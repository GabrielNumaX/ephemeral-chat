import React from 'react';
// import React, { useContext } from 'react';
// import { SocketContext } from '../../context/SocketContext';
import { Link, useLocation } from 'react-router-dom';

import logo from '../../assets/logo.png';

import { connect } from 'react-redux';
import { toggleHeader, setUser, setLogInOut, setSelectedContact } from '../../redux/app/actions';

// import { useHistory } from "react-router-dom";

// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faCog, faUser } from '@fortawesome/free-solid-svg-icons';

// import { imageUrl } from '../../config/config';

// import { USER_DISCONNECTED } from '../../socketEvents/socketEvents';

// import ChangeLanguage from './ChangeLanguage';

import { useTranslation } from 'react-i18next'

const Header = (props) => {

    // const socket = useContext(SocketContext);

    let location = useLocation();

    // let history = useHistory();

    const { t } = useTranslation();

    // const handleLogoutUnregistered = () => {

    //     socket.emit(USER_DISCONNECTED, props.username);

    //     localStorage.removeItem('ephemeral-username')
    //     const data = {
    //         username: null,
    //         image: null,
    //         contactsNumber: null
    //     }
    //     props.setUser(data);
    //     props.toggleHeader(false);
    //     props.setSelectedContact(null);
    //     // history.push('/');
    //     // this is to avoid getting NONE socket.id upon logout
    //     // and keeping user from being UNABLE to login
    //     // without REFRESHING browser
    //     window.location.reload();
    // }

    // const handleLogoutRegistered = () => {

    //     localStorage.clear();
    //     const data = {
    //         username: null,
    //         image: null,
    //         contactsNumber: null
    //     }
    //     props.setUser(data);
    //     props.setLogInOut(false);
    //     props.toggleHeader(false);
    //     props.setSelectedContact(null);
    //     // history.push('/');
    //     window.location.reload();
    // }

    // // console.log('HEADER isTyping', props.isTyping);

    // console.log('HEADER props', location)
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
// export default withRouter(connect(mapStateToProps, { toggleHeader, setUser, setLoginOut })(Header));

// export default Header;