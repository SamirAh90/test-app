import { useEffect, useRef, useState } from "react";

import { useNavigate } from "react-router-dom";

import { useAuth } from "../../contexts/AuthContext";

import { saveQuizAttempt } from "../../services/progressService";

import QuizProgress from "./QuizProgress";
import QuizQuestion from "./QuizQuestion";
import QuizAnswers from "./QuizAnswers";
import QuizFeedback from "./QuizFeedback";
import QuizFooter from "./QuizFooter";

function QuizRunner({
  quiz,
  quizType,
  resultState = {},
  className = "",
  cardClassName = "",
  loadingText = "Hämtar frågor...",
  emptyText = "Det finns inga frågor att visa.",

  translationLanguage = null,
  showTranslation = true,

  exitTo = "/trainer",

  progressCurrent = null,
  progressTotal = null,
}) {
  const navigate = useNavigate();

  const { token, isAuthenticated } = useAuth();

  const resultHandledRef = useRef(false);

  const [savingResult, setSavingResult] = useState(false);
  const [saveWarning, setSaveWarning] = useState("");

  const {
    questions,
    currentQuestion,
    currentQuestionIndex,
    selectedAnswerId,
    answerResult,
    checkingAnswer,
    loading,
    error,
    isLastQuestion,
    results,
    selectAnswer,
    nextQuestion,
  } = quiz;

  /* -------------------------------- */
  /* Reset result guard               */
  /* -------------------------------- */

  useEffect(() => {
    resultHandledRef.current = false;
  }, [questions]);

  /* -------------------------------- */
  /* Complete quiz                    */
  /* -------------------------------- */

  useEffect(() => {
    if (!answerResult || !isLastQuestion || resultHandledRef.current) {
      return undefined;
    }

    if (!Array.isArray(results) || results.length !== questions.length) {
      return undefined;
    }

    resultHandledRef.current = true;

    const timer = window.setTimeout(async () => {
      const totalQuestions = questions.length;

      /* -------------------------------- */
      /* Normalize results                */
      /* -------------------------------- */

      const finalResults = results.map((result) => ({
        questionId: Number(result.questionId),

        subjectId: Number(result.subjectId),

        subjectName: result.subjectName || "Ämne",

        selectedAnswerId: Number(result.selectedAnswerId),

        correct: Boolean(result.correct),
      }));

      /* -------------------------------- */
      /* Score                            */
      /* -------------------------------- */

      const finalScore = finalResults.filter((result) => result.correct).length;

      const wrongAnswers = totalQuestions - finalScore;

      const percentage =
        totalQuestions > 0
          ? Math.round((finalScore / totalQuestions) * 100)
          : 0;

      /* -------------------------------- */
      /* Database answers                 */
      /* -------------------------------- */

      const answers = finalResults.filter(
        (answer) =>
          Number.isInteger(answer.questionId) &&
          Number.isInteger(answer.subjectId) &&
          Number.isInteger(answer.selectedAnswerId),
      );

      let savedToDatabase = false;

      /* -------------------------------- */
      /* Save authenticated result        */
      /* -------------------------------- */

      if (isAuthenticated && token) {
        try {
          setSavingResult(true);

          setSaveWarning("");

          await saveQuizAttempt(token, {
            quizType,
            score: finalScore,
            totalQuestions,
            percentage,
            answers,
          });

          savedToDatabase = true;
        } catch (saveError) {
          console.error("Could not save quiz result:", saveError);

          setSaveWarning("Resultatet kunde inte sparas just nu.");
        } finally {
          setSavingResult(false);
        }
      }

      /* -------------------------------- */
      /* Results                          */
      /* -------------------------------- */

      navigate("/results", {
        state: {
          score: finalScore,

          results: finalResults,

          totalQuestions,

          answeredQuestions: finalResults.length,

          unansweredQuestions: Math.max(
            0,
            totalQuestions - finalResults.length,
          ),

          correctAnswers: finalScore,

          wrongAnswers,

          percentage,

          savedToDatabase,

          completedWhileAuthenticated: isAuthenticated,

          quizType,

          translationLanguage,

          ...resultState,
        },
      });
    }, 1200);

    return () => {
      window.clearTimeout(timer);
    };
  }, [
    answerResult,
    isAuthenticated,
    isLastQuestion,
    navigate,
    questions.length,
    quizType,
    resultState,
    results,
    token,
    translationLanguage,
  ]);

  /* -------------------------------- */
  /* Loading                          */
  /* -------------------------------- */

  if (loading) {
    return (
      <div className={cardClassName}>
        <p>{loadingText}</p>
      </div>
    );
  }

  /* -------------------------------- */
  /* Error                            */
  /* -------------------------------- */

  if (error) {
    return (
      <div className={cardClassName}>
        <p>{error}</p>
      </div>
    );
  }

  /* -------------------------------- */
  /* Empty                            */
  /* -------------------------------- */

  if (!currentQuestion) {
    return (
      <div className={cardClassName}>
        <p>{emptyText}</p>
      </div>
    );
  }

  /* -------------------------------- */
  /* Progress                         */
  /* -------------------------------- */

  const useCustomProgress =
    Number.isFinite(Number(progressCurrent)) &&
    Number.isFinite(Number(progressTotal)) &&
    Number(progressTotal) > 0;

  const displayedCurrentQuestion = useCustomProgress
    ? Number(progressCurrent)
    : currentQuestionIndex + 1;

  const displayedTotalQuestions = useCustomProgress
    ? Number(progressTotal)
    : questions.length;

  /* -------------------------------- */
  /* Quiz                             */
  /* -------------------------------- */

  return (
    <div className={className}>
      <div className={cardClassName}>
        <QuizProgress
          currentQuestionIndex={displayedCurrentQuestion - 1}
          totalQuestions={displayedTotalQuestions}
        />

        <QuizQuestion
          subject={
            currentQuestion.Subject?.name ||
            currentQuestion.subjectName ||
            "Ämne"
          }
          question={currentQuestion.question}
          translation={currentQuestion.translation}
          translationLanguage={translationLanguage}
          showTranslation={showTranslation}
        />

        <QuizAnswers
          answers={currentQuestion.Answers}
          selectedAnswerId={selectedAnswerId}
          answerResult={answerResult}
          onSelectAnswer={selectAnswer}
          translationLanguage={translationLanguage}
          showTranslation={showTranslation}
        />

        <QuizFeedback
          answerResult={answerResult}
          translationLanguage={translationLanguage}
          showTranslation={showTranslation}
        />

        {savingResult && <p role="status">Sparar ditt resultat...</p>}

        {saveWarning && <p role="alert">{saveWarning}</p>}

        <QuizFooter
          answerResult={answerResult}
          checkingAnswer={checkingAnswer}
          isLastQuestion={isLastQuestion}
          onNextQuestion={nextQuestion}
          exitTo={exitTo}
        />
      </div>
    </div>
  );
}

export default QuizRunner;
