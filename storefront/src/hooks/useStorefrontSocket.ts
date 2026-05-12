import { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { io, Socket } from 'socket.io-client';
import { addMessage, setIsTyping, setAllRead } from '../store/slices/supportSlice';

let socket: Socket | null = null;

export const useStorefrontSocket = (roomId: string | null) => {
    const dispatch = useDispatch();
    const user = useSelector((state: any) => state.user.user);

    useEffect(() => {
        if (!user || !roomId) return;

        if (!socket) {
            socket = io(import.meta.env.VITE_SOCKET_URL || 'http://localhost:8080', {
                auth: { token: localStorage.getItem('accessToken') },
                withCredentials: true
            });
        }

        socket.emit('join_room', roomId);

        socket.on('new_message', (message) => {
            dispatch(addMessage(message));
            if (message.sender.id !== user.id) {
                socket?.emit('mark_read', { roomId, userId: user.id });
            }
        });

        socket.on('user_typing', (data) => {
            if (data.userId !== user.id) {
                dispatch(setIsTyping(true));
            }
        });

        socket.on('user_stop_typing', () => {
            dispatch(setIsTyping(false));
        });

        socket.on('messages_read', () => {
            dispatch(setAllRead());
        });

        return () => {
            if (socket) {
                socket.off('new_message');
                socket.off('user_typing');
                socket.off('user_stop_typing');
                socket.off('messages_read');
            }
        };
    }, [roomId, user, dispatch]);

    const sendMessage = useCallback((content: string, tempId?: string) => {
        if (socket && roomId) {
            socket.emit('send_message', {
                roomId,
                content,
                messageType: 'TEXT',
                attachments: [],
                tempId
            });
        }
    }, [roomId]);

    const sendTyping = useCallback((isTyping: boolean) => {
        if (socket && roomId) {
            socket.emit(isTyping ? 'typing' : 'stop_typing', roomId);
        }
    }, [roomId]);

    return { sendMessage, sendTyping };
};
