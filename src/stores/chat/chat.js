import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    user_contacts: [],
    user_contacts_loader: false,
    
    user_chats: [],
    user_chats_loader: false,
    chat_messages: [],
    chat_messages_loader: false,

    message: {
        id: '',
        body: '',
        dialog_message: '',
        edit: false,
    },


    selectedChat: [],
    mode: '',
    chat_message: ''
};

export const chatSlice = createSlice({
    name: 'chat',
    initialState,
    reducers: {
        setUserChatContacts: (state, action) => {
            state.user_chats = action.payload;
            state.user_chats_loader = false;
        },
        setUserChatContactsLoading: (state) => {
            state.user_chats_loader = true;
        },

        setUserChatMessages: (state,action) => {
            state.chat_messages = action.payload
            state.chat_messages_loader = false
        },
        setChatMessagesLoading: (state) => {
            state.chat_messages_loader = true;
        },

        setSelectedChat: (state,action) => {
            state.selectedChat = action.payload
        },
       
        setMessage: (state,action) => {
            state.message = action.payload
        },

        setUserContacts: (state,action) => {
            state.user_contacts = action.payload
            state.user_contacts_loader = false
        },

        setUserContactsLoading: (state,action) => {
            state.user_contacts_loader = action.payload
        }
    },
});

export const { setUserChatContacts, setUserChatContactsLoading,
               setUserChatMessages, setChatMessagesLoading,
               setSelectedChat,
               setMessage,
               setUserContacts, setUserContactsLoading
            } = chatSlice.actions;

export default chatSlice.reducer;