import React, { useState, useEffect } from 'react';

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
import { useSelector } from 'react-redux';
import AddGroup from '../components/Chats/AddGroup';



const Chat = () => {

    const authUser = useSelector((state) => state?.user?.user);
    const isLoggedIn = useSelector((state) => state?.user?.isLoggedIn);

    const [sidebarOpen, setSidebarOpen] = useState(false);

    const initAuthMiddleware = useAuth({ middleware: 'auth' })

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

                                        {user_chats?.conversations?.map((user,index) => (

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

                                                {<div className='p-4 overflow-y-scroll h-[95%]'>

                                                    {chat_messages.map((msg, index) => (
                                                        <Message
                                                            key={msg.id}
                                                            msg={msg}
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