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
import { setChatMessagePage, setUserChatMessages } from '../stores/chat/chat';
import './chat.css'


const Chat = () => {

    const authUser = useSelector((state) => state?.user?.user);
    const isLoggedIn = useSelector((state) => state?.user?.isLoggedIn);

    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [page, setPage] = useState(1);
    const [scrollToKey, setScrollToKey] = useState();
    const itemRefs = useRef({});
    const containerRef = useRef(null);
    const chatMessagePageRef = useRef(1);

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
        chat_message_page,
        message: chat_message,
    } = useSelector((state) => state?.chat);

    // Use useEffect to perform actions after dispatching
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`${API_ROUTES?.chat?.ChatMessages}?contact_user_id=${selectedChat?.pivot?.channel_id}&sender_id=${authUser?.id}&page=${chat_message_page}`);
                if (chat_message_page == 1) {
                    dispatch(setUserChatMessages([...response?.data?.data]));
                } else {

                    dispatch(setUserChatMessages([...response?.data?.data, ...chat_messages]));
                }

                setScrollToKey(response?.data?.data[0]?.id);
            } catch (error) {
                console.error("Error fetching messages:", error);
            }
        };

        fetchData();
    }, [chat_message_page]);



    const initLoadChat = useOnLoadChat();

    if ((isLoggedIn != true) || (isLoggedIn == null)) return <LinearProgress />;



    // const scrollToMessageById = (messageId) => {
    //     if (messageId) {
    //         scrollToMessaged(messageId);
    //     }
    // }

    const scrollToMessageById = async (messageId) => {
        // Define a function to scroll to the top of the container
        const scrollToTop = () => {
            containerRef.current.scrollTop = 0;
        };

        // Define a function to scroll to the message once it's loaded
        const scrollToMessage = () => {

            const messageElement = itemRefs.current[messageId];
            if (messageElement) {
                // Calculate the distance of the message element from the top of the container
                const container = containerRef.current;
                const scrollTop = messageElement.offsetTop - container.offsetTop;
                // Scroll to the calculated position
                container.scrollTop = scrollTop;
                messageElement.classList.add('flash');
                setTimeout(() => {
                    messageElement.classList.remove('flash');
                }, 1000);
            } else {

                containerRef.current.scrollTop = 0;
            }
        };

        // Scroll to the top of the container
        scrollToTop();

        // Define a recursive function to continuously scroll until the message is found
        const scrollUntilMessageFound = () => {
            // Check if the message is loaded
            const messageElement = itemRefs.current[messageId];
            if (messageElement) {
                // Scroll to the message if found
                scrollToMessage();
            } else {
                // If message is not found, scroll again after a short delay
                scrollToTop();

                setTimeout(scrollUntilMessageFound, 500);
            }
        };

        // Start scrolling until the message is found
        scrollUntilMessageFound();
    };



    const handleScroll = async (e, page_no) => {
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
            // console.log(chatMessagePageRef.current)
            // chatMessagePageRef.current += 1

            // dispatch(setChatMessagePage(chat_message_page + 1));
            dispatch(setChatMessagePage(page_no + 1));
            // console.log('new' + chat_message_page)
            // const response = await axios.get(`${API_ROUTES.chat.ChatMessages}?contact_user_id=${selectedChat?.pivot.channel_id}&sender_id=${authUser?.id}&page=${page_no}`);
            // page_no = page_no + 1;

            // dispatch(setUserChatMessages([...response?.data?.data, ...chat_messages]))

            // setScrollToKey(response?.data?.data[0]?.id);

        }
    }

    const groupedMessages = {};
    chat_messages.forEach(msg => {
        const dateKey = msg.created_at;
        if (!groupedMessages[dateKey]) {
            groupedMessages[dateKey] = [];
        }
        groupedMessages[dateKey].push(msg);
    });


    // const sortKeys = Object.keys(groupedMessages).sort((a, b) => {
    //     // Parse the dates to compare them
    //     const dateA = new Date(a);
    //     const dateB = new Date(b);
    //     // Compare the dates
    //     if (dateA < dateB) return -1;
    //     if (dateA > dateB) return 1;
    //     // If dates are equal, compare the day names
    //     const dayA = dateA.toLocaleDateString('en-US', { weekday: 'long' });
    //     const dayB = dateB.toLocaleDateString('en-US', { weekday: 'long' });
    //     return dayA.localeCompare(dayB);
    // });

    // console.log(sortKeys);

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
                                                <div> {chat_message_page}</div>
                                                {<div ref={containerRef} className='p-4 overflow-y-scroll h-[90%]' onScroll={(e) => handleScroll(e, chat_message_page)}>

                                                    {/* {chat_messages.map((msg, index) => (
                                                        msg.date ? (
                                                            <div key={index} className='py-2 flex justify-center items-center'>
                                                                <span id="msg_day" className='px-2 py-1 text-xs shadow font-medium rounded-md text-gray-600 bg-white border-gray-600'>
                                                                    {msg.date}
                                                                </span>
                                                            </div>
                                                        ) : (
                                                            <Message
                                                                key={msg.id}
                                                                msg={msg}
                                                                ref={(el) => (itemRefs.current[msg.id] = el)}
                                                                handleShowOldReply={scrollToMessageById}
                                                            />
                                                        )
                                                    ))} */}


                                                    {Object.keys(groupedMessages).map(dateKey => (
                                                        <div key={dateKey}>
                                                            <div className='py-2 flex justify-center items-center'>
                                                                <span id="msg_day" className='px-2 py-1 text-xs shadow font-medium rounded-md text-gray-600 bg-white border-gray-600'>
                                                                    {dateKey}
                                                                </span>
                                                            </div>
                                                            {groupedMessages[dateKey].map((msg, index) => (
                                                                <Message
                                                                    key={msg.id}
                                                                    msg={msg}
                                                                    ref={(el) => (itemRefs.current[msg.id] = el)}
                                                                    handleShowOldReply={scrollToMessageById}
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