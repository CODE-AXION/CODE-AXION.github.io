import { toast } from 'react-toastify';
import axios from '../lib/axios';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
    setUserChatContacts, setUserChatContactsLoading, 
    setUserChatMessages, setChatMessagesLoading,
    setMessage,
    setUserContactsLoading, setUserContacts, setShowDeleteMessageConfirmationDialog
} from '../stores/chat/chat';
import { getChatContacts, getUserChatMessages, getUserContacts, getUserGroupChatMessages, sendEditedMessageToUser, sendMessageToUser } from '../lib/api/chatApi';

export const useChat = () => {
    

    const dispatch = useDispatch();

    // // fetch sidebar chat contacts
    const fetchChatContacts = async (isMounted) => {
        try {
            dispatch(setUserChatContactsLoading());
            
            const response = await getChatContacts();
            if (isMounted) {
                dispatch(setUserChatContacts(response.data.data))
            }
        } catch (error) {

            toast.error(error)
            console.error('Error fetching data:', error);
        }
    };

    // // fetch user contacts for adding contacts
    const fetchUserContacts = async () => {
        try {
            dispatch(setUserContactsLoading(true));
            const response = await getUserContacts();
            dispatch(setUserContacts(response.data.data));
              
        } catch (error) {

            toast.error(error)
            console.error('Error fetching data:', error);
        }
    };

    // fetch chat messages
    const fetchChatMessages = async (authUser,selectedChatId, isMounted, enableLoading = true, is_group = false) => {
        try {
            
            if (selectedChatId != undefined) {
                if (isMounted) {
                    if (enableLoading) dispatch(setChatMessagesLoading(true))
                    if(is_group == true)
                    {
                        const response = await getUserGroupChatMessages(selectedChatId,authUser.id);
                        dispatch(setUserChatMessages(response.data.data))
                        
                    }else{
                        
                        const response = await getUserChatMessages(selectedChatId,authUser.id);
                        dispatch(setUserChatMessages(response.data.data))
                    }
                }
            }

        } catch (error) {
            toast.error(error)
            console.error('Error fetching data:', error);
        }
    };

    //send message to user
    const sendMessageChatClick = async (e,authUser,chat_message,selectedChat) => {
        e.preventDefault()
        // Don't send empty messages or if no chat is selected
        if (!chat_message.body.trim() || !selectedChat) return; 

        if (chat_message.edit) {

            await sendEditedMessageToUser(selectedChat?.pivot?.id,chat_message.id,{
                message: chat_message.body,
                channel_id: selectedChat?.pivot?.channel_id,
            })
            

        } else {

            await sendMessageToUser(selectedChat?.pivot?.id,{
                receiver_id: selectedChat?.pivot?.contact_user_id,
                channel_id: selectedChat?.pivot?.channel_id,
                message: chat_message.body
            })
        }



        fetchChatMessages(authUser,selectedChat?.pivot?.channel_id, true)

        dispatch(setMessage({...chat_message,id: '',body: '', edit: false}))

    }

    // remove message
    const onClickRemoveMessage = async (selectedChat,chat_message) => {

        if (!chat_message.edit) {
            await axios.post(`/api/v1/send-message/chat-id/${selectedChat?.pivot?.id}?delete_mode=on&id=${chat_message.id}`)

            dispatch(setMessage({
                id: '',
                body: '',
                dialog_message: '',
                edit: false,           
            }));

            dispatch(setShowDeleteMessageConfirmationDialog(false));

            fetchChatMessages(authUser,selectedChat?.pivot?.channel_id, true)
        }
    }

    return {
        fetchChatContacts,
        onClickRemoveMessage,
        sendMessageChatClick,
        fetchUserContacts,
        fetchChatMessages
    };
}