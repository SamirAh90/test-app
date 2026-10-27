import { useEffect, useRef, useState } from "react";

import { getQuestionsBySubject } from "../services/questionService";

import useQuizRunner from "./useQuizRunner";

/* -------------------------------- */
/* Subject quiz                     */
/* -------------------------------- */

function useSubjectQuiz(
  subjectId,
  translationLanguage = null,
  questionLimit = 15,
) {
  const [loading, setLoading] = useState(true);

  const [loadError, setLoadError] = useState("");

  const hasLoadedQuestionsRef = useRef(false);

  const previousSubjectIdRef = useRef(subjectId);

  const quizRunner = useQuizRunner({
    initialQuestions: [],
    translationLanguage,
  });

  const { resetQuiz, setQuestions } = quizRunner;

  /* -------------------------------- */
  /* Detect subject change            */
  /* -------------------------------- */

  useEffect(() => {
    if (previousSubjectIdRef.current !== subjectId) {
      previousSubjectIdRef.current = subjectId;

      hasLoadedQuestionsRef.current = false;
    }
  }, [subjectId]);

  /* -------------------------------- */
  /* Load subject questions           */
  /* -------------------------------- */

  useEffect(() => {
    async function loadQuestions() {
      if (!subjectId) {
        resetQuiz([]);

        setLoadError("Inget ämne valdes.");

        setLoading(false);

        hasLoadedQuestionsRef.current = false;

        return;
      }

      try {
        setLoading(true);

        setLoadError("");

        /*
          Swedish remains canonical.

          language only asks the backend
          for the optional translation.
        */

        const language = translationLanguage || "sv";

        const data = await getQuestionsBySubject(subjectId, language);

        const nextQuestions = Array.isArray(data)
          ? data.slice(0, questionLimit)
          : [];

        /* -------------------------------- */
        /* First load / new subject          */
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
          Do not reset the quiz here.

          Only replace the question objects
          so the user stays on the same:

          - question number
          - score
          - previous results
          - selected answer
          - feedback state
        */

        setQuestions(nextQuestions);
      } catch (requestError) {
        console.error("Failed to load subject questions:", requestError);

        /*
          Only destroy the quiz if the
          initial subject load failed.

          A translation request failure
          should not erase user progress.
        */

        if (!hasLoadedQuestionsRef.current) {
          resetQuiz([]);
        }

        setLoadError(
          requestError.message || "Kunde inte hämta frågor för ämnet.",
        );
      } finally {
        setLoading(false);
      }
    }

    loadQuestions();
  }, [subjectId, translationLanguage, questionLimit, resetQuiz, setQuestions]);

  return {
    ...quizRunner,

    loading,

    error: loadError || quizRunner.error,
  };
}

export default useSubjectQuiz;
