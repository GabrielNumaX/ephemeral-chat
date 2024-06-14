import ContactItem from "../ContactItem/ContactItem";

import { useTranslation } from 'react-i18next';

const RoomContacts = (props) => {

    const { t } = useTranslation();

    return (
        <div className={props.isMobile ? "contactsMobile" : "contacts"}>
            <div className="contactsHeading">
                <h2>{t('roomContacts.contacts')}</h2>
                {/* 
                {
                    props.isLoggedIn && props.contacts &&
                    <input type="text" placeholder={t('roomContacts.search')}></input>
                } */}

            </div>

            {
                !props.isLoggedIn ?
                    <div className="noContacts">

                        <p>{t('roomContacts.createAccount')}</p>

                    </div>
                    :
                    // check if contacts then RENDER or same DIV with
                    // different MESSAGE
                    !props.contacts ?
                        <div className="noContacts">

                            <p>{t('roomContacts.noOnlineContacts')}</p>

                        </div>
                        :
                        <div>
                            {/* here map contacts from db */}
                            {
                                props.contacts &&
                                props.contacts.map(item => {

                                    if (item.isBlocked) return null;

                                    return (
                                        <ContactItem key={item.contactId._id}
                                            name={item.contactId.username}
                                            hasPhoto={item.contactId.image}
                                            isOnline={item.isOnline}
                                            isContact={item.isContact}
                                            hover={false}
                                        />
                                    )
                                })
                            }
                        </div>
            }
        </div>
    );
}

export default RoomContacts;