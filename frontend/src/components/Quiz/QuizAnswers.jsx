function QuizAnswers({
  answers,
  selectedAnswerId,
  answerResult,
  onSelectAnswer,
  translationLanguage = null,
  showTranslation = true,
}) {
  const isRtl = translationLanguage === "ar" || translationLanguage === "fa";

  return (
    <div className="demo-quiz__answers">
      {answers?.map((answer, index) => {
        const isSelected = selectedAnswerId === answer.id;

        const hasTranslation =
          showTranslation && translationLanguage && answer.translation;

        return (
          <button
            key={answer.id}
            type="button"
            className={`demo-quiz__answer ${
              isSelected ? "demo-quiz__answer--selected" : ""
            }`}
            disabled={Boolean(answerResult)}
            onClick={() => onSelectAnswer(answer.id)}
          >
            <span className="demo-quiz__answer-main">
              <span className="demo-quiz__answer-letter">
                {String.fromCharCode(65 + index)}.
              </span>

              <span>{answer.answer}</span>
            </span>

            {hasTranslation && (
              <span
                className="demo-quiz__answer-translation"
                dir={isRtl ? "rtl" : "ltr"}
                lang={translationLanguage}
              >
                {answer.translation}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

export default QuizAnswers;
