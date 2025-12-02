import { generateWords } from './wordGenerator.js';
import { initializeApp, cert } from 'firebase-admin/app';
import { getDatabase } from 'firebase-admin/database';
import fs from 'fs';

// Initialize Firebase (Conditional)
let db = null;
try {
    if (fs.existsSync('./serviceAccountKey.json')) {
        const serviceAccount = JSON.parse(fs.readFileSync('./serviceAccountKey.json', 'utf8'));
        initializeApp({
            credential: cert(serviceAccount),
            databaseURL: process.env.FIREBASE_DB_URL // e.g. "https://your-project.firebaseio.com"
        });
        db = getDatabase();
        console.log("Firebase initialized successfully");
    } else {
        console.log("No serviceAccountKey.json found. Running in-memory mode.");
    }
} catch (error) {
    console.error("Firebase initialization failed:", error);
}

// In-memory store (synced with Firebase if available)
const rooms = new Map();

export class GameManager {
    constructor(io) {
        this.io = io;
    }

    createRoom(hostName, socketId) {
        const roomCode = Math.random().toString(36).substring(2, 8).toUpperCase();

        const newRoom = {
            code: roomCode,
            players: [{
                id: socketId,
                name: hostName,
                team: '1', // '1' or '2'
                isHost: true
            }],
            gameState: {
                words: generateWords(),
                scores: { team1: 0, team2: 0 },
                currentTurn: '1', // Team 1 starts
                timer: 30,
                isPlaying: false,
                contributions: []
            }
        };

        rooms.set(roomCode, newRoom);
        this.syncRoom(roomCode);
        return roomCode;
    }

    joinRoom(roomCode, playerName, socketId) {
        const room = rooms.get(roomCode);
        if (!room) return null;

        // Auto-assign team to balance
        const team1Count = room.players.filter(p => p.team === '1').length;
        const team2Count = room.players.filter(p => p.team === '2').length;
        const team = team1Count <= team2Count ? '1' : '2';

        const player = {
            id: socketId,
            name: playerName,
            team: team,
            isHost: false
        };

        room.players.push(player);
        this.syncRoom(roomCode);
        return room;
    }

    leaveRoom(socketId) {
        for (const [code, room] of rooms.entries()) {
            const index = room.players.findIndex(p => p.id === socketId);
            if (index !== -1) {
                room.players.splice(index, 1);
                if (room.players.length === 0) {
                    rooms.delete(code);
                } else {
                    this.syncRoom(code);
                }
                return code;
            }
        }
        return null;
    }

    startGame(roomCode) {
        const room = rooms.get(roomCode);
        if (!room) return;

        room.gameState.isPlaying = true;
        room.gameState.timer = 30;
        this.syncRoom(roomCode);

        // Start timer loop
        if (room.timerInterval) clearInterval(room.timerInterval);

        room.timerInterval = setInterval(() => {
            if (!rooms.has(roomCode)) {
                clearInterval(room.timerInterval);
                return;
            }

            room.gameState.timer--;

            if (room.gameState.timer <= 0) {
                this.nextTurn(roomCode);
            } else {
                this.io.to(roomCode).emit('timerUpdate', room.gameState.timer);
            }
        }, 1000);
    }

    nextTurn(roomCode) {
        const room = rooms.get(roomCode);
        if (!room) return;

        room.gameState.currentTurn = room.gameState.currentTurn === '1' ? '2' : '1';
        room.gameState.timer = 30; // Reset timer
        this.syncRoom(roomCode);
    }

    handleGuess(roomCode, wordText, team) {
        const room = rooms.get(roomCode);
        if (!room || !room.gameState.isPlaying) return;
        if (room.gameState.currentTurn !== team) return; // Not your turn

        const wordObj = room.gameState.words.find(w => w.word === wordText);
        if (wordObj && !wordObj.guessed) {
            wordObj.guessed = true;

            // Add points
            if (team === '1') room.gameState.scores.team1 += wordObj.pts;
            else room.gameState.scores.team2 += wordObj.pts;

            // Add to contributions
            room.gameState.contributions.push({
                word: wordText,
                team: team,
                timestamp: Date.now()
            });

            this.syncRoom(roomCode);
            return true;
        }
        return false;
    }

    syncRoom(roomCode) {
        const room = rooms.get(roomCode);
        if (!room) return;

        // Send update to all clients in room
        // Strip out internal stuff like timerInterval
        const cleanRoom = {
            ...room,
            timerInterval: undefined
        };

        this.io.to(roomCode).emit('gameStateUpdate', cleanRoom);

        // Sync to Firebase if available
        if (db) {
            const ref = db.ref(`rooms/${roomCode}`);
            ref.set(cleanRoom).catch(err => console.error("Firebase sync error:", err));
        }
    }
}
