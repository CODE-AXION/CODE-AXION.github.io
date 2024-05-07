// import React from 'react'

import { useDispatch, useSelector } from "react-redux";
import { setSelectedChat } from "../../stores/chat/chat";
import { useChat } from "../../hooks/chat";

const ChatProfileSideWidget = ({ user, username, profileImg, message, unseen_message_count }) => {

    const dispatch = useDispatch();
    // const selectedChat = useSelector((state) => state.chat.selectedChat);

    return (
        <>
            <div onClick={() => {
                dispatch(setSelectedChat(user));
            }} className='cursor-pointer flex items-start gap-2  border border-slate-200 py-3 px-2 border-r-0 border-l-0 border-t-0'>
                <img className="w-11 h-11 object-cover p-1 rounded-full " src={profileImg} alt="Bordered avatar" />
                <div className="w-full">

                    <div className="w-full flex justify-between">

                        <div className='text-sm font-semibold'>{username}</div>
                        <div className="text-xs">3:34</div>
                    </div>
                    <div className="w-full flex justify-between">
                        <div className='text-xs'>{message}</div>
                        {/* <div className='text-xs w-5 h-5 flex items-center justify-center bg-blue-700 text-white rounded-full'>{unseen_message_count}</div> */}
                    </div>
                </div>
            </div>
        </>
    )
}

export default ChatProfileSideWidget

