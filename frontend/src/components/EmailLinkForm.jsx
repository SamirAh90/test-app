import { useState } from "react";
import { requestEmailLink } from "../services/authService";

export default function EmailLinkForm() {
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [failed, setFailed] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setBusy(true);
    setMessage("");
    setFailed(false);
    try {
      const response = await requestEmailLink(email.trim());
      setMessage(response.message);
    } catch (error) {
      setFailed(true);
      setMessage(error instanceof TypeError ? "Kunde inte ansluta till servern. Försök igen senare." : error.message);
    } finally { setBusy(false); }
  }

  return (
    <details className="login-email-link">
      <summary>Logga in utan lösenord</summary>
      <p>Ange din registrerade e-postadress så skickar vi en engångslänk. Du behöver inget lösenord.</p>
      <form className="login-form" onSubmit={handleSubmit}>
        <label className="login-field">
          <span>E-post för inloggningslänk</span>
          <input type="email" autoComplete="email" value={email} onChange={event => setEmail(event.target.value)} required maxLength={254} placeholder="din@email.se" />
        </label>
        <button className="login-button" type="submit" disabled={busy}>{busy ? "Begär länk..." : "Skicka inloggningslänk"}</button>
        {message && <p className={failed ? "login-message" : "login-email-link__status"} role={failed ? "alert" : "status"}>{message}</p>}
      </form>
    </details>
  );
}
