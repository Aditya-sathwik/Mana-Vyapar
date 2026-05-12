import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { useStorefrontSocket } from '../../hooks/useStorefrontSocket';
import { toggleChat, addMessage } from '../../store/slices/supportSlice';
import { 
    MessageSquare as HiOutlineChatBubbleLeftRight, 
    X as HiOutlineXMark, 
    Send as HiPaperAirplane,
    Paperclip as HiOutlinePaperClip
} from 'lucide-react';

const SupportChatWidget: React.FC<{ roomId: string }> = ({ roomId }) => {
    const dispatch = useDispatch();
    const { isOpen, messages, isTyping } = useSelector((state: any) => state.support || { isOpen: false, messages: [], isTyping: false });
    const user = useSelector((state: any) => (state.user || {}).user);
    const [input, setInput] = useState('');
    const scrollRef = useRef<HTMLDivElement>(null);
    const { sendMessage, sendTyping } = useStorefrontSocket(roomId);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isOpen]);

    const handleSend = () => {
        if (!input.trim()) return;
        const tempId = Date.now().toString();
        
        const tempMsg = {
            _id: tempId,
            roomId,
            sender: user,
            content: input,
            messageType: 'TEXT',
            status: 'PENDING',
            attachments: [],
            createdAt: new Date().toISOString(),
            tempId
        };

        dispatch(addMessage(tempMsg as any));
        sendMessage(input, tempId);
        setInput('');
        sendTyping(false);
    };

    return (
        <div className="fixed bottom-6 right-6 z-50">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="mb-4 w-80 sm:w-96 h-[500px] flex flex-col bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-2xl overflow-hidden"
                    >
                        {/* Header */}
                        <div className="p-4 bg-primary text-primary-foreground flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                                    <HiOutlineChatBubbleLeftRight size={18} />
                                </div>
                                <div>
                                    <h3 className="font-medium text-sm">Store Support</h3>
                                    <p className="text-[10px] opacity-80">We're online</p>
                                </div>
                            </div>
                            <button 
                                onClick={() => dispatch(toggleChat())}
                                className="p-1 hover:bg-white/10 rounded-lg transition-colors"
                            >
                                <HiOutlineXMark size={20} />
                            </button>
                        </div>

                        {/* Messages */}
                        <div 
                            ref={scrollRef}
                            className="flex-1 overflow-y-auto p-4 space-y-4 bg-zinc-50/50 dark:bg-zinc-950/50"
                        >
                            {messages.map((msg: any, index: number) => {
                                const isMe = msg.sender?.id === user?.id;
                                return (
                                    <div key={msg._id || index} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                                        <div className={`
                                            max-w-[80%] p-3 rounded-2xl text-sm shadow-sm
                                            ${isMe 
                                                ? 'bg-primary text-primary-foreground rounded-br-none' 
                                                : 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 rounded-bl-none border border-zinc-200 dark:border-zinc-700'
                                            }
                                        `}>
                                            {msg.content}
                                        </div>
                                    </div>
                                );
                            })}
                            {isTyping && (
                                <div className="flex justify-start">
                                    <div className="bg-zinc-200 dark:bg-zinc-800 px-3 py-2 rounded-2xl rounded-bl-none animate-pulse text-xs">
                                        Typing...
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Input */}
                        <div className="p-3 border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
                            <div className="flex items-center gap-2 bg-zinc-100 dark:bg-zinc-800 rounded-xl p-1.5 px-3">
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => {
                                        setInput(e.target.value);
                                        sendTyping(e.target.value.length > 0);
                                    }}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                                    placeholder="Ask us anything..."
                                    className="flex-1 bg-transparent border-none focus:ring-0 text-sm py-1 placeholder:text-zinc-500"
                                />
                                <button 
                                    onClick={handleSend}
                                    className="text-primary hover:scale-110 transition-transform disabled:opacity-50"
                                    disabled={!input.trim()}
                                >
                                    <HiPaperAirplane size={20} />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => dispatch(toggleChat())}
                className="w-14 h-14 bg-primary text-primary-foreground rounded-full shadow-lg flex items-center justify-center hover:shadow-primary/20 transition-all"
            >
                {isOpen ? <HiOutlineXMark size={28} /> : <HiOutlineChatBubbleLeftRight size={28} />}
            </motion.button>
        </div>
    );
};

export default SupportChatWidget;
