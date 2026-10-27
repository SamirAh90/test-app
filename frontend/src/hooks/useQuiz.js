import { useEffect, useRef, useState } from "react";

import { getQuestions } from "../services/questionService";

import useQuizRunner from "./useQuizRunner";

/* -------------------------------- */
/* Demo / public quiz               */
/* -------------------------------- */

function useQuiz(translationLanguage = null, questionLimit = 15) {
  const [loading, setLoading] = useState(true);

  /*
    Used to distinguish the initial quiz load
    from a later translation-language change.
  */

  const hasLoadedQuestionsRef = useRef(false);

  const quizRunner = useQuizRunner({
    initialQuestions: [],
    translationLanguage,
  });

  const { resetQuiz, setQuestions, error } = quizRunner;

  /* -------------------------------- */
  /* Load questions                   */
  /* -------------------------------- */

  useEffect(() => {
    async function loadQuestions() {
      try {
        setLoading(true);

        /*
          Swedish remains canonical.

          The language parameter only controls
          which optional translation accompanies
          the Swedish question and answers.
        */

        const language = translationLanguage || "sv";

        const data = await getQuestions(language);

        const nextQuestions = Array.isArray(data)
          ? data.slice(0, questionLimit)
          : [];

        /* -------------------------------- */
        /* First load                       */
        /* -------------------------------- */

        if (!hasLoadedQuestionsRef.current) {
          resetQuiz(nextQuestions);

          hasLoadedQuestionsRef.current = true;

          return;
        }

        /* -------------------------------- */
        /* Translation change               */
        /* -------------------------------- */

        /*
          Do NOT use resetQuiz here.

          The question IDs remain the same.
          Only translated content changes.

          setQuestions therefore updates the
          displayed text while preserving:
          - current question index
          - score
          - previous results
          - selected answer
          - answer state
        */

        setQuestions(nextQuestions);
      } catch (requestError) {
        console.error("Failed to load questions:", requestError);

        /*
          Only clear the quiz if the initial
          question load itself failed.

          A later translation error should not
          destroy the user's current progress.
        */

        if (!hasLoadedQuestionsRef.current) {
          resetQuiz([]);
        }
      } finally {
        setLoading(false);
      }
    }

    loadQuestions();
  }, [translationLanguage, questionLimit, resetQuiz, setQuestions]);

  return {
    ...quizRunner,
    loading,
    error,
  };
}

export default useQuiz;
