import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Message {
    _id: string;
    roomId: string;
    sender: {
        _id: string;
        fullName: string;
        fullname?: string;
        role: string;
        avatar?: string;
    };
    content: string;
    messageType: string;
    status: "PENDING" | "SENT" | "DELIVERED" | "READ";
    attachments: any[];
    createdAt: string;
    tempId?: string;
    isInternal?: boolean;
}

interface SupportState {
    tickets: any[];
    activeRoom: string | null;
    messages: Message[];
    typingParticipants: string[];
    loading: boolean;
    error: string | null;
}

const initialState: SupportState = {
    tickets: [],
    activeRoom: null,
    messages: [],
    typingParticipants: [],
    loading: false,
    error: null,
};

const supportSlice = createSlice({
    name: "support",
    initialState,
    reducers: {
        setTickets: (state, action: PayloadAction<any[]>) => {
            state.tickets = action.payload;
        },
        setActiveRoom: (state, action: PayloadAction<string | null>) => {
            state.activeRoom = action.payload;
            state.messages = []; // Clear messages when switching rooms
        },
        setMessages: (state, action: PayloadAction<Message[]>) => {
            state.messages = action.payload;
        },
        addMessage: (state, action: PayloadAction<Message>) => {
            // Check if message already exists (e.g. optimistic UI sync)
            const existingIndex = state.messages.findIndex(
                m => (m.tempId && m.tempId === action.payload.tempId) || m._id === action.payload._id
            );
            
            if (existingIndex > -1) {
                state.messages[existingIndex] = { ...state.messages[existingIndex], ...action.payload };
            } else {
                state.messages.push(action.payload);
            }
        },
        updateMessageStatus: (state, action: PayloadAction<{ messageId: string; status: Message["status"] }>) => {
            const message = state.messages.find(m => m._id === action.payload.messageId);
            if (message) {
                message.status = action.payload.status;
            }
        },
        setAllRead: (state, action: PayloadAction<string>) => {
            state.messages.forEach(m => {
                if (m.roomId === action.payload) {
                    m.status = "READ";
                }
            });
        },
        setTyping: (state, action: PayloadAction<{ userId: string; isTyping: boolean }>) => {
            if (action.payload.isTyping) {
                if (!state.typingParticipants.includes(action.payload.userId)) {
                    state.typingParticipants.push(action.payload.userId);
                }
            } else {
                state.typingParticipants = state.typingParticipants.filter(id => id !== action.payload.userId);
            }
        },
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.loading = action.payload;
        },
        setError: (state, action: PayloadAction<string | null>) => {
            state.error = action.payload;
        },
    },
});

export const {
    setTickets,
    setActiveRoom,
    setMessages,
    addMessage,
    updateMessageStatus,
    setAllRead,
    setTyping,
    setLoading,
    setError,
} = supportSlice.actions;

export default supportSlice.reducer;
