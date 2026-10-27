import "./HowItWorks.css";

import { useTranslation } from "react-i18next";

import useAnalyticsSection from "../../hooks/useAnalyticsSection";

const stepKeys = ["one", "two", "three", "four"];

function HowItWorks() {
  const { t } = useTranslation();

  /* -------------------------------- */
  /* Analytics                        */
  /* -------------------------------- */

  const sectionRef = useAnalyticsSection("landing_how_it_works_seen", {
    section: "how_it_works",
  });

  return (
    <section ref={sectionRef} className="how-it-works">
      <div className="how-it-works__container">
        <div className="how-it-works__header">
          <span className="how-it-works__eyebrow">
            {t("howItWorks.eyebrow")}
          </span>

          <h2>{t("howItWorks.title")}</h2>

          <p>{t("howItWorks.description")}</p>
        </div>

        <div className="how-it-works__grid">
          {stepKeys.map((stepKey, index) => (
            <article className="how-it-works__card" key={stepKey}>
              <span className="how-it-works__number">
                {String(index + 1).padStart(2, "0")}
              </span>

              <h3>{t(`howItWorks.steps.${stepKey}.title`)}</h3>

              <p>{t(`howItWorks.steps.${stepKey}.description`)}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default HowItWorks;
