import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import HttpBackend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';

import { availableLanguages, defaultLanguage } from '../utils/i18n';

// Read language from Redux persist sessionStorage or detect from browser
function getInitialLanguage(): string {
  try {
    // Try to read from Redux persist first
    const persistedState = sessionStorage.getItem('persist:root');
    if (persistedState) {
      const parsed = JSON.parse(persistedState);
      if (parsed.i18nReducer) {
        const i18nState = JSON.parse(parsed.i18nReducer);
        if (
          i18nState.language &&
          availableLanguages.includes(i18nState.language)
        ) {
          return i18nState.language;
        }
      }
    }
  } catch (e) {
    console.warn('Failed to read persisted language', e);
  }

  // Fallback to browser language detection
  const browserLang = navigator.language.split('-')[0];
  return availableLanguages.includes(browserLang)
    ? browserLang
    : defaultLanguage;
}

const initialLanguage = getInitialLanguage();

i18next
  .use(HttpBackend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    lng: initialLanguage,
    fallbackLng: defaultLanguage,
    supportedLngs: [...availableLanguages],
    debug: true,
    backend: {
      loadPath: `/locales/{{lng}}/{{lng}}.json?v=${__APP_VERSION__}`,
    },
    detection: {
      order: ['navigator'],
      caches: [],
    },
    react: {
      useSuspense: true,
      bindI18n: 'languageChanged loaded',
      bindI18nStore: 'added removed',
    },
  });
