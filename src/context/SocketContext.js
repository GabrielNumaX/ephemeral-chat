import { createContext } from 'react';
// import io from 'socket.io-client';
import { io } from 'socket.io-client';
import { socketUrl } from '../config/config';

// export const socket = io.connect(socketUrl);
export const socket = io(socketUrl, { withCredentials: true, closeOnBeforeunload: false });
// export const socket = io();

export const SocketContext = createContext();