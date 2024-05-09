import React from 'react'
import { useSelector } from 'react-redux'

const ChatHeader = () => {

    const selectedChat = useSelector((state) => state.chat.selectedChat);
    // console.log(selectedChat)
    return (
        <div className='py-4 border bg-transparent'>
            <div className='pl-4 flex items-center gap-4'>
                <div className="relative">
                    <img className="w-10 h-10 object-cover rounded-full" src={selectedChat.avatar} alt="" />
                    <span className="bottom-0 left-7 absolute  w-3.5 h-3.5 bg-green-400 border-2 border-white dark:border-gray-800 rounded-full"></span>
                </div>
                <div>
                    <div className='font-semibold'>{selectedChat.name}</div>
                    <div className='text-xs text-slate-600'>{selectedChat?.users?.length ?? '1'} members </div>
                </div>
            </div>
        </div>
    )
}

export default ChatHeader