import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../contexts/AuthContext";

import { getPremiumTrainingSession } from "../services/api";

import useQuizRunner from "../hooks/useQuizRunner";

import AppHeader from "../components/AppHeader/AppHeader";
import QuizRunner from "../components/Quiz/QuizRunner";

import "../sections/DemoQuiz/DemoQuiz.css";

function PremiumTraining() {
  const navigate = useNavigate();

  const { token } = useAuth();

  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  const quiz = useQuizRunner({
    initialQuestions: [],
    language: "sv",
  });

  const { resetQuiz } = quiz;

  /* -------------------------------- */
  /* Load Premium training session    */
  /* -------------------------------- */

  useEffect(() => {
    async function loadPremiumTraining() {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setLoadError("");

        const response = await getPremiumTrainingSession(token, 60);

        setSession(response);

        const questions = Array.isArray(response?.questions)
          ? response.questions
          : [];

        resetQuiz(questions);
      } catch (requestError) {
        console.error("Could not load Premium Training:", requestError);

        setLoadError(
          requestError.response?.data?.message ||
            requestError.message ||
            "Premiumträningen kunde inte startas.",
        );
      } finally {
        setLoading(false);
      }
    }

    loadPremiumTraining();
  }, [token, resetQuiz]);

  /* -------------------------------- */
  /* Loading                          */
  /* -------------------------------- */

  if (loading) {
    return (
      <>
        <AppHeader />

        <main className="demo-quiz">
          <div className="demo-quiz__container">
            <section className="demo-quiz__card">
              <p>Hämtar frågor från hela frågebanken...</p>
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

        <main className="demo-quiz">
          <div className="demo-quiz__container">
            <section className="demo-quiz__card">
              <h1>Premiumträningen kunde inte startas</h1>

              <p>{loadError}</p>

              <button type="button" onClick={() => navigate("/min-traning")}>
                ← Till Min träning
              </button>
            </section>
          </div>
        </main>
      </>
    );
  }

  /* -------------------------------- */
  /* Empty                            */
  /* -------------------------------- */

  if (
    !session ||
    !Array.isArray(session.questions) ||
    session.questions.length === 0
  ) {
    return (
      <>
        <AppHeader />

        <main className="demo-quiz">
          <div className="demo-quiz__container">
            <section className="demo-quiz__card">
              <h1>Inga frågor hittades</h1>

              <p>Det finns inga frågor att visa just nu.</p>

              <button type="button" onClick={() => navigate("/min-traning")}>
                ← Till Min träning
              </button>
            </section>
          </div>
        </main>
      </>
    );
  }

  /* -------------------------------- */
  /* Premium quiz                     */

  /* -------------------------------- */

  const backButtonStyle = {
    display: "inline-flex",
    alignItems: "center",
    gap: "7px",
    padding: "9px 13px",
    border: "1px solid #d9e2e8",
    borderRadius: "9px",
    background: "#ffffff",
    color: "#334155",
    fontSize: "13px",
    fontWeight: "700",
    cursor: "pointer",
  };
  return (
    <>
      <AppHeader />

      <section className="demo-quiz">
        <div className="demo-quiz__container">
          <button
            type="button"
            style={backButtonStyle}
            onClick={() => navigate("/min-traning")}
          >
            ← Till Min träning
          </button>

          <div
            style={{
              marginBottom: "18px",
            }}
          >
            <h1>Träna med hela frågebanken</h1>

            <p>
              Du har tillgång till alla{" "}
              <strong>{session.totalBankQuestions ?? 0}</strong> frågor i
              Premium.
            </p>

            <p
              style={{
                marginTop: "6px",
                color: "#64748b",
                fontSize: "14px",
              }}
            ></p>
          </div>

          <QuizRunner
            quiz={{
              ...quiz,
              loading: false,
            }}
            quizType="premium"
            cardClassName="demo-quiz__card"
            loadingText="Hämtar Premiumfrågor..."
            emptyText="Det finns inga frågor i detta träningspass."
          />
        </div>
      </section>
    </>
  );
}

export default PremiumTraining;
