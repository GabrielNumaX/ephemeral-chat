import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';

import { imageUrl } from '../../config/config';

const Message = ({ own, date, message, image, sender }) => {

    return (

        <div className={own ? "messageWrapper own" : "messageWrapper"} title={sender}>
            <div className='message'>
                {/* conditional rendering for ICON or PHOTO*/}
                <div className="iconContainer">

                    {
                        image ?
                            <img src={`${imageUrl}${image}`} alt="username"></img>
                            :
                            <FontAwesomeIcon icon={faUser} className="icon"></FontAwesomeIcon>
                    }
                </div>

                <div className="messageContainer">
                    <p>
                        {message}
                    </p>
                    <div className="timeContainer">
                        <p>{date}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Message;