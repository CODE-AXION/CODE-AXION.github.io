import BasicMenu from "./BasicMenu";

const Message = ({ handelDeleteOnClick, onClick, isSender,message_time , sender, user, message, is_edited, is_deleted, profilePic }) => {

    return (
        <div className={isSender ? 'flex justify-end flex-start gap-4' : 'flex flex-start gap-4'}>
            {!isSender && (
                <img className="w-10 h-10 rounded-full" src={profilePic} alt="Rounded avatar" />
            )}
            <div className='relative'>
                <div className='absolute top-0 text-xs right-0'>{message_time}</div>
                <div className='flex items-center gap-2 my-6 px-2 py-0.5 rounded text-sm bg-white border w-fit'>
                    <div>
                        <div className={is_deleted ? 'italic text-xs' : ''}>{message}</div>
                    </div>

                    <div className='relative'>
                        {
                            isSender &&
                            <BasicMenu is_edited={is_edited} is_deleted={is_deleted} onClick={onClick} handelDeleteOnClick={handelDeleteOnClick} />
                        }
                    </div>

                </div>
                {!is_deleted &&
                    <div className='absolute bottom-1 right-0 text-xs' >{is_edited ? 'message edited' : ''}</div>
                }
            </div>
        </div>
    );
};

export default Message