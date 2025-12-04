import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import { setupSocketHandlers } from './socketHandlers.js';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const httpServer = createServer(app);

// CORS setup - Allow Firebase Hosting
const allowedOrigins = [
    'https://scipher-game.web.app',
    'https://scipher-game.firebaseapp.com',
    'http://localhost:5173',
    'http://localhost:5174'
];

app.use(cors({
    origin: allowedOrigins,
    credentials: true
}));

// Socket.IO setup
const io = new Server(httpServer, {
    cors: {
        origin: allowedOrigins,
        methods: ["GET", "POST"],
        credentials: true
    }
});

// Setup handlers
setupSocketHandlers(io);

// Serve static files (for production/deployment)
// In dev, we use Vite server separately
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../scipher_clone_ui/dist')));

    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, '../scipher_clone_ui/dist/index.html'));
    });
}

const PORT = process.env.PORT || 3000;

httpServer.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

export default httpServer;
