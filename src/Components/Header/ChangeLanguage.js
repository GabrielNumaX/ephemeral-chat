import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGlobe } from "@fortawesome/free-solid-svg-icons";

import arFlag from '../../assets/argFlag.png';
import usFlag from '../../assets/usFlag.jpg';

import { useTranslation } from 'react-i18next'


const ChangeLanguage = () => {

    const { i18n } = useTranslation()

    const handleLanguageChange = (e) => {
        i18n.changeLanguage(e)
    }

    return (
        <div className="dropDownContainerChangeLang">

            <div className="iconContainerChangeLang">
                <FontAwesomeIcon icon={faGlobe} className="iconGlobe"></FontAwesomeIcon>
            </div>

            <div className="dropDownWrapperChangeLang">
                <div className="dropDownChangeLang">
                    <ul>
                        <li onClick={() => handleLanguageChange('es')}>
                            <img src={arFlag} alt="arg-flag" />

                            <p className="langP">Español</p>
                        </li>
                        <li onClick={() => handleLanguageChange('en')}>
                            <img src={usFlag} alt="us-flag" />

                            <p className="langP">English</p>
                        </li>
                    </ul>

                </div>

            </div>

        </div>
    );
}

export default ChangeLanguage;