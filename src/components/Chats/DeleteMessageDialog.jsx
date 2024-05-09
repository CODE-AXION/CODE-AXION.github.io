import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { useDispatch, useSelector } from 'react-redux';
import { useChat } from '../../hooks/chat';
import { setMessage,setSelectedChat,setShowDeleteMessageConfirmationDialog  } from '../../stores/chat/chat';

export default function DeleteMessageDialog({ message }) {

    const open = useSelector((state) => state.chat.ui.show_delete_message_confirmation_dialog);
    const chat_message = useSelector((state) => state.chat.message)
    const authUser = useSelector((state) => state.user.user)
    const selectedChat = useSelector((state) => state.chat.selectedChat)

    const dispatch = useDispatch();

    const { onClickRemoveMessage } = useChat()

    const handleCloseDeleteDialog = () => {

        dispatch(setMessage({
            ...chat_message,
            dialog_message: ''
        }));

        dispatch(setShowDeleteMessageConfirmationDialog(false));
    };

    return (
        <Dialog
            open={open}
            onClose={handleCloseDeleteDialog}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">{"Are you sure you want to remove this message?"}</DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    {message?.dialog_message}
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleCloseDeleteDialog}>Cancel</Button>
                <Button color='error' onClick={() => onClickRemoveMessage(authUser,selectedChat,chat_message)} autoFocus>
                    Remove </Button>
            </DialogActions>
        </Dialog>
    );
}
