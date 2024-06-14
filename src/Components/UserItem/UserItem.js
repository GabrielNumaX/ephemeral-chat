import React from 'react';
import { useTranslation } from 'react-i18next';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faUser,
    faUserCheck,
    faUserSlash,
    faUserMinus,
    faUserPlus,
} from '@fortawesome/free-solid-svg-icons';

import { imageUrl } from '../../config/config';


const UserItem = ({
    isBlocked,
    hasImage,
    username,
    handleBlockUnblock,
    handleDelete,
    isRequest = false,
    handleAcceptRequest,
    handleRejectRequest,
}) => {

    const { t } = useTranslation();

    return (
        <div className="contactElement">
            <div className="iconContainer">
                {/* conditional rendering */}

                {
                    hasImage ? <img src={`${imageUrl}${hasImage}`} alt="username"></img>
                        :
                        <FontAwesomeIcon icon={faUser} className="icon" />
                }

            </div>
            <div className="contactUser">

                <p className="username">{username}</p>

                <div className="actionContainer">

                    {
                        !isRequest ?
                            <>

                                {
                                    isBlocked ?
                                        <div className="iconAction" onClick={handleBlockUnblock}
                                            title={t('userItem.unblock')}
                                        >
                                            <FontAwesomeIcon icon={faUserCheck} className="iconUnblock" />
                                            {/* <p className="actionUnblock">{t('userItem.unblock')}</p> */}
                                        </div>
                                        :
                                        <div className="iconAction" onClick={handleBlockUnblock}
                                            title={t('userItem.block')}
                                        >
                                            <FontAwesomeIcon icon={faUserSlash} className="icon" />
                                            {/* <p className="action">{t('userItem.block')}</p> */}
                                        </div>
                                }

                                <div className="iconAction" onClick={handleDelete}
                                    title={t('userItem.delete')}
                                >
                                    <FontAwesomeIcon icon={faUserMinus} className="icon" />
                                    {/* <p className="action">{t('userItem.delete')}</p> */}
                                </div>
                            </>
                            :
                            <>

                                <div className="iconAction" onClick={handleAcceptRequest}
                                    title={t('userItem.acceptRequest')}
                                >
                                    <FontAwesomeIcon icon={faUserPlus} className="iconUnblock" />
                                    {/* <p className="actionUnblock">{t('userItem.acceptRequest')}</p> */}
                                </div>

                                <div className="iconAction" onClick={handleRejectRequest}
                                    title={t('userItem.rejectRequest')}
                                >
                                    <FontAwesomeIcon icon={faUserMinus} className="icon" />
                                    {/* <p className="action">{t('userItem.rejectRequest')}</p> */}
                                </div>

                            </>
                    }
                </div>

            </div>
        </div>
    );
}

export default UserItem;