import React, { useState } from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faUserFriends } from '@fortawesome/free-solid-svg-icons';

import Header from '../../Components/Header/Header';

import { imageUrl } from '../../config/config';
import {
    setUserImage,
    setToast,
    setUser,
} from '../../redux/app/actions';

import Toast from '../../Components/Toast/Toast';
import Loader from '../../Components/Loader/Loader';

const Profile = (props) => {

    const { t } = useTranslation();

    const [image, setImage] = useState(null);

    const [inputKey, setInputKey] = useState('empty');

    const [newUsername, setNewUsername] = useState('');

    const [userData, setUserData] = useState({
        password: '',
        passwordRep: '',
    });


    const [userVal, setUserVal] = useState({
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

    const [loader, setLoader] = useState(false);

    const validateUsername = (type) => {

        switch (type) {
            case 'isValid':
                if (/^[a-zA-Z0-9_\-.]{2,24}$/g.test(newUsername)) {

                    setUserVal({
                        error: false,
                        message: ''
                    })

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

    const validatePassword = (password, type = 'passRep') => {

        if (/^[A-Za-z\S]{8,32}$/g.test(password)) {

            setPassVal({
                error: false,
                message: ''
            })

            return true;
        }
        else {

            if (type === 'password') {


                setPassVal({
                    error: true,
                    message: t('signup.errors.passwordLength')
                })
                return false;
            }

            setPassRepVal({
                error: true,
                message: t('signup.errors.passwordLength')
            })

            return false;

        }
    }

    const onFileChange = (e) => {

        setImage(e.target.files[0]);
    }

    const makeid = (length) => {
        var result = '';
        var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var charactersLength = characters.length;
        for (var i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    }

    const handleImage = (e) => {
        e.preventDefault()

        if (!image) return;

        setLoader(true);

        const id = makeid(5)

        const formData = new FormData()
        formData.append('profileImg', image)

        axios.put("/users/profile-image", formData, {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        }).then(({ data }) => {

            setInputKey(id);
            setImage(null);
            setLoader(false);

            props.setUserImage(data.image);
        })
            .catch(() => {

                setLoader(false);

                props.setToast({
                    showToast: true,
                    message: t('profile.errors.onImageUpload'),
                    type: 'error'
                })
            })
    }

    const handleChangeUsername = (e) => {

        e.preventDefault();

        if (!validateUsername('isValid') || !validateUsername('isEmpty')) {
            return;
        }

        setLoader(true);

        axios({
            method: 'put',
            url: '/users/change-username',
            data: {
                newUsername: newUsername
            }
        })
            .then(res => {

                // REDUCER expected DATA FOR USER
                // username: action.payload.username,
                // userImage: action.payload.image,
                // contactsNumber: action.payload.contactsNumber

                const userData = {
                    username: res.data.username,
                    image: props.userImage,
                    contactsNumber: props.contactsNumber,
                }

                setLoader(false);
                props.setUser(userData);
                setNewUsername('');
            })
            .catch(error => {

                setLoader(false);

                if (error.response.status === 422) {

                    props.setToast({
                        showToast: true,
                        message: t('profile.errors.onChangeUsername'),
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

    const handleChangePassword = (e) => {

        e.preventDefault();

        if (!validatePassword(userData.password, 'password')
            || !validatePassword(userData.passwordRep)) {

            return;
        }

        setLoader(true);

        axios({
            method: 'put',
            url: '/users/change-password',
            data: {
                password: userData.password,
                newPassword: userData.passwordRep,
            }
        })
            .then(() => {

                props.setToast({
                    showToast: true,
                    message: t('profile.passwordChanged'),
                    type: 'success'
                })

                setUserData({
                    password: '',
                    passwordRep: '',
                })

                setLoader(false);

            })
            .catch((error) => {

                setLoader(false);

                if (error.response.status === 409) {

                    props.setToast({
                        showToast: true,
                        message: t('profile.errors.originalPasswordError'),
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

        <Loader visible={loader}>
            <div className="container">
                <Header />

                <div className="profile">

                    <div className="profileWrapper">

                        <div className="profileUserData">

                            <div className="profileUser">

                                <div className="iconContainer">

                                    {/* conditional rendering here */}

                                    {
                                        !props.userImage ?

                                            <FontAwesomeIcon icon={faUser} className="icon" />
                                            :
                                            <img src={`${imageUrl}${props.userImage}`} alt="username"></img>

                                    }
                                </div>

                                <p className="profileUsername">{props.username}</p>
                            </div>


                            {
                                props.contactsNumber &&
                                <div className="userContactsWrapper">

                                    <div className="userContacts">
                                        <div className="iconContactsContainer">
                                            <FontAwesomeIcon icon={faUserFriends} className="iconContacts" />
                                        </div>

                                        <div className="contactsAmount">
                                            <p>{props.contactsNumber} {t('profile.contacts')}</p>
                                        </div>
                                    </div>

                                </div>
                            }
                        </div>

                        {/* change User and Image */}

                        <div className="changeUserImgPassWrapper">

                            <div className="changeUserDiv">

                                <form onSubmit={handleChangeUsername}>

                                    <label>{t('profile.changeUsername')}</label>

                                    <div className="changeUserInputContainer">

                                        <input type="text" placeholder={t('profile.changeUsername')}
                                            onChange={(e) => setNewUsername(e.target.value)}
                                            onBlur={() => validateUsername('isValid')}
                                            value={newUsername}
                                        ></input>
                                        {userVal.error && <p>{userVal.message}</p>}
                                    </div>
                                    <div className="inputSubmitContainer">
                                        <input type="submit" value={t('profile.submit')}></input>

                                    </div>
                                </form>


                            </div>

                            <div className="changePassDiv">

                                <form onSubmit={handleChangePassword}>
                                    <label>{t('profile.changePassword')}</label>
                                    <input type="password" placeholder={t('profile.currentPassword')}
                                        className="currentPass"
                                        onChange={(e) => setUserData({ ...userData, password: e.target.value })}
                                        onBlur={() => validatePassword(userData.password, 'password')}
                                        value={userData.password}
                                    ></input>
                                    {passVal.error && <p>{passVal.message}</p>}

                                    <input type="password" placeholder={t('profile.newPassword')}
                                        onChange={(e) => setUserData({ ...userData, passwordRep: e.target.value })}
                                        value={userData.passwordRep}
                                    ></input>
                                    {passRepVal.error && <p>{passRepVal.message}</p>}

                                    <div className="inputSubmitContainer">
                                        <input type="submit" value={t('profile.submit')}></input>
                                    </div>
                                </form>


                            </div>

                            <div className="changeImageDiv">

                                <form onSubmit={handleImage}>
                                    <label>{t('profile.changeImage')}</label>
                                    <input
                                        key={inputKey}
                                        type="file"
                                        name="profileImg"
                                        accept="image/gif, image/jpeg, image/png, image/jpg"
                                        onChange={onFileChange}
                                    ></input>
                                    <input type="submit" value={t('profile.upload')}></input>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>

                <Toast />
            </div>
        </Loader>
    );
}

const mapStateToProps = (state) => {

    return {
        contactsNumber: state.app.contactsNumber,
        username: state.app.username,
        userImage: state.app.userImage,
    }
}

export default connect(mapStateToProps, { setUserImage, setToast, setUser })(Profile);