import { useDispatch, useSelector } from "react-redux";
import { setMessage } from "../../stores/chat/chat";

import FormControl from '@mui/material/FormControl';
import { Input, InputAdornment } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import ClearIcon from '@mui/icons-material/Clear';
import SendIcon from '@mui/icons-material/Send';
import { useChat } from "../../hooks/chat";
import { memo } from "react";

const SendMessageInput = () => {
    const dispatch = useDispatch();

       
    const chat_message = useSelector((state) => state?.chat?.message);

    const authUser = useSelector((state) => state?.user?.user);
    const selectedChat = useSelector((state) => state?.chat?.selectedChat);
    const { sendMessageChatClick } = useChat();

    return (
        <form action="" 
            onSubmit={(e) => sendMessageChatClick(e,authUser,chat_message,selectedChat)} 
        >
            <FormControl sx={{ width: '100%' }} variant="standard">
                <Input
                    onChange={(e) => dispatch(setMessage({
                        ...chat_message,
                        body: e.target.value
                    }))}
                    value={chat_message.body}
                    placeholder='Send'
                    id="standard-adornment-send"
                    endAdornment={
                        <InputAdornment sx={{ mb: 1 }} position="end">
                            {chat_message.edit &&
                                <IconButton onClick={() => {
                                    dispatch(setMessage({
                                        id: '',
                                        body: '',
                                        dialog_message: '',
                                        edit: false,
                                    }));
                                }} type="button" sx={{ mb: 1 }} aria-label="search">
                                    <ClearIcon color="error" sx={{ fontSize: 27 }} />
                                </IconButton>
                            }
                            {!chat_message.edit &&
                                <IconButton type="submit" sx={{ mb: 1 }} aria-label="search">
                                    <SendIcon color="primary" sx={{ fontSize: 27 }} />
                                </IconButton>
                            }
                        </InputAdornment>
                    }
                />
            </FormControl>
        </form>
    );
};

export default memo(SendMessageInput);
