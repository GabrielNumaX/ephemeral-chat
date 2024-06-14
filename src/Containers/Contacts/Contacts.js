import React, { useState, useEffect } from 'react';

import Header from '../../Components/Header/Header';
import UserItem from '../../Components/UserItem/UserItem';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserFriends, faUsersSlash } from '@fortawesome/free-solid-svg-icons';

import { connect } from 'react-redux';
import { setAllContacts, setToast } from '../../redux/app/actions';

import { SERVICES } from '../../services/services';

import { useTranslation } from 'react-i18next';

import Toast from '../../Components/Toast/Toast';

const Contacts = (props) => {

    const { t } = useTranslation();

    const [contactsNoBlocked, setContactsNoBlocked] = useState([]);
    const [contactsBlocked, setContactsBlocked] = useState([]);

    const [searchNoBlocked, setSearchNoBlocked] = useState([]);
    const [searchBlocked, setSearchBlocked] = useState([]);

    const setAllContacts = props.setAllContacts;
    const setToast = props.setToast

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

        return getAllContacts();

    }, [setAllContacts, t, setToast]);

    useEffect(() => {

        if (Array.isArray(props.contacts) && props.contacts.length) {

            const filterBlocked = props.contacts.filter(item => {

                return item.isBlocked;
            })

            const filterNoBlocked = props.contacts.filter(item => {

                return !item.isBlocked;
            })
            setContactsNoBlocked(filterNoBlocked);
            setContactsBlocked(filterBlocked);
        }

    }, [props.contacts])

    useEffect(() => {

        setSearchNoBlocked(contactsNoBlocked);
        setSearchBlocked(contactsBlocked);

    }, [contactsNoBlocked, contactsBlocked]);

    const handleSearchNoBlocked = (e) => {

        const searchVal = e.target.value;

        let searchRes = [];

        contactsNoBlocked.forEach(cont => {

            if (cont.contactId.username.toLowerCase().includes(searchVal.toLowerCase())) {

                searchRes = [...searchRes, cont];
            }
        })

        setSearchNoBlocked(searchRes);
    }

    const handleSearchBlocked = (e) => {

        const searchVal = e.target.value;

        let searchRes = [];

        contactsBlocked.forEach(cont => {

            if (cont.contactId.username.toLowerCase().includes(searchVal.toLowerCase())) {

                searchRes = [...searchRes, cont];
            }
        })

        setSearchBlocked(searchRes);
    }

    const handleBlockUnblock = (contactId, block) => {

        const toastMessage = block ? t('contacts.errors.onBlock') : t('contacts.errors.onUnblock')

        SERVICES.contactBlockUnblock({ contactId, block })
            .then(() => {

                SERVICES.getAllContacts()
                    .then(({ data }) => {

                        props.setAllContacts(data.contacts);
                    })
                    .catch(() => {
                        props.setToast({ showToast: true, message: t('contacts.errors.onGetContacts'), type: 'error' })
                    })
            })
            .catch(() => {
                props.setToast({ showToast: true, message: toastMessage, type: 'error' })
            })
    }

    const handleContactDelete = (contactId) => {

        SERVICES.contactDelete({ contactId })
            .then(() => {

                SERVICES.getAllContacts()
                    .then(({ data }) => {

                        props.setAllContacts(data.contacts);
                    })
                    .catch(() => {
                        props.setToast({ showToast: true, message: t('contacts.errors.onGetContacts'), type: 'error' })
                    })
            })
            .catch(() => {
                props.setToast({ showToast: true, message: t('contacts.errors.onDelete'), type: 'error' })
            })
    }
    return (
        <div className="container">
            <Header />

            <div className="settings">

                <div className="contactsWrapper">

                    <div className="contactsHeading">
                        <FontAwesomeIcon icon={faUserFriends} className="icon" />
                        <h2>{t('contacts.contacts')}</h2>
                    </div>
                    <input type="search"
                        placeholder={t('contacts.search')}
                        onChange={handleSearchNoBlocked}
                    />

                    <div className="contactsRow">

                        {
                            searchNoBlocked.map(item => {

                                return (
                                    <UserItem key={item.contactId._id}
                                        isBlocked={item.isBlocked}
                                        hasImage={item.contactId.image}
                                        username={item.contactId.username}
                                        handleBlockUnblock={() => handleBlockUnblock(item.contactId._id, !item.isBlocked)}
                                        handleDelete={() => handleContactDelete(item.contactId._id)}
                                    />
                                )
                            })
                        }

                        {/* end row */}
                    </div>

                </div>

                <div className="contactsBlockedWrapper">

                    <div className="contactsBlockedHeading">

                        <FontAwesomeIcon icon={faUsersSlash} className="icon" />

                        <h2>{t('contacts.blocked')}</h2>
                    </div>
                    <input type="search" placeholder={t('contacts.search')}
                        onChange={handleSearchBlocked}
                    />

                    <div className="contactsBlockedRow">

                        {
                            searchBlocked.map(item => {

                                return (
                                    <UserItem key={item.contactId._id}
                                        isBlocked={item.isBlocked}
                                        hasImage={item.contactId.image}
                                        username={item.contactId.username}
                                        handleBlockUnblock={() => handleBlockUnblock(item.contactId._id, !item.isBlocked)}
                                        handleDelete={() => handleContactDelete(item.contactId._id)}
                                    />
                                )
                            })
                        }


                    </div>

                </div>

            </div>

            <Toast />

        </div>
    );
}

const mapStateToProps = (state) => {
    return {
        contacts: state.app.contacts,
    }
}

export default connect(mapStateToProps, { setAllContacts, setToast })(Contacts);