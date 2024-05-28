import { toast } from 'react-toastify';
import axios from '../lib/axios';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import chat, {
    setUserChatContacts, setUserChatContactsLoading,
    setUserChatMessages, setChatMessagesLoading,
    setMessage,
    setUserContactsLoading, setUserContacts, setShowDeleteMessageConfirmationDialog, setChatMessagePage, setChatMaxId
} from '../stores/chat/chat';
import { getChatContacts, getUserChatMessages, getUserContacts, getUserGroupChatMessages, sendEditedMessageToUser, sendMessageToUser } from '../lib/api/chatApi';

export const useChat = (props) => {


    const dispatch = useDispatch();
    const {
        chat_message_page, chat_messages
    } = useSelector((state) => state?.chat);
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
    const fetchChatMessages = async (authUser, selectedChatId, isMounted, enableLoading = true, is_group = false,page) => {
        try {

            if (selectedChatId != undefined) {
                if (isMounted) {
                    if (enableLoading) dispatch(setChatMessagesLoading(true))
                    if (is_group == true) {
                        const response = await getUserGroupChatMessages(selectedChatId, authUser.id,chat_message_page);
                        dispatch(setUserChatMessages(response.data.data))

                    } else {

                        function uniq(data,key){
                            return [
                                ...new Map(
                                    data.map(x => [key(x),x])
                                ).values()
                            ]
                        }
                        const response = await getUserChatMessages(selectedChatId, authUser.id,chat_message_page);
                        const newMessages = uniq([...chat_messages,...response.data.data],it => it.id);
                        dispatch(setUserChatMessages(newMessages))
                        // dispatch(setUserChatMessages(response.data.data))
                        dispatch(setChatMaxId(response.data.max_id))
                        // console.log(chat_max_id)
                        // if(props?.selectedChat?.pivot?.id != undefined)
                        // {
                        //     updateLastSeenMessage(props?.selectedChat?.pivot?.id,chat_max_id)
                        // }

                        return response;
                    }
                }
            }

        } catch (error) {
            toast.error(error)
            console.error('Error fetching data:', error);
        }
    };

    //send message to user
    const sendMessageChatClick = async (e, authUser, chat_message, selectedChat) => {
        e.preventDefault()
        // Don't send empty messages or if no chat is selected
        if (!chat_message.body.trim() || !selectedChat) return;
        if (selectedChat.is_group) {

            if (!chat_message.edit) {

                await sendMessageToUser(selectedChat?.id, {
                    // receiver_id: selectedChat?.pivot?.contact_user_id,
                    // channel_id: selectedChat?.pivot?.channel_id,
                    message: chat_message?.body,
                    group_id: selectedChat?.id,
                    sender_id: authUser.id,
                    is_group: true,
                    reply_id: chat_message.reply_id
                })

            }

            if (chat_message.edit) {
                await sendEditedMessageToUser(selectedChat?.id, chat_message.id, {
                    message: chat_message.body,
                    group_id: selectedChat?.id,
                    sender_id: authUser.id,
                    is_group: true
                })

            }

            dispatch(setChatMessagePage(1))
            fetchChatMessages(authUser, selectedChat?.id, true, false, true)
        }

        if (!selectedChat.is_group) {
            if (chat_message.edit) {

                await sendEditedMessageToUser(selectedChat?.pivot?.id, chat_message.id, {
                    message: chat_message.body,
                    channel_id: selectedChat?.pivot?.channel_id,
                    is_group: false
                })


            } else {

                await sendMessageToUser(selectedChat?.pivot?.id, {
                    receiver_id: selectedChat?.pivot?.contact_user_id,
                    channel_id: selectedChat?.pivot?.channel_id,
                    message: chat_message.body,
                    is_group: false,
                    reply_id: chat_message.reply_id
                })
            }

            dispatch(setChatMessagePage(1))
            fetchChatMessages(authUser, selectedChat?.pivot?.channel_id, true, false, false)
        }


        dispatch(setMessage({ ...chat_message, id: '', body: '', edit: false }))

    }

    // remove message
    const onClickRemoveMessage = async (authUser, selectedChat, chat_message) => {

        if (selectedChat.is_group) {
            if (!chat_message.edit) {

                await axios.post(`/api/v1/send-message/chat-id/${selectedChat?.id}?delete_mode=on&id=${chat_message.id}`)

                dispatch(setMessage({
                    id: '',
                    body: '',
                    dialog_message: '',
                    edit: false,
                }));

                dispatch(setShowDeleteMessageConfirmationDialog(false));
                    
            }

            fetchChatMessages(authUser, selectedChat?.id, true, true,true)

        } else {


            if (!chat_message.edit) {

                await axios.post(`/api/v1/send-message/chat-id/${selectedChat?.pivot?.id}?delete_mode=on&id=${chat_message?.id}`)

                dispatch(setMessage({
                    id: '',
                    body: '',
                    dialog_message: '',
                    edit: false,
                }));

                dispatch(setShowDeleteMessageConfirmationDialog(false));
            }
            fetchChatMessages(authUser, selectedChat?.pivot?.channel_id, true, true, false)
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