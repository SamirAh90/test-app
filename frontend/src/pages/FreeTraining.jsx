import { useNavigate } from "react-router-dom";

import { useAuth } from "../contexts/AuthContext";

import useFreeTraining from "../hooks/useFreeTraining";
import useQuestionTranslation from "../hooks/useQuestionTranslation";

import TrainerHeader from "../components/TrainerHeader/TrainerHeader";
import QuizRunner from "../components/Quiz/QuizRunner";

import "../sections/DemoQuiz/DemoQuiz.css";

function FreeTraining() {
  const navigate = useNavigate();

  const { token } = useAuth();

  /* -------------------------------- */
  /* Translation                     */
  /* -------------------------------- */

  const { translationLanguage, showTranslation } = useQuestionTranslation();

  /* -------------------------------- */
  /* Free Training                   */
  /* -------------------------------- */

  const quiz = useFreeTraining(token, translationLanguage, 15);

  const {
    session,
    loading,
    loadError,

    freeQuestionLimit,
    liveRemainingQuestions,
    currentFreeQuestion,
  } = quiz;

  /* -------------------------------- */
  /* Shared styles                   */
  /* -------------------------------- */

  const messageCardStyle = {
    textAlign: "center",
    padding: "36px 28px",
  };

  const premiumButtonStyle = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",

    marginTop: "8px",
    padding: "11px 18px",

    border: "1px solid var(--color-primary)",
    borderRadius: "9px",

    background: "var(--color-primary)",
    color: "#ffffff",

    fontFamily: "inherit",
    fontSize: "13px",
    fontWeight: "800",

    cursor: "pointer",
  };

  const secondaryButtonStyle = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",

    marginTop: "10px",
    marginLeft: "8px",
    padding: "11px 18px",

    border: "1px solid var(--color-border)",
    borderRadius: "9px",

    background: "var(--color-surface)",
    color: "var(--color-text)",

    fontFamily: "inherit",
    fontSize: "13px",
    fontWeight: "700",

    cursor: "pointer",
  };

  /* -------------------------------- */
  /* Loading                         */
  /* -------------------------------- */

  if (loading && !session) {
    return (
      <>
        <TrainerHeader />

        <main className="demo-quiz">
          <div className="demo-quiz__container">
            <section className="demo-quiz__card" style={messageCardStyle}>
              <p>Hämtar dina frågor...</p>
            </section>
          </div>
        </main>
      </>
    );
  }

  /* -------------------------------- */
  /* Initial load error              */
  /* -------------------------------- */

  if (loadError && !session) {
    return (
      <>
        <TrainerHeader />

        <main className="demo-quiz">
          <div className="demo-quiz__container">
            <section className="demo-quiz__card" style={messageCardStyle}>
              <h1>Träningen kunde inte startas</h1>

              <p>{loadError}</p>

              <button
                type="button"
                style={secondaryButtonStyle}
                onClick={() => navigate("/min-traning")}
              >
                Till Min träning
              </button>
            </section>
          </div>
        </main>
      </>
    );
  }

  /* -------------------------------- */
  /* Free limit reached              */
  /* -------------------------------- */

  if (session?.strategy === "free_limit_reached") {
    return (
      <>
        <TrainerHeader />

        <main className="demo-quiz">
          <div className="demo-quiz__container">
            <section className="demo-quiz__card" style={messageCardStyle}>
              <div
                style={{
                  fontSize: "28px",
                  marginBottom: "10px",
                }}
                aria-hidden="true"
              >
                ✨
              </div>

              <h1>Du har slutfört dina kostnadsfria frågor</h1>

              <p
                style={{
                  maxWidth: "520px",
                  margin: "10px auto",

                  color: "var(--color-text-muted)",

                  lineHeight: "1.6",
                }}
              >
                Du har tränat på alla{" "}
                {session?.limit ?? freeQuestionLimit ?? 30} kostnadsfria frågor
                som ingår i ditt konto.
              </p>

              <p
                style={{
                  maxWidth: "520px",
                  margin: "10px auto 18px",

                  color: "var(--color-text-muted)",

                  lineHeight: "1.6",
                }}
              >
                Lås upp Premium för att fortsätta med hela frågebanken, Smart
                träning och Provsimulatorn.
              </p>

              <div>
                <button
                  type="button"
                  style={premiumButtonStyle}
                  onClick={() => navigate("/premium")}
                >
                  Lås upp Premium →
                </button>

                <button
                  type="button"
                  style={secondaryButtonStyle}
                  onClick={() => navigate("/min-traning")}
                >
                  Till Min träning
                </button>
              </div>
            </section>
          </div>
        </main>
      </>
    );
  }

  /* -------------------------------- */
  /* Empty                           */
  /* -------------------------------- */

  if (
    !session ||
    !Array.isArray(session.questions) ||
    session.questions.length === 0
  ) {
    return (
      <>
        <TrainerHeader />

        <main className="demo-quiz">
          <div className="demo-quiz__container">
            <section className="demo-quiz__card" style={messageCardStyle}>
              <h1>Inga frågor hittades</h1>

              <p>Det finns inga kostnadsfria frågor att visa just nu.</p>

              <button
                type="button"
                style={secondaryButtonStyle}
                onClick={() => navigate("/min-traning")}
              >
                Till Min träning
              </button>
            </section>
          </div>
        </main>
      </>
    );
  }

  /* -------------------------------- */
  /* Free quiz                       */
  /* -------------------------------- */

  return (
    <>
      <TrainerHeader />

      <main className="demo-quiz">
        <div className="demo-quiz__container">
          {/* -------------------------------- */}
          {/* Heading                          */}
          {/* -------------------------------- */}

          <header className="demo-quiz__free-heading">
            <span className="demo-quiz__free-eyebrow">Gratis träning</span>

            <span className="demo-quiz__free-quota">
              {liveRemainingQuestions} frågor kvar
            </span>
          </header>

          {/* -------------------------------- */}
          {/* Translation warning              */}
          {/* -------------------------------- */}

          {loadError && (
            <p className="demo-quiz__translation-warning" role="status">
              {loadError}
            </p>
          )}

          {/* -------------------------------- */}
          {/* Quiz                             */}
          {/* -------------------------------- */}

          <QuizRunner
            quiz={{
              ...quiz,

              loading: false,

              /*
                Translation failure should not
                replace the whole quiz with the
                QuizRunner error state.
              */

              error: "",
            }}
            quizType="free"
            cardClassName="demo-quiz__card"
            loadingText="Hämtar kostnadsfria frågor..."
            emptyText="Det finns inga frågor i detta träningspass."
            translationLanguage={translationLanguage}
            showTranslation={showTranslation}
            /*
              Logged-in Free Training belongs to
              the user's personal training area.
            */

            exitTo="/min-traning"
            /*
              Free Training progress represents
              the user's full 30-question allowance,
              not only the current 15-question batch.
            */

            progressCurrent={currentFreeQuestion}
            progressTotal={freeQuestionLimit}
          />
        </div>

        {/* -------------------------------- */}
        {/* Disclaimer                       */}
        {/* -------------------------------- */}

        <footer className="demo-quiz__disclaimer">
          <p>
            Frågorna är utformade för att hjälpa dig förbereda dig inför det
            svenska medborgarskapsprovet. MedborgaTest är en fristående
            utbildningstjänst och är inte en officiell myndighetstjänst.
          </p>
        </footer>
      </main>
    </>
  );
}

export default FreeTraining;
