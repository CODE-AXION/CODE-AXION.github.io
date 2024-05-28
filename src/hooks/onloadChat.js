import { toast } from 'react-toastify';
import axios from '../lib/axios';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useChat } from './chat';
import { setChatMessagePage, setUnreadMessageCount } from '../stores/chat/chat';


export const useOnLoadChat = () => {

    const { selectedChat, chat_messages, chat_max_id } = useSelector((state) => state?.chat);

    const chat_message_page = useSelector((state) => state?.chat.chat_message_page);
    const dispatch = useDispatch();

    const authUser = useSelector((state) => state?.user?.user);
    const { fetchChatMessages, fetchChatContacts } = useChat({ selectedChat: selectedChat, chat_max_id: chat_max_id });

    const generateSelectedChatObject = (selectedChat) => {
        return {
            id: (selectedChat?.is_group) ? selectedChat?.id : selectedChat?.pivot?.channel_id,
            is_group: selectedChat?.is_group
        }
    }

    useEffect(() => {
        let isMounted = true;

        const selectedChatObject = generateSelectedChatObject(selectedChat)

        if (selectedChatObject?.id != undefined) {

            const new_messages = fetchChatMessages(authUser, selectedChatObject?.id, isMounted, true, selectedChatObject?.is_group, chat_message_page);
            console.log(new_messages.data);
            console.log('<-- SELECTED CHAT --> ');
            console.log(selectedChat)
            console.log('<-- SELECTED CHAT --> ');
            const interval = setInterval(() => {


                if (selectedChat?.pivot?.id) {
                    // fetchNewMessagesCount({chatId:selectedChat?.pivot?.channe_id , lastSeenMessageId, receiver_id: selectedChat?.id})
                    // updateLastSeenMessage(selectedChat?.pivot?.id,lastSeenMessageId)
                    // fetchChatMessages(authUser, selectedChatObject?.id, isMounted, true, selectedChatObject?.is_group, chat_message_page);
                }

            }, 2000);

            return () => {

                isMounted = false;
                clearInterval(interval);
            };
        }

    }, [selectedChat]);

    // useEffect(() => {
    //   let isMounted = true;

    //     if(selectedChat?.pivot?.id && isMounted)
    //     {   
    //         updateLastSeenMessage({chatId:selectedChat?.pivot?.id,lastSeenMessageId: chat_max_id,receiver_id: selectedChat?.id})
    //     }

    //   return () => isMounted = false;

    // }, [chat_max_id])

    useEffect(() => {

        let isMounted = true;
        const interval = setInterval(() => {

            const selectedChatObject = generateSelectedChatObject(selectedChat)

            if (selectedChat?.id) {
                
                fetchChatMessages(authUser, selectedChatObject?.id, isMounted, true, selectedChatObject?.is_group, chat_message_page);

                // const lastSeenMessageId = chat_messages[chat_messages.length - 1]?.id
                // fetchNewMessagesCount({ chatId: selectedChat?.pivot?.channel_id, lastSeenMessageId, receiver_id: selectedChat?.id })
                // console.log()
                
            }

        }, 2000);


        return () => {
            isMounted = false;
            clearInterval(interval);
        };

    }, [chat_messages])


    const updateLastSeenMessage = async ({ chatId, lastSeenMessageId, receiver_id }) => {
        try {
            await axios.post(`/api/v1/markAsSeen`, { last_seen_message_id: lastSeenMessageId, chat_id: chatId, receiver_id: receiver_id });
        } catch (error) {
            console.error('Error updating last seen message:', error);
        }
    };

    const fetchNewMessagesCount = async ({ chatId, lastSeenMessageId, receiver_id }) => {
        try {
            const response = await axios.get(`/api/v1/check/new-messages`,
                { params: { last_seen_message_id: lastSeenMessageId, chat_id: chatId, receiver_id: receiver_id } }
            );
            dispatch(setUnreadMessageCount(response.data.count));
        } catch (error) {
            console.error('Error updating last seen message:', error);
        }
    };



    useEffect(() => {
        let isMounted = true;

        fetchChatContacts(isMounted);

        return () => {
            isMounted = false;
        };

    }, []);

}