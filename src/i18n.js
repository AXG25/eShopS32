import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import useStoreConfigStore from './store/useStoreConfigStore';

import enTranslations from './locales/en.json';
import esTranslations from './locales/es.json';
import frTranslations from './locales/fr.json';

const resources = {
  en: { translation: enTranslations },
  es: { translation: esTranslations },
  fr: { translation: frTranslations },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'es',
    interpolation: {
      escapeValue: false,
    },
  });

// Función para cambiar el idioma
export const changeLanguage = (lng) => {
  i18n.changeLanguage(lng);
};

// Configurar el idioma inicial desde el store
const setInitialLanguage = () => {
  const { config } = useStoreConfigStore.getState();
  i18n.changeLanguage(config.language);
};

setInitialLanguage();

export default i18n;