function QuizFeedback({
  answerResult,
  translationLanguage = null,
  showTranslation = true,
}) {
  if (!answerResult) {
    return null;
  }

  const sources = Array.isArray(answerResult.sources)
    ? answerResult.sources
    : [];

  const translatedExplanation = answerResult.translation?.explanation || "";

  const showTranslatedExplanation =
    showTranslation && translationLanguage && translatedExplanation;

  const isRtl = translationLanguage === "ar" || translationLanguage === "fa";

  return (
    <div
      className={`demo-quiz__feedback ${
        answerResult.correct
          ? "demo-quiz__feedback--correct"
          : "demo-quiz__feedback--wrong"
      }`}
    >
      <strong>{answerResult.correct ? "✓ Rätt!" : "✕ Fel"}</strong>

      {answerResult.explanation && (
        <div className="demo-quiz__feedback-section">
          <span className="demo-quiz__feedback-language">Svenska</span>

          <p className="demo-quiz__feedback-explanation">
            {answerResult.explanation}
          </p>
        </div>
      )}

      {showTranslatedExplanation && (
        <div
          className="demo-quiz__feedback-section demo-quiz__feedback-section--translation"
          dir={isRtl ? "rtl" : "ltr"}
          lang={translationLanguage}
        >
          <span className="demo-quiz__feedback-language">
            {translationLanguage === "en"
              ? "English"
              : translationLanguage === "ar"
                ? "العربية"
                : "دری / فارسی"}
          </span>

          <p className="demo-quiz__feedback-explanation">
            {translatedExplanation}
          </p>
        </div>
      )}

      {sources.length > 0 && (
        <div className="demo-quiz__feedback-sources">
          <span className="demo-quiz__feedback-sources-title">
            Läs mer / Källor
          </span>

          <ul>
            {sources.map((source) => (
              <li key={source.id}>
                <a href={source.url} target="_blank" rel="noopener noreferrer">
                  {source.title}

                  <span aria-hidden="true"> ↗</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default QuizFeedback;
