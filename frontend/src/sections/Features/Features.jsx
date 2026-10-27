import "./Features.css";

import { useTranslation } from "react-i18next";

import useAnalyticsSection from "../../hooks/useAnalyticsSection";

const featureKeys = [
  {
    key: "translations",
    icon: "🌐",
  },
  {
    key: "feedback",
    icon: "✓",
  },
  {
    key: "subjects",
    icon: "📚",
  },
  {
    key: "progress",
    icon: "📊",
  },
  {
    key: "simulator",
    icon: "⏱️",
  },
  {
    key: "repeat",
    icon: "🔁",
  },
];

function Features() {
  const { t } = useTranslation();

  /* -------------------------------- */
  /* Analytics                        */
  /* -------------------------------- */

  const sectionRef = useAnalyticsSection("landing_features_seen", {
    section: "features",
  });

  return (
    <section ref={sectionRef} className="features">
      <div className="features__container">
        <div className="features__header">
          <span className="features__eyebrow">{t("features.eyebrow")}</span>

          <h2>{t("features.title")}</h2>

          <p>{t("features.description")}</p>
        </div>

        <div className="features__grid">
          {featureKeys.map((feature) => (
            <article className="features__card" key={feature.key}>
              <div className="features__icon">{feature.icon}</div>

              <h3>{t(`features.items.${feature.key}.title`)}</h3>

              <p>{t(`features.items.${feature.key}.description`)}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Features;
