import { useCallback, useEffect, useState } from "react";

/* -------------------------------- */
/* Configuration                    */
/* -------------------------------- */

const STORAGE_KEY = "medborgatest_question_translation";

const CHANGE_EVENT = "medborgatest-question-translation-change";

const SUPPORTED_LANGUAGES = ["en", "ar", "fa"];

/* -------------------------------- */
/* Normalize language               */
/* -------------------------------- */

const normalizeQuestionTranslationLanguage = (language) => {
  if (!language) {
    return null;
  }

  const normalizedLanguage = String(language)
    .trim()
    .toLowerCase()
    .split("-")[0];

  if (!SUPPORTED_LANGUAGES.includes(normalizedLanguage)) {
    return null;
  }

  return normalizedLanguage;
};

/* -------------------------------- */
/* Remove old saved implementation  */
/* -------------------------------- */

const removeOldPreference = () => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Ignore storage errors.
  }
};

/* -------------------------------- */
/* Read current-session preference  */
/* -------------------------------- */

const getSavedLanguage = () => {
  try {
    return normalizeQuestionTranslationLanguage(
      sessionStorage.getItem(STORAGE_KEY),
    );
  } catch {
    return null;
  }
};

/* -------------------------------- */
/* Notify all hook instances        */
/* -------------------------------- */

const notifyTranslationChange = (language) => {
  window.dispatchEvent(
    new CustomEvent(CHANGE_EVENT, {
      detail: {
        language,
      },
    }),
  );
};

/* -------------------------------- */
/* Translation preference           */
/* -------------------------------- */

function useQuestionTranslation() {
  const [translationLanguage, setTranslationLanguageState] =
    useState(getSavedLanguage);

  const [showTranslation, setShowTranslation] = useState(() =>
    Boolean(getSavedLanguage()),
  );

  /* -------------------------------- */
  /* Clean old localStorage value     */
  /* -------------------------------- */

  useEffect(() => {
    removeOldPreference();
  }, []);

  /* -------------------------------- */
  /* Listen for changes               */
  /* -------------------------------- */

  useEffect(() => {
    const handleTranslationChange = (event) => {
      const language = normalizeQuestionTranslationLanguage(
        event.detail?.language,
      );

      setTranslationLanguageState(language);

      setShowTranslation(Boolean(language));
    };

    window.addEventListener(CHANGE_EVENT, handleTranslationChange);

    return () => {
      window.removeEventListener(CHANGE_EVENT, handleTranslationChange);
    };
  }, []);

  /* -------------------------------- */
  /* Change translation language      */
  /* -------------------------------- */

  const setTranslationLanguage = useCallback((language) => {
    const normalizedLanguage = normalizeQuestionTranslationLanguage(language);

    try {
      if (normalizedLanguage) {
        sessionStorage.setItem(STORAGE_KEY, normalizedLanguage);
      } else {
        sessionStorage.removeItem(STORAGE_KEY);
      }
    } catch {
      // Continue without storage.
    }

    setTranslationLanguageState(normalizedLanguage);

    setShowTranslation(Boolean(normalizedLanguage));

    notifyTranslationChange(normalizedLanguage);
  }, []);

  /* -------------------------------- */
  /* Clear translation                */
  /* -------------------------------- */

  const clearTranslation = useCallback(() => {
    try {
      sessionStorage.removeItem(STORAGE_KEY);
    } catch {
      // Ignore storage errors.
    }

    setTranslationLanguageState(null);

    setShowTranslation(false);

    notifyTranslationChange(null);
  }, []);

  /* -------------------------------- */
  /* Show / hide                      */
  /* -------------------------------- */

  const toggleTranslation = useCallback(() => {
    setShowTranslation((currentValue) => !currentValue);
  }, []);

  const isTranslationEnabled = Boolean(translationLanguage);

  const isRtlTranslation =
    translationLanguage === "ar" || translationLanguage === "fa";

  return {
    translationLanguage,
    showTranslation,
    isTranslationEnabled,
    isRtlTranslation,

    setTranslationLanguage,
    clearTranslation,
    toggleTranslation,
  };
}

export { SUPPORTED_LANGUAGES, normalizeQuestionTranslationLanguage };

export default useQuestionTranslation;
