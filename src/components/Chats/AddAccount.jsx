import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import { useDispatch, useSelector } from 'react-redux';
import axios from '../../lib/axios';
import { setContactId, setShowAddAccountDialog } from '../../stores/chat/chat';
import { useChat } from '../../hooks/chat';

export default function AddAccount({ users, handleClose, handleMaxWidthChange }) {

    const user_contacts = useSelector((state) => state.chat.user_contacts);

    
    const contact_id = useSelector((state) => state.chat.contact_id);


    const { fetchChatContacts } = useChat()
    const dispatch = useDispatch();
    const addAccount = async() => {
        await axios.post(`/api/v1/add-user-contact`, {
            'add_user_contact_id': contact_id,
        });
        dispatch(setContactId(''));
        dispatch(setShowAddAccountDialog(false));
        fetchChatContacts(true)
    };

    const open = useSelector((state) => state.chat.ui.show_add_account_modal);


    return (
        <>
            <Dialog

                open={open}
                onClose={() => dispatch(setShowAddAccountDialog(false))}
            >
                <DialogTitle>Contacts</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        You can create contacts from here
                    </DialogContentText>
                    <Box
                        noValidate
                        component="form"
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            m: 'auto',
                            width: 'fit-content',
                        }}
                    >
                        <FormControl sx={{ mt: 2, minWidth: 420 }}>
                            <InputLabel htmlFor="max-width">Contacts</InputLabel>
                            <Select
                                autoFocus
                                value={contact_id}
                                onChange={(e) => dispatch(setContactId(e.target.value))}
                                label="Contacts"
                                inputProps={{
                                    name: 'max-width',
                                    id: 'max-width',
                                }}
                            >
                                {user_contacts?.map((user) => (

                                    <MenuItem key={user?.id} value={user?.id}>{user?.name}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={addAccount}>Add</Button>
                </DialogActions>
            </Dialog>
        </>
    );
}
