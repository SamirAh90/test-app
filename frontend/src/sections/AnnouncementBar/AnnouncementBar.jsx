import "./AnnouncementBar.css";
import { useTranslation } from "react-i18next";

function AnnouncementBar() {
  const { t } = useTranslation();

  return (
    <section className="announcement-bar">
      <div className="announcement-bar__container">
        <span className="announcement-bar__badge">
          🇸🇪 {t("announcement.badge")}
        </span>

        <p>{t("announcement.text")}</p>
      </div>
    </section>
  );
}

export default AnnouncementBar;
