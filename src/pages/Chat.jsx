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
import { useDispatch, useSelector } from 'react-redux';
import BasicMenu from '../components/Chats/BasicMenu';
import DeleteMessageDialog from '../components/Chats/DeleteMessageDialog';
import ClearIcon from '@mui/icons-material/Clear';
import Message from '../components/Chats/Message';
import { useChat } from '../hooks/chat';
import AddIcon from '@mui/icons-material/Add';
import AddAccount from '../components/Chats/AddAccount';
import { setMessage } from '../stores/chat/chat';



const Chat = () => {


    const authUser = useSelector((state) => state.user.user);
    const chat_message = useSelector((state) => state.chat.message);


    const dispatch = useDispatch();

    const [sidebarOpen, setSidebarOpen] = useState(false);

    const { load, isLoading, user } = useAuth({ middleware: 'auth' })

    const { 
        fetchChatContacts,
        isDeleteDialogOpen,
        sendDialogMessageChat,
        sendMessageChatClick,
        showSelectedChatMessages,
        handelDeleteOnClick,
        handleCloseDeleteDialog,
        disableEditMode,
        onClickRemoveMessage,
        
        fetchUserContacts,
        users,

        user_chats,
        user_chats_loader,

        chat_messages,
        chat_messages_loader,
        selectedChat,
        user_contacts

        } = useChat();

    const [open, setOpen] = useState(false);
    const [maxWidth, setMaxWidth] = useState('');

    const handleClickOpen = async() => {
        setOpen(true);
        await fetchUserContacts();
        console.log(users)
    };

    const addToContacts = async(sendContactId) => {

        await axios.post(`/api/v1/add-user-contact`,{
            'add_user_contact_id': sendContactId,
        });
    }
    

    const handleClose = () => {
        addToContacts(maxWidth);
        setOpen(false);
        fetchChatContacts(true)
        // console.log(maxWidth)
    };

    const handleMaxWidthChange = (event) => {
        setMaxWidth(event.target.value);
    };

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
                                        <div className='flex justify-between py-4 px-4 bg-slate-100 border-b border-slate-300'>
                                            <div>
                                                <div className='font-semibold'>
                                                    Messages
                                                </div>
                                                <div className='text-xs'>
                                                    Groups, Chat, Friends
                                                </div>
                                            </div>
                                            <div>
                                                <IconButton onClick={handleClickOpen} aria-label="delete">
                                                    <AddIcon />
                                                </IconButton>
                                            </div>
                                        </div>
                                        {/* statusChatContactLoading */}

                                        {user_chats_loader && <LinearProgress />}

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

                                        {/* {user_chats.conversations} */}
                                        {user_chats?.conversations?.map((user) => (

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
                                                {chat_messages_loader && <LinearProgress />}

                                                {<div className='p-4 overflow-y-scroll h-[95%]'>

                                                    {chat_messages.map((msg, index) => (
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
                                                            onClick={() => {
                                                                dispatch(setMessage({
                                                                    id: msg.id,
                                                                    body: msg.message,
                                                                    edit: true
                                                                }))
                                                            }}
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
                                                <form action="" onSubmit={sendMessageChatClick}>

                                                    <FormControl sx={{ width: '100%' }} variant="standard">
                                                        {/* <InputLabel htmlFor="standard-adornment-send">Send</InputLabel> */}
                                                        <Input
                                                            onChange={(e) => dispatch(setMessage({
                                                                ...chat_message,
                                                                body: e.target.value
                                                            }))}

                                                            // onClick={(e) => sendMessageChatClick(e.target.value)}
                                                            value={chat_message.body}
                                                            placeholder='Send'
                                                            id="standard-adornment-send"
                                                            endAdornment={
                                                                <InputAdornment sx={{ mb: 1 }} position="end">

                                                                    {
                                                                        chat_message.edit &&
                                                                        <IconButton onClick={() => {
                                                                            dispatch(setMessage({
                                                                                id: '',
                                                                                body: '',
                                                                                dialog_message: '',
                                                                                edit: false,           
                                                                            }));
                                                                        }} type="button" sx={{ mb: 1 }} aria-label="search">
                                                                            <ClearIcon color="error" sx={{ fontSize: 27 }} />
                                                                        </IconButton>
                                                                    }
                                                                    {
                                                                        !chat_message.edit &&

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
            <AddAccount

                maxWidth={maxWidth}
                handleClose={handleClose}
                handleClickOpen={handleClickOpen}
                // handleFullWidthChange={handleFullWidthChange}
                handleMaxWidthChange={handleMaxWidthChange}
                open={open}
                users={user_contacts}
            />
        </>
    );
}


export default Chat