import { toast } from 'react-toastify';
import axios from '../lib/axios';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useChat } from './chat';
import { setChatMessagePage } from '../stores/chat/chat';


export const useOnLoadChat = () => {

    const { selectedChat } = useSelector((state) => state?.chat);

    const chat_message_page = useSelector((state) => state?.chat.chat_message_page);
    const dispatch = useDispatch();

    const authUser = useSelector((state) => state?.user?.user);
    const { fetchChatMessages, fetchChatContacts } = useChat();

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

            fetchChatMessages(authUser,selectedChatObject?.id, isMounted, true, selectedChatObject?.is_group, chat_message_page);

            const interval = setInterval(() => {
                dispatch(setChatMessagePage(1)) 
                // fetchChatMessages(authUser,selectedChatObject?.id, isMounted, false, selectedChatObject?.is_group);
            }, 15000);

            return () => {

                isMounted = false;
                clearInterval(interval);
            };
        }

    }, [selectedChat]);

    useEffect(() => {
        let isMounted = true;

        fetchChatContacts(isMounted);

        return () => {
            isMounted = false;
        };

    }, []);

}