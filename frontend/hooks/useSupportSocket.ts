import { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { io, Socket } from 'socket.io-client';
import { addMessage, setTyping, setAllRead, updateMessageStatus } from '../redux/slices/supportSlice';
import { RootState } from '../redux/store';
import { storage } from '@/lib/storage';

import { useAuth } from '@/context/auth-context';

let socket: Socket | null = null;

export const useSupportSocket = (roomId: string | null) => {
    const dispatch = useDispatch();
    const { user: contextUser } = useAuth();
    const user = contextUser || storage.getUser();

    useEffect(() => {
        if (!user || !roomId) return;

        const token = storage.getAccessToken();
        if (!token) {
            console.error("⚠️ Cannot initialize socket: No access token found in storage.");
            return;
        }

        // Initialize socket if not exists
        if (!socket) {
            console.log("🔌 Initializing socket connection...");
            socket = io(process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:8080', {
                auth: { token },
                withCredentials: true,
                autoConnect: false
            });

            // Register connection logs
            socket.on('connect', () => {
                console.log('✅ Socket connected successfully! ID:', socket?.id);
            });

            socket.on('connect_error', (err) => {
                console.error('❌ Socket connection error:', err.message);
            });

            socket.on('disconnect', (reason) => {
                console.warn('🔌 Socket disconnected. Reason:', reason);
            });
        }

        // Dynamically update the token in case it changed/refreshed
        socket.auth = { token };

        if (!socket.connected) {
            console.log("🔌 Socket is disconnected, connecting now...");
            socket.connect();
        }

        // Join room
        console.log(`📣 Socket emitting 'join_room' for [${roomId}]`);
        socket.emit('join_room', roomId);

        // Listen for events
        socket.on('new_message', (message) => {
            dispatch(addMessage(message));
            // Automatically mark as read if we are in the room
            if (message.sender._id !== user._id) {
                socket?.emit('mark_read', { roomId, userId: user._id });
            }
        });

        socket.on('user_typing', (data) => {
            if (data.userId !== user._id) {
                dispatch(setTyping({ userId: data.userId, isTyping: true }));
            }
        });

        socket.on('user_stop_typing', (data) => {
            dispatch(setTyping({ userId: data.userId, isTyping: false }));
        });

        socket.on('messages_read', (data) => {
            dispatch(setAllRead(data.roomId));
        });

        socket.on('message_status_update', (data) => {
            dispatch(updateMessageStatus({ messageId: data.messageId, status: data.status }));
        });

        return () => {
            if (socket) {
                socket.off('new_message');
                socket.off('user_typing');
                socket.off('user_stop_typing');
                socket.off('messages_read');
                socket.off('message_status_update');
            }
        };
    }, [roomId, user, dispatch]);

    const sendMessage = useCallback((content: string, messageType = 'TEXT', attachments = [], tempId?: string) => {
        if (socket && roomId) {
            console.log(`📤 Sending message to room [${roomId}] (tempId: ${tempId}): "${content.substring(0, 30)}..."`);
            socket.emit('send_message', {
                roomId,
                content,
                messageType,
                attachments,
                tempId
            });
        } else {
            console.warn(`⚠️ Cannot send message: socket is ${socket ? 'connected but roomId is missing' : 'not connected'}`, { roomId });
        }
    }, [roomId]);

    const sendTyping = useCallback((isTyping: boolean) => {
        if (socket && roomId) {
            socket.emit(isTyping ? 'typing' : 'stop_typing', roomId);
        }
    }, [roomId]);

    return { sendMessage, sendTyping };
};
