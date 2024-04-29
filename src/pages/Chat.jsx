import React, { useState, useEffect } from 'react';

import Sidebar from '../partials/Sidebar';
import Header from '../partials/Header';
import SearchIcon from '@mui/icons-material/Search';


import FormControl from '@mui/material/FormControl';

import { useAuth } from '../hooks/auth'
import axios from '../lib/axios';
import { Input, InputAdornment, LinearProgress, TextField } from '@mui/material';
import { toast } from 'react-toastify';
import IconButton from '@mui/material/IconButton';

import ChatProfileSideWidget from '../components/Chats/ChatProfileSideWidget';
import SendIcon from '@mui/icons-material/Send';
import { useSelector } from 'react-redux';
import BasicMenu from '../components/Chats/BasicMenu';
import DeleteMessageDialog from '../components/Chats/DeleteMessageDialog';
import ClearIcon from '@mui/icons-material/Clear';
import Message from '../components/Chats/Message';
import { useChat } from '../hooks/chat';

const Chat = () => {


    const authUser = useSelector((state) => state.user.user);

    const [sidebarOpen, setSidebarOpen] = useState(false);

    // const [selectedChat, setSelectedChat] = useState([]); // State to store the selected chat profile
    // const [messages, setMessages] = useState([]); // State to store the messages

    // const [statusChatContactLoading, setChatContactLoading] = useState(false);
    // const [chatBoxLoading, setChatBoxLoading] = useState(false);

    const [sendMessageChat, setSendMessageChat] = useState('');
    const [sendDialogMessageChat, setSendDialogMessageChat] = useState('');

    const [editMode, setEditMode] = useState(false);



    const [sendEditMessageChatId, setsendEditMessageChatId] = useState('');
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);


    // const [userContacts, setUserContacts] = useState({});

    const { load, isLoading, user } = useAuth({ middleware: 'auth' })
    const { statusChatContactLoading, selectedChat, setSelectedChat,chatBoxLoading , fetchChatMessages, messages , fetchChatContacts, userContacts } = useChat();
    
    // const fetchChatContacts = async (isMounted) => {
    //     try {
    //         const response = await axios.get('/api/v1/chat/contacts');
    //         if (isMounted) {
    //             setUserContacts(response.data.data);
    //             setChatContactLoading(false)
    //         }
    //     } catch (error) {
    //         toast.error(error)
    //         console.error('Error fetching data:', error);
    //     }
    // };

    // useEffect(() => {
    //     let isMounted = true;

    //     setChatContactLoading(true,isMounted);

    //     fetchChatContacts();

    //     return () => {
    //         isMounted = false;
    //     };
    // }, []);
    // console.log(userContacts)
    // const fetchChatMessages = async (selectedChatId, isMounted, enableLoading = true) => {
    //     try {
            
    //         if (selectedChatId != undefined) {
    //             if (isMounted) {
    //                 if (enableLoading) setChatBoxLoading(true)

    //                 const response = await axios.get(`/api/v1/chat?contact_user_id=${selectedChatId}&sender_id=${authUser.id}`);
    //                 setMessages(response.data.data)
    //                 if (enableLoading) setChatBoxLoading(false)
    //             }
    //         }

    //     } catch (error) {
    //         toast.error(error)
    //         console.error('Error fetching data:', error);
    //     }
    // };

    // useEffect(() => {
    //     let isMounted = true;
    
    //     if (selectedChat?.pivot?.channel_id != undefined) {
    //         fetchChatMessages(selectedChat?.pivot?.channel_id, isMounted);
            
    //         const interval = setInterval(() => {
    //             fetchChatMessages(selectedChat?.pivot?.channel_id, isMounted, false);
    //         }, 10000);
    
    //         return () => {
    //              // Clean up when component unmounts
    //             isMounted = false; 
    //             clearInterval(interval);
    //         };
    //     }
    
    // }, [selectedChat]);
    


    const showSelectedChatMessages = async (user) => {
        setSelectedChat(user);
        fetchChatMessages(selectedChat?.pivot?.channel_id)

    };

    const handleSendMessageChatClick = async (e) => {
        e.preventDefault()

        // Don't send empty messages or if no chat is selected
        if (!sendMessageChat.trim() || !selectedChat) return; 

        if (sendEditMessageChatId != '') {
            await axios.post(`/api/v1/send-message/chat-id/${selectedChat?.pivot?.id}?edit_mode=on&id=${sendEditMessageChatId}`, {
                message: sendMessageChat,
                channel_id: selectedChat?.pivot?.channel_id,
            })

            setsendEditMessageChatId('');
            setEditMode(false)

        } else {

            await axios.post(`/api/v1/send-message/chat-id/${selectedChat?.pivot?.id}`, {
                receiver_id: selectedChat?.pivot?.contact_user_id,
                channel_id: selectedChat?.pivot?.channel_id,
                message: sendMessageChat
            })
        }



        fetchChatMessages(selectedChat?.pivot?.channel_id, true)

        setSendMessageChat('');

    }



    const editChatMessage = (msg) => {
        setSendMessageChat(msg.message)
        setsendEditMessageChatId(msg.id)
        setEditMode(true)

    }

    const handelDeleteOnClick = (message) => {
        setSendMessageChat('')

        setSendDialogMessageChat(message)
        setsendEditMessageChatId(message.id)

        setIsDeleteDialogOpen(true);
    };

    const handleCloseDeleteDialog = () => {
    
        setSendDialogMessageChat('')
        setIsDeleteDialogOpen(false);

    };

    const disableEditMode = () => {
        setsendEditMessageChatId('')
        setSendMessageChat('')
        setSendDialogMessageChat('')
        setEditMode(false)

    }


    const onClickRemoveMessage = async () => {

        if (sendEditMessageChatId != '') {
            await axios.post(`/api/v1/send-message/chat-id/${selectedChat?.pivot?.id}?delete_mode=on&id=${sendEditMessageChatId}`)

            setSendDialogMessageChat('')
            setsendEditMessageChatId('');

            setIsDeleteDialogOpen(false);

            fetchChatMessages(selectedChat?.pivot?.channel_id, true)


        }
    }

    return (
        <>
            <div className="flex h-screen overflow-hidden">

                {/* Sidebar */}
                <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

                {/* Content area */}
                <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">

                    {/*  Site header */}
                    <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

                    <main>
                        {
                            <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">

                                {/* <div className="sm:flex sm:justify-between sm:items-center mb-8">

                                <div className="grid grid-flow-col sm:auto-cols-max justify-start sm:justify-end gap-2">
                                    <Link to={'/categories'}>
                                        <Button variant="contained">List Categories</Button>
                                    </Link>
                                </div>

                            </div> */}


                                {/* Cards */}
                                <div className='border border-dotted flex items-start relative'>

                                    <div className='border h-[80vh] w-4/12'>

                                        {/* MAIN HEADER */}
                                        <div className='py-4 px-4 bg-slate-100 border-b border-slate-300'>
                                            <div className='font-semibold'>
                                                Messages
                                            </div>
                                            <div className='text-xs'>
                                                Groups, Chat, Friends
                                            </div>
                                        </div>
                                        {/* statusChatContactLoading */}

                                        {statusChatContactLoading && <LinearProgress />}

                                        <div className='px-4'>

                                            <div className='mt-4'>
                                                <div className='flex items-start gap-4'>

                                                    {!authUser.avatar && <div className="w-11 h-11 object-cover p-0.5 rounded-full ring ring-gray-300 dark:ring-gray-500"></div>}
                                                    {authUser.avatar && <img className="w-11 h-11 object-cover p-0.5 rounded-full ring ring-gray-300 dark:ring-gray-500" src={authUser.avatar} alt="Bordered avatar" />}
                                                    <div>{authUser.name}</div>
                                                </div>


                                                <div className='mt-4 py-4 '>

                                                    <FormControl className='w-full'>
                                                        <TextField
                                                            size="small"
                                                            variant="standard"
                                                            defaultValue="How can we help"
                                                            fullWidth
                                                            InputProps={{
                                                                startAdornment: (
                                                                    <InputAdornment position="start">
                                                                        <SearchIcon />
                                                                    </InputAdornment>
                                                                )
                                                            }}
                                                        />
                                                    </FormControl>

                                                </div>



                                            </div>


                                        </div>

                                        {/* {userContacts.conversations} */}
                                        {userContacts?.conversations?.map((user) => (

                                            <ChatProfileSideWidget

                                                username={user.name}
                                                // unseen_message_count={user.unseen_message_count}
                                                profileImg={user.avatar}
                                                message={user.pivot.last_seen_message}

                                                onClick={() => showSelectedChatMessages(user)}
                                                key={user.id}

                                            />
                                        ))}
                                        {/* {users.map((user) => (

                                        <ChatProfileSideWidget

                                            username={user.name}
                                            unseen_message_count={user.unseen_message_count}
                                            profileImg={user.profilePic}
                                            message={user.last_message}

                                            onClick={() => showSelectedChatMessages(user)}
                                            key={user.id}

                                        />
                                    ))} */}

                                    </div>

                                    <div className='w-full border relative border-dashed h-[80vh]'>

                                        {selectedChat && (
                                            <div className='h-5/6'>
                                                {/* HEADER */}
                                                <div className='py-4 border bg-transparent'>
                                                    <div className='pl-4 flex items-center gap-4'>
                                                        <div className="relative">
                                                            <img className="w-10 h-10 object-cover rounded-full" src={selectedChat.avatar} alt="" />
                                                            <span className="bottom-0 left-7 absolute  w-3.5 h-3.5 bg-green-400 border-2 border-white dark:border-gray-800 rounded-full"></span>
                                                        </div>
                                                        <div>
                                                            <div className='font-semibold'>{selectedChat.name}</div>
                                                            <div className='text-xs text-slate-600'>2 members, 1 group</div>
                                                        </div>
                                                    </div>
                                                </div>
                                                {chatBoxLoading && <LinearProgress />}

                                                {<div className='p-4 overflow-y-scroll h-[95%]'>

                                                    {messages.map((msg, index) => (
                                                        <Message
                                                            key={msg.id}
                                                            sender={msg.sender}
                                                            isSender={msg.isSender}
                                                            user={msg.user}
                                                            message={msg.message}
                                                            profilePic={msg.sender.avatar}
                                                            is_edited={msg.is_edited}
                                                            is_deleted={msg.is_deleted}
                                                            message_time={msg.created_at}
                                                            onClick={() => editChatMessage(msg)}
                                                            handelDeleteOnClick={() => handelDeleteOnClick(msg)}

                                                        />
                                                    ))}

                                                </div>}
                                            </div>

                                        )}

                                        {!selectedChat && (
                                            <div className='w-full h-full flex items-center justify-center text-3xl'>Empty Mesages</div>
                                        )}
                                        <div className='w-full bg-white pt-4 absolute bottom-0'>

                                            <div className='border-b px-4 py-1'>
                                                <form action="" onSubmit={handleSendMessageChatClick}>

                                                    <FormControl sx={{ width: '100%' }} variant="standard">
                                                        {/* <InputLabel htmlFor="standard-adornment-send">Send</InputLabel> */}
                                                        <Input
                                                            onChange={(e) => setSendMessageChat(e.target.value)}

                                                            // onClick={(e) => handleSendMessageChatClick(e.target.value)}
                                                            value={sendMessageChat}
                                                            placeholder='Send'
                                                            id="standard-adornment-send"
                                                            endAdornment={
                                                                <InputAdornment sx={{ mb: 1 }} position="end">

                                                                    {
                                                                        editMode &&
                                                                        <IconButton onClick={disableEditMode} type="button" sx={{ mb: 1 }} aria-label="search">
                                                                            <ClearIcon color="error" sx={{ fontSize: 27 }} />
                                                                        </IconButton>
                                                                    }
                                                                    {
                                                                        !editMode &&

                                                                        <IconButton type="submit" sx={{ mb: 1 }} aria-label="search">
                                                                            <SendIcon color="primary" sx={{ fontSize: 27 }} />
                                                                        </IconButton>
                                                                    }
                                                                </InputAdornment>
                                                            }
                                                        />
                                                    </FormControl>

                                                </form>
                                            </div>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        }
                    </main>

                </div>
            </div>
            <DeleteMessageDialog open={isDeleteDialogOpen} onClose={handleCloseDeleteDialog} onClickRemoveMessage={onClickRemoveMessage} message={sendDialogMessageChat} />

        </>
    );
}


export default Chat