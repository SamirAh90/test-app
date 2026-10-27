import { useEffect, useRef, useState } from "react";

import { getFreeTrainingSession } from "../services/api";

import useQuizRunner from "./useQuizRunner";

/* -------------------------------- */
/* Free training                    */
/* -------------------------------- */

function useFreeTraining(
  token,
  translationLanguage = null,
  questionLimit = 15,
) {
  const [session, setSession] = useState(null);

  const [loading, setLoading] = useState(true);

  const [loadError, setLoadError] = useState("");

  /*
    Used to distinguish the first Free Training
    session load from a translation-language change.
  */

  const hasLoadedSessionRef = useRef(false);

  /*
    Keep the IDs/order from the original free session.

    Translation changes must never create a new random
    free session because the learner should remain in
    exactly the same training session.
  */

  const sessionQuestionIdsRef = useRef([]);

  const quizRunner = useQuizRunner({
    initialQuestions: [],
    translationLanguage,
  });

  const { resetQuiz, setQuestions } = quizRunner;

  /* -------------------------------- */
  /* Reset when authentication changes*/
  /* -------------------------------- */

  useEffect(() => {
    hasLoadedSessionRef.current = false;

    sessionQuestionIdsRef.current = [];
  }, [token]);

  /* -------------------------------- */
  /* Load Free Training               */
  /* -------------------------------- */

  useEffect(() => {
    let cancelled = false;

    async function loadFreeTraining() {
      if (!token) {
        if (!cancelled) {
          setLoading(false);

          setLoadError(
            "Du måste vara inloggad för att använda gratis träning.",
          );
        }

        return;
      }

      try {
        setLoading(true);

        setLoadError("");

        const language = translationLanguage || "sv";

        /*
          First request:
          Backend creates the free session normally.

          Translation request:
          The backend should return translated content
          for the requested language.
        */

        const response = await getFreeTrainingSession(
          token,
          questionLimit,
          language,
        );

        if (cancelled) {
          return;
        }

        const receivedQuestions = Array.isArray(response?.questions)
          ? response.questions
          : [];

        /* -------------------------------- */
        /* Free limit reached               */
        /* -------------------------------- */

        if (response?.strategy === "free_limit_reached") {
          setSession(response);

          resetQuiz([]);

          hasLoadedSessionRef.current = true;

          sessionQuestionIdsRef.current = [];

          return;
        }

        /* -------------------------------- */
        /* Initial Free Training session     */
        /* -------------------------------- */

        if (!hasLoadedSessionRef.current) {
          setSession(response);

          resetQuiz(receivedQuestions);

          sessionQuestionIdsRef.current = receivedQuestions
            .map((question) => Number(question.id))
            .filter((questionId) => Number.isInteger(questionId));

          hasLoadedSessionRef.current = true;

          return;
        }

        /* -------------------------------- */
        /* Translation change               */
        /* -------------------------------- */

        /*
          The free-training endpoint may randomize
          questions each time.

          Therefore we must NOT blindly replace the
          existing quiz with another random set.

          Match the translated response to the IDs
          from the original session.
        */

        const translatedQuestionMap = new Map(
          receivedQuestions.map((question) => [Number(question.id), question]),
        );

        setQuestions((currentQuestions) =>
          currentQuestions.map((currentQuestion) => {
            const translatedQuestion = translatedQuestionMap.get(
              Number(currentQuestion.id),
            );

            if (!translatedQuestion) {
              return currentQuestion;
            }

            return {
              ...currentQuestion,

              translation: translatedQuestion.translation,

              Answers: Array.isArray(currentQuestion.Answers)
                ? currentQuestion.Answers.map((currentAnswer) => {
                    const translatedAnswer = translatedQuestion.Answers?.find(
                      (answer) =>
                        Number(answer.id) === Number(currentAnswer.id),
                    );

                    return {
                      ...currentAnswer,

                      translation: translatedAnswer?.translation ?? null,
                    };
                  })
                : [],
            };
          }),
        );

        setSession((currentSession) => ({
          ...currentSession,

          translationLanguage: response?.translationLanguage ?? null,
        }));
      } catch (requestError) {
        if (cancelled) {
          return;
        }

        console.error("Could not load Free Training:", requestError);

        /*
          If the first session fails, there is no
          usable training session.

          If only a later translation request fails,
          keep the Swedish quiz and existing progress.
        */

        if (!hasLoadedSessionRef.current) {
          resetQuiz([]);

          setLoadError(
            requestError.response?.data?.message ||
              requestError.message ||
              "Den kostnadsfria träningen kunde inte startas.",
          );
        } else {
          setLoadError(
            "Översättningen kunde inte hämtas. Du kan fortsätta träna på svenska.",
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadFreeTraining();

    return () => {
      cancelled = true;
    };
  }, [token, translationLanguage, questionLimit, resetQuiz, setQuestions]);

  /* -------------------------------- */
  /* Live quota                       */
  /* -------------------------------- */

  const answeredInCurrentSession = Array.isArray(quizRunner.results)
    ? quizRunner.results.length
    : 0;

  const liveRemainingQuestions = Math.max(
    0,

    Number(session?.remainingQuestions ?? 0) - answeredInCurrentSession,
  );

  return {
    ...quizRunner,

    session,

    loading,

    loadError,

    liveRemainingQuestions,
  };
}

export default useFreeTraining;
