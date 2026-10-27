import "./Disclaimer.css";

import { useTranslation } from "react-i18next";

import useAnalyticsSection from "../../hooks/useAnalyticsSection";

function Disclaimer() {
  const { t } = useTranslation();

  /* -------------------------------- */
  /* Analytics                        */
  /* -------------------------------- */

  const sectionRef = useAnalyticsSection("landing_disclaimer_seen", {
    section: "disclaimer",
  });

  return (
    <section ref={sectionRef} className="disclaimer">
      <div className="disclaimer__container">
        <div className="disclaimer__header">
          <span className="disclaimer__eyebrow">{t("disclaimer.eyebrow")}</span>

          <h2>{t("disclaimer.title")}</h2>
        </div>

        <div className="disclaimer__content">
          <p>{t("disclaimer.paragraph1")}</p>

          <p>{t("disclaimer.paragraph2")}</p>

          <p>{t("disclaimer.paragraph3")}</p>

          <p>{t("disclaimer.paragraph4")}</p>
        </div>
      </div>
    </section>
  );
}

export default Disclaimer;
