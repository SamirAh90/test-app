import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../../contexts/AuthContext";

import {
  checkAnswer,
  completeTrainingSession,
  saveTrainingAnswer,
  saveTrainingFlags,
  startTrainingSession,
} from "../../services/api";

function SimulatorRunner({
  questions = [],
  durationMinutes = 90,
  resultState = {},
}) {
  const navigate = useNavigate();

  const { token, isAuthenticated } = useAuth();

  const timerRef = useRef(null);
  const autoSubmitHandledRef = useRef(false);

  const [attemptId, setAttemptId] = useState(null);
  const [sessionReady, setSessionReady] = useState(false);
  const [sessionError, setSessionError] = useState("");

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [flaggedQuestions, setFlaggedQuestions] = useState(new Set());

  const [savingAnswerId, setSavingAnswerId] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [showSubmitConfirmation, setShowSubmitConfirmation] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const [timeLeft, setTimeLeft] = useState(Number(durationMinutes || 90) * 60);

  /* -------------------------------- */
  /* Current question                 */
  /* -------------------------------- */

  const currentQuestion = questions[currentQuestionIndex] || null;

  /* -------------------------------- */
  /* Answer statistics                */
  /* -------------------------------- */

  const answeredCount = Object.keys(answers).length;

  const unansweredCount = Math.max(0, questions.length - answeredCount);

  const flaggedCount = flaggedQuestions.size;
  /* -------------------------------- */
  /* Start / resume simulator session */
  /* -------------------------------- */

  useEffect(() => {
    async function initializeSession() {
      if (!isAuthenticated || !token || questions.length === 0) {
        return;
      }

      try {
        setSessionReady(false);
        setSessionError("");
        setSubmitError("");

        const response = await startTrainingSession(token, {
          quizType: "simulator",
          totalQuestions: questions.length,

          simulatorQuestionIds: questions.map((question) =>
            Number(question.id),
          ),
        });
        const activeAttemptId = response?.attempt?.id;

        if (!activeAttemptId) {
          throw new Error("Provsimulatorn saknar attempt-id.");
        }

        setAttemptId(activeAttemptId);

        /* -------------------------------- */
        /* Restore remaining exam time      */
        /* -------------------------------- */

        const durationSeconds = Number(durationMinutes || 90) * 60;

        const startedAt = response?.attempt?.startedAt;

        if (startedAt) {
          const startedAtTimestamp = new Date(startedAt).getTime();

          if (Number.isNaN(startedAtTimestamp)) {
            setTimeLeft(durationSeconds);
          } else {
            const elapsedSeconds = Math.max(
              0,
              Math.floor((Date.now() - startedAtTimestamp) / 1000),
            );

            const remainingSeconds = Math.max(
              0,
              durationSeconds - elapsedSeconds,
            );

            setTimeLeft(remainingSeconds);
          }
        } else {
          setTimeLeft(durationSeconds);
        }

        autoSubmitHandledRef.current = false;

        /* -------------------------------- */
        /* Restore saved answers            */
        /* -------------------------------- */

        const savedAnswers = Array.isArray(response?.answers)
          ? response.answers
          : [];

        const restoredAnswers = {};

        savedAnswers.forEach((answer) => {
          restoredAnswers[answer.questionId] = {
            selectedAnswerId: Number(answer.selectedAnswerId),
            correct: Boolean(answer.correct),
          };
        });

        setAnswers(restoredAnswers);
        const restoredFlaggedQuestionIds = Array.isArray(
          response?.flaggedQuestionIds,
        )
          ? response.flaggedQuestionIds
          : Array.isArray(response?.attempt?.flaggedQuestionIds)
            ? response.attempt.flaggedQuestionIds
            : [];

        setFlaggedQuestions(
          new Set(
            restoredFlaggedQuestionIds
              .map((questionId) => Number(questionId))
              .filter((questionId) => Number.isInteger(questionId)),
          ),
        );

        /* -------------------------------- */
        /* Resume close to unanswered work  */
        /* -------------------------------- */

        if (response?.resumed && savedAnswers.length > 0) {
          const firstUnansweredIndex = questions.findIndex(
            (question) => !restoredAnswers[question.id],
          );

          if (firstUnansweredIndex >= 0) {
            setCurrentQuestionIndex(firstUnansweredIndex);
          } else {
            setCurrentQuestionIndex(0);
          }
        } else {
          setCurrentQuestionIndex(0);
        }

        setSessionReady(true);
      } catch (requestError) {
        console.error("Could not initialize simulator session:", requestError);

        setSessionError(
          requestError.response?.data?.message ||
            requestError.message ||
            "Provsimulatorn kunde inte startas.",
        );
      }
    }

    initializeSession();
  }, [durationMinutes, isAuthenticated, questions, token]);

  /* -------------------------------- */
  /* Timer                            */
  /* -------------------------------- */

  useEffect(() => {
    if (!sessionReady || submitting) {
      return undefined;
    }

    timerRef.current = window.setInterval(() => {
      setTimeLeft((currentTime) => {
        if (currentTime <= 1) {
          window.clearInterval(timerRef.current);

          return 0;
        }

        return currentTime - 1;
      });
    }, 1000);

    return () => {
      window.clearInterval(timerRef.current);
    };
  }, [sessionReady, submitting]);

  /* -------------------------------- */
  /* Format timer                     */
  /* -------------------------------- */

  const formattedTime = useMemo(() => {
    const hours = Math.floor(timeLeft / 3600);

    const minutes = Math.floor((timeLeft % 3600) / 60);

    const seconds = timeLeft % 60;

    return [
      String(hours).padStart(2, "0"),
      String(minutes).padStart(2, "0"),
      String(seconds).padStart(2, "0"),
    ].join(":");
  }, [timeLeft]);

  /* -------------------------------- */
  /* Flag / unflag question           */
  /* -------------------------------- */

  const handleToggleFlag = async () => {
    if (!currentQuestion || !attemptId || submitting) {
      return;
    }

    const questionId = Number(currentQuestion.id);

    if (!Number.isInteger(questionId)) {
      return;
    }

    const nextFlags = new Set(flaggedQuestions);

    if (nextFlags.has(questionId)) {
      nextFlags.delete(questionId);
    } else {
      nextFlags.add(questionId);
    }

    /*
    Update UI immediately.
  */

    setFlaggedQuestions(nextFlags);

    try {
      await saveTrainingFlags(token, attemptId, Array.from(nextFlags));
    } catch (requestError) {
      console.error("Could not save simulator flags:", requestError);

      /*
      Restore previous local state if saving failed,
      so frontend and MySQL do not disagree.
    */

      setFlaggedQuestions(new Set(flaggedQuestions));

      setSubmitError(
        requestError.response?.data?.message ||
          requestError.message ||
          "Flaggan kunde inte sparas. Försök igen.",
      );
    }
  };

  /* -------------------------------- */
  /* Select answer                    */
  /* -------------------------------- */

  const handleSelectAnswer = async (selectedAnswerId) => {
    if (
      !currentQuestion ||
      !attemptId ||
      submitting ||
      savingAnswerId === currentQuestion.id
    ) {
      return;
    }

    const questionId = Number(currentQuestion.id);

    const subjectId = Number(
      currentQuestion.subjectId || currentQuestion.Subject?.id,
    );

    const normalizedSelectedAnswerId = Number(selectedAnswerId);

    if (
      !Number.isInteger(questionId) ||
      !Number.isInteger(subjectId) ||
      !Number.isInteger(normalizedSelectedAnswerId)
    ) {
      return;
    }

    try {
      setSavingAnswerId(questionId);

      /*
      Ask backend whether the selected
      answer is correct.

      We deliberately do NOT show the
      result to the user during the exam.
    */

      const checkedAnswer = await checkAnswer(
        questionId,
        normalizedSelectedAnswerId,
        "sv",
      );

      const correct = Boolean(checkedAnswer?.correct);

      /*
      Update the local simulator state.
    */

      setAnswers((currentAnswers) => ({
        ...currentAnswers,

        [questionId]: {
          selectedAnswerId: normalizedSelectedAnswerId,

          correct,
        },
      }));

      /*
      Save immediately to MySQL.
    */

      await saveTrainingAnswer(token, attemptId, {
        questionId,
        subjectId,

        selectedAnswerId: normalizedSelectedAnswerId,

        correct,
      });
    } catch (requestError) {
      console.error("Could not save simulator answer:", requestError);

      setSubmitError(
        requestError.response?.data?.message ||
          requestError.message ||
          "Svaret kunde inte sparas. Försök igen.",
      );
    } finally {
      setSavingAnswerId(null);
    }
  };

  /* -------------------------------- */
  /* Build COMPLETE result data       */
  /* -------------------------------- */

  const buildResults = () =>
    questions.map((question) => {
      const saved = answers[question.id];

      const subjectId = Number(question.subjectId || question.Subject?.id);

      return {
        questionId: Number(question.id),

        subjectId,

        subjectName: question.Subject?.name || question.subjectName || "Ämne",

        selectedAnswerId: saved ? Number(saved.selectedAnswerId) : null,

        answered: Boolean(saved),

        correct: saved ? Boolean(saved.correct) : false,
      };
    });

  /* -------------------------------- */
  /* Submit simulator                 */
  /* -------------------------------- */

  const handleSubmitSimulator = async ({ automatic = false } = {}) => {
    if (!attemptId || submitting) {
      return;
    }

    try {
      setSubmitting(true);
      setSubmitError("");

      window.clearInterval(timerRef.current);

      /*
       * The answers have already been saved individually
       * while the user works through the simulator.
       *
       * This call marks the current attempt as completed.
       */
      await completeTrainingSession(token, attemptId);

      /*
       * IMPORTANT:
       *
       * buildResults contains ALL questions.
       *
       * An unanswered question has:
       *
       * answered: false
       * selectedAnswerId: null
       * correct: false
       */
      const results = buildResults();

      const finalAnsweredCount = results.filter(
        (result) => result.answered,
      ).length;

      const finalUnansweredCount = results.length - finalAnsweredCount;

      const correctAnswers = results.filter((result) => result.correct).length;

      const wrongAnswers = results.filter(
        (result) => result.answered && !result.correct,
      ).length;

      const percentage =
        questions.length > 0
          ? Math.round((correctAnswers / questions.length) * 100)
          : 0;

      navigate("/results", {
        state: {
          score: correctAnswers,

          results,

          totalQuestions: questions.length,

          answeredQuestions: finalAnsweredCount,

          unansweredQuestions: finalUnansweredCount,

          correctAnswers,

          wrongAnswers,

          percentage,

          savedToDatabase: true,

          completedWhileAuthenticated: true,

          quizType: "simulator",

          attemptId,

          simulatorTimedOut: automatic,

          simulatorTimeLeft: timeLeft,

          flaggedQuestions: Array.from(flaggedQuestions),

          ...resultState,
        },
      });
    } catch (requestError) {
      console.error("Could not submit simulator:", requestError);

      setSubmitError(
        requestError.response?.data?.message ||
          requestError.message ||
          "Provet kunde inte lämnas in. Försök igen.",
      );

      setSubmitting(false);
    }
  };

  /* -------------------------------- */
  /* Auto-submit at 00:00             */
  /* -------------------------------- */

  useEffect(() => {
    if (
      timeLeft !== 0 ||
      !sessionReady ||
      submitting ||
      autoSubmitHandledRef.current
    ) {
      return;
    }

    autoSubmitHandledRef.current = true;

    handleSubmitSimulator({
      automatic: true,
    });
  }, [timeLeft, sessionReady, submitting]);

  /* -------------------------------- */
  /* Loading                          */
  /* -------------------------------- */

  if (!sessionReady && !sessionError) {
    return (
      <section className="demo-quiz__card">
        <p>Startar provsimulatorn...</p>
      </section>
    );
  }

  /* -------------------------------- */
  /* Error                            */
  /* -------------------------------- */

  if (sessionError) {
    return (
      <section className="demo-quiz__card">
        <p>{sessionError}</p>
      </section>
    );
  }

  /* -------------------------------- */
  /* Empty                            */
  /* -------------------------------- */

  if (!currentQuestion) {
    return (
      <section className="demo-quiz__card">
        <p>Det finns inga frågor i provet.</p>
      </section>
    );
  }

  const selectedAnswerId =
    answers[currentQuestion.id]?.selectedAnswerId ?? null;

  const currentQuestionFlagged = flaggedQuestions.has(
    Number(currentQuestion.id),
  );

  /* -------------------------------- */
  /* Button styles                    */
  /* -------------------------------- */

  const secondaryButtonStyle = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "7px",
    minHeight: "42px",
    padding: "0 14px",
    border: "1px solid #d9e2e8",
    borderRadius: "9px",
    background: "#ffffff",
    color: "#334155",
    fontSize: "13px",
    fontWeight: "700",
    cursor: "pointer",
  };

  const primaryButtonStyle = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "7px",
    minHeight: "42px",
    padding: "0 16px",
    border: "1px solid #b9ded4",
    borderRadius: "9px",
    background: "#edf8f5",
    color: "#176b5b",
    fontSize: "13px",
    fontWeight: "800",
    cursor: "pointer",
  };

  const submitButtonStyle = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "7px",
    minHeight: "44px",
    padding: "0 18px",
    border: "1px solid #17344f",
    borderRadius: "9px",
    background: "#17344f",
    color: "#ffffff",
    fontSize: "13px",
    fontWeight: "800",
    cursor: "pointer",
  };

  const flagButtonStyle = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "7px",
    minHeight: "40px",
    padding: "0 13px",

    border: currentQuestionFlagged ? "1px solid #e6c66d" : "1px solid #d9e2e8",

    borderRadius: "9px",

    background: currentQuestionFlagged ? "#fff8df" : "#ffffff",

    color: currentQuestionFlagged ? "#745814" : "#475569",

    fontSize: "13px",
    fontWeight: "700",
    cursor: "pointer",
  };

  /* -------------------------------- */
  /* Simulator                        */
  /* -------------------------------- */

  return (
    <section className="demo-quiz__card">
      {/* Exam status */}

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "16px",
          marginBottom: "22px",
          flexWrap: "wrap",
        }}
      >
        <div>
          <strong>
            Fråga {currentQuestionIndex + 1} av {questions.length}
          </strong>

          <div
            style={{
              marginTop: "4px",
              color: "#64748b",
              fontSize: "13px",
            }}
          >
            {answeredCount} besvarade · {unansweredCount} obesvarade ·{" "}
            {flaggedCount} flaggade
          </div>
        </div>

        <div
          style={{
            padding: "8px 12px",
            border: "1px solid #dbe4ea",
            borderRadius: "9px",
            background: "#f8fafb",
            fontWeight: "800",
          }}
        >
          {formattedTime} kvar
        </div>
      </div>

      {/* Flag */}

      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginBottom: "16px",
        }}
      >
        <button
          type="button"
          style={flagButtonStyle}
          onClick={handleToggleFlag}
        >
          {currentQuestionFlagged ? "⚑ Ta bort flagga" : "⚐ Flagga fråga"}
        </button>
      </div>

      {/* Question */}

      <div
        style={{
          marginBottom: "22px",
        }}
      >
        <span
          style={{
            color: "#64748b",
            fontSize: "13px",
            fontWeight: "700",
          }}
        >
          {currentQuestion.Subject?.name ||
            currentQuestion.subjectName ||
            "Ämne"}
        </span>

        <h2
          style={{
            margin: "8px 0 0",
          }}
        >
          {currentQuestion.question}
        </h2>
      </div>

      {/* Answers */}

      <div
        style={{
          display: "grid",
          gap: "10px",
        }}
      >
        {currentQuestion.Answers?.map((answer) => {
          const selected = Number(selectedAnswerId) === Number(answer.id);

          return (
            <button
              key={answer.id}
              type="button"
              disabled={savingAnswerId === currentQuestion.id || submitting}
              onClick={() => handleSelectAnswer(answer.id)}
              style={{
                width: "100%",
                padding: "14px 16px",

                border: selected ? "1px solid #79b9aa" : "1px solid #dbe4ea",

                borderRadius: "10px",

                background: selected ? "#eef8f5" : "#ffffff",

                color: "#1e293b",

                textAlign: "left",
                fontSize: "14px",
                cursor: "pointer",
              }}
            >
              {answer.answerText || answer.text || answer.answer}
            </button>
          );
        })}
      </div>

      {/* Previous / Next */}

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: "12px",
          marginTop: "22px",
        }}
      >
        <button
          type="button"
          style={{
            ...secondaryButtonStyle,

            opacity: currentQuestionIndex === 0 ? 0.45 : 1,
          }}
          disabled={currentQuestionIndex === 0}
          onClick={() =>
            setCurrentQuestionIndex((current) => Math.max(0, current - 1))
          }
        >
          ← Föregående
        </button>

        <button
          type="button"
          style={{
            ...primaryButtonStyle,

            opacity: currentQuestionIndex === questions.length - 1 ? 0.45 : 1,
          }}
          disabled={currentQuestionIndex === questions.length - 1}
          onClick={() =>
            setCurrentQuestionIndex((current) =>
              Math.min(questions.length - 1, current + 1),
            )
          }
        >
          Nästa →
        </button>
      </div>

      {/* Question navigator */}

      <div
        style={{
          marginTop: "26px",
          paddingTop: "20px",
          borderTop: "1px solid #e2e8f0",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: "12px",
            marginBottom: "12px",
            flexWrap: "wrap",
          }}
        >
          <strong
            style={{
              fontSize: "14px",
            }}
          >
            Frågeöversikt
          </strong>

          <span
            style={{
              color: "#64748b",
              fontSize: "12px",
            }}
          >
            ⚑ = flaggad fråga
          </span>
        </div>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "6px",
          }}
        >
          {questions.map((question, index) => {
            const answered = Boolean(answers[question.id]);

            const active = index === currentQuestionIndex;

            const flagged = flaggedQuestions.has(Number(question.id));

            return (
              <button
                key={question.id}
                type="button"
                onClick={() => setCurrentQuestionIndex(index)}
                title={
                  flagged
                    ? `Fråga ${index + 1} är flaggad`
                    : `Gå till fråga ${index + 1}`
                }
                style={{
                  position: "relative",
                  width: "36px",
                  height: "36px",

                  border: active
                    ? "2px solid #2f7668"
                    : flagged
                      ? "1px solid #d7b95b"
                      : "1px solid #dbe4ea",

                  borderRadius: "8px",

                  background: flagged
                    ? "#fff8df"
                    : answered
                      ? "#edf8f5"
                      : "#ffffff",

                  color: flagged ? "#745814" : answered ? "#2f7668" : "#475569",

                  fontSize: "12px",
                  fontWeight: "700",
                  cursor: "pointer",
                }}
              >
                {index + 1}

                {flagged && (
                  <span
                    aria-hidden="true"
                    style={{
                      position: "absolute",
                      top: "-5px",
                      right: "-4px",
                      fontSize: "10px",
                    }}
                  >
                    ⚑
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Submit error */}

      {submitError && (
        <div
          role="alert"
          style={{
            marginTop: "18px",
            padding: "12px 14px",
            border: "1px solid #fecaca",
            borderRadius: "9px",
            background: "#fef2f2",
            color: "#991b1b",
            fontSize: "13px",
          }}
        >
          {submitError}
        </div>
      )}
      {showSubmitConfirmation && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="simulator-submit-title"
          style={{
            marginTop: "22px",
            padding: "20px",
            border: "1px solid #dbe4ea",
            borderRadius: "12px",
            background: "#f8fafb",
          }}
        >
          <h3
            id="simulator-submit-title"
            style={{
              margin: "0 0 8px",
              color: "#0f172a",
              fontSize: "18px",
            }}
          >
            Vill du lämna in provet?
          </h3>

          <p
            style={{
              margin: "0 0 16px",
              color: "#64748b",
              lineHeight: "1.6",
            }}
          >
            När du lämnar in provet avslutas provsimulatorn och du kommer till
            ditt resultat.
          </p>

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "8px",
              marginBottom: "16px",
            }}
          >
            <span
              style={{
                padding: "7px 10px",
                borderRadius: "8px",
                background: "#edf8f5",
                color: "#176b5b",
                fontSize: "13px",
                fontWeight: "700",
              }}
            >
              {answeredCount} besvarade
            </span>

            <span
              style={{
                padding: "7px 10px",
                borderRadius: "8px",
                background: unansweredCount > 0 ? "#fff7ed" : "#edf8f5",
                color: unansweredCount > 0 ? "#9a5b13" : "#176b5b",
                fontSize: "13px",
                fontWeight: "700",
              }}
            >
              {unansweredCount} obesvarade
            </span>

            <span
              style={{
                padding: "7px 10px",
                borderRadius: "8px",
                background: flaggedCount > 0 ? "#fff8df" : "#f8fafb",
                color: flaggedCount > 0 ? "#745814" : "#64748b",
                fontSize: "13px",
                fontWeight: "700",
              }}
            >
              {flaggedCount} flaggade
            </span>
          </div>

          {unansweredCount > 0 && (
            <p
              style={{
                margin: "0 0 16px",
                padding: "10px 12px",
                border: "1px solid #fed7aa",
                borderRadius: "8px",
                background: "#fff7ed",
                color: "#9a5b13",
                fontSize: "13px",
                lineHeight: "1.5",
              }}
            >
              Du har {unansweredCount} obesvarade frågor. Du kan fortsätta
              provet och gå tillbaka till dem innan du lämnar in.
            </p>
          )}

          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: "10px",
              flexWrap: "wrap",
            }}
          >
            <button
              type="button"
              style={secondaryButtonStyle}
              disabled={submitting}
              onClick={() => setShowSubmitConfirmation(false)}
            >
              Fortsätt provet
            </button>

            <button
              type="button"
              style={{
                ...submitButtonStyle,
                opacity: submitting ? 0.65 : 1,
              }}
              disabled={submitting}
              onClick={() => handleSubmitSimulator()}
            >
              {submitting ? "Lämnar in..." : "Ja, lämna in prov"}
            </button>
          </div>
        </div>
      )}

      {/* Submit */}

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "16px",
          flexWrap: "wrap",
          marginTop: "28px",
          paddingTop: "20px",
          borderTop: "1px solid #e2e8f0",
        }}
      >
        <span
          style={{
            color: "#64748b",
            fontSize: "13px",
          }}
        >
          {unansweredCount > 0
            ? `${unansweredCount} frågor är fortfarande obesvarade.`
            : "Alla frågor är besvarade."}
        </span>

        <button
          type="button"
          style={{
            ...submitButtonStyle,
            opacity: submitting ? 0.65 : 1,
          }}
          disabled={submitting}
          onClick={() => setShowSubmitConfirmation(true)}
        >
          Lämna in prov
        </button>
      </div>
    </section>
  );
}

export default SimulatorRunner;
