import { useCallback, useMemo, useState } from "react";

import { checkAnswer } from "../services/questionService";

/* -------------------------------- */
/* Shared quiz runner               */
/* -------------------------------- */

function useQuizRunner({
  initialQuestions = [],
  translationLanguage = null,
} = {}) {
  const [questions, setQuestions] = useState(initialQuestions);

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const [selectedAnswerId, setSelectedAnswerId] = useState(null);

  const [answerResult, setAnswerResult] = useState(null);

  const [checkingAnswer, setCheckingAnswer] = useState(false);

  const [error, setError] = useState("");

  const [score, setScore] = useState(0);

  const [results, setResults] = useState([]);

  /* -------------------------------- */
  /* Translation language             */
  /* -------------------------------- */

  const normalizedTranslationLanguage = useMemo(() => {
    if (!translationLanguage) {
      return "sv";
    }

    const normalized = String(translationLanguage)
      .trim()
      .toLowerCase()
      .split("-")[0];

    return ["en", "ar", "fa"].includes(normalized) ? normalized : "sv";
  }, [translationLanguage]);

  /* -------------------------------- */
  /* Current question                 */
  /* -------------------------------- */

  const currentQuestion = questions[currentQuestionIndex] || null;

  const isLastQuestion =
    questions.length > 0 && currentQuestionIndex === questions.length - 1;

  /* -------------------------------- */
  /* Reset quiz                       */
  /* -------------------------------- */

  const resetQuiz = useCallback((nextQuestions = []) => {
    setQuestions(Array.isArray(nextQuestions) ? nextQuestions : []);

    setCurrentQuestionIndex(0);

    setSelectedAnswerId(null);

    setAnswerResult(null);

    setCheckingAnswer(false);

    setError("");

    setScore(0);

    setResults([]);
  }, []);

  /* -------------------------------- */
  /* Select + check answer            */
  /* -------------------------------- */

  const selectAnswer = async (answerId) => {
    if (!currentQuestion || answerResult || checkingAnswer) {
      return;
    }

    /* -------------------------------- */
    /* Show selected answer immediately */
    /* -------------------------------- */

    setSelectedAnswerId(answerId);

    try {
      setCheckingAnswer(true);

      setError("");

      /* -------------------------------- */
      /* Check answer in backend           */
      /* -------------------------------- */

      const result = await checkAnswer(
        currentQuestion.id,
        answerId,
        normalizedTranslationLanguage,
      );

      /* -------------------------------- */
      /* Show feedback                    */
      /* -------------------------------- */

      setAnswerResult(result);

      /* -------------------------------- */
      /* Score                            */
      /* -------------------------------- */

      if (result.correct) {
        setScore((previousScore) => previousScore + 1);
      }

      /* -------------------------------- */
      /* Save result locally              */
      /* -------------------------------- */

      setResults((previousResults) => [
        ...previousResults,

        {
          questionId: currentQuestion.id,

          subjectId:
            currentQuestion.Subject?.id ?? currentQuestion.subjectId ?? null,

          subjectName:
            currentQuestion.Subject?.name ||
            currentQuestion.subjectName ||
            "Ämne",

          selectedAnswerId: answerId,

          correct: Boolean(result.correct),
        },
      ]);
    } catch (requestError) {
      console.error("Failed to check quiz answer:", requestError);

      /*
        If the backend request fails,
        allow the user to try again.
      */

      setSelectedAnswerId(null);

      setAnswerResult(null);

      setError(requestError.message || "Kunde inte kontrollera svaret.");
    } finally {
      setCheckingAnswer(false);
    }
  };

  /* -------------------------------- */
  /* Next question                    */
  /* -------------------------------- */

  const nextQuestion = () => {
    if (isLastQuestion) {
      return false;
    }

    setCurrentQuestionIndex((previousIndex) => previousIndex + 1);

    setSelectedAnswerId(null);

    setAnswerResult(null);

    setCheckingAnswer(false);

    setError("");

    return true;
  };

  return {
    questions,

    currentQuestion,

    currentQuestionIndex,

    selectedAnswerId,

    answerResult,

    checkingAnswer,

    error,

    isLastQuestion,

    score,

    results,

    translationLanguage:
      normalizedTranslationLanguage === "sv"
        ? null
        : normalizedTranslationLanguage,

    setQuestions,

    resetQuiz,

    selectAnswer,

    nextQuestion,
  };
}

export default useQuizRunner;
