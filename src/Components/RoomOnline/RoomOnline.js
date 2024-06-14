import { useState, useEffect } from "react";

import ContactItem from "../ContactItem/ContactItem";
import { connect } from 'react-redux';

import { useTranslation } from "react-i18next";

const RoomOnline = ({
    username,
    hasOnlineUsers,
    onlineUsers,
    handleContactAdd,
    openChat,
    isLoggedIn,
    isMobile = false,
}) => {

    const { t } = useTranslation();

    const [searchOnlineUsers, setSearchOnlineUsers] = useState([]);

    useEffect(() => {
        setSearchOnlineUsers(onlineUsers)
    }, [onlineUsers]);

    const handleSearch = (e) => {

        const searchVal = e.target.value;

        let searchRes = [];

        onlineUsers.forEach((user) => {
            if (user.username.toLowerCase().includes(searchVal.toLowerCase())) {

                searchRes = [...searchRes, user];
            }
        })

        setSearchOnlineUsers(searchRes);
    }


    return (
        <div className={isMobile ? "onlineMobile" : "online"}>
            <div className="onlineHeading">
                <h2>{t('roomOnline.online')}</h2>


                {
                    hasOnlineUsers &&
                    <input type="text"
                        placeholder={t('roomOnline.search')}
                        onChange={handleSearch}
                    ></input>
                }

            </div>

            {/* here I should HANDLE REGISTERED AND NO REGISTERED
                        ONLINE USERS 
                    */}
            {/* conditional RENDERING */}

            {
                !hasOnlineUsers ?

                    <div className="noContacts">

                        <p>{t('roomOnline.noOneOnline')}</p>

                    </div>
                    :
                    searchOnlineUsers.map(item => {

                        if (item?.isBlocked) return null;

                        // here I handle NOT SHOWING CURRENT user on ONLINE LIST
                        if (item.username === username) return null;

                        return (
                            <ContactItem key={item.username}
                                name={item.username}
                                hasPhoto={item?.image}
                                isLoggedIn={isLoggedIn}
                                // handle isOnline HERE
                                isOnline={item.isOnline}
                                isContact={item?.isContact}
                                isRegistered={item.isRegistered}
                                handleAdd={
                                    (item.isRegistered && !item?.isContact && isLoggedIn) ?
                                        (e) => handleContactAdd(item.username, item.socketId, e)
                                        :
                                        null
                                }
                                openChat={() => openChat(item.username, item.socketId, item?.image)}
                            />
                        )
                    })
            }
        </div>
    )
}

const mapStateToProps = (state) => {

    return {
        username: state.app.username,
        isLoggedIn: state.app.isLoggedIn,
        onlineUsers: state.app.onlineUsers,
    }
}

export default connect(mapStateToProps, null)(RoomOnline);