import "./AnnouncementBar.css";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from 'react';
import { getAnnouncement } from '../../services/announcementService';

function AnnouncementBar() {
  const { t } = useTranslation();
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    let active = true;
    let pending = false;
    async function refresh() {
      if (pending) return;
      pending = true;
      try {
        const response = await getAnnouncement();
        if (active) setEnabled(response.announcementEnabled);
      } catch {
        // Keep the last known state if the API is temporarily unavailable.
      } finally { pending = false; }
    }
    refresh();
    const interval = window.setInterval(refresh, 60000);
    window.addEventListener('focus', refresh);
    window.addEventListener('announcement-updated', refresh);
    return () => {
      active = false;
      window.clearInterval(interval);
      window.removeEventListener('focus', refresh);
      window.removeEventListener('announcement-updated', refresh);
    };
  }, []);

  if (!enabled) return null;

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
