import React, { useState, useEffect, useContext, useRef, useCallback } from 'react';
import { SocketContext } from '../../context/SocketContext';
import Picker from 'emoji-picker-react';

import Header from '../../Components/Header/Header';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSmile, faKeyboard } from '@fortawesome/free-regular-svg-icons';

import { faAddressBook, faUsers, faTimes } from '@fortawesome/free-solid-svg-icons';

import { formatRelative } from 'date-fns';
import { es } from 'date-fns/locale';

import logo from '../../assets/logo.png';

import Message from '../../Components/Message/Message';
import RoomContacts from '../../Components/RoomContacts/RoomContacts';
import RoomOnline from '../../Components/RoomOnline/RoomOnline';

import {
    setAllContacts,
    setOnlineUsers,
    setSelectedContact,
    setIsTyping,
    setAllChats,
    setToast,
    populateRequests,
} from '../../redux/app/actions';
import { connect } from 'react-redux';

import { SERVICES } from '../../services/services';

import {
    SEND_ALL_ONLINE_USERS,
    SEND_MESSAGE,
    RECEIVE_MESSAGE,
    IS_TYPING,
    USER_TYPING,
    SEND_REQUEST,
    RECEIVE_REQUEST,
} from '../../socketEvents/socketEvents';

import debounce from '../../utils/debounce';

import useCheckContact from '../../hooks/useCheckContact';

import { useTranslation } from 'react-i18next';

import Toast from '../../Components/Toast/Toast';

