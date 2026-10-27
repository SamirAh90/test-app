import { useLocation, useNavigate, useParams } from "react-router-dom";

import useSubjectQuiz from "../../hooks/useSubjectQuiz";
import useQuestionTranslation from "../../hooks/useQuestionTranslation";

import TrainerHeader from "../../components/TrainerHeader/TrainerHeader";
import QuizRunner from "../../components/Quiz/QuizRunner";

import "../DemoQuiz/DemoQuiz.css";
import "./SubjectQuiz.css";

function SubjectQuiz() {
  const { subjectId } = useParams();

  const location = useLocation();
  const navigate = useNavigate();

  /* -------------------------------- */
  /* Translation                      */
  /* -------------------------------- */

  const { translationLanguage, showTranslation } = useQuestionTranslation();

  /* -------------------------------- */
  /* Navigation state                 */
  /* -------------------------------- */

  const subjectNameFromNavigation = location.state?.subjectName || "";

  const returnTo = location.state?.returnTo || "/trainer";

  const returnLabel = location.state?.returnLabel || "Till träning";

  /* -------------------------------- */
  /* Subject quiz                     */
  /* -------------------------------- */

  const quiz = useSubjectQuiz(subjectId, translationLanguage, 15);

  /* -------------------------------- */
  /* Subject name                     */
  /* -------------------------------- */

  const subjectName =
    quiz.currentQuestion?.Subject?.name ||
    subjectNameFromNavigation ||
    "Valt ämne";

  return (
    <>
      <TrainerHeader />

      <main className="subject-quiz">
        <div className="subject-quiz__container">
          {/* Back                             */}
          {/* -------------------------------- */}
          {/* <button
            className="subject-quiz__back"
            type="button"
            onClick={() => navigate(returnTo)}
          >
            ← {returnLabel}
          </button> */}

          {/* -------------------------------- */}
          {/* Heading                          */}
          {/* -------------------------------- */}

          <header className="subject-quiz__heading">
            <span>Träning efter ämne</span>

            <h1>{subjectName}</h1>
          </header>

          {/* -------------------------------- */}
          {/* Quiz                             */}
          {/* -------------------------------- */}

          <QuizRunner
            quiz={quiz}
            quizType="subject"
            cardClassName="subject-quiz__card demo-quiz__card"
            loadingText="Hämtar frågor..."
            emptyText="Det finns inga frågor för detta ämne ännu."
            translationLanguage={translationLanguage}
            showTranslation={showTranslation}
            resultState={{
              subjectId: Number(subjectId),
              subjectName,
              returnTo,
              returnLabel,
            }}
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

export default SubjectQuiz;
