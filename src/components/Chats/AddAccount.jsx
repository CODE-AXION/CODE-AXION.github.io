import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Switch from '@mui/material/Switch';

export default function AddAccount({ users, open, setOpen, fullWidth, setFullWidth, maxWidth, setMaxWidth, handleClose, handleMaxWidthChange, handleFullWidthChange, handleClickOpen }) {
    //   const [open, setOpen] = React.useState(false);
    //   const [fullWidth, setFullWidth] = React.useState(true);
    //   const [maxWidth, setMaxWidth] = React.useState('sm');

    //   const handleClickOpen = () => {
    //     setOpen(true);
    //   };

    //   const handleClose = () => {
    //     setOpen(false);
    //   };

    //   const handleMaxWidthChange = (event) => {
    //     setMaxWidth(event.target.value);
    //   };

    //   const handleFullWidthChange = (event) => {
    //     setFullWidth(event.target.checked);
    //   };

    return (
        <>
            <Button variant="outlined" onClick={handleClickOpen}>
                Open max-width dialog
            </Button>
            <Dialog
            
                open={open}
                onClose={handleClose}
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
                                value={maxWidth}
                                onChange={handleMaxWidthChange}
                                label="Contacts"
                                inputProps={{
                                    name: 'max-width',
                                    id: 'max-width',
                                }}
                            >
                                {users?.map((user) => (
                   
                                    <MenuItem key={user?.id} value={user?.id}>{user?.name}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Add</Button>
                </DialogActions>
            </Dialog>
        </>
    );
}
