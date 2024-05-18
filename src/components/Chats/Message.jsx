import BasicMenu from "./BasicMenu";
import { setMessage } from "../../stores/chat/chat";
import { forwardRef } from "react";
import { ButtonBase } from "@mui/material";

const Message = forwardRef(({ msg, handleShowOldReply }, ref) => {

    return (
        <div ref={ref} className={msg.isSender ? 'flex justify-end flex-start gap-4' : 'flex flex-start gap-4'}>
            {!msg.isSender && (
                <img className="w-10 h-10 rounded-full" src={msg.sender.avatar} alt="Rounded avatar" />
            )}
            <div className='relative'>
                <div className='absolute top-0 text-xs right-0'>{msg.created_at}</div>
                <div className="text-xs">{(msg.group_id != undefined) && msg?.sender.name}</div>
                <div className='flex items-center gap-2 my-6 px-2 py-0.5 rounded text-sm bg-white border w-fit'>
                    <div>
                        <div className={msg.is_deleted ? 'italic text-xs' : ''}>{msg.message}</div>

                        {
                            msg?.reply?.message && (
                                <ButtonBase>
                                    <div onClick={() => handleShowOldReply(msg?.reply?.id)} className="bg-slate-200 rounded-l-md border-l-2 border-purple-500 p-1">
                                        {msg?.reply?.message}
                                    </div>
                                </ButtonBase>
                            )
                        }
                    </div>

                    <div className='relative'>
                        {

                            <BasicMenu is_edited={msg.is_edited} msg={msg} is_deleted={msg.is_deleted} />
                        }
                    </div>

                </div>
                {!msg.is_deleted &&
                    <div className='absolute bottom-1 right-0 text-xs' >{msg.is_edited ? 'message edited' : ''}</div>
                }
            </div>
        </div>
    );
});


export default Message