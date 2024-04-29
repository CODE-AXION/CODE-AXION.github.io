import { toast } from 'react-toastify';
import axios from '../lib/axios';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

export const useChat = () => {
    
    const [userContacts, setUserContacts] = useState({});
    const [statusChatContactLoading, setChatContactLoading] = useState(false);
    
    const [messages, setMessages] = useState([]);
    const [chatBoxLoading, setChatBoxLoading] = useState(false);
    const [selectedChat, setSelectedChat] = useState([]);

    const authUser = useSelector((state) => state.user.user);

    // fetch sidebar chat contacts
    const fetchChatContacts = async (isMounted) => {
        try {
            const response = await axios.get('/api/v1/chat/contacts');
            if (isMounted) {
                setUserContacts(response.data.data);
                setChatContactLoading(false);
            }
        } catch (error) {

            toast.error(error)
            console.error('Error fetching data:', error);
        }
    };

    // fetch chat messages
    const fetchChatMessages = async (selectedChatId, isMounted, enableLoading = true) => {
        try {
            
            if (selectedChatId != undefined) {
                if (isMounted) {
                    if (enableLoading) setChatBoxLoading(true)

                    const response = await axios.get(`/api/v1/chat?contact_user_id=${selectedChatId}&sender_id=${authUser.id}`);
                    setMessages(response.data.data)
                    if (enableLoading) setChatBoxLoading(false)
                }
            }

        } catch (error) {
            toast.error(error)
            console.error('Error fetching data:', error);
        }
    };

    useEffect(() => {
        let isMounted = true;
    
        if (selectedChat?.pivot?.channel_id != undefined) {
            fetchChatMessages(selectedChat?.pivot?.channel_id, isMounted);
            
            const interval = setInterval(() => {
                fetchChatMessages(selectedChat?.pivot?.channel_id, isMounted, false);
            }, 10000);
    
            return () => {
                 // Clean up when component unmounts
                isMounted = false; 
                clearInterval(interval);
            };
        }
    
    }, [selectedChat]);

    useEffect(() => {
        let isMounted = true;

        setChatContactLoading(true);

        fetchChatContacts(isMounted);

        return () => {
            isMounted = false;
        };

    }, []);


    return {
        statusChatContactLoading,
        fetchChatContacts,
        chatBoxLoading,
        fetchChatMessages,
        selectedChat,
        setSelectedChat,
        messages,
        userContacts
    };
}