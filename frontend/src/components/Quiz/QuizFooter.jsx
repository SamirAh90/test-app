import { useNavigate } from "react-router-dom";

function QuizFooter({
  answerResult,
  checkingAnswer,
  isLastQuestion,
  onNextQuestion,
  exitTo = "/trainer",
}) {
  const navigate = useNavigate();

  /* -------------------------------- */
  /* Exit quiz                        */
  /* -------------------------------- */

  const handleExit = () => {
    navigate(exitTo);
  };

  /* -------------------------------- */
  /* Footer                           */
  /* -------------------------------- */

  return (
    <div
      className={`demo-quiz__footer ${
        answerResult ? "demo-quiz__footer--answered" : "demo-quiz__footer--idle"
      }`}
    >
      <div className="demo-quiz__footer-actions">
        <button
          type="button"
          className="demo-quiz__button demo-quiz__button--exit"
          onClick={handleExit}
        >
          Avsluta
        </button>

        {checkingAnswer && (
          <span className="demo-quiz__checking">Kontrollerar svaret...</span>
        )}

        {answerResult && !isLastQuestion && (
          <button
            type="button"
            className="demo-quiz__button demo-quiz__button--next"
            onClick={onNextQuestion}
          >
            Nästa fråga →
          </button>
        )}

        {answerResult && isLastQuestion && (
          <span className="demo-quiz__checking">Resultatet öppnas...</span>
        )}
      </div>
    </div>
  );
}

export default QuizFooter;
