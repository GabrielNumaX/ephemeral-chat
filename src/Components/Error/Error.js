import React from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamation } from '@fortawesome/free-solid-svg-icons';

import Header from '../Header/Header';
import { useHistory } from "react-router-dom";

const Error = () => {

    let history = useHistory();

    return (
        <div className="container">
            <Header />

            <div className="errorWrapper">

                <div className="error">
                    <FontAwesomeIcon icon={faExclamation} className="icon">

                    </FontAwesomeIcon>
                    404
                </div>
                <div className="errorMessage">
                    <h3>
                        Ops!!! You got lost...
                    </h3>

                    <p onClick={() => history.goBack()}>Go Back</p>
                </div>

            </div>

        </div>
    );
}


export default Error;
