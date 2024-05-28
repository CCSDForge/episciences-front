import i18next from "i18next";
import { initReactI18next } from "react-i18next";
import HttpBackend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';

import { availableLanguages } from "../utils/i18n";

i18next
  .use(HttpBackend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    supportedLngs: availableLanguages,
    debug: true,
    backend: {
      loadPath: '/locales/{{lng}}/{{lng}}.json',
    }
  })