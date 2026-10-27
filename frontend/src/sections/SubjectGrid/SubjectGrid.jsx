import "./SubjectGrid.css";

import { useTranslation } from "react-i18next";

import useAnalyticsSection from "../../hooks/useAnalyticsSection";

const subjectKeys = [
  "country",
  "democracy",
  "government",
  "elections",
  "law",
  "media",
];

function SubjectGrid() {
  const { t } = useTranslation();

  /* -------------------------------- */
  /* Analytics                        */
  /* -------------------------------- */

  const sectionRef = useAnalyticsSection("landing_subjects_seen", {
    section: "subjects",
  });

  return (
    <section ref={sectionRef} className="subject-grid-section">
      <div className="subject-grid-container">
        <div className="subject-grid-header">
          <span className="subject-grid-eyebrow">{t("subjects.eyebrow")}</span>

          <h2>{t("subjects.title")}</h2>

          <p>{t("subjects.description")}</p>
        </div>

        <div className="subject-grid">
          {subjectKeys.map((subjectKey, index) => (
            <article className="subject-card" key={subjectKey}>
              <div className="subject-card-number">
                {String(index + 1).padStart(2, "0")}
              </div>

              <h3>{t(`subjects.items.${subjectKey}.name`)}</h3>

              <p>{t(`subjects.items.${subjectKey}.description`)}</p>

              <button type="button" className="subject-card-button">
                {t("subjects.start")} →
              </button>
            </article>
          ))}
        </div>

        <div className="subject-grid-footer">
          <button type="button" className="subject-grid-all-button">
            {t("subjects.showAll")}
          </button>
        </div>
      </div>
    </section>
  );
}

export default SubjectGrid;
