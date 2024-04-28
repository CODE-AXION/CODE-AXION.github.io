import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

export default function DeleteMessageDialog({ open, onClose,onClickRemoveMessage, message }) {
    return (
        <Dialog
            open={open}
            onClose={onClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">{"Are you sure you want to remove this message?"}</DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    {message?.message}
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button color='error' onClick={onClickRemoveMessage} autoFocus>
                    Remove </Button>
            </DialogActions>
        </Dialog>
    );
}
