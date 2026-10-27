import "./CTA.css";

import { useTranslation } from "react-i18next";

import useAnalyticsSection from "../../hooks/useAnalyticsSection";

function CTA() {
  const { t } = useTranslation();

  /* -------------------------------- */
  /* Analytics                        */
  /* -------------------------------- */

  const sectionRef = useAnalyticsSection("landing_cta_seen", {
    section: "cta",
  });

  return (
    <section ref={sectionRef} className="cta">
      <div className="cta__container">
        <div className="cta__content">
          <span className="cta__eyebrow">{t("cta.eyebrow")}</span>

          <h2>{t("cta.title")}</h2>

          <p>{t("cta.description")}</p>
        </div>

        <div className="cta__actions">
          <button type="button" className="cta__primary">
            {t("cta.primaryButton")} →
          </button>

          <button type="button" className="cta__secondary">
            {t("cta.secondaryButton")}
          </button>
        </div>
      </div>
    </section>
  );
}

export default CTA;
