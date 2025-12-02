import { GameManager } from './gameManager.js';

export function setupSocketHandlers(io) {
    const gameManager = new GameManager(io);

    io.on('connection', (socket) => {
        console.log('User connected:', socket.id);

        // Create Room
        socket.on('createRoom', ({ playerName }, callback) => {
            const roomCode = gameManager.createRoom(playerName, socket.id);
            socket.join(roomCode);
            callback({ success: true, roomCode });
        });

        // Join Room
        socket.on('joinRoom', ({ roomCode, playerName }, callback) => {
            const room = gameManager.joinRoom(roomCode, playerName, socket.id);
            if (room) {
                socket.join(roomCode);
                callback({ success: true, room: room });
            } else {
                callback({ success: false, error: 'Room not found' });
            }
        });

        // Start Game
        socket.on('startGame', ({ roomCode }) => {
            gameManager.startGame(roomCode);
        });

        // Submit Guess
        socket.on('submitGuess', ({ roomCode, word, team }) => {
            const success = gameManager.handleGuess(roomCode, word, team);
            // Optional: emit specific success/fail event back to guesser
        });

        // Disconnect
        socket.on('disconnect', () => {
            console.log('User disconnected:', socket.id);
            gameManager.leaveRoom(socket.id);
        });
    });
}
