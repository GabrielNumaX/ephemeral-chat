import { createContext } from 'react';
import io from 'socket.io-client';
import { socketUrl } from '../config/config';

export const socket = io.connect(socketUrl);

export const SocketContext = createContext();