function QuizQuestion({
  subject,
  question,
  translation = null,
  translationLanguage = null,
  showTranslation = true,
}) {
  const hasTranslation =
    showTranslation && translationLanguage && translation?.question;

  const isRtl = translationLanguage === "ar" || translationLanguage === "fa";

  return (
    <>
      <span className="demo-quiz__subject">{subject}</span>

      <h1 className="demo-quiz__question">{question}</h1>

      {hasTranslation && (
        <div
          className="demo-quiz__question-translation"
          dir={isRtl ? "rtl" : "ltr"}
          lang={translationLanguage}
        >
          {translation.question}
        </div>
      )}
    </>
  );
}

export default QuizQuestion;
