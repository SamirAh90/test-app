import "./Hero.css";

import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import { trackEvent } from "../../services/analyticsService";

import useAnalyticsSection from "../../hooks/useAnalyticsSection";

function Hero() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const sectionRef = useAnalyticsSection("landing_hero_seen", {
    section: "hero",
  });

  const handleStartTraining = () => {
    trackEvent("hero_start_training_clicked", {
      button: "primary",
      destination: "/trainer/demo",
      language: i18n.language,
    });

    navigate("/trainer/demo");
  };

  const handleOpenStudyMaterial = () => {
    trackEvent("hero_study_material_clicked", {
      button: "secondary",
      destination: "/studiematerial",
      language: i18n.language,
    });

    navigate("/studiematerial");
  };

  return (
    <section className="hero">
      <div className="hero-container">
        <div className="hero-content">
          <span className="hero-badge">🇸🇪 {t("hero.badge")}</span>

          <h1>
            {t("hero.titleLine1")}
            <br />
            {t("hero.titleLine2")}
          </h1>

          <p>{t("hero.description")}</p>

          <div className="hero-actions">
            <button
              type="button"
              className="primary-button"
              onClick={handleStartTraining}
            >
              {t("hero.primaryButton")} →
            </button>

            <button
              type="button"
              className="secondary-button"
              onClick={handleOpenStudyMaterial}
            >
              {t("hero.secondaryButton")}
            </button>
          </div>
        </div>

        <div className="hero-card">
          <span className="hero-card-label">{t("hero.previewSubject")}</span>

          <h2>{t("hero.previewQuestion")}</h2>

          <div className="hero-answer">A. {t("hero.previewAnswers.a")}</div>

          <div className="hero-answer hero-answer-selected">
            B. {t("hero.previewAnswers.b")}
          </div>

          <div className="hero-answer">C. {t("hero.previewAnswers.c")}</div>

          <div className="hero-answer">D. {t("hero.previewAnswers.d")}</div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
