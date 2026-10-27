import "./FAQ.css";

import { useTranslation } from "react-i18next";

import useAnalyticsSection from "../../hooks/useAnalyticsSection";

const faqKeys = ["whatIs", "languages", "subjects", "feedback", "simulator"];

function FAQ() {
  const { t } = useTranslation();

  /* -------------------------------- */
  /* Analytics                        */
  /* -------------------------------- */

  const sectionRef = useAnalyticsSection("landing_faq_seen", {
    section: "faq",
  });

  return (
    <section ref={sectionRef} className="faq">
      <div className="faq__container">
        <div className="faq__header">
          <span className="faq__eyebrow">{t("faq.eyebrow")}</span>

          <h2>{t("faq.title")}</h2>

          <p>{t("faq.description")}</p>
        </div>

        <div className="faq__list">
          {faqKeys.map((faqKey) => (
            <details className="faq__item" key={faqKey}>
              <summary>{t(`faq.items.${faqKey}.question`)}</summary>

              <p>{t(`faq.items.${faqKey}.answer`)}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

export default FAQ;
