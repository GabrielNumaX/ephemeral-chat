import React, { useState, useContext } from 'react';
import Header from '../../Components/Header/Header';
import { SocketContext } from '../../context/SocketContext';

import { USER_CONNECTED } from '../../socketEvents/socketEvents';

import { withRouter } from 'react-router';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-regular-svg-icons';

import { connect } from 'react-redux';
import {
    toggleHeader,
    setLogInOut,
    setUser,
    setToast,
    populateRequests,
} from '../../redux/app/actions';


import { SERVICES } from '../../services/services';

import { useTranslation } from 'react-i18next';

import Toast from '../../Components/Toast/Toast';
import Loader from '../../Components/Loader/Loader';

const Login = (props) => {

    const socket = useContext(SocketContext);

    const { t } = useTranslation();

    const [userData, setUserData] = useState({
        username: '',
        password: '',
    });

    const [showPass, setShowPass] = useState(false);

    const [loginError, setLoginError] = useState({
        userErr: false,
        userErrMessage: '',
        passErr: false,
        passErrMessage: ''
    });

    const [loading, setLoading] = useState(false);

    const validate = () => {

        let errors = {
            userErr: false,
            userErrMessage: '',
            passErr: false,
            passErrMessage: ''
        }

        let isValid = true;

        if (userData.username === '') {

            isValid = false;

            errors = {
                ...errors,
                userErr: true,
                userErrMessage: t('login.errors.enterUserOrEmail')
            }
        }

        if (userData.password === '') {

            isValid = false;

            errors = {
                ...errors,
                passErr: true,
                passErrMessage: t('login.errors.enterPassword')
            }
        }

        setLoginError({ ...errors });

        return isValid;
    }

    const handleLogin = (e) => {
        e.preventDefault();

        if (!validate()) {

            return;
        }

        setLoading(true);

        // here I should process REGISTERED USER TO GO TO ROOM
        SERVICES.login(userData)
            .then(({ data }) => {
                // console.log(data);

                setLoading(false);

                // here RECIEVE isRegistered from DB
                // and emit to BACK with username to USER_CONNECTED

                const contactsNumber = data.contactsNumber === 0 ? null : data.contactsNumber;

                const userObj = {
                    token: data.token,
                    username: data.username,
                    contactsNumber,
                    image: data.image
                }
                localStorage.setItem('token', data.token);
                localStorage.setItem('username', data.username);
                localStorage.setItem('contacts-amount', contactsNumber);
                localStorage.setItem('user-image', data.image)
                props.setUser(userObj);

                props.toggleHeader(true);
                props.setLogInOut(true);
                props.populateRequests(data.requests);

                socket.emit(USER_CONNECTED, { user: data.username, isRegistered: true });
                props.history.push('/room')
            })
            .catch((error) => {

                setLoading(false);

                if (error.response?.data.message) {

                    props.setToast({
                        showToast: true,
                        message: t('login.errors.invalidLogin'),
                        type: 'error'
                    })

                    return;
                }

                props.setToast({
                    showToast: true,
                    message: t('API.errors.generic'),
                    type: 'error'
                })

            })
    }

    return (

        <Loader visible={loading}>

            <div className="container">
                <Header />
                <div className="login">

                    <h2>{t('login.login')}</h2>

                    <form onSubmit={handleLogin}>

                        <div>
                            <label>{t('login.userOrEmail')}</label>
                            <input type="text" placeholder={t('login.userOrEmail')} className="loginInput"
                                onChange={(e) => setUserData({ ...userData, username: e.target.value })}
                            ></input>
                            {loginError.userErr && <p>{loginError.userErrMessage}</p>}
                        </div>

                        <div>
                            <label>{t('login.password')}</label>
                            <input type={showPass ? "text" : "password"} placeholder={t('login.password')} className="loginInput"
                                onChange={(e) => setUserData({ ...userData, password: e.target.value })}
                            ></input>
                            <FontAwesomeIcon icon={showPass ? faEyeSlash : faEye} className="eyeIcon"
                                onClick={() => setShowPass(prevState => !prevState)}
                            />
                            {loginError.passErr && <p>{loginError.passErrMessage}</p>}
                        </div>

                        <input type="submit" value={t('login.login')} className="loginInput"></input>
                    </form>
                </div>

                <Toast />
            </div>

        </Loader>
    );
}

// export default Login;

export default withRouter(connect(null,
    {
        toggleHeader,
        setLogInOut,
        setUser,
        setToast,
        populateRequests,
    })(Login));