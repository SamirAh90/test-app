import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../../contexts/AuthContext";

import { getFreeTrainingStatus, getSubjects } from "../../services/api";

import { getProgressSummary } from "../../services/progressService";

import usePaymentSettings from "../../hooks/usePaymentSettings";

import "./MyTraining.css";

/* -------------------------------- */
/* Subject performance              */
/* -------------------------------- */

function getSubjectLevel(percentage, hasAnswers) {
  if (!hasAnswers) {
    return {
      label: "Inte testat",
      className: "subject-level--untested",
    };
  }

  if (percentage < 40) {
    return {
      label: "Behöver träna",
      className: "subject-level--critical",
    };
  }

  if (percentage < 60) {
    return {
      label: "Under utveckling",
      className: "subject-level--developing",
    };
  }

  if (percentage < 75) {
    return {
      label: "På väg",
      className: "subject-level--progressing",
    };
  }

  if (percentage < 90) {
    return {
      label: "Bra",
      className: "subject-level--good",
    };
  }

  return {
    label: "Starkt",
    className: "subject-level--strong",
  };
}

/* -------------------------------- */
/* Quiz type labels                 */
/* -------------------------------- */

function getQuizTypeLabel(quizType) {
  const labels = {
    demo: "Demo",
    free: "Gratis",
    subject: "Ämne",
    smart: "Smart",
    simulator: "Simulator",
  };

  return labels[quizType] || "Test";
}

