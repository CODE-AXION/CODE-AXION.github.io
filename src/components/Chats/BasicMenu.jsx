import Menu from '@mui/material/Menu';

import IconButton from '@mui/material/IconButton';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import MenuItem from '@mui/material/MenuItem';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useState } from 'react';
import { setMessage, setShowDeleteMessageConfirmationDialog } from '../../stores/chat/chat';
import { useDispatch, useSelector } from 'react-redux';

export default function BasicMenu({ msg, is_deleted }) {
    const [anchorEl, setAnchorEl] = useState(null);
    const chat_message = useSelector((state) => state.chat.message)
    const open = Boolean(anchorEl);

    const dispatch = useDispatch();


    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleDeleteClick = () => {
        handleClose();
    };

    return (
        <>
            {!is_deleted &&
                <div>
                    <IconButton
                        id="basic-button"
                        aria-controls={open ? 'basic-menu' : undefined}
                        aria-haspopup="true"
                        aria-expanded={open ? 'true' : undefined}
                        onClick={handleClick}
                    >
                        <MoreVertIcon
                            sx={{ fontSize: 16 }}

                        />
                    </IconButton>
                    <Menu
                        id="basic-menu"
                        anchorEl={anchorEl}
                        open={open}
                        onClose={handleClose}
                        MenuListProps={{
                            'aria-labelledby': 'basic-button',
                        }}
                    >
                        <div onClick={handleClose}>
                            <MenuItem onClick={(e) => dispatch(setMessage({
                                id: msg.id,
                                body: msg.message,
                                edit: true
                            }))} sx={{
                                display: 'flex',
                                gap: 2
                            }}> <EditIcon sx={{ fontSize: 18 }} /> Edit</MenuItem>
                        </div>

                        <div onClick={handleClose}>
                            <MenuItem onClick={() => {
                                  dispatch(setMessage({
                                    ...chat_message,
                                    id: msg.id,
                                    body: '',
                                    dialog_message: msg.message           
                                }))
                                dispatch(setShowDeleteMessageConfirmationDialog(true));
                            }} sx={{
                                display: 'flex',
                                gap: 2
                            }}> <DeleteIcon sx={{ fontSize: 18 }} /> Delete</MenuItem>
                        </div>


                    </Menu>
                </div>
            }
        </>
    );
}