import React from 'react';
// import { useHistory } from "react-router-dom";
import { useNavigate } from "react-router-dom";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamation } from '@fortawesome/free-solid-svg-icons';

import Header from '../Header/Header';

const Error = () => {

    // let history = useHistory();
    let navigate = useNavigate();

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

                    <p onClick={() => navigate(-1)}>Go Back</p>
                </div>

            </div>

        </div>
    );
}


export default Error;
