import { createInstance } from 'i18next';
import ru from './locales/ru.js';

const createI18n = async () => {
  const instance = createInstance();
  await instance.init({
    lng: 'ru',
    fallbackLng: 'ru',
    supportedLngs: ['ru'],
    resources: { ru },
    interpolation: { escapeValue: false },
  });
  return instance;
};

export default createI18n;
