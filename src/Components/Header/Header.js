import React, { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { connect } from 'react-redux';
import { useTranslation } from 'react-i18next'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCog, faUser } from '@fortawesome/free-solid-svg-icons';

import { SocketContext } from '../../context/SocketContext';
import { toggleHeader, setUser, setLogInOut, setSelectedContact } from '../../redux/app/actions';
import { imageUrl } from '../../config/config';
import { USER_DISCONNECTED } from '../../socketEvents/socketEvents';

import ChangeLanguage from './ChangeLanguage';

import logo from '../../assets/logo.png';

const Header = (props) => {

    const socket = useContext(SocketContext);

    let location = useLocation();

    const { t } = useTranslation();

    const handleLogoutUnregistered = () => {

        socket.emit(USER_DISCONNECTED, props.username);

        localStorage.removeItem('ephemeral-username')
        const data = {
            username: null,
            image: null,
            contactsNumber: null
        }
        props.setUser(data);
        props.toggleHeader(false);
        props.setSelectedContact(null);
        // history.push('/');
        // this is to avoid getting NONE socket.id upon logout
        // and keeping user from being UNABLE to login
        // without REFRESHING browser
        window.location.reload();
    }

    const handleLogoutRegistered = () => {

        localStorage.clear();
        const data = {
            username: null,
            image: null,
            contactsNumber: null
        }
        props.setUser(data);
        props.setLogInOut(false);
        props.toggleHeader(false);
        props.setSelectedContact(null);
        // history.push('/');
        window.location.reload();
    }


    return (
        <header>

            <div className="headerLogoContainer">

                <div className="headerLogo">

                    {/* this DOES disable LINK if user is on ROOM otherwise socket connection was getting lost*/}
                    <Link to="/" style={location.pathname === "/room" ? { pointerEvents: 'none', cursor: 'default' } : null}>
                        <img src={logo} alt='logo' />
                        <h1>Ephemeral Chat</h1>
                    </Link>
                </div>

                {/* display SELECT CONTACT/USER to chat
                CONDITIONAL RENDERIG FOR TYPING */}
                {
                    props.selectedContact &&
                    <div className='usernameDiv'>
                        <h3><span>{t('header.chatWith')}</span>{props.selectedContact}</h3>
                        {props.isTyping && <p>{t('header.isTyping')}</p>}
                    </div>
                }
            </div>

            {
                !props.showHeader ?
                    <nav>
                        <Link to="/login">
                            <p className="navP">{t('header.login')}</p>
                        </Link>

                        <Link to="/sign-up">
                            <p className="navP">{t('header.signup')}</p>
                        </Link>

                        <ChangeLanguage />
                    </nav>
                    :
                    props.isLoggedIn ?
                        <nav>

                            {/* here handle SETTINGS for REGISTERED user */}
                            <div className="dropDownContainer">

                                <div className="iconContainer">
                                    <FontAwesomeIcon icon={faCog} className="icon"></FontAwesomeIcon>
                                </div>

                                <div className="dropDownWrapper">
                                    <div className="dropDown">
                                        <ul>
                                            <li>
                                                <div aria-label={props.username}>

                                                    {
                                                        props.userImage ?
                                                            < img src={`${imageUrl}${props.userImage}`} alt="username"></img>
                                                            :
                                                            <FontAwesomeIcon icon={faUser} className="iconUser" />
                                                    }
                                                </div>

                                                <p className="username">{props.username}</p>
                                            </li>
                                            <li>
                                                <Link to="/contacts"
                                                    onClick={() => props.setSelectedContact(null)}>{t('header.contacts')}</Link>
                                            </li>
                                            <li>
                                                <Link to={`/profile/${props.username}`}
                                                    onClick={() => props.setSelectedContact(null)}>{t('header.profile')}</Link>
                                            </li>
                                            <li className="liRequests">
                                                {
                                                    props.hasRequests && <div className="requests">{props.requestsAmount}</div>
                                                }
                                                <Link to="/requests"
                                                    onClick={() => props.setSelectedContact(null)}>{t('header.requests')}</Link>
                                            </li>
                                            <li>
                                                <p onClick={handleLogoutRegistered} className="logoutNav">{t('header.signout')}</p>
                                            </li>
                                        </ul>

                                    </div>

                                </div>

                            </div>

                            <ChangeLanguage />
                        </nav>

                        :
                        <nav>
                            {/* this won't be here for REGISTERED USER just DROPDOWN */}
                            <p onClick={handleLogoutUnregistered} className="logout">{t('header.logout')}</p>

                            <ChangeLanguage />
                        </nav>
            }
        </header >
    );
}

const mapStateToProps = (state) => {
    return {
        showHeader: state.app.showHeader,
        username: state.app.username,
        isLoggedIn: state.app.isLoggedIn,
        userImage: state.app.userImage,
        selectedContact: state.app.selectedContact,
        isTyping: state.app.isTyping,
        hasRequests: state.app.hasRequests,
        requestsAmount: state.app.requestsAmount,
    }
}

export default connect(mapStateToProps, { toggleHeader, setUser, setLogInOut, setSelectedContact })(Header);
