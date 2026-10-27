import { useNavigate } from "react-router-dom";

import useQuiz from "../../hooks/useQuiz";
import useQuestionTranslation from "../../hooks/useQuestionTranslation";

import QuizRunner from "../../components/Quiz/QuizRunner";

import "./DemoQuiz.css";

function DemoQuiz({ showBackToMyTraining = false }) {
  const navigate = useNavigate();

  /* -------------------------------- */
  /* Translation preference           */
  /* -------------------------------- */

  const { translationLanguage, showTranslation } = useQuestionTranslation();

  /* -------------------------------- */
  /* Quiz                             */
  /* -------------------------------- */

  const quiz = useQuiz(translationLanguage, 15);

  /* -------------------------------- */
  /* Back button                      */
  /* -------------------------------- */

  const backButtonStyle = {
    display: "inline-flex",
    alignItems: "center",
    gap: "7px",
    marginBottom: "20px",
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
    <section className="demo-quiz">
      <div className="demo-quiz__container">
        <header className="subject-quiz__heading">
          <span>Träna gratis</span>
          {/* 
          <h1>Testa dina kunskaper</h1> */}
        </header>

        <QuizRunner
          quiz={quiz}
          quizType="demo"
          cardClassName="demo-quiz__card"
          loadingText="Hämtar frågor..."
          emptyText="Det finns inga frågor att visa."
          translationLanguage={translationLanguage}
          showTranslation={showTranslation}
        />
      </div>

      <footer className="demo-quiz__disclaimer">
        <p>
          Frågorna är utformade för att hjälpa dig förbereda dig inför det
          svenska medborgarskapsprovet. MedborgaTest är en fristående
          utbildningstjänst och är inte en officiell myndighetstjänst.
        </p>
      </footer>
    </section>
  );
}

export default DemoQuiz;
