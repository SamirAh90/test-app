import "./DemoQuestion.css";

import { useTranslation } from "react-i18next";

import useAnalyticsSection from "../../hooks/useAnalyticsSection";

function DemoQuestion() {
  const { t } = useTranslation();

  /* -------------------------------- */
  /* Analytics                        */
  /* -------------------------------- */

  const sectionRef = useAnalyticsSection("landing_demo_question_seen", {
    section: "demo_question",
  });

  return (
    <section ref={sectionRef} className="demo-question">
      <div className="demo-question__container">
        <div className="demo-question__content">
          <span className="demo-question__eyebrow">{t("demo.eyebrow")}</span>

          <h2>{t("demo.title")}</h2>

          <p>{t("demo.description")}</p>
        </div>

        <div className="demo-card">
          <div className="demo-card__top">
            <span>{t("demo.questionProgress")}</span>

            <button type="button" className="translation-button">
              {t("demo.showTranslation")}
            </button>
          </div>

          <small>{t("demo.subject")}</small>

          <h3>{t("demo.question")}</h3>

          <div className="demo-answer">A. {t("demo.answers.a")}</div>

          <div className="demo-answer demo-answer--correct">
            B. {t("demo.answers.b")}
          </div>

          <div className="demo-answer">C. {t("demo.answers.c")}</div>

          <div className="demo-answer">D. {t("demo.answers.d")}</div>

          <div className="demo-explanation">
            <strong>{t("demo.explanationTitle")}</strong>

            <p>{t("demo.explanation")}</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default DemoQuestion;
