import { useLayoutEffect } from 'react';
import i18next from 'i18next';

import { setLanguage } from '../store/features/i18n/i18n.slice';
import { useAppDispatch, useAppSelector } from './store';
import { AvailableLanguage, defaultLanguage } from '../utils/i18n';

function I18nSyncHook(): null {
  const dispatch = useAppDispatch();
  const reduxLanguage = useAppSelector(state => state.i18nReducer.language);

  useLayoutEffect(() => {
    // If Redux has a language saved (from a previous session), use it in i18next
    // Otherwise, use the language detected by i18next and save it to Redux
    if (reduxLanguage && reduxLanguage !== defaultLanguage) {
      // User has a saved language preference, use it
      if (i18next.language !== reduxLanguage) {
        i18next.changeLanguage(reduxLanguage);
      }
    } else {
      // No saved preference, use i18next detected language and save to Redux
      const i18nextLanguage = i18next.language as AvailableLanguage;
      if (i18nextLanguage && i18nextLanguage !== reduxLanguage) {
        dispatch(setLanguage(i18nextLanguage));
      }
    }
  }, [dispatch]);

  return null;
}

export default I18nSyncHook;
