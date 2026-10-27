import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../contexts/AuthContext";

import { getSmartTrainingSession } from "../services/api";

import useQuizRunner from "../hooks/useQuizRunner";

import AppHeader from "../components/AppHeader/AppHeader";
import QuizRunner from "../components/Quiz/QuizRunner";

import "../sections/DemoQuiz/DemoQuiz.css";
import "./SmartTraining.css";

function SmartTraining() {
  const navigate = useNavigate();

  const { token, user } = useAuth();

  /* -------------------------------- */
  /* Smart Training recommendation    */
  /* -------------------------------- */

  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  const [trainingStarted, setTrainingStarted] = useState(false);

  /* -------------------------------- */
  /* Shared quiz runner               */
  /* -------------------------------- */

  const quiz = useQuizRunner({
    initialQuestions: [],
    language: "sv",
  });

  const { resetQuiz } = quiz;

  /* -------------------------------- */
  /* Load Smart Training session      */
  /* -------------------------------- */

  useEffect(() => {
    async function loadSmartTraining() {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setLoadError("");

        const response = await getSmartTrainingSession(token, 20);

        setSession(response);
      } catch (requestError) {
        console.error("Could not load Smart Training:", requestError);

        setLoadError(
          requestError.response?.data?.message ||
            requestError.message ||
            "Smart träning kunde inte startas.",
        );
      } finally {
        setLoading(false);
      }
    }

    loadSmartTraining();
  }, [token]);

  /* -------------------------------- */
  /* Results metadata                 */
  /* -------------------------------- */

  const resultState = useMemo(
    () => ({
      recommendedSubjects: session?.recommendedSubjects || [],
    }),
    [session],
  );

  /* -------------------------------- */
  /* Start training                   */
  /* -------------------------------- */

  const handleStartTraining = () => {
    const questions = Array.isArray(session?.questions)
      ? session.questions
      : [];

    if (questions.length === 0) {
      return;
    }

    resetQuiz(questions);
    setTrainingStarted(true);
  };

  /* -------------------------------- */
  /* Helpers                          */
  /* -------------------------------- */

  const getPerformanceClass = (percentage) => {
    const value = Number(percentage || 0);

    if (value < 40) {
      return "smart-training__performance--low";
    }

    if (value < 70) {
      return "smart-training__performance--medium";
    }

    return "smart-training__performance--good";
  };

  /* -------------------------------- */
  /* Loading                          */
  /* -------------------------------- */

  if (loading) {
    return (
      <>
        <AppHeader />

        <main className="smart-training">
          <div className="smart-training__container">
            <section className="smart-training__message-card">
              <div className="smart-training__loading-icon">🧠</div>

              <div>
                <h1>Smart träning</h1>
                <p>Förbereder din personliga träning...</p>
              </div>
            </section>
          </div>
        </main>
      </>
    );
  }

  /* -------------------------------- */
  /* Error                            */
  /* -------------------------------- */

  if (loadError) {
    return (
      <>
        <AppHeader />

        <main className="smart-training">
          <div className="smart-training__container">
            <button
              type="button"
              className="smart-training__back-button"
              onClick={() => navigate("/min-traning")}
            >
              ← Till Min träning
            </button>

            <section className="smart-training__message-card">
              <div>
                <h1>Smart träning</h1>
                <p>{loadError}</p>
              </div>
            </section>
          </div>
        </main>
      </>
    );
  }

  if (!session) {
    return null;
  }

  /* -------------------------------- */
  /* No training history              */
  /* -------------------------------- */

  if (session.strategy === "no_history") {
    return (
      <>
        <AppHeader />

        <main className="smart-training">
          <div className="smart-training__container">
            <button
              type="button"
              className="smart-training__back-button"
              onClick={() => navigate("/min-traning")}
            >
              ← Till Min träning
            </button>

            <section className="smart-training__message-card">
              <div className="smart-training__message-icon">🧠</div>

              <div className="smart-training__message-content">
                <h1>Smart träning</h1>

                <p>
                  Hej {user?.firstName || "där"}! Vi behöver lite
                  träningshistorik innan vi kan skapa personlig träning för dig.
                </p>

                <p>
                  Gör några frågor först. Därefter analyserar Smart träning
                  vilka områden du behöver öva mer på.
                </p>

                <button
                  type="button"
                  className="smart-training__primary-button"
                  onClick={() => navigate("/min-traning/demo")}
                >
                  Gör ett test →
                </button>
              </div>
            </section>
          </div>
        </main>
      </>
    );
  }

  /* -------------------------------- */
  /* Active Smart Training quiz       */
  /* -------------------------------- */

  if (trainingStarted) {
    return (
      <>
        <AppHeader />

        <main className="demo-quiz">
          <div className="demo-quiz__container">
            <button
              type="button"
              className="smart-training__back-button"
              onClick={() => {
                setTrainingStarted(false);
                resetQuiz([]);
              }}
            >
              ← Avsluta Smart träning
            </button>

            <div className="smart-training__active-heading">
              <span className="smart-training__eyebrow">SMART TRÄNING</span>

              <h1>Personligt träningspass</h1>

              <p>
                Frågorna är valda utifrån dina tidigare resultat och dina
                svagaste områden.
              </p>
            </div>

            <QuizRunner
              quiz={{
                ...quiz,
                loading: false,
              }}
              quizType="smart"
              resultState={resultState}
              cardClassName="demo-quiz__card"
              loadingText="Förbereder Smart träning..."
              emptyText="Det finns inga frågor i detta träningspass."
            />
          </div>
        </main>
      </>
    );
  }

  /* -------------------------------- */
  /* Smart Training overview          */
  /* -------------------------------- */

  return (
    <>
      <AppHeader />

      <main className="smart-training">
        <div className="smart-training__container">
          <button
            type="button"
            className="smart-training__back-button"
            onClick={() => navigate("/min-traning")}
          >
            ← Till Min träning
          </button>

          {/* -------------------------------- */}
          {/* Page heading                     */}
          {/* -------------------------------- */}

          <header className="smart-training__header">
            <div>
              <span className="smart-training__eyebrow">PREMIUM</span>

              <h1>Smart träning</h1>

              <p>
                Vi har analyserat dina tidigare resultat och skapat ett
                personligt träningspass för dig.
              </p>
            </div>

            <div className="smart-training__header-badge">
              🧠 Personligt för dig
            </div>
          </header>

          {/* -------------------------------- */}
          {/* Recommended subjects             */}
          {/* -------------------------------- */}

          <section className="smart-training__subjects-card">
            <div className="smart-training__section-heading">
              <div className="smart-training__section-icon">🎯</div>

              <div>
                <div className="smart-training__title-row">
                  <h2>Rekommenderade ämnen</h2>

                  <span className="smart-training__weak-badge">
                    Dina svagaste områden
                  </span>
                </div>

                <p>
                  Vi fokuserar på ämnen där dina tidigare resultat visar störst
                  behov av träning.
                </p>
              </div>
            </div>

            <div className="smart-training__subject-list">
              {session.recommendedSubjects?.map((subject) => {
                const percentage = Number(subject.percentage || 0);

                return (
                  <article
                    className="smart-training__subject-row"
                    key={subject.subjectId}
                  >
                    <div className="smart-training__subject-main">
                      <div className="smart-training__subject-icon">📚</div>

                      <div className="smart-training__subject-info">
                        <h3>{subject.subject.name}</h3>

                        <div className="smart-training__subject-stats">
                          <span
                            className={`smart-training__percentage ${getPerformanceClass(
                              percentage,
                            )}`}
                          >
                            {percentage}%
                          </span>

                          <span>
                            {subject.correctAnswers} rätt av{" "}
                            {subject.totalAnswers} svar
                          </span>

                          <span className="smart-training__wrong-stat">
                            {subject.wrongAnswers} fel
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="smart-training__progress-area">
                      <div className="smart-training__progress-track">
                        <div
                          className={`smart-training__progress-fill ${getPerformanceClass(
                            percentage,
                          )}`}
                          style={{
                            width: `${Math.min(100, Math.max(0, percentage))}%`,
                          }}
                        />
                      </div>

                      <span>{percentage}%</span>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>

          {/* -------------------------------- */}
          {/* Training session                 */}
          {/* -------------------------------- */}

          <section className="smart-training__session-card">
            <div className="smart-training__session-icon">📋</div>

            <div className="smart-training__session-content">
              <h2>Smart träningspass</h2>

              <div className="smart-training__session-stats">
                <div className="smart-training__session-stat">
                  <span className="smart-training__session-stat-icon">📄</span>

                  <div>
                    <strong>{session.totalQuestions}</strong>
                    <span>frågor</span>
                  </div>
                </div>

                <div className="smart-training__session-divider" />

                <div className="smart-training__session-stat">
                  <span className="smart-training__session-stat-icon">🎯</span>

                  <div>
                    <span>Fokus på</span>
                    <strong>dina svagaste områden</strong>
                  </div>
                </div>

                <div className="smart-training__session-divider" />

                <div className="smart-training__session-stat">
                  <span className="smart-training__session-stat-icon">⏱️</span>

                  <div>
                    <span>Beräknad tid</span>
                    <strong>ca 10–15 min</strong>
                  </div>
                </div>
              </div>
            </div>

            <button
              type="button"
              className="smart-training__primary-button smart-training__start-button"
              disabled={!session.questions?.length}
              onClick={handleStartTraining}
            >
              🚀 Starta smart träning
            </button>
          </section>

          {/* -------------------------------- */}
          {/* Explanation                      */}
          {/* -------------------------------- */}

          <section className="smart-training__info-card">
            <div className="smart-training__info-icon">ⓘ</div>

            <div>
              <strong>Så fungerar det</strong>

              <p>
                Vi prioriterar frågor du tidigare svarat fel på och väljer sedan
                fler frågor från de ämnen där du behöver mest träning.
              </p>
            </div>
          </section>
        </div>
      </main>
    </>
  );
}

export default SmartTraining;
