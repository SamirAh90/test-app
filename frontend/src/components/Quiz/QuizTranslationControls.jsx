function QuizTranslationControls({
  translationLanguage,
  showTranslation,
  onLanguageChange,
  onToggleTranslation,
}) {
  const hasTranslationLanguage = Boolean(translationLanguage);

  return (
    <div className="demo-quiz__translation-controls">
      <div className="demo-quiz__translation-language">
        <span className="demo-quiz__translation-label">Språk</span>

        <strong>Svenska</strong>
      </div>

      <div className="demo-quiz__translation-language">
        <label
          className="demo-quiz__translation-label"
          htmlFor="quiz-translation-language"
        >
          Förklaringar
        </label>

        <select
          id="quiz-translation-language"
          className="demo-quiz__translation-select"
          value={translationLanguage || ""}
          onChange={(event) => onLanguageChange(event.target.value || null)}
        >
          <option value="">Ingen översättning</option>

          <option value="en">English</option>

          <option value="ar">العربية</option>

          <option value="fa">دری / فارسی</option>
        </select>
      </div>

      {hasTranslationLanguage && (
        <button
          type="button"
          className="demo-quiz__translation-toggle"
          onClick={onToggleTranslation}
        >
          {showTranslation ? "Dölj översättning" : "Visa översättning"}
        </button>
      )}
    </div>
  );
}

export default QuizTranslationControls;
