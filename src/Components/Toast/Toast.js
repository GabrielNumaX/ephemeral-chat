import React from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, faEnvelopeOpenText, faExclamationTriangle, faCheckCircle } from "@fortawesome/free-solid-svg-icons";

import { connect } from 'react-redux';
import { closeToast } from '../../redux/app/actions';

import { useTranslation } from 'react-i18next';

const Toast = (props) => {

    const { t } = useTranslation();

    return (

        // <React.Fragment>
        //     < div className="toast" >

        //         <>
        //             <FontAwesomeIcon icon={faCheckCircle} className="iconSuccess" />

        //             <div className="toastPContainer">
        //                 <p className="errorMsg">Usuario Creado</p>
        //             </div>

        //             <FontAwesomeIcon icon={faTimes} className="iconCloseError"
        //                 onClick={props.closeToast}
        //             />
        //         </>

        //     </div >
        // </React.Fragment>
        <React.Fragment>
            {
                props.showToast &&
                < div className="toast" >

                    {
                        props.type === 'chat' ?
                            <>

                                <FontAwesomeIcon icon={faEnvelopeOpenText} className="iconEnvelope" />

                                <div className="toastPContainer">
                                    {t('toast.newMessage')}
                                    <p className="userMsg">{props.message}</p>
                                </div>

                                <FontAwesomeIcon icon={faTimes} className="iconCloseChat"
                                    onClick={props.closeToast}
                                />
                            </>

                            :
                            props.type === 'error' ?
                                <>
                                    <FontAwesomeIcon icon={faExclamationTriangle} className="iconError" />

                                    <div className="toastPContainer">
                                        <p className="errorMsg">{props.message}</p>
                                    </div>

                                    <FontAwesomeIcon icon={faTimes} className="iconCloseError"
                                        onClick={props.closeToast}
                                    />
                                </>

                                :

                                props.type === 'success' ?

                                    <>
                                        <FontAwesomeIcon icon={faCheckCircle} className="iconSuccess" />

                                        <div className="toastPContainer">
                                            <p className="errorMsg">{props.message}</p>
                                        </div>

                                        <FontAwesomeIcon icon={faTimes} className="iconCloseError"
                                            onClick={props.closeToast}
                                        />
                                    </>
                                    :
                                    null

                    }
                </div >
            }
        </React.Fragment>
    );
}

const mapStateToProps = (state) => {

    return {
        showToast: state.app.toast.showToast,
        message: state.app.toast.message,
        type: state.app.toast.type,
    }
}

export default connect(mapStateToProps, { closeToast })(Toast);