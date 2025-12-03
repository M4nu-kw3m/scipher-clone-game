import { useEffect, useState } from 'react';
import io from 'socket.io-client';

const SERVER_URL = process.env.NODE_ENV === 'production'
    ? 'https://scipher-backend-qzp2cix6x-voids-projects-705600c7.vercel.app'
    : 'http://localhost:3000';

export function useSocket() {
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        const newSocket = io(SERVER_URL);
        setSocket(newSocket);

        return () => newSocket.close();
    }, []);

    return socket;
}
