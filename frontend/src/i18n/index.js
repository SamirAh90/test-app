import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import sv from "./locales/sv.json";
import en from "./locales/en.json";
import ar from "./locales/ar.json";
import fa from "./locales/fa.json";

/* -------------------------------- */
/* Landing-page language only       */
/* -------------------------------- */

const LANGUAGE_STORAGE_KEY = "medborgatest-language";

const savedLanguage = localStorage.getItem(LANGUAGE_STORAGE_KEY) || "sv";

/* -------------------------------- */
/* i18n                             */
/* -------------------------------- */

i18n.use(initReactI18next).init({
  resources: {
    sv: {
      translation: sv,
    },

    en: {
      translation: en,
    },

    ar: {
      translation: ar,
    },

    fa: {
      translation: fa,
    },
  },

  lng: savedLanguage,

  fallbackLng: "sv",

  interpolation: {
    escapeValue: false,
  },
});

/* -------------------------------- */
/* Store selected landing language  */
/* -------------------------------- */

i18n.on("languageChanged", (language) => {
  localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
});

/* -------------------------------- */
/* Important                       */
/* -------------------------------- */

/*
  Do NOT change:

  document.documentElement.dir

  The whole application must remain LTR.

  Arabic/Persian direction will be handled
  only inside the landing page container.
*/

document.documentElement.lang = "sv";
document.documentElement.dir = "ltr";

export default i18n;
