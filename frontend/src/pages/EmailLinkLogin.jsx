import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import "../sections/Login/Login.css";

export default function EmailLinkLogin() {
  const [token] = useState(() => window.location.hash.slice(1));
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const { emailLinkLogin } = useAuth();
  const navigate = useNavigate();
  const validFormat = /^[a-f0-9]{64}$/.test(token);

  async function confirmLogin() {
    setBusy(true);
    setMessage("");
    try {
      await emailLinkLogin(token);
      navigate("/min-traning", { replace: true });
    } catch (error) {
      setMessage(error instanceof TypeError ? "Kunde inte ansluta till servern. Försök igen." : error.message);
    } finally { setBusy(false); }
  }

  return (
    <main className="login-page">
      <section className="login-card login-email-confirm">
        <div className="login-intro">
          <h1>Logga in med e-postlänk</h1>
          <p>{validFormat ? "Tryck på knappen för att logga in. Fortsätt bara om du själv begärde den här länken." : "Länken saknas eller är ogiltig. Begär en ny inloggningslänk."}</p>
        </div>
        {validFormat && <button className="login-button" type="button" onClick={confirmLogin} disabled={busy}>{busy ? "Loggar in..." : "Logga in"}</button>}
        {message && <p className="login-message" role="alert">{message}</p>}
        <p><Link to="/login" replace>Gå till inloggningen och begär en ny länk</Link></p>
      </section>
    </main>
  );
}
