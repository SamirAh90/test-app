import "./Stats.css";

import { useTranslation } from "react-i18next";

import useAnalyticsSection from "../../hooks/useAnalyticsSection";

function Stats() {
  const { t } = useTranslation();

  /* -------------------------------- */
  /* Analytics                        */
  /* -------------------------------- */

  const sectionRef = useAnalyticsSection("landing_stats_seen", {
    section: "stats",
  });

  return (
    <section ref={sectionRef} className="stats">
      <div className="stats__container">
        <div className="stats__item">
          <strong>~60</strong>

          <span>{t("stats.questions")}</span>
        </div>

        <div className="stats__item">
          <strong>90</strong>

          <span>{t("stats.minutes")}</span>
        </div>

        <div className="stats__item">
          <strong>4</strong>

          <span>{t("stats.answers")}</span>
        </div>

        <div className="stats__item">
          <strong>4</strong>

          <span>{t("stats.languages")}</span>
        </div>
      </div>
    </section>
  );
}

export default Stats;
