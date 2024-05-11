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
import MessageList from '../components/Chats/MessageList';



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

    function mergeObjects(obj1, obj2) {
        const merged = {};
    
        // Merge object1
        for (const date in obj1) {
            merged[date] = { ...obj1[date] }; // Create a shallow copy of the object
        }
    
        // Merge object2
        for (const date in obj2) {
            if (merged[date]) {
                // If the date already exists, concatenate the messages
                merged[date] = {
                    ...merged[date],
                    messages: [...merged[date].messages, ...obj2[date].messages], // Create a new array
                };
            } else {
                // If the date doesn't exist, simply add it to the merged object
                merged[date] = obj2[date];
            }
        }
    
        return merged;
    }

    const scrollToMessaged = async (messageId) => {
        let found = false;
        let page = 1;
        let allMessages = []; // Array to store all messages

        while (!found) {
            const response = await axios.get(`${API_ROUTES.chat.ChatMessages}?contact_user_id=${selectedChat?.pivot?.channel_id}&sender_id=${authUser?.id}&page=${page + 1}`);
            const new_messages = response?.data?.data;
            // if (!messages.length) break;

            allMessages = mergeObjects(new_messages,allMessages);

            dispatch(setUserChatMessages(allMessages));
    

            setTimeout(() => {
                const messageElement = itemRefs.current[response?.data?.data[0]?.id];
                if (messageElement) {
                    const container = containerRef.current;
                    const scrollTop = messageElement.offsetTop - container.offsetTop;
                    container.scrollTop = scrollTop;
                }
            }, 0);

            console.log(page)
            
            for (const date in new_messages) {
                if (found) break; // If already found, exit loop
                const messages = new_messages[date]?.messages;
                for (const msg of messages) {
                    if (msg.id === messageId) {
                        found = true;
                        break; // Break out of the inner loop
                    }
                }
            }

            // for (const msg of new_messages) {
            //     if (msg.id === messageId) {
            //         found = true;
            //         break;
            //     }
            // }
            if (!found) {
                page++;
            }
        }
        if (found) {
            dispatch(setUserChatMessages(mergeObjects(allMessages, chat_messages)));


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
            // console.log(Object.keys(response?.data?.data));
            // console.log([...response?.data?.data, ...chat_messages])
            let date = Object.keys(response?.data?.data)[0]
            console.log(response?.data?.data[date]['messages'][0]?.id)
            console.log(response?.data?.data, chat_messages)
            const mergedObject = mergeObjects(response?.data?.data, chat_messages);
            console.log(mergedObject)
            dispatch(setUserChatMessages(mergedObject))
            // Object.keys(responseData)[0];
            // console.log(response?.data?.data)
            setScrollToKey(response?.data?.data[date]['messages'][0]?.id);
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

                                                    {/* <MessageList 
                                                        messages={chat_messages}
                                                        itemRefs={itemRefs}
                                                    /> */}
                                                    {Object.keys(chat_messages).map(date => (
                                                        <React.Fragment key={date}>
                                                            <div className='py-2 flex justify-center items-center'>
                                                                <span id="msg_day" className='px-2 py-1 shadow font-medium rounded-lg text-gray-400 bg-white border-gray-300'>
                                                                    {date}
                                                                </span>
                                                            </div>
                                                            {chat_messages[date].messages.map((msg, index) => (
                                                                <Message
                                                                    key={msg.id}
                                                                    msg={msg}
                                                                    ref={(el) => (itemRefs.current[msg.id] = el)}
                                                                />
                                                            ))}
                                                        </React.Fragment>
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