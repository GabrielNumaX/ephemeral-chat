import React, { useState, useEffect, useCallback } from 'react';
import Header from '../../Components/Header/Header';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-regular-svg-icons';

import { useTranslation } from 'react-i18next';

import Loader from '../../Components/Loader/Loader';
import Toast from '../../Components/Toast/Toast';

import { connect } from 'react-redux';
import { setToast } from '../../redux/app/actions';

import { SERVICES } from '../../services/services';

const Signup = (props) => {

    const { t } = useTranslation();

    const [userData, setUserData] = useState({
        username: '',
        email: '',
        password: '',
        passwordRep: '',
    });

    const [showPass, setShowPass] = useState(false);
    const [showPassRep, setShowPassRep] = useState(false);

    const [userVal, setUserVal] = useState({
        error: false,
        message: '',
    });

    const [emailVal, setEmailVal] = useState({
        error: false,
        message: '',
    });

    const [passVal, setPassVal] = useState({
        error: false,
        message: '',
    });

    const [passRepVal, setPassRepVal] = useState({
        error: false,
        message: '',
    });

    const [isPassRepTouched, setIsPassRepTouched] = useState(false);

    const [loading, setLoading] = useState(false);

    const passwordRepValCallback = useCallback(() => {

        if ((userData.password !== userData.passwordRep) && isPassRepTouched) {

            setPassRepVal({
                error: true,
                message: t('signup.errors.passwordNoMatch'),
            })

            return false;
        }
        else {
            setPassRepVal({
                error: false,
                message: '',
            })

            return true;
        }
    }, [userData.password, userData.passwordRep, t, isPassRepTouched]);

    const validateUsername = (type) => {

        switch (type) {
            case 'isValid':
                if (/^[a-zA-Z0-9_\-.]{2,24}$/g.test(userData.username)) {

                    setUserVal({
                        error: false,
                        message: ''
                    })

                    usernameCheck();

                    return true;
                }
                else {

                    setUserVal({
                        error: true,
                        message: t('signup.errors.userError')
                    })

                    return false;
                }
            case 'isEmpty':
                if (userData.username !== '') {

                    setUserVal({
                        error: false,
                        message: ''
                    })

                    return true;
                }
                else {

                    setUserVal({
                        error: true,
                        message: t('signup.errors.userRequired')
                    })

                    return false;
                }
            default:
                return;
        }
    }

    const validateEmail = () => {
        // [\w-\.]
        if (/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/g.test(userData.email)) {

            setEmailVal({
                error: false,
                message: ''
            })

            return true;
        }
        else {

            setEmailVal({
                error: true,
                message: t('signup.errors.enterEmail')
            })

            return false;
        }
    }

    const validatePassword = () => {

        if (/^[A-Za-z\S]{8,32}$/g.test(userData.password)) {

            setPassVal({
                error: false,
                message: ''
            })

            return true;
        }
        else {

            setPassVal({
                error: true,
                message: t('signup.errors.passwordLength')
            })

            return false;
        }
    }

    const validateAll = () => {

        const userValid = validateUsername('isValid');
        const userEmpty = validateUsername('isEmpty');
        const email = validateEmail();
        const pass = validatePassword();
        // const passRep = passwordRepVal();
        const passRep = passwordRepValCallback();

        if (userEmpty && userValid && email && pass && passRep) {

            return true;
        }

        return false;
    }

    const usernameCheck = () => {

        SERVICES.checkUsername(userData.username)
            .then(res => {

                setUserVal({
                    error: false,
                    message: '',
                })
            })
            .catch(error => {

                console.log(error.response.status);

                if (error.response.status === 406) {

                    setUserVal({
                        error: true,
                        message: t('signup.errors.userNotAvailable'),
                    })

                    props.setToast({
                        showToast: true,
                        message: t('signup.errors.userNotAvailable'),
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

    const handleSignup = (e) => {

        e.preventDefault();

        if (!validateAll()) {

            // alert('ERROR');
            return;
        }

        setLoading(true)

        SERVICES.signup(userData)
            .then(res => {

                setLoading(false)
                // console.log(res.data);

                setUserData({
                    username: '',
                    email: '',
                    password: '',
                    passwordRep: '',
                });

                props.setToast({
                    showToast: true,
                    message: t('signup.userCreated'),
                    type: 'success',
                })
            })
            .catch(error => {
                setLoading(false)
                // console.log(error);

                if (error.response.status === 422) {

                    props.setToast({
                        showToast: true,
                        message: t('signup.errors.emailNotAvailable'),
                        type: 'error'
                    });

                    return
                }

                props.setToast({
                    showToast: true,
                    message: t('API.errors.generic'),
                    type: 'error'
                });
            })
    }

    useEffect(() => {

        passwordRepValCallback();

    }, [passwordRepValCallback]);

    // console.log({ isPassRepTouched })

    return (

        <Loader visible={loading}>
            <div className="container">
                <Header />
                <div className="signup">

                    <h2>{t('signup.createUser')}</h2>

                    <form onSubmit={handleSignup}>
                        <div>
                            <label>{t('signup.username')}</label>
                            <input type="text" placeholder={t('signup.username')}
                                onChange={(e) => setUserData({ ...userData, username: e.target.value })}
                                onBlur={() => validateUsername('isValid')}
                                value={userData.username}
                            ></input>
                            {userVal.error && <p>{userVal.message}</p>}
                        </div>

                        <div>
                            <label>Email</label>
                            <input type="email" placeholder="Email"
                                onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                                onBlur={validateEmail}
                                value={userData.email}
                            ></input>
                            {emailVal.error && <p>{emailVal.message}</p>}
                        </div>

                        <div>
                            <label>{t('signup.password')}</label>
                            <input type={showPass ? "text" : "password"} placeholder={t('signup.password')}
                                onChange={(e) => setUserData({ ...userData, password: e.target.value })}
                                onBlur={validatePassword}
                                value={userData.password}
                            ></input>
                            <FontAwesomeIcon icon={showPass ? faEyeSlash : faEye} className="eyeIcon"
                                onClick={() => setShowPass(prevState => !prevState)}
                            />
                            {passVal.error && <p>{passVal.message}</p>}
                        </div>

                        <div>
                            <label>{t('signup.repeatPassword')}</label>
                            <input type={showPassRep ? "text" : "password"} placeholder={t('signup.repeatPassword')}
                                onChange={(e) => setUserData({ ...userData, passwordRep: e.target.value })}
                                onFocus={() => setIsPassRepTouched(true)}
                                value={userData.passwordRep}
                            ></input>
                            <FontAwesomeIcon icon={showPassRep ? faEyeSlash : faEye} className="eyeIcon"
                                onClick={() => setShowPassRep(prevState => !prevState)}
                            />
                            {passRepVal.error && <p>{passRepVal.message}</p>}
                        </div>

                        <input type="submit" value={t('signup.createAccount')}></input>
                    </form>
                </div>
                <div className="disclaimer">
                    <p>{t('signup.disclaimer01')}<span>&nbsp;Ephemeral&trade;&nbsp;</span>{t('signup.disclaimer02')}<span>&nbsp;{t('signup.disclaimer03')}&nbsp;</span>{t('signup.disclaimer04')}</p>
                </div>
                <Toast />
            </div>
        </Loader>
    );
}

export default connect(null, { setToast })(Signup);