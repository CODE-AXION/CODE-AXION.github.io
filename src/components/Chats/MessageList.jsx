import React from 'react'
import moment from 'moment';
import Message from './Message';


const MessageList = ({ messages, itemRefs }) => {

    const msgDates = new Set();

    const formatMsgDate = (created_date) => {

        const today = moment().startOf('day');
        const msgDate = moment(created_date);
        let dateDay = '';

        if (msgDate.isSame(today, 'day')) {
            dateDay = 'Today';
        }
        else if (msgDate.isSame(today.clone().subtract(1, 'days'), 'day')) {
            dateDay = 'Yesterday';
        }
        else {
            dateDay = msgDate.format('MMMM D, YYYY');
        }

        return dateDay
    }

    const dates = new Set();


    const renderDate = (chat, dateNum) => {
        const timestampDate = format(chat.created_at, 'EEEE, YYYY-MM-DD HH:mm:ss');
      
        // Add to Set so it does not render again
        dates.add(dateNum);
      
        return <Text>{timestampDate}</Text>;
      };

    const renderMsgDate = (message, prevMessage) => {
        const prevDateTimeStamp = prevMessage ? moment(prevMessage.created_at, 'YYYY-MM-DD HH:mm:ss').valueOf() : null;
        const dateTimeStamp = moment(message.created_at, 'YYYY-MM-DD HH:mm:ss').valueOf();

        if (!prevDateTimeStamp || !msgDates.has(prevDateTimeStamp)) {
            msgDates.add(dateTimeStamp);

            return (
                <div key={dateTimeStamp} className='py-2 flex justify-center items-center'>
                    <span id="msg_day" className='px-2 py-1 shadow font-medium rounded-lg text-gray-400 bg-white border-gray-300'>
                        {formatMsgDate(message.created_at)}
                    </span>
                </div>
            )
        }

        return null;
    }



    return (
        <>
            {messages?.map((message, index) => (
                
                <React.Fragment key={message.id}>
                    {/* {renderMsgDate(message, messages[index - 1])} */}

                    {dates.has(moment(message.timestamp).format('ddMMyyyy')) ? null : renderDate(message, moment(message.timestamp).format( 'ddMMyyyy'))}

                    <Message
                        key={message.id}
                        msg={message}
                        ref={(el) => (itemRefs.current[message.id] = el)}
                    />
                    {/* {renderMsgDate(message, messages[index + 1])} */}
                </React.Fragment>
            ))}
        </>
    );
}

export default MessageList