function MyTrainingSection() {
  const { user, token } = useAuth();

  const navigate = useNavigate();

  const { formattedPremiumPrice } = usePaymentSettings();

  /* -------------------------------- */
  /* Data                             */
  /* -------------------------------- */

  const [backendSubjects, setBackendSubjects] = useState([]);

  const [progressData, setProgressData] = useState(null);

  const [freeTrainingStatus, setFreeTrainingStatus] = useState(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  /* -------------------------------- */
  /* Load dashboard data              */
  /* -------------------------------- */

  useEffect(() => {
    async function loadMyTraining() {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        const [subjectsResponse, progressResponse, freeTrainingResponse] =
          await Promise.all([
            getSubjects(),
            getProgressSummary(token),
            getFreeTrainingStatus(token),
          ]);

        setBackendSubjects(
          Array.isArray(subjectsResponse) ? subjectsResponse : [],
        );

        setProgressData(progressResponse);

        setFreeTrainingStatus(freeTrainingResponse);
      } catch (requestError) {
        console.error("Could not load My Training:", requestError);

        setError(
          requestError.message || "Kunde inte hämta din träningsstatistik.",
        );
      } finally {
        setLoading(false);
      }
    }

    loadMyTraining();
  }, [token]);

  /* -------------------------------- */
  /* Subject statistics               */
  /* -------------------------------- */

  const subjects = useMemo(() => {
    const progressSubjects = progressData?.subjects || [];

    return backendSubjects.map((subject) => {
      const subjectResult = progressSubjects.find(
        (resultSubject) =>
          resultSubject.id === subject.id ||
          resultSubject.name === subject.name,
      );

      const correct = Number(subjectResult?.correct ?? 0);

      const total = Number(subjectResult?.total ?? 0);

      const percentage =
        total > 0
          ? Number(
              subjectResult?.percentage ?? Math.round((correct / total) * 100),
            )
          : 0;

      return {
        id: subject.id,
        name: subject.name,
        slug: subject.slug,
        correct,
        total,
        percentage,
        hasAnswers: total > 0,

        ...getSubjectLevel(percentage, total > 0),
      };
    });
  }, [backendSubjects, progressData]);

  /* -------------------------------- */
  /* Recommendations                  */
  /* -------------------------------- */

  const recommendedSubjects = useMemo(() => {
    const recommendations = progressData?.recommendedSubjects || [];

    return recommendations.map((subject) => ({
      ...subject,

      correct: Number(subject.correct ?? 0),

      total: Number(subject.total ?? 0),

      percentage: Number(subject.percentage ?? 0),

      hasAnswers: Number(subject.total ?? 0) > 0,

      ...getSubjectLevel(
        Number(subject.percentage ?? 0),

        Number(subject.total ?? 0) > 0,
      ),
    }));
  }, [progressData]);

  /* -------------------------------- */
  /* Overall statistics               */
  /* -------------------------------- */

  const summary = progressData?.summary || {};

  const answeredQuestions = Number(summary.answeredQuestions ?? 0);

  const correctAnswers = Number(summary.correctAnswers ?? 0);

  const wrongAnswers = Number(summary.wrongAnswers ?? 0);

  const latestPercentage = Number(summary.latestPercentage ?? 0);

  const testedSubjects = Number(summary.testedSubjects ?? 0);

  const totalAttempts = Number(summary.attempts ?? 0);

  const recentAttempts = Array.isArray(progressData?.recentAttempts)
    ? progressData.recentAttempts
    : [];

  /* -------------------------------- */
  /* Overall learning percentage      */
  /* -------------------------------- */

  const overallPercentage =
    answeredQuestions > 0
      ? Math.round((correctAnswers / answeredQuestions) * 100)
      : 0;

  /* -------------------------------- */
  /* Access                           */
  /* -------------------------------- */

  const isPremiumUser = Boolean(user?.isPremium);

  /* -------------------------------- */
  /* Free-account quota               */
  /* -------------------------------- */

  const freeQuestionLimit = isPremiumUser
    ? 0
    : Number(freeTrainingStatus?.limit ?? 30);

  const freeQuestionsUsed = isPremiumUser
    ? 0
    : Number(freeTrainingStatus?.usedQuestions ?? 0);

  const freeQuestionsLeft = isPremiumUser
    ? 0
    : Number(freeTrainingStatus?.remainingQuestions ?? freeQuestionLimit);

  /* -------------------------------- */
  /* Navigation                       */
  /* -------------------------------- */

  const handleStudyMaterial = () => {
    navigate("/studiematerial");
  };

  const handleRedoDemo = () => {
    navigate("/min-traning/demo");
  };

  const handleContinueFreeTraining = () => {
    navigate("/min-traning/free");
  };

  const handlePremiumTraining = () => {
    navigate("/min-traning/premium");
  };

  const handleSmartTraining = () => {
    navigate("/min-traning/smart-training");
  };

  const handleSimulator = () => {
    navigate("/min-traning/simulator");
  };

  const handleActivatePremium = () => {
    navigate("/premium");
  };

  const handleRecommendedSubjectClick = (subject) => {
    navigate(`/trainer/subject/${subject.id}`, {
      state: {
        subjectName: subject.name,
      },
    });
  };

  const handleStudySubjectClick = (subject) => {
    const subjectPath = subject.slug || subject.id;

    navigate(`/amnen/${subjectPath}`, {
      state: {
        subjectId: subject.id,

        subjectName: subject.name,

        subjectSlug: subject.slug,
      },
    });
  };

  /* -------------------------------- */
  /* Loading                          */
  /* -------------------------------- */

  if (loading) {
    return (
      <main className="my-training-page">
        <div className="my-training-container">
          <section className="my-training-message">
            Hämtar din träning...
          </section>
        </div>
      </main>
    );
  }

  /* -------------------------------- */
  /* Error                            */
  /* -------------------------------- */

  if (error) {
    return (
      <main className="my-training-page">
        <div className="my-training-container">
          <section className="my-training-message my-training-message--error">
            <strong>Något gick fel</strong>

            <p>{error}</p>

            <button type="button" onClick={() => window.location.reload()}>
              Försök igen
            </button>
          </section>
        </div>
      </main>
    );
  }

  return (
    <main className="my-training-page">
      <div className="my-training-container">
        {/* -------------------------------- */}
        {/* Welcome                          */}
        {/* -------------------------------- */}

        <section className="my-training-top">
          <article className="my-training-welcome">
            <span className="my-training-eyebrow">Min träning</span>

            <h1>
              Hej {user?.firstName || "där"}
              <span aria-hidden="true"> 👋</span>
            </h1>

            <p className="my-training-welcome__intro">Välkommen tillbaka!</p>

            {isPremiumUser ? (
              <div className="my-training-welcome__status">
                <strong>Premium är aktivt</strong>

                <span>
                  Du har obegränsad tillgång till hela frågebanken och alla
                  Premiumfunktioner.
                </span>
              </div>
            ) : (
              <div className="my-training-welcome__status">
                <strong>
                  Du har {freeQuestionsLeft} kostnadsfria frågor kvar.
                </strong>

                <span>
                  Fortsätt träna för att förbättra dina resultat inför
                  medborgarskapsprovet.
                </span>
              </div>
            )}

            {/* -------------------------------- */}
            {/* Main training actions            */}
            {/* -------------------------------- */}

            <div className="my-training-actions">
              <button
                className="my-training-action my-training-action--study"
                type="button"
                onClick={handleStudyMaterial}
              >
                <span className="my-training-action__icon">📚</span>

                <span className="my-training-action__content">
                  <strong>Studiematerial</strong>

                  <small>Läs först och bygg kunskap innan du tränar</small>
                </span>

                <span
                  className="my-training-action__arrow"
                  aria-hidden="true"
                >
                  →
                </span>
              </button>

              {!isPremiumUser && (
                <>
                  <button
                    className="my-training-action my-training-action--continue"
                    type="button"
                    onClick={handleContinueFreeTraining}
                    disabled={freeQuestionsLeft <= 0}
                  >
                    <span className="my-training-action__icon">🚀</span>

                    <span className="my-training-action__content">
                      <strong>
                        {freeQuestionsLeft > 0
                          ? "Fortsätt träna"
                          : "Gratis frågor använda"}
                      </strong>

                      {freeQuestionsLeft > 0 && (
                        <small>
                          {freeQuestionsLeft} kostnadsfria frågor kvar
                        </small>
                      )}
                    </span>

                    <span
                      className="my-training-action__arrow"
                      aria-hidden="true"
                    >
                      →
                    </span>
                  </button>

                  <button
                    className="my-training-action my-training-action--demo"
                    type="button"
                    onClick={handleRedoDemo}
                  >
                    <span className="my-training-action__icon">📘</span>

                    <span className="my-training-action__content">
                      <strong>Gör om demo</strong>

                      <small>Träna på de 15 demofrågorna igen</small>
                    </span>

                    <span
                      className="my-training-action__arrow"
                      aria-hidden="true"
                    >
                      →
                    </span>
                  </button>
                </>
              )}

              {isPremiumUser && (
                <>
                  <button
                    className="my-training-action my-training-action--continue"
                    type="button"
                    onClick={handlePremiumTraining}
                  >
                    <span className="my-training-action__icon">🚀</span>

                    <span className="my-training-action__content">
                      <strong>Träna med hela frågebanken</strong>

                      <small>Obegränsad träning med alla frågor</small>
                    </span>

                    <span
                      className="my-training-action__arrow"
                      aria-hidden="true"
                    >
                      →
                    </span>
                  </button>

                  <button
                    className="my-training-action my-training-action--smart"
                    type="button"
                    onClick={handleSmartTraining}
                  >
                    <span className="my-training-action__icon">🧠</span>

                    <span className="my-training-action__content">
                      <strong>Smart träning</strong>

                      <small>Träna på dina svagaste områden</small>
                    </span>

                    <span
                      className="my-training-action__arrow"
                      aria-hidden="true"
                    >
                      →
                    </span>
                  </button>

                  <button
                    className="my-training-action my-training-action--simulator"
                    type="button"
                    onClick={handleSimulator}
                  >
                    <span className="my-training-action__icon">⏱️</span>

                    <span className="my-training-action__content">
                      <strong>Provsimulator</strong>

                      <small>Genomför ett provliknande test</small>
                    </span>

                    <span
                      className="my-training-action__arrow"
                      aria-hidden="true"
                    >
                      →
                    </span>
                  </button>
                </>
              )}
            </div>

            {/* -------------------------------- */}
            {/* Premium CTA                      */}
            {/* -------------------------------- */}

            {!isPremiumUser && (
              <div className="my-training-welcome__premium">
                <div className="my-training-welcome__premium-heading">
                  <span className="my-training-welcome__premium-icon">✨</span>

                  <div>
                    <strong>Lås upp Premium</strong>

                    <span>Engångsbetalning · Livstidsåtkomst</span>
                  </div>
                </div>

                <div className="my-training-welcome__premium-features">
                  <span>✓ Hela frågebanken</span>

                  <span>✓ Smart träning</span>

                  <span>✓ Provsimulator</span>
                </div>

                <button
                  className="my-training-premium-cta"
                  type="button"
                  onClick={handleActivatePremium}
                >
                  <span>✨ Lås upp Premium</span>

                  <span aria-hidden="true">→</span>
                </button>
              </div>
            )}
          </article>

          {/* -------------------------------- */}
          {/* Statistics                       */}
          {/* -------------------------------- */}

          <article className="my-training-statistics">
            <div className="my-training-statistics__header">
              <div className="my-training-statistics__progress">
                <span className="my-training-eyebrow">Din utveckling</span>

                <strong className="my-training-progress-value">
                  {overallPercentage}%
                </strong>

                <p>
                  {correctAnswers} rätt av {answeredQuestions} besvarade frågor
                </p>

                <div className="my-training-progress">
                  <div
                    className="my-training-progress__bar"
                    style={{
                      width: `${overallPercentage}%`,
                    }}
                  />
                </div>

                {!isPremiumUser && (
                  <p className="my-training-free-quota">
                    Kontofrågor: {freeQuestionsUsed} av {freeQuestionLimit}{" "}
                    använda · {freeQuestionsLeft} kvar
                  </p>
                )}

                {isPremiumUser && (
                  <p className="my-training-free-quota">
                    Premium · Obegränsad träning
                  </p>
                )}
              </div>

              <div
                className="my-training-donut"
                style={{
                  "--score": `${latestPercentage}%`,
                }}
                role="img"
                aria-label={`Senaste testresultat: ${latestPercentage} procent`}
              >
                <div className="my-training-donut__center">
                  <strong>{latestPercentage}%</strong>

                  <span>Senaste test</span>
                </div>
              </div>
            </div>

            {/* -------------------------------- */}
            {/* Statistic counters               */}
            {/* -------------------------------- */}

            <div className="my-training-stat-grid">
              <div className="my-training-stat">
                <span className="my-training-stat__icon my-training-stat__icon--correct">
                  ✓
                </span>

                <div>
                  <strong>{correctAnswers}</strong>

                  <span>Rätt svar</span>
                </div>
              </div>

              <div className="my-training-stat">
                <span className="my-training-stat__icon my-training-stat__icon--wrong">
                  ×
                </span>

                <div>
                  <strong>{wrongAnswers}</strong>

                  <span>Fel svar</span>
                </div>
              </div>

              <div className="my-training-stat">
                <span className="my-training-stat__icon my-training-stat__icon--questions">
                  ?
                </span>

                <div>
                  <strong>{answeredQuestions}</strong>

                  <span>Besvarade frågor</span>
                </div>
              </div>

              <div className="my-training-stat">
                <span className="my-training-stat__icon my-training-stat__icon--subjects">
                  ★
                </span>

                <div>
                  <strong>{testedSubjects}</strong>

                  <span>Testade ämnen</span>
                </div>
              </div>
            </div>

            {totalAttempts > 0 && (
              <p className="my-training-attempt-count">
                {totalAttempts}{" "}
                {totalAttempts === 1 ? "genomfört test" : "genomförda test"}
              </p>
            )}

            {/* -------------------------------- */}
            {/* Result trend                     */}
            {/* Desktop only via CSS             */}
            {/* -------------------------------- */}

            {recentAttempts.length > 1 && (
              <div className="my-training-visualization">
                <div className="my-training-visualization__header">
                  <div>
                    <span className="my-training-visualization__eyebrow">
                      Resultatutveckling
                    </span>

                    <strong>Dina senaste resultat</strong>
                  </div>

                  <span className="my-training-visualization__accuracy">
                    Senast {latestPercentage}%
                  </span>
                </div>

                <div className="my-training-trend">
                  <svg
                    viewBox="0 0 500 150"
                    preserveAspectRatio="none"
                    role="img"
                    aria-label="Resultatutveckling för dina senaste tester"
                  >
                    <line
                      x1="10"
                      y1="37.5"
                      x2="490"
                      y2="37.5"
                      className="my-training-trend__grid"
                    />

                    <line
                      x1="10"
                      y1="75"
                      x2="490"
                      y2="75"
                      className="my-training-trend__grid"
                    />

                    <line
                      x1="10"
                      y1="112.5"
                      x2="490"
                      y2="112.5"
                      className="my-training-trend__grid"
                    />

                    <polyline
                      className="my-training-trend__line"
                      points={recentAttempts
                        .map((attempt, index) => {
                          const percentage = Math.max(
                            0,
                            Math.min(Number(attempt.percentage || 0), 100),
                          );

                          const x =
                            recentAttempts.length === 1
                              ? 250
                              : 10 +
                                (index / (recentAttempts.length - 1)) * 480;

                          const y = 140 - (percentage / 100) * 130;

                          return `${x},${y}`;
                        })
                        .join(" ")}
                    />

                    {recentAttempts.map((attempt, index) => {
                      const percentage = Math.max(
                        0,
                        Math.min(Number(attempt.percentage || 0), 100),
                      );

                      const x =
                        recentAttempts.length === 1
                          ? 250
                          : 10 + (index / (recentAttempts.length - 1)) * 480;

                      const y = 140 - (percentage / 100) * 130;

                      return (
                        <circle
                          key={attempt.id}
                          cx={x}
                          cy={y}
                          r="5"
                          className="my-training-trend__point"
                        />
                      );
                    })}
                  </svg>

                  <div className="my-training-trend__labels">
                    {recentAttempts.map((attempt) => (
                      <span key={attempt.id}>
                        <strong>{Number(attempt.percentage || 0)}%</strong>

                        <small>{getQuizTypeLabel(attempt.quizType)}</small>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </article>
        </section>

        {/* -------------------------------- */}
        {/* Recommendations                  */}
        {/* -------------------------------- */}

        <section className="my-training-study">
          <div className="my-training-study__header">
            <div>
              <span className="my-training-eyebrow">Rekommenderas för dig</span>

              <h2>Vad bör du träna mer på?</h2>

              <p>Vi rekommenderar ämnen utifrån dina sparade testresultat.</p>
            </div>
          </div>

          {recommendedSubjects.length > 0 ? (
            <div className="my-training-recommendation-list">
              {recommendedSubjects.map((subject, index) => (
                <button
                  className={`my-training-recommendation-row ${subject.className}`}
                  type="button"
                  key={subject.id}
                  onClick={() => handleRecommendedSubjectClick(subject)}
                >
                  <span className="my-training-recommendation-row__number">
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  <span className="my-training-recommendation-row__content">
                    <strong>{subject.name}</strong>

                    <small>
                      {subject.correct} av {subject.total} rätt
                    </small>
                  </span>

                  <span className="my-training-recommendation-row__status">
                    {index === 0 ? "Börja här" : subject.label}
                  </span>

                  <strong className="my-training-recommendation-row__score">
                    {subject.percentage}%
                  </strong>

                  <span
                    className="my-training-recommendation-row__arrow"
                    aria-hidden="true"
                  >
                    →
                  </span>
                </button>
              ))}
            </div>
          ) : (
            <div className="my-training-no-results">
              <strong>Ingen rekommendation ännu</strong>

              <span>
                Gör ett test så visar vi vilka ämnen du bör träna mer på.
              </span>

              <button type="button" onClick={handleRedoDemo}>
                Starta demot →
              </button>
            </div>
          )}

          {/* -------------------------------- */}
          {/* Study by subject                 */}
          {/* -------------------------------- */}

          {subjects.length > 0 && (
            <div className="my-training-all-subjects">
              <div className="my-training-all-subjects__heading">
                <div>
                  <h3>Plugga per ämne</h3>

                  <p>
                    Välj ett ämne för att läsa studiematerial och förbereda dig
                    innan du börjar träna på frågor.
                  </p>
                </div>

                <span>{subjects.length} ämnen</span>
              </div>

              <div className="my-training-subject-pills">
                {subjects.map((subject) => (
                  <button
                    className={`my-training-subject-pill ${subject.className}`}
                    type="button"
                    key={subject.id}
                    onClick={() => handleStudySubjectClick(subject)}
                  >
                    <span className="my-training-subject-pill__dot" />

                    <span className="my-training-subject-pill__name">
                      {subject.name}
                    </span>

                    <span className="my-training-subject-pill__result">
                      {subject.hasAnswers
                        ? `${subject.percentage}%`
                        : "Inte testat"}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="my-training-legend">
            <span>
              <i className="legend-dot legend-dot--critical" />
              Behöver träna
            </span>

            <span>
              <i className="legend-dot legend-dot--developing" />
              Under utveckling
            </span>

            <span>
              <i className="legend-dot legend-dot--progressing" />
              På väg
            </span>

            <span>
              <i className="legend-dot legend-dot--good" />
              Bra
            </span>

            <span>
              <i className="legend-dot legend-dot--strong" />
              Starkt
            </span>
          </div>
        </section>

        {/* -------------------------------- */}
        {/* Premium promotion                */}
        {/* -------------------------------- */}

        {!isPremiumUser && (
          <section className="my-training-premium">
            <div className="my-training-premium__content">
              <span className="my-training-eyebrow">Premium</span>

              <h2>Lås upp hela MedborgaTest</h2>

              <p>
                Få hela frågebanken, provsimulatorn, smart träning och alla
                Premiumfunktioner.
              </p>

              <div className="my-training-premium__features">
                <span>✓ Hela frågebanken</span>

                <span>✓ Provsimulator</span>

                <span>✓ Smart träning</span>
              </div>
            </div>

            <div className="my-training-premium__action">
              <strong>{formattedPremiumPrice}</strong>

              <span>Engångsbetalning</span>

              <button
                className="my-training-button my-training-button--dark"
                type="button"
                onClick={handleActivatePremium}
              >
                Lås upp Premium
              </button>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}

export default MyTrainingSection;
