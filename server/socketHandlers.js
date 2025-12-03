import { GameManager } from './gameManager.js';

export function setupSocketHandlers(io) {
    const gameManager = new GameManager(io);

    io.on('connection', (socket) => {
        console.log('User connected:', socket.id);

        // Create Room
        socket.on('createRoom', async ({ playerName }, callback) => {
            const roomCode = await gameManager.createRoom(playerName, socket.id);
            socket.join(roomCode);
            callback({ success: true, roomCode });
        });

        // Join Room
        socket.on('joinRoom', async ({ roomCode, playerName }, callback) => {
            const room = await gameManager.joinRoom(roomCode, playerName, socket.id);
            if (room) {
                socket.join(roomCode);
                callback({ success: true, room: room });
            } else {
                callback({ success: false, error: 'Room not found' });
            }
        });

        // Start Game
        socket.on('startGame', async ({ roomCode }) => {
            await gameManager.startGame(roomCode);
        });

        // Submit Guess
        socket.on('submitGuess', async ({ roomCode, word, team }) => {
            await gameManager.handleGuess(roomCode, word, team);
            // Optional: emit specific success/fail event back to guesser
        });

        // Disconnect
        socket.on('disconnect', async () => {
            console.log('User disconnected:', socket.id);
            await gameManager.leaveRoom(socket.id);
        });
    });
}
