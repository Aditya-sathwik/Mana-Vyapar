import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Message {
    _id: string;
    roomId: string;
    sender: {
        id: string;
        name: string;
        role?: string;
        avatar?: string;
    };
    content: string;
    messageType: string;
    status: "PENDING" | "SENT" | "DELIVERED" | "READ";
    attachments: any[];
    createdAt: string;
    tempId?: string;
}

interface SupportState {
    messages: Message[];
    isOpen: boolean;
    activeRoom: string | null;
    isTyping: boolean;
}

const initialState: SupportState = {
    messages: [],
    isOpen: false,
    activeRoom: null,
    isTyping: false,
};

const supportSlice = createSlice({
    name: "support",
    initialState,
    reducers: {
        toggleChat: (state) => {
            state.isOpen = !state.isOpen;
        },
        setMessages: (state, action: PayloadAction<Message[]>) => {
            state.messages = action.payload;
        },
        addMessage: (state, action: PayloadAction<Message>) => {
            const existingIndex = state.messages.findIndex(
                m => (m.tempId && m.tempId === action.payload.tempId) || m._id === action.payload._id
            );
            
            if (existingIndex > -1) {
                state.messages[existingIndex] = { ...state.messages[existingIndex], ...action.payload };
            } else {
                state.messages.push(action.payload);
            }
        },
        setAllRead: (state) => {
            state.messages.forEach(m => m.status = "READ");
        },
        setIsTyping: (state, action: PayloadAction<boolean>) => {
            state.isTyping = action.payload;
        }
    },
});

export const { toggleChat, setMessages, addMessage, setAllRead, setIsTyping } = supportSlice.actions;
export default supportSlice.reducer;
