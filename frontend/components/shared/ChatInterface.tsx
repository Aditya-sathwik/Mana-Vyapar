"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { useSupportSocket } from '@/hooks/useSupportSocket';
import { RootState } from '@/redux/store';
import { addMessage } from '@/redux/slices/supportSlice';
import { format } from 'date-fns';
import { 
    Send as FiSend, 
    Paperclip as FiPaperclip, 
    Check as FiCheck, 
    CheckCircle as FiCheckCircle, 
    MoreVertical as FiMoreVertical,
    User as FiUser
} from 'lucide-react';

interface ChatInterfaceProps {
    roomId: string;
    role: 'Admin' | 'Merchant' | 'Customer';
    title: string;
    showInternalNotes?: boolean;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ 
    roomId, 
    role, 
    title, 
    showInternalNotes = false 
}) => {
    const dispatch = useDispatch();
    const { user } = useSelector((state: RootState) => state.auth || { user: null });
    const { messages = [], typingParticipants = [] } = useSelector((state: RootState) => state.support || { messages: [], typingParticipants: [] });
    const [input, setInput] = useState('');
    const [isInternal, setIsInternal] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);
    const { sendMessage, sendTyping } = useSupportSocket(roomId);

    // Scroll to bottom on new messages
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSend = () => {
        if (!input.trim()) return;

        const tempId = Date.now().toString();
        
        // Optimistic UI update
        const tempMsg = {
            _id: tempId,
            roomId,
            sender: {
                _id: user?._id || '',
                fullName: user?.fullName || '',
                role: user?.role || 'User',
                avatar: user?.avatar
            },
            content: input,
            messageType: 'TEXT',
            status: 'PENDING',
            attachments: [],
            createdAt: new Date().toISOString(),
            tempId,
            isInternal
        };

        dispatch(addMessage(tempMsg as any));
        sendMessage(input, 'TEXT', [], tempId);
        setInput('');
        sendTyping(false);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setInput(e.target.value);
        sendTyping(e.target.value.length > 0);
    };

    return (
        <div className="flex flex-col h-full bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-white/10 bg-white/5">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                        <FiUser size={20} />
                    </div>
                    <div>
                        <h3 className="font-semibold text-foreground">{title}</h3>
                        <p className="text-xs text-muted-foreground">
                            {typingParticipants.length > 0 ? (
                                <span className="text-primary animate-pulse">Typing...</span>
                            ) : (
                                "Online"
                            )}
                        </p>
                    </div>
                </div>
                <button className="p-2 hover:bg-white/5 rounded-full transition-colors">
                    <FiMoreVertical />
                </button>
            </div>

            {/* Messages */}
            <div 
                ref={scrollRef}
                className="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth custom-scrollbar"
            >
                {messages.map((msg, index) => {
                    const isMe = msg.sender?._id === user?._id;
                    return (
                        <motion.div
                            key={msg._id || index}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                        >
                            <div className={`max-w-[80%] group`}>
                                {!isMe && (
                                    <p className="text-[10px] text-muted-foreground ml-2 mb-1">
                                        {msg.sender.fullName}
                                    </p>
                                )}
                                <div className={`
                                    relative p-3 rounded-2xl shadow-sm
                                    ${isMe 
                                        ? 'bg-primary text-primary-foreground rounded-tr-none' 
                                        : 'bg-white/10 text-foreground rounded-tl-none border border-white/5'
                                    }
                                    ${msg.isInternal ? 'border-2 border-amber-500/50 bg-amber-500/10' : ''}
                                `}>
                                    <p className="text-sm whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                                    
                                    <div className="flex items-center justify-end gap-1 mt-1 opacity-70">
                                        <span className="text-[9px]">
                                            {format(new Date(msg.createdAt), 'HH:mm')}
                                        </span>
                                        {isMe && (
                                            <span className="text-[10px]">
                                                {msg.status === 'READ' ? <FiCheckCircle className="text-blue-400" /> : <FiCheck />}
                                            </span>
                                        )}
                                    </div>
                                    
                                    {msg.isInternal && (
                                        <span className="absolute -top-2 -right-2 bg-amber-500 text-[8px] px-1 rounded font-bold uppercase">Internal</span>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            {/* Input */}
            <div className="p-4 bg-white/5 border-t border-white/10">
                {showInternalNotes && (
                    <div className="flex items-center gap-2 mb-3">
                        <button 
                            onClick={() => setIsInternal(!isInternal)}
                            className={`text-[10px] px-2 py-1 rounded transition-all font-medium uppercase
                                ${isInternal 
                                    ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/20' 
                                    : 'bg-white/10 text-muted-foreground'
                                }`}
                        >
                            Internal Note
                        </button>
                    </div>
                )}
                <div className="flex items-end gap-2 bg-white/5 rounded-xl border border-white/10 p-2 focus-within:border-primary/50 transition-all">
                    <button className="p-2 text-muted-foreground hover:text-primary transition-colors">
                        <FiPaperclip size={20} />
                    </button>
                    <textarea
                        rows={1}
                        value={input}
                        onChange={handleInputChange}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                handleSend();
                            }
                        }}
                        placeholder="Type a message..."
                        className="flex-1 bg-transparent border-none focus:ring-0 text-sm py-2 resize-none max-h-32"
                    />
                    <button 
                        onClick={handleSend}
                        disabled={!input.trim()}
                        className={`p-2 rounded-lg transition-all
                            ${input.trim() 
                                ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20 scale-100 hover:scale-110' 
                                : 'bg-white/10 text-muted-foreground scale-95 opacity-50 cursor-not-allowed'
                            }`}
                    >
                        <FiSend size={20} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ChatInterface;
