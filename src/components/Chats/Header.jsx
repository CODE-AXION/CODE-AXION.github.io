import React from 'react'
import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/Add';
import { setShowAddAccountDialog, setShowAddGroupDialog } from '../../stores/chat/chat';
import { useChat } from '../../hooks/chat';
import { useDispatch } from 'react-redux';
import GroupAddIcon from '@mui/icons-material/GroupAdd';

const Header = ({ onClick }) => {

    const { fetchUserContacts } = useChat()
    const dispatch = useDispatch();
    const openAddAccountDialog = async () => {
        dispatch(setShowAddAccountDialog(true));
        await fetchUserContacts();
    };

    const openAddGroup = async() => {
        dispatch(setShowAddGroupDialog(true));
        await fetchUserContacts();
    }

    return (
        <div className='flex justify-between py-4 px-4 bg-slate-100 border-b border-slate-300'>
            <div>
                <div className='font-semibold'>
                    Messages
                </div>
                <div className='text-xs'>
                    Groups, Chat, Friends
                </div>
            </div>
            <div className='flex items-center gap-2'>
                <div>
                    <IconButton onClick={openAddAccountDialog} aria-label="delete">
                        <AddIcon />
                    </IconButton>
                </div>

                <div>
                    <IconButton onClick={openAddGroup} aria-label="delete">
                        <GroupAddIcon />
                    </IconButton>
                </div>
            </div>
        </div>
    )
}

export { Header };
