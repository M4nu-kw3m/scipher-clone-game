import { generateWords } from './wordGenerator.js';
import { initializeApp, cert } from 'firebase-admin/app';
import { getDatabase } from 'firebase-admin/database';
import fs from 'fs';

// Initialize Firebase
let db = null;
try {
    // Check for environment variables first (Production/Vercel)
    if (process.env.FIREBASE_SERVICE_ACCOUNT) {
        const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
        initializeApp({
            credential: cert(serviceAccount),
            databaseURL: process.env.FIREBASE_DB_URL
        });
        db = getDatabase();
        console.log("Firebase initialized from Env Var");
    }
    // Check for local file (Development)
    else if (fs.existsSync('./serviceAccountKey.json')) {
        const serviceAccount = JSON.parse(fs.readFileSync('./serviceAccountKey.json', 'utf8'));
        initializeApp({
            credential: cert(serviceAccount),
            databaseURL: process.env.FIREBASE_DB_URL
        });
        db = getDatabase();
        console.log("Firebase initialized from File");
    } else {
        console.warn("No Firebase credentials found! Game will not persist.");
    }
} catch (error) {
    console.error("Firebase initialization failed:", error);
}

export class GameManager {
    constructor(io) {
        this.io = io;
    }

    async getRoom(roomCode) {
        if (!db) return null;
        const snapshot = await db.ref(`rooms/${roomCode}`).once('value');
        return snapshot.val();
    }

    async saveRoom(roomCode, roomData) {
        if (!db) return;
        await db.ref(`rooms/${roomCode}`).set(roomData);
    }

    async createRoom(hostName, socketId) {
        const roomCode = Math.random().toString(36).substring(2, 8).toUpperCase();

        const newRoom = {
            code: roomCode,
            players: [{
                id: socketId,
                name: hostName,
                team: '1',
                isHost: true
            }],
            gameState: {
                words: generateWords(),
                scores: { team1: 0, team2: 0 },
                currentTurn: '1',
                timer: 30,
                isPlaying: false,
                contributions: []
            },
            lastUpdated: Date.now()
        };

        await this.saveRoom(roomCode, newRoom);
        return roomCode;
    }

    async joinRoom(roomCode, playerName, socketId) {
        const room = await this.getRoom(roomCode);
        if (!room) return null;

        // Auto-assign team
        const players = room.players || [];
        const team1Count = players.filter(p => p.team === '1').length;
        const team2Count = players.filter(p => p.team === '2').length;
        const team = team1Count <= team2Count ? '1' : '2';

        const player = {
            id: socketId,
            name: playerName,
            team: team,
            isHost: false
        };

        players.push(player);
        room.players = players;

        await this.saveRoom(roomCode, room);
        this.io.to(roomCode).emit('gameStateUpdate', room);
        return room;
    }

    async leaveRoom(socketId) {
        // This is harder in serverless without keeping state
        // We might skip strict leave handling for Vercel or scan rooms
        // For now, we'll rely on client disconnects
        return null;
    }

    async startGame(roomCode) {
        const room = await this.getRoom(roomCode);
        if (!room) return;

        room.gameState.isPlaying = true;
        room.gameState.timer = 30;
        room.lastUpdated = Date.now();

        await this.saveRoom(roomCode, room);
        this.io.to(roomCode).emit('gameStateUpdate', room);
    }

    async handleGuess(roomCode, wordText, team) {
        const room = await this.getRoom(roomCode);
        if (!room || !room.gameState.isPlaying) return;
        if (room.gameState.currentTurn !== team) return;

        const wordObj = room.gameState.words.find(w => w.word === wordText);
        if (wordObj && !wordObj.guessed) {
            wordObj.guessed = true;
            if (team === '1') room.gameState.scores.team1 += wordObj.pts;
            else room.gameState.scores.team2 += wordObj.pts;

            room.gameState.contributions = room.gameState.contributions || [];
            room.gameState.contributions.push({
                word: wordText,
                team: team,
                timestamp: Date.now()
            });

            await this.saveRoom(roomCode, room);
            this.io.to(roomCode).emit('gameStateUpdate', room);
            return true;
        }
        return false;
    }
}
