import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    user_contacts: [],
    user_contacts_loader: false,

    user_chats: [],
    user_chats_loader: false,
    chat_messages: [],
    chat_messages_loader: false,
    contact_id: '',
    ui: {
        show_add_account_modal: false,
        show_add_group_modal: false,
        show_delete_message_confirmation_dialog: false
    },

    message: {
        id: '',
        body: '',
        dialog_message: '',
        edit: false,
        reply_id: ''
    },

    chat_message_page: 1,
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

        setUserChatMessages: (state, action) => {
            state.chat_messages = action.payload
            state.chat_messages_loader = false
        },

        setChatMessagesLoading: (state) => {
            state.chat_messages_loader = true;
        },

        setSelectedChat: (state, action) => {
            state.selectedChat = action.payload
        },

        setMessage: (state, action) => {
            state.message = action.payload
        },

        setUserContacts: (state, action) => {
            state.user_contacts = action.payload
            state.user_contacts_loader = false
        },

        setUserContactsLoading: (state, action) => {
            state.user_contacts_loader = action.payload
        },

        setContactId: (state, action) => {
            state.contact_id = action.payload
        },

        // UI 
        setShowAddAccountDialog: (state, action) => {
            state.ui.show_add_account_modal = action.payload
        },

        setShowAddGroupDialog: (state, action) => {
            state.ui.show_add_group_modal = action.payload
        },

        setShowDeleteMessageConfirmationDialog: (state, action) => {
            state.ui.show_delete_message_confirmation_dialog = action.payload
        },
        setChatMessagePage: (state,action) => {
            state.chat_message_page = action.payload
        }

    },
});

export const { setUserChatContacts, setUserChatContactsLoading,
    setUserChatMessages, setChatMessagesLoading,
    setSelectedChat,
    setMessage,
    setUserContacts, setUserContactsLoading,
    setContactId,
    setShowAddAccountDialog, setShowAddGroupDialog,
    setShowDeleteMessageConfirmationDialog,
    setChatMessagePage
} = chatSlice.actions;

export default chatSlice.reducer;