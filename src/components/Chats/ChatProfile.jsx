import React from 'react'

const ChatProfile = ({user}) => {
    return (
        <div className='flex items-start gap-4'>

            {!user.avatar && <div className="w-11 h-11 object-cover p-0.5 rounded-full ring ring-gray-300 dark:ring-gray-500"></div>}
            {user.avatar && <img className="w-11 h-11 object-cover p-0.5 rounded-full ring ring-gray-300 dark:ring-gray-500" src={user.avatar} alt="Bordered avatar" />}
            <div>{user.name}</div>
        </div>
    )
}

export default ChatProfile