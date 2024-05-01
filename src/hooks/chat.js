import { toast } from 'react-toastify';
import axios from '../lib/axios';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setUserChatContacts, setUserChatContactsLoading, 
    setUserChatMessages, setChatMessagesLoading,
    setSelectedChat,
    setMessage,
    setUserContactsLoading, setUserContacts
} from '../stores/chat/chat';

export const useChat = () => {
    
    // const setUserChatContacts = useSelector((state) => state.chat.setUserChatContacts);
    const user_chats = useSelector((state) => state.chat.user_chats);
    const user_chats_loader = useSelector((state) => state.chat.user_chats_loader);

    const user_contacts = useSelector((state) => state.chat.user_contacts);

    const chat_messages = useSelector((state) => state.chat.chat_messages);
    const chat_messages_loader = useSelector((state) => state.chat.chat_messages_loader);
    
    const selectedChat = useSelector((state) => state.chat.selectedChat);

    const chat_message = useSelector((state) => state.chat.message);



    const dispatch = useDispatch();


    const [statusChatContactLoading, setChatContactLoading] = useState(false);
    const [chatBoxLoading, setChatBoxLoading] = useState(false);
    
    const [editMode, setEditMode] = useState(false);
    
    const [messages, setMessages] = useState([]);
    const [sendMessageChat, setSendMessageChat] = useState('');
    // const [selectedChat, setSelectedChat] = useState([]);
    const [sendEditMessageChatId, setsendEditMessageChatId] = useState('');
    
   
    
    const [sendDialogMessageChat, setSendDialogMessageChat] = useState('');
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

    const authUser = useSelector((state) => state.user.user);

    // fetch sidebar chat contacts
    const fetchChatContacts = async (isMounted) => {
        try {
            dispatch(setUserChatContactsLoading());
            const response = await axios.get('/api/v1/chat/contacts');
            if (isMounted) {
                dispatch(setUserChatContacts(response.data.data))
            }
        } catch (error) {

            toast.error(error)
            console.error('Error fetching data:', error);
        }
    };

    const fetchUserContacts = async () => {
        try {
            dispatch(setUserContactsLoading(true));
            const response = await axios.get('/api/v1/user-contacts');
            // if (isMounted) {
                dispatch(setUserContacts(response.data.data));
                // console.log(users)
                // setChatContactLoading(false);
            // }
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
                    if (enableLoading) dispatch(setChatMessagesLoading(true))

                    const response = await axios.get(`/api/v1/chat?contact_user_id=${selectedChatId}&sender_id=${authUser.id}`);
                    dispatch(setUserChatMessages(response.data.data))
                }
            }

        } catch (error) {
            toast.error(error)
            console.error('Error fetching data:', error);
        }
    };

    //fetch selected chat messages on click 
    const showSelectedChatMessages = async (user) => {
        dispatch(setSelectedChat(user));
        fetchChatMessages(selectedChat?.pivot?.channel_id)

    };


    const sendMessageChatClick = async (e) => {
        e.preventDefault()

        // Don't send empty messages or if no chat is selected
        if (!chat_message.body.trim() || !selectedChat) return; 

        if (chat_message.edit) {
            await axios.post(`/api/v1/send-message/chat-id/${selectedChat?.pivot?.id}?edit_mode=on&id=${chat_message.id}`, {
                message: chat_message.body,
                channel_id: selectedChat?.pivot?.channel_id,
            })

            
            // dispatch(setMessage({
            //     ...chat_message,
            //     id: '',
            //     body: '',
            //     edit: false
            // }));

            // setsendEditMessageChatId('');
            // setEditMode(false)

        } else {

            await axios.post(`/api/v1/send-message/chat-id/${selectedChat?.pivot?.id}`, {
                receiver_id: selectedChat?.pivot?.contact_user_id,
                channel_id: selectedChat?.pivot?.channel_id,
                message: chat_message.body
            })
        }



        fetchChatMessages(selectedChat?.pivot?.channel_id, true)

        dispatch(setMessage({
            ...chat_message,
            id: '',
            body: '',
            edit: false,
        }))
        // setSendMessageChat('');

    }
  
    // await axios.post(`/api/v1/send-message/chat-id/${selectedChat?.pivot?.id}?delete_mode=on&id=${sendEditMessageChatId}`)


    

    // const editChatMessage = (msg) => {
        
    //     setSendMessageChat(msg.message)
    //     setsendEditMessageChatId(msg.id)
    //     setEditMode(true)

    // }

    const handelDeleteOnClick = (message) => {
        dispatch(setMessage({
            ...chat_message,
            id: message.id,
            body: '',
            dialog_message: message.message           
        }))
        // setSendMessageChat('')

        // setSendDialogMessageChat(message)
        // setsendEditMessageChatId(message.id)

        setIsDeleteDialogOpen(true);
    };

    const handleCloseDeleteDialog = () => {
    
        dispatch(setMessage({
            ...chat_message,
            dialog_message: ''           
        }));

        // setSendDialogMessageChat('')
        setIsDeleteDialogOpen(false);

    };

    const onClickRemoveMessage = async () => {

        if (!chat_message.edit) {
            await axios.post(`/api/v1/send-message/chat-id/${selectedChat?.pivot?.id}?delete_mode=on&id=${chat_message.id}`)

            dispatch(setMessage({
                id: '',
                body: '',
                dialog_message: '',
                edit: false,           
            }));
            // setSendDialogMessageChat('')
            // setsendEditMessageChatId('');

            setIsDeleteDialogOpen(false);

            fetchChatMessages(selectedChat?.pivot?.channel_id, true)


        }
    }
    
    useEffect(() => {
        let isMounted = true;
    
        if (selectedChat?.pivot?.channel_id != undefined) {
            fetchChatMessages(selectedChat?.pivot?.channel_id, isMounted);
            
            const interval = setInterval(() => {
                fetchChatMessages(selectedChat?.pivot?.channel_id, isMounted, false);
            }, 90000);
    
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
        editMode, 
        setEditMode,
        // selectedChat,
        sendMessageChat,
        sendMessageChatClick,
        setSendMessageChat,
        sendEditMessageChatId, 
        isDeleteDialogOpen, 
        setIsDeleteDialogOpen,
        setsendEditMessageChatId,
        showSelectedChatMessages,
        sendDialogMessageChat,
        setSelectedChat,
        messages,
        
        handelDeleteOnClick,
        handleCloseDeleteDialog,
        onClickRemoveMessage,

        fetchUserContacts,

        user_chats,
        user_chats_loader,
        chat_messages,
        chat_messages_loader,
        selectedChat,

        user_contacts
    };
}