import React, { useState, useEffect, useLayoutEffect, useRef } from 'react';

import Sidebar from '../partials/Sidebar';
import Header from '../partials/Header';
import SearchIcon from '@mui/icons-material/Search';


import FormControl from '@mui/material/FormControl';

import { useAuth } from '../hooks/auth'
import { InputAdornment, LinearProgress, TextField } from '@mui/material';

import ChatProfileSideWidget from '../components/Chats/ChatProfileSideWidget';
import DeleteMessageDialog from '../components/Chats/DeleteMessageDialog';
import Message from '../components/Chats/Message';
import { useChat } from '../hooks/chat';

import AddAccount from '../components/Chats/AddAccount';
import { useOnLoadChat } from '../hooks/onloadChat';
import SendMessageInput from '../components/Chats/SendMessageInput';
import ChatHeader from '../components/Chats/ChatHeader';
import { Header as AppChatHeader } from '../components/Chats/Header';
import ChatProfile from '../components/Chats/ChatProfile';
import { useDispatch, useSelector } from 'react-redux';
import AddGroup from '../components/Chats/AddGroup';
import { API_ROUTES } from '../lib/api/api_constants';
import axios from '../lib/axios';
import { setUserChatMessages } from '../stores/chat/chat';



const Chat = () => {

    const authUser = useSelector((state) => state?.user?.user);
    const isLoggedIn = useSelector((state) => state?.user?.isLoggedIn);

    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [page, setPage] = useState(1);
    const [scrollToKey, setScrollToKey] = useState();
    const itemRefs = useRef({});
    const containerRef = useRef(null);

    const scrollToMessage = (messageId) => {
        const messageElement = itemRefs.current[messageId];
        if (messageElement) {
            // Calculate the distance of the message element from the top of the container
            const container = containerRef.current;
            const scrollTop = messageElement.offsetTop - container.offsetTop;
            // Scroll to the calculated position
            container.scrollTop = scrollTop;
        }
    };
    useLayoutEffect(() => {
        if (
            scrollToKey === undefined ||
            (containerRef.current).scrollTop !== 0
        )
            return;
        // itemRefs.current[scrollToKey].scrollIntoView();
        scrollToMessage(scrollToKey);

    }, [scrollToKey]);

    const initAuthMiddleware = useAuth({ middleware: 'auth' })
    const dispatch = useDispatch()
    const {
        user_chats,
        user_chats_loader,
        user_contacts,
        chat_messages,
        chat_messages_loader,
        selectedChat,
        message: chat_message,
    } = useSelector((state) => state?.chat);

    const initLoadChat = useOnLoadChat();

    if ((isLoggedIn != true) || (isLoggedIn == null)) return <LinearProgress />;


    const scrollToMessageById = (messageId) => {
        if (messageId) {
           scrollToMessaged(messageId);
       }
    }

    const scrollToMessaged = async (messageId) => {
        let found = false;
        let page = 1;
        let allMessages = []; // Array to store all messages

        while (!found) {
            const response = await axios.get(`${API_ROUTES.chat.ChatMessages}?contact_user_id=${selectedChat?.pivot?.channel_id}&sender_id=${authUser?.id}&page=${page + 1}`);
            const messages = response?.data?.data;
            if (!messages.length) break;
            allMessages = [...messages,...allMessages];
            dispatch(setUserChatMessages(allMessages))

            setTimeout(() => {
                const messageElement = itemRefs.current[response?.data?.data[0]?.id];
                if (messageElement) {
                    const container = containerRef.current;
                    const scrollTop = messageElement.offsetTop - container.offsetTop;
                    container.scrollTop = scrollTop;
                }
            }, 0);

            console.log(page)
            for (const msg of messages) {
                if (msg.id === messageId) {
                    found = true;
                    break;
                }
            }
            if (!found) {
                page++;
            }
        }
        if (found) {
            dispatch(setUserChatMessages([...allMessages,...chat_messages])); 
            
            // setScrollToKey(messageId);

            // scrollToMessage(messageId)
            setTimeout(() => {
                const messageElement = itemRefs.current[messageId];
                if (messageElement) {
                    const container = containerRef.current;
                    const scrollTop = messageElement.offsetTop - container.offsetTop;
                    container.scrollTop = scrollTop;
                }
            }, 0);
        }
    };
    console.log(chat_messages)
    const handleScroll = async (e) => {
        let element = e.target;

        // const { scrollTop, clientHeight, scrollHeight } = containerRef.current;
        // if (scrollTop + clientHeight >= scrollHeight - 10) {

        //     console.log('df')
            
        //     const response = await axios.get(`${API_ROUTES.chat.ChatMessages}?contact_user_id=${selectedChat?.pivot.channel_id}&sender_id=${authUser?.id}&page=${page - 1}`);
        //     // dispatch(setUserChatMessages([...chat_messages,...response?.data?.data]))
        //     // // console.log(chat_messages.reverse())
        //     // setScrollToKey(response?.data?.data[0]?.id);
        //     // // chat_messages = chat_messages.reverse()
        //     // setPage(page + 1);

        //     dispatch(setUserChatMessages([...response?.data?.data,...chat_messages]))
        //     // console.log(chat_messages.reverse())
        //     setScrollToKey(response?.data?.data[0]?.id);
        //     // chat_messages = chat_messages.reverse()
        //     setPage(page - 1);
        // }

        if (element.scrollTop === 0) {
            const response = await axios.get(`${API_ROUTES.chat.ChatMessages}?contact_user_id=${selectedChat?.pivot.channel_id}&sender_id=${authUser?.id}&page=${page + 1}`);
        
            dispatch(setUserChatMessages([...response?.data?.data, ...chat_messages]))
            setScrollToKey(response?.data?.data[0]?.id);
            setPage(page + 1);
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
                                        <AppChatHeader />

                                        {/* statusChatContactLoading */}
                                        {user_chats_loader && <LinearProgress />}

                                        <div className='px-4'>

                                            <div className='mt-4'>

                                                <ChatProfile user={authUser} />

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

                                        {user_chats?.conversations?.map((user, index) => (

                                            <ChatProfileSideWidget

                                                username={user.name}
                                                // unseen_message_count={user.unseen_message_count}
                                                profileImg={user.avatar}
                                                message={user?.pivot?.last_seen_message}
                                                user={user}
                                                key={user.unique_id}

                                            />
                                        ))}

                                    </div>

                                    <div className='w-full border relative border-dashed h-[80vh]'>

                                        {selectedChat && (
                                            <div className='h-5/6'>

                                                <ChatHeader />

                                                {chat_messages_loader && <LinearProgress />}
                                                <button onClick={() => scrollToMessageById(113)}>Search for Message ID 1</button>

                                                {<div ref={containerRef} className='p-4 overflow-y-scroll h-[95%]' onScroll={handleScroll}>

                                                    {/* {chat_messages.map((msg, index) => (
                                                        <Message
                                                            key={msg.id}
                                                            msg={msg}
                                                            ref={(el) => (itemRefs.current[msg.id] = el)}
                                                          
                                                        />
                                                    ))} */}

                                                    {chat_messages.map(group => (
                                                        <div key={group.date}>
                                                            <div className="text-gray-500 font-semibold">{group.date}</div>
                                                            {group.messages.map((msg, index) => (
                                                                <Message
                                                                    key={msg.id}
                                                                    msg={msg}
                                                                    ref={(el) => (itemRefs.current[msg.id] = el)}
                                                                />
                                                            ))}
                                                        </div>
                                                    ))}

                                                </div>}
                                            </div>

                                        )}

                                        {!selectedChat && (
                                            <div className='w-full h-full flex items-center justify-center text-3xl'>Empty Mesages</div>
                                        )}
                                        <div className='w-full bg-white pt-4 absolute bottom-0'>

                                            <div className='border-b px-4 py-1'>
                                                <SendMessageInput />
                                            </div>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        }
                    </main>

                </div>
            </div>
            <DeleteMessageDialog message={chat_message} />
            <AddAccount />
            <AddGroup />
        </>
    );
}


export default Chat