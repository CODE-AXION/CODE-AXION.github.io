import Menu from '@mui/material/Menu';

import IconButton from '@mui/material/IconButton';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import MenuItem from '@mui/material/MenuItem';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useState } from 'react';

export default function BasicMenu({ onClick, handelDeleteOnClick, is_edited, is_deleted }) {
    const [anchorEl, setAnchorEl] = useState(null);

    const open = Boolean(anchorEl);
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
                            <MenuItem onClick={onClick} sx={{
                                display: 'flex',
                                gap: 2
                            }}> <EditIcon sx={{ fontSize: 18 }} /> Edit</MenuItem>
                        </div>

                        <div onClick={handleClose}>
                            <MenuItem onClick={handelDeleteOnClick} sx={{
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