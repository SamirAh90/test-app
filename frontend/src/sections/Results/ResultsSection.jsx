import { useEffect, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { useAuth } from "../../contexts/AuthContext";
import usePaymentSettings from "../../hooks/usePaymentSettings";

import "./Results.css";

const DEMO_RESULT_STORAGE_KEY = "medborgatest_demo_result";

/* -------------------------------- */
/* Quiz type configuration          */
/* -------------------------------- */

function getQuizTypeConfig(quizType) {
  const configs = {
    demo: {
      eyebrow: "Demo slutfört",

      retryLabel: "Gör demot igen",

      retryPath: "/trainer/demo",
    },

    free: {
      eyebrow: "Gratis träning slutförd",

      retryLabel: "Träna fler gratisfrågor",

      retryPath: "/min-traning/free",
    },

    premium: {
      eyebrow: "Premiumträning slutförd",

      retryLabel: "Träna igen",

      retryPath: "/min-traning/premium",
    },

    subject: {
      eyebrow: "Ämnesträning slutförd",

      retryLabel: "Fortsätt träna",

      retryPath: "/min-traning",
    },

    smart: {
      eyebrow: "Smart träning slutförd",

      retryLabel: "Starta ny smart träning",

      retryPath: "/min-traning/smart-training",
    },

    simulator: {
      eyebrow: "Provsimulator slutförd",

      retryLabel: "Gör ett nytt prov",

      retryPath: "/min-traning/simulator",
    },
  };

  return configs[quizType] || configs.demo;
}

function ResultsSection() {
  const location = useLocation();

  const navigate = useNavigate();

  const { user, isAuthenticated } = useAuth();

  const { formattedPremiumPrice } = usePaymentSettings();

  /* -------------------------------- */
  /* Result state                    */
  /* -------------------------------- */

  const {
    score = 0,

    results = [],

    totalQuestions = 0,

    quizType = "demo",

    answeredQuestions: stateAnsweredQuestions,

    unansweredQuestions: stateUnansweredQuestions,

    correctAnswers: stateCorrectAnswers,

    wrongAnswers: stateWrongAnswers,

    simulatorTimedOut = false,
  } = location.state || {};

  const quizConfig = getQuizTypeConfig(quizType);

  const isSimulatorResult = quizType === "simulator";

  /* -------------------------------- */
  /* Result totals                   */
  /* -------------------------------- */

  const calculatedAnsweredQuestions = results.filter(
    (result) => result.answered !== false,
  ).length;

  const answeredQuestions = isSimulatorResult
    ? Number(stateAnsweredQuestions ?? calculatedAnsweredQuestions)
    : totalQuestions;

  const unansweredQuestions = isSimulatorResult
    ? Number(
        stateUnansweredQuestions ??
          Math.max(0, totalQuestions - answeredQuestions),
      )
    : 0;

  const correctAnswers = Number(stateCorrectAnswers ?? score);

  const wrongAnswers = isSimulatorResult
    ? Number(
        stateWrongAnswers ??
          results.filter(
            (result) => result.answered !== false && !result.correct,
          ).length,
      )
    : Math.max(0, totalQuestions - score);

  const percentage =
    totalQuestions > 0
      ? Math.round((correctAnswers / totalQuestions) * 100)
      : 0;

  /* -------------------------------- */
  /* Subject statistics              */
  /* -------------------------------- */

  const subjects = useMemo(() => {
    const subjectStatistics = results.reduce((statistics, result) => {
      const subjectId = result.subjectId;

      const subjectName = result.subjectName || "Ämne";

      const subjectKey = subjectId != null ? String(subjectId) : subjectName;

      if (!statistics[subjectKey]) {
        statistics[subjectKey] = {
          id: subjectId,

          name: subjectName,

          total: 0,

          answered: 0,

          unanswered: 0,

          correct: 0,

          wrong: 0,
        };
      }

      statistics[subjectKey].total += 1;

      if (result.answered === false) {
        statistics[subjectKey].unanswered += 1;
      } else {
        statistics[subjectKey].answered += 1;

        if (result.correct) {
          statistics[subjectKey].correct += 1;
        } else {
          statistics[subjectKey].wrong += 1;
        }
      }

      return statistics;
    }, {});

    return Object.values(subjectStatistics).map((statistics) => ({
      id: statistics.id,

      name: statistics.name,

      total: statistics.total,

      answered: statistics.answered,

      unanswered: statistics.unanswered,

      correct: statistics.correct,

      wrong: statistics.wrong,

      percentage:
        statistics.total > 0
          ? Math.round((statistics.correct / statistics.total) * 100)
          : 0,
    }));
  }, [results]);

  /* -------------------------------- */
  /* Save guest demo result locally  */
  /* -------------------------------- */

  useEffect(() => {
    if (!location.state) {
      return;
    }

    if (quizType !== "demo") {
      return;
    }

    if (location.state.savedToDatabase) {
      localStorage.removeItem(DEMO_RESULT_STORAGE_KEY);

      return;
    }

    const answers = results
      .map((result) => ({
        questionId: result.questionId,

        subjectId: result.subjectId,

        selectedAnswerId: result.selectedAnswerId,

        correct: Boolean(result.correct),
      }))
      .filter(
        (answer) =>
          Number.isInteger(answer.questionId) &&
          Number.isInteger(answer.subjectId) &&
          Number.isInteger(answer.selectedAnswerId),
      );

    const demoResult = {
      quizType: "demo",

      score,

      totalQuestions,

      percentage,

      answers,

      subjects,

      completedAt: new Date().toISOString(),
    };

    localStorage.setItem(
      DEMO_RESULT_STORAGE_KEY,

      JSON.stringify(demoResult),
    );
  }, [
    location.state,
    percentage,
    quizType,
    results,
    score,
    subjects,
    totalQuestions,
  ]);

  /* -------------------------------- */
  /* Strongest subject               */
  /* -------------------------------- */

  const sortedSubjects = useMemo(
    () =>
      [...subjects].sort((firstSubject, secondSubject) => {
        if (secondSubject.percentage !== firstSubject.percentage) {
          return secondSubject.percentage - firstSubject.percentage;
        }

        return secondSubject.correct - firstSubject.correct;
      }),

    [subjects],
  );

  const strongestSubject = sortedSubjects[0];

  /* -------------------------------- */
  /* Recommended subjects            */
  /* -------------------------------- */

  const recommendedSubjects = useMemo(
    () =>
      [...subjects]
        .filter((subject) => subject.percentage < 70)
        .sort(
          (firstSubject, secondSubject) =>
            firstSubject.percentage - secondSubject.percentage,
        )
        .slice(0, 2),

    [subjects],
  );

  /* -------------------------------- */
  /* Result message                  */
  /* -------------------------------- */

  const getResultMessage = () => {
    if (percentage >= 80) {
      return {
        title: "Mycket bra resultat",

        text: "Du har en stark grund. Fortsätt träna regelbundet för att behålla nivån.",

        className: "results-status--high",

        icon: "🏆",
      };
    }

    if (percentage >= 50) {
      return {
        title: "Bra resultat",

        text: "Du är på god väg. Fokusera på ämnena där du hade flest fel.",

        className: "results-status--medium",

        icon: "⭐",
      };
    }

    return {
      title: "Fortsätt träna",

      text: "Fortsätt öva på områdena där du hade flest fel. Dina resultat förbättras med regelbunden träning.",

      className: "results-status--low",

      icon: "📚",
    };
  };

  const resultMessage = getResultMessage();

  /* -------------------------------- */
  /* User access                     */
  /* -------------------------------- */

  const isPremiumUser = isAuthenticated && Boolean(user?.isPremium);

  const isFreeUser = isAuthenticated && !user?.isPremium;

  const isGuest = !isAuthenticated;

  /* -------------------------------- */
  /* Navigation helpers              */
  /* -------------------------------- */

  const handleRetry = () => {
    navigate(quizConfig.retryPath);
  };

  const handleSubjectTraining = (subject) => {
    if (!subject.id) {
      navigate("/min-traning");

      return;
    }

    navigate(`/trainer/subject/${subject.id}`, {
      state: {
        subjectName: subject.name,

        returnTo: isAuthenticated ? "/min-traning" : "/trainer",

        returnLabel: isAuthenticated ? "Till Min träning" : "Till tränaren",
      },
    });
  };

  /* -------------------------------- */
  /* No result                       */
  /* -------------------------------- */

  if (!location.state) {
    return (
      <main className="results-page">
        <section className="results-empty">
          <h1>Inget resultat hittades</h1>

          <p>Starta ett träningspass för att se ditt resultat.</p>

          <button
            className="results-button results-button--primary"
            type="button"
            onClick={() =>
              navigate(isAuthenticated ? "/min-traning" : "/trainer")
            }
          >
            {isAuthenticated ? "Till Min träning" : "Till tränaren"}
          </button>
        </section>
      </main>
    );
  }

  return (
    <main className="results-page">
      <div className="results-container">
        {/* -------------------------------- */}
        {/* Result overview                  */}
        {/* -------------------------------- */}

        <section className="results-overview">
          <div className="results-overview__heading">
            <div>
              <span className="results-eyebrow">{quizConfig.eyebrow}</span>

              <h1>Bra jobbat! 🎉</h1>

              <p>
                Du fick{" "}
                <strong>
                  {correctAnswers} av {totalQuestions}
                </strong>{" "}
                rätt.
              </p>

              {isSimulatorResult && simulatorTimedOut && (
                <p>Tiden tog slut och provet lämnades in automatiskt.</p>
              )}
            </div>

            <div className={`results-status ${resultMessage.className}`}>
              <span>{resultMessage.icon}</span>

              <div>
                <strong>{resultMessage.title}</strong>

                <p>{resultMessage.text}</p>
              </div>
            </div>
          </div>

          {/* -------------------------------- */}
          {/* Main score                       */}
          {/* -------------------------------- */}

          <div className="results-main-score">
            <div
              className="results-donut"
              style={{
                "--score": `${percentage}%`,
              }}
              role="img"
              aria-label={`Du fick ${percentage} procent rätt`}
            >
              <div className="results-donut__center">
                <strong>{percentage}%</strong>

                <span>rätt</span>
              </div>
            </div>

            <div className="results-score-details">
              <div className="results-score-stat">
                <span>Rätt svar</span>

                <strong>{correctAnswers}</strong>
              </div>

              <div className="results-score-stat">
                <span>Fel svar</span>

                <strong>{wrongAnswers}</strong>
              </div>

              {isSimulatorResult && (
                <div className="results-score-stat">
                  <span>Obesvarade</span>

                  <strong>{unansweredQuestions}</strong>
                </div>
              )}

              <div className="results-score-stat">
                <span>Frågor</span>

                <strong>{totalQuestions}</strong>
              </div>
            </div>
          </div>

          {/* -------------------------------- */}
          {/* Subject results                  */}
          {/* -------------------------------- */}

          {subjects.length > 0 && (
            <div className="results-subject-section">
              <div className="results-subject-section__heading">
                <h2>Resultat efter ämne</h2>

                <span>{subjects.length} ämnen</span>
              </div>

              <div className="results-subject-list">
                {subjects.map((subject) => (
                  <div
                    className="results-subject-row"
                    key={subject.id ?? subject.name}
                  >
                    <div className="results-subject-row__top">
                      <div>
                        <strong>{subject.name}</strong>

                        <span>
                          {subject.correct} av {subject.total} rätt
                        </span>

                        {isSimulatorResult && subject.unanswered > 0 && (
                          <span>{subject.unanswered} obesvarade</span>
                        )}
                      </div>

                      <strong>{subject.percentage}%</strong>
                    </div>

                    <div className="results-subject-progress">
                      <div
                        className="results-subject-progress__bar"
                        style={{
                          width: `${subject.percentage}%`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* -------------------------------- */}
          {/* Insights                         */}
          {/* -------------------------------- */}

          {subjects.length > 0 && (
            <div className="results-insights">
              <article className="results-insight">
                <span className="results-insight__icon">🏆</span>

                <div>
                  <span className="results-insight__label">
                    Starkaste område
                  </span>

                  <h3>{strongestSubject?.name || "Fortsätt träna"}</h3>

                  {strongestSubject && (
                    <p>
                      {strongestSubject.correct} av {strongestSubject.total}{" "}
                      rätt
                    </p>
                  )}
                </div>
              </article>

              <article className="results-insight">
                <span className="results-insight__icon">🎯</span>

                <div>
                  <span className="results-insight__label">
                    Rekommenderat fokus
                  </span>

                  {recommendedSubjects.length > 0 ? (
                    <>
                      <h3>{recommendedSubjects[0].name}</h3>

                      <p>
                        Börja här
                        {recommendedSubjects[1]
                          ? ` och fortsätt sedan med ${recommendedSubjects[1].name}.`
                          : "."}
                      </p>
                    </>
                  ) : (
                    <>
                      <h3>Fortsätt regelbundet</h3>

                      <p>Du klarade alla områden bra.</p>
                    </>
                  )}
                </div>
              </article>
            </div>
          )}
        </section>

        {/* -------------------------------- */}
        {/* Recommended training             */}
        {/* -------------------------------- */}

        {recommendedSubjects.length > 0 && (
          <section className="results-focus">
            <div className="results-section-heading">
              <div>
                <span className="results-eyebrow">Rekommenderad träning</span>

                <h2>Träna mer på</h2>
              </div>
            </div>

            <div className="results-focus__grid">
              {recommendedSubjects.map((subject) => (
                <article
                  className="results-focus-card"
                  key={subject.id ?? subject.name}
                >
                  <div className="results-focus-card__score">
                    <strong>{subject.percentage}%</strong>

                    <span>
                      {subject.correct} av {subject.total} rätt
                    </span>
                  </div>

                  <div>
                    <h3>{subject.name}</h3>

                    <p>
                      Träna fler frågor inom detta område för att förbättra
                      resultatet.
                    </p>
                  </div>

                  <button
                    className="results-text-button"
                    type="button"
                    onClick={() => handleSubjectTraining(subject)}
                  >
                    Träna på ämnet →
                  </button>
                </article>
              ))}
            </div>
          </section>
        )}

        {/* -------------------------------- */}
        {/* Next step                        */}
        {/* Guest / free users only          */}
        {/* -------------------------------- */}

        {!isPremiumUser && (
          <section className="results-next">
            <div className="results-section-heading">
              <div>
                <span className="results-eyebrow">Fortsätt härifrån</span>

                <h2>Nästa steg</h2>
              </div>
            </div>

            <div className="results-next__grid">
              {/* Guest */}

              {isGuest && (
                <article className="results-next-card results-next-card--free">
                  <span className="results-card-badge">Rekommenderas</span>

                  <div>
                    <span className="results-next-card__icon">🚀</span>

                    <h3>Fortsätt gratis</h3>

                    <p>
                      Skapa ett gratis konto för att spara dina resultat och
                      fortsätta träna.
                    </p>
                  </div>

                  <ul>
                    <li>30 kostnadsfria frågor</li>

                    <li>Spara dina resultat</li>

                    <li>Följ din utveckling</li>

                    <li>Repetera tidigare fel</li>
                  </ul>

                  <button
                    className="results-button results-button--primary"
                    type="button"
                    onClick={() => navigate("/register")}
                  >
                    Skapa gratis konto
                  </button>
                </article>
              )}

              {/* Free account */}

              {isFreeUser && (
                <article className="results-next-card results-next-card--free">
                  <span className="results-card-badge">
                    Resultatet är sparat
                  </span>

                  <div>
                    <span className="results-next-card__icon">📊</span>

                    <h3>Se din utveckling</h3>

                    <p>
                      Ditt resultat är sparat. Se statistik, rekommendationer
                      och fortsätt med dina kostnadsfria frågor.
                    </p>
                  </div>

                  <ul>
                    <li>Se dina sparade resultat</li>

                    <li>Följ utvecklingen över tid</li>

                    <li>Se rekommenderade ämnen</li>

                    <li>Fortsätt gratis träning</li>
                  </ul>

                  <button
                    className="results-button results-button--primary"
                    type="button"
                    onClick={() => navigate("/min-traning")}
                  >
                    Gå till Min träning
                  </button>
                </article>
              )}

              {/* Premium promotion */}

              <article className="results-next-card results-next-card--premium">
                <span className="results-card-badge">Full tillgång</span>

                <div>
                  <span className="results-next-card__icon">💎</span>

                  <h3>Lås upp allt</h3>

                  <p>
                    Få tillgång till hela MedborgaTest och alla träningsverktyg.
                  </p>
                </div>

                <ul>
                  <li>Hela frågebanken</li>

                  <li>Provsimulator</li>

                  <li>Smart träning</li>

                  <li>Repetera fel</li>
                </ul>

                <div className="results-price">
                  <strong>{formattedPremiumPrice}</strong>

                  <span>Engångsbetalning</span>
                </div>

                <button
                  className="results-button results-button--dark"
                  type="button"
                  onClick={() => navigate("/premium")}
                >
                  Läs mer
                </button>
              </article>
            </div>
          </section>
        )}

        {/* -------------------------------- */}
        {/* Main result actions              */}
        {/* -------------------------------- */}

        <div
          className={`results-main-actions ${
            isPremiumUser ? "results-main-actions--premium" : ""
          }`}
        >
          <button
            className="results-main-action results-main-action--primary"
            type="button"
            onClick={handleRetry}
          >
            <span className="results-main-action__icon">↻</span>

            <span>
              <strong>{quizConfig.retryLabel}</strong>

              {isPremiumUser && (
                <small>
                  {isSimulatorResult
                    ? "Starta en ny provsimulering"
                    : "Starta ett nytt träningspass"}
                </small>
              )}
            </span>

            <span aria-hidden="true">→</span>
          </button>

          {isAuthenticated && (
            <button
              className="results-main-action results-main-action--secondary"
              type="button"
              onClick={() => navigate("/min-traning")}
            >
              <span className="results-main-action__icon">📊</span>

              <span>
                <strong>Till Min träning</strong>

                <small>Se statistik och utveckling</small>
              </span>

              <span aria-hidden="true">→</span>
            </button>
          )}
        </div>
      </div>
    </main>
  );
}

export default ResultsSection;
