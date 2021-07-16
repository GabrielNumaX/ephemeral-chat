import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

// detect user language and load translation
// import Backend from 'i18next-xhr-backend'
import Backend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector'
//this as JSON files;
import translationEN from './translations/en.json'
import translationES from './translations/es.json'

const fallbackLng = ['en']
const availableLanguages = ['en', 'es']

const resources = {
    en: {
        translation: translationEN,
    },
    es: {
        translation: translationES,
    },
}

i18n
    .use(Backend)
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources,
        fallbackLng,

        detection: {
            checkWhitelist: true,
        },

        debug: false,

        whitelist: availableLanguages,

        interpolation: {
            escapeValue: false,
        },
    })

export default i18n