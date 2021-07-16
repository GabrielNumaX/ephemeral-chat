import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';

import Header from '../../Components/Header/Header';
import UserItem from '../../Components/UserItem/UserItem';
import { connect } from 'react-redux';

import { useTranslation } from 'react-i18next';

import { SERVICES } from '../../services/services';

import {
    populateRequests,
    setToast,
} from '../../redux/app/actions';

import Toast from '../../Components/Toast/Toast';

const Requests = (props) => {

    const { t } = useTranslation();

    const handleAcceptRequest = (requestId) => {

        // handle API call
        // get RESPONSE
        // update request ON FRONTEND
        // handle REDUX state

        SERVICES.acceptRequest(requestId)
            .then(() => {

                SERVICES.getRequests()
                    .then(({ data }) => {

                        props.populateRequests(data.requests);

                    })
                    .catch(() => {

                        props.setToast({ showToast: true, message: t('requests.errors.onGetRequests'), type: 'error' })
                    })
            })
            .catch(() => {

                props.setToast({ showToast: true, message: t('requests.errors.onAccept'), type: 'error' })
            })
    }


    const handleRejectRequest = (requestId) => {

        // handle API call
        // get RESPONSE
        // update request ON FRONTEND
        // handle REDUX state

        SERVICES.rejectRequest(requestId)
            .then(() => {

                SERVICES.getRequests()
                    .then(({ data }) => {

                        props.populateRequests(data.requests);

                    })
                    .catch(() => {

                        props.setToast({ showToast: true, message: t('requests.errors.onGetRequests'), type: 'error' })
                    })
            })
            .catch(() => {
                props.setToast({ showToast: true, message: t('requests.errors.onReject'), type: 'error' })
            })
    }

    return (
        <div className="container">
            <Header />

            <div className="profile">

                <div className="requestsWrapper">

                    <div className="requestsHeadingContainer">

                        <div className="requestsHeading">
                            <h2>
                                {t('header.requests')}
                            </h2>
                            <FontAwesomeIcon icon={faEnvelope} className="iconEnvelope" />
                        </div>
                    </div>

                    <div className="requestsContainer">

                        {
                            !props.hasRequests ?
                                <div className="noRequests">
                                    <h3>{t('requests.noPending')}</h3>
                                </div>

                                :

                                props.requests.map(item => {

                                    return (
                                        <UserItem
                                            key={item._id}
                                            username={item.senderId.username}
                                            image={item.senderId.image}
                                            isRequest={true}
                                            handleAcceptRequest={() => handleAcceptRequest(item._id)}
                                            handleRejectRequest={() => handleRejectRequest(item._id)}
                                        ></UserItem>
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
        hasRequests: state.app.hasRequests,
        requestsAmount: state.app.requestsAmount,
        requests: state.app.requests,
        username: state.app.username,
    }
}

export default connect(mapStateToProps,
    {
        populateRequests,
        setToast,
    })(Requests);