const Room = (props) => {

    const socket = useContext(SocketContext);

    const { t } = useTranslation();

    const lang = t('language');

    const scrollRef = useRef();

    const setOnlineUsers = props.setOnlineUsers;

    const setOnlineUsersCallback = useCallback((users) => {
        setOnlineUsers(users);
    }, [setOnlineUsers]);

    const setAllChats = props.setAllChats;

    const setAllChatsCallback = useCallback((data) => {
        setAllChats(data);
    }, [setAllChats]);

    const [message, setMessage] = useState('');

    const [showEmojis, setShowEmojis] = useState(false);

    // this handles SETTING online users on NAVIGATING back to CHAT after for ex.
    // going to Contacts or Profile
    const [hasOnlineUsers, setHasOnlineUsers] = useState(() => {

        if (Array.isArray(props.onlineUsers) && props.onlineUsers.length) {

            if (props.onlineUsers.length === 1) {

                return false;
            }
            else {

                return true;
            }
        }
        else {
            return false;
        }
    });

    const [hasChat, setHasChat] = useState(false);

    const [chatUser, setChatUser] = useState({
        isChatting: false,
        chatUser: '',
        chatSocketId: '',
        image: null,
    });

    const [hasMessages, currentChat] = useCheckContact(props.selectedContact);

    const [onlineUserAdded, setOnlineUserAdded] = useState(false);

    const [toggleNav, setToggleNav] = useState(false);
    const [toggleType, setToggleType] = useState(null);

    const [hideOnMobile, setHideOnMobile] = useState(() => {

        if (window.innerWidth <= 480) {

            return true;
        }
        return false;
    });

    const onEmojiClick = (event) => {
        setMessage(message + event.target.innerText)
    };

    useEffect(() => {

        // this is to DISABLE <RoomOnline/> and <RoomContacts/> components
        // from being active on MOBILE
        // avoid unnecessary MEMORY COMSUPTION
        const setMobile = () => {

            if (window.innerWidth <= 480) {

                setHideOnMobile(true)
            }
            setHideOnMobile(false);
        }

        window.addEventListener('resize', setMobile);

        return () => window.removeEventListener('resize', setMobile)

    }, []);

    const setToast = props.setToast;
    const populateRequests = props.populateRequests;
    const isLoggedInProp = props.isLoggedIn;

    useEffect(() => {

        const getAllRequests = () => {

            SERVICES.getRequests()
                .then(({ data }) => {

                    populateRequests(data.requests);
                })
                .catch(() => {
                    setToast({ showToast: true, message: t('requests.errors.onGetRequests'), type: 'error' })
                })
        }

        if(isLoggedInProp) {
            getAllRequests();
        }

    }, [isLoggedInProp, populateRequests, setToast, t]);

    useEffect(() => {

        const getAllRequests = () => {

            SERVICES.getRequests()
                .then(({ data }) => {

                    populateRequests(data.requests);
                })
                .catch(() => {

                    setToast({ showToast: true, message: t('requests.errors.onGetRequests'), type: 'error' })
                })
        }

        socket.on(RECEIVE_REQUEST, ({ sender }) => {

            setToast({ showToast: true, message: `${t('toast.newRequest')}${sender}`, type: 'success' })

            // -> to get LATEST REQUESTS and UPDATE COUNTER with requests ARRAY length;
            getAllRequests();
        })

    }, [socket, setToast, populateRequests, t]);

    const setAllContacts = props.setAllContacts;

    useEffect(() => {

        const getAllContacts = () => {

            SERVICES.getAllContacts()
                .then(({ data }) => {

                    if (Array.isArray(data.contacts) && data.contacts.length) {

                        setAllContacts(data.contacts);
                    }

                })
                .catch(() => {
                    setToast({ showToast: true, message: t('contacts.errors.onGetContacts'), type: 'error' })
                })
        }

        if(isLoggedInProp) {
            getAllContacts();
        }

    }, [isLoggedInProp, setAllContacts, setToast, t]);


    useEffect(() => {

        socket.on(SEND_ALL_ONLINE_USERS, onlineUsers => {

            setOnlineUsersCallback(onlineUsers);

            setOnlineUserAdded(prev => !prev);

            if (onlineUsers.length === 1) {
                setHasOnlineUsers(false);
            }
            else {
                setHasOnlineUsers(true);
            }

        })
    }, [socket, setOnlineUsersCallback]);

    const contacts = props.contacts;
    const onlineUsers = props.onlineUsers

    // I SHOULD PERFORM THIS TASK ON THE BACKEND
    // IT IS TO COSTLY ON THE FRONTEND
    // RESEARCH AND TO REMEMBER WILL BE NEEDED HAHA
    // 2024.06.14
    useEffect(() => {

      if (Array.isArray(onlineUsers) && onlineUsers.length) {

        if (Array.isArray(contacts) && contacts.length) {

          let allOnline = [];

          contacts.forEach((contact) => {
            for (let i = 0; i < onlineUsers.length; i++) {
              if (contact.contactId.username === onlineUsers[i].username) {
                const onlineObj = {
                  username: contact.contactId.username,
                  image: contact.contactId.image,
                  isBlocked: contact.isBlocked,
                  isContact: contact.isContact,
                  isOnline: onlineUsers[i].isOnline,
                  isRegistered: onlineUsers[i].isRegistered,
                  _id: contact.contactId._id,
                  socketId: onlineUsers[i].socketId,
                };

                allOnline = [...allOnline, onlineObj];
              } else {
                allOnline = [...allOnline, onlineUsers[i]];
              }
            }
          });

          allOnline.sort((a, b) =>
            a.isContact !== b.isContact
              ? 1
              : !a.isContact !== b.isContact
              ? -1
              : 0
          );

          // this is to remove DUPLICATES username's
          const uniqueOnline = Array.from(
            new Set(allOnline.map((a) => a.username))
          ).map((user) => {
            return allOnline.find((a) => a.username === user);
          });

          setOnlineUsersCallback(uniqueOnline);
        }
      }
      // eslint-disable-next-line
    }, [socket, contacts, onlineUserAdded, setOnlineUsersCallback]);

    useEffect(() => {

        socket.on(RECEIVE_MESSAGE, ({ message, messageSender, image }) => {

            const data = {
                contact: messageSender,
                sender: messageSender,
                message,
                image,
                date: Date.now(),
            }

            setToast({ showToast: true, message: messageSender, type: 'chat' })

            setAllChatsCallback(data)
        })

    }, [socket, setToast, setAllChatsCallback]);

    socket.on(USER_TYPING, ({ isTyping, userWhoIsTyping }) => {

        if (!userWhoIsTyping) {

            props.setIsTyping(false);
        }
        else if (userWhoIsTyping === props.selectedContact) {

            props.setIsTyping(isTyping);
        }
        else {
            return;
        }
    })

    const { chatSocketId } = chatUser;
    useEffect(() => {
        // this handles DELAY for props.isTyping -> it runs as many times as key is pressed
        const timeOut = setTimeout(() => {

            socket.emit(IS_TYPING, ({ userTypingId: chatSocketId, isTyping: false }))
        }, 1800);

        return () => clearTimeout(timeOut);

    }, [message, chatSocketId, socket]);


    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: 'smooth' });

    }, [currentChat])

    const handleMessage = (e) => {

        setMessage(e.target.value)

        // is THIS handled on useFX [message] with setTimeOut() ???
        debounce(socket.emit(IS_TYPING, ({ userTypingId: chatUser.chatSocketId, isTyping: true, userWhoIsTyping: props.username })), 500);
    }

    // with BUTTON click
    const handleSendMessageButton = () => {

        if (message === '' && message.trim().length) return;

        sendMessage(message);
        setMessage('');
    }

    // with ENTER key
    const handleSendMessageEnter = (e) => {

        const key = e.keyCode || e.which;

        if (key === 13 && message !== '' && message.trim().length) {

            sendMessage(message);
            setMessage('');
            return;
        }
        return;
    }

    // actually SEND MESSAGE
    const sendMessage = (message) => {

        const msgToSend = message.trim();

        socket.emit(SEND_MESSAGE, ({
            message: msgToSend,
            messageSender: props.username,
            messageSocketId: chatUser.chatSocketId,
            image: props.userImage,
        }))

        const data = {
            contact: props.selectedContact,
            sender: props.username,
            message: msgToSend,
            image: props.userImage,
            date: Date.now(),
        }

        props.setAllChats(data)
    }

    const handleContactAdd = (username, socketId, e) => {

        e.stopPropagation();

        SERVICES.sendRequest(username)
            .then(() => {

                socket.emit(SEND_REQUEST, ({ receiverSocketId: socketId, sender: props.username }));

                props.setToast({
                    showToast: true,
                    type: 'success',
                    message: t('toast.sentRequest')
                })

            })
            .catch(error => {

                // status 406 request ALREADY EXISTS
                if (error.response.status === 406) {

                    props.setToast({
                        showToast: true,
                        type: 'error',
                        message: t('toast.requestExists')
                    })
                    return;
                }

                props.setToast({
                    showToast: true,
                    type: 'error',
                    message: t('requests.errors.onSendRequest')
                })
            })
    }

    const openChat = (contact, socketId, image) => {

        setHasChat(true);

        // handle has conversations to consider
        // isChatting -> true/false
        setChatUser({
            isChatting: true,
            chatUser: contact,
            chatSocketId: socketId,
            image: image ? image : null,
        })

        props.setSelectedContact(contact);
    }

    const handleMobileToggle = (type) => {

        switch (type) {

            case 'contacts':
                setToggleNav(true);
                setToggleType('contact');
                break;
            case 'online':
                setToggleNav(true);
                setToggleType('online');
                break;
            case 'reset':
                setToggleNav(false);
                setToggleType(null);
                break;
            default:
                setToggleNav(false);
                setToggleType(null);
                break;
        }
    }

    return (
        <div className="container">
            <Header />

            <div className="roomContainer">

                {/* START mobile MENU */}

                <div className={!toggleNav ? "mobileMenuNav" : "mobileMenuNav hide"}>
                    <div className="iconContainer" onClick={() => handleMobileToggle('contacts')}>

                        <FontAwesomeIcon icon={faAddressBook} className="icon">
                        </FontAwesomeIcon>

                        <p>{t('roomContacts.contacts')}</p>

                    </div>

                    <div className="iconContainer" onClick={() => handleMobileToggle('online')}>

                        <FontAwesomeIcon icon={faUsers} className="icon">
                        </FontAwesomeIcon>

                        <p>{t('roomOnline.online')}</p>
                    </div>
                </div>

                <div className={toggleNav ? "mobileMenuClose show" : "mobileMenuClose"}>
                    <div className="iconContainer" onClick={() => handleMobileToggle('reset')}>

                        <FontAwesomeIcon icon={faTimes} className="icon">
                        </FontAwesomeIcon>

                        <p>{t('header.close')}</p>
                    </div>

                </div>

                <div className={toggleNav ? "mobileNav show" : "mobileNav"}>
                    {
                        toggleNav && toggleType === 'contact' &&
                        <RoomContacts
                            isLoggedIn={props.isLoggedIn}
                            contacts={props.contacts}
                            isMobile={true}
                        />
                    }

                    {
                        toggleNav && toggleType === 'online' &&
                        <RoomOnline hasOnlineUsers={hasOnlineUsers}
                            handleContactAdd={handleContactAdd} openChat={openChat}
                            isMobile={true}
                        />}
                </div>

                {/* END mobile MENU */}


                {
                    hideOnMobile ?
                        null
                        :
                        <RoomContacts
                            isLoggedIn={props.isLoggedIn}
                            contacts={props.contacts}
                            isMobile={false}
                        />
                }

                <div className={!hasChat ? "chatWrapper empty" : "chatWrapper"}>

                    {
                        !hasChat ?

                            <div className="noMessages">

                                <p>{t('room.noMessages')}</p>

                            </div>
                            :
                            <>
                                <div className="chat">

                                    {/* this NEEDS TO BE HANDLED WHEN A SELECTED USER DISCONECTS */}
                                    {
                                        chatUser.isChatting && !hasMessages ?
                                            <div className="chatBegin">

                                                <p>{t('room.beginningOfChat')} {chatUser.chatUser}</p>
                                            </div>
                                            :
                                            hasMessages &&
                                            currentChat.map((item) => {

                                                const format = lang === 'es' ? { locale: es } : null;

                                                const d = new Date(item.date);
                                                const dateToShow = formatRelative(d, new Date(), format) //or {locale: es}

                                                return (
                                                    <div key={item.date} ref={scrollRef}>
                                                        <Message own={item.sender === props.username}
                                                            message={item.message} date={dateToShow}
                                                            image={item.image}
                                                            sender={item.sender}
                                                        />
                                                    </div>
                                                )
                                            })
                                    }

                                </div>

                                <div className="messageSend">

                                    <div className="inputEmojiContainer">
                                        <input type="text" placeholder={t('room.typeMessage')}
                                            onChange={handleMessage}
                                            onKeyUp={handleSendMessageEnter}
                                            value={message}
                                        ></input>

                                        <div className="emojiShowContainer">

                                            <FontAwesomeIcon icon={!showEmojis ? faSmile : faKeyboard}
                                                className={!showEmojis ? "emojiShow" : "keyboardShow"}
                                                onClick={() => setShowEmojis(prevState => !prevState)}
                                            />

                                        </div>

                                        {showEmojis &&
                                            <Picker
                                                pickerStyle={{ position: "absolute", bottom: '60px', right: '30px' }}
                                                onEmojiClick={(e) => onEmojiClick(e)}
                                                native={true}
                                            // preload={true}
                                            // UNCOMMENT ON PRODUCTION
                                            />
                                        }
                                    </div>

                                    <div className="send" onClick={handleSendMessageButton}>
                                        <p>{t('room.send')}</p>
                                        <img src={logo} alt="send"></img>
                                    </div>
                                </div>
                            </>
                    }
                </div>

                {
                    hideOnMobile ?
                        null
                        :
                        <RoomOnline hasOnlineUsers={hasOnlineUsers}
                            handleContactAdd={handleContactAdd}
                            openChat={openChat}
                        />
                }
            </div>
            <Toast />
        </div>
    );
}

const mapStateToProps = (state) => {

    return {
        isLoggedIn: state.app.isLoggedIn,
        contacts: state.app.contacts,
        username: state.app.username,
        onlineUsers: state.app.onlineUsers,
        selectedContact: state.app.selectedContact,
        isTyping: state.app.isTyping,
        allChats: state.app.allChats,
        userImage: state.app.userImage,
    }
}

export default connect(mapStateToProps, {
    setAllContacts,
    setOnlineUsers,
    setSelectedContact,
    setIsTyping,
    setAllChats,
    setToast,
    populateRequests,
})(Room);