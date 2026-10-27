import "./Footer.css";
import logo from "../../assets/logo.png";
import { useTranslation } from "react-i18next";

function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="footer">
      <div className="footer__container">
        <div className="footer__brand">
          <div className="footer__logo">
            <img src={logo} alt="MedborgaTest logo" />

            <div>
              <strong>MedborgaTest</strong>
              <span>{t("navbar.brandSubtitle")}</span>
            </div>
          </div>

          <p>{t("footer.description")}</p>
        </div>

        <div className="footer__links">
          <div>
            <h3>{t("footer.sections.practice.title")}</h3>
            <a href="#">{t("footer.sections.practice.subjects")}</a>
            <a href="#">{t("footer.sections.practice.start")}</a>
            <a href="#">{t("footer.sections.practice.simulator")}</a>
            <a href="#">{t("footer.sections.practice.repeat")}</a>
          </div>

          <div>
            <h3>{t("footer.sections.about.title")}</h3>
            <a href="#">{t("footer.sections.about.service")}</a>
            <a href="#">{t("footer.sections.about.test")}</a>
            <a href="#">{t("footer.sections.about.faq")}</a>
            <a href="#">{t("footer.sections.about.contact")}</a>
          </div>

          <div>
            <h3>{t("footer.sections.legal.title")}</h3>
            <a href="#">{t("footer.sections.legal.privacy")}</a>
            <a href="#">{t("footer.sections.legal.terms")}</a>
            <a href="#">{t("footer.sections.legal.cookies")}</a>
          </div>
        </div>
      </div>

      <div className="footer__bottom">
        <div className="footer__bottom-container">
          <span>{t("footer.copyright")}</span>
          <span>{t("footer.independent")}</span>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
