import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import "./GoogleSignIn.css";

let googleScript;
function loadGoogle() {
  if (window.google?.accounts?.id) return Promise.resolve();
  if (!googleScript) {
    googleScript = new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = "https://accounts.google.com/gsi/client?hl=sv";
      script.async = true;
      script.onload = resolve;
      script.onerror = () => { script.remove(); googleScript = null; reject(new Error("Google kunde inte laddas. Ladda om sidan eller använd e-post.")); };
      document.head.appendChild(script);
    });
  }
  return googleScript;
}

export default function GoogleSignIn() {
  const target = useRef(null);
  const busy = useRef(false);
  const { googleLogin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  // Keep the callback current without reinitializing Google's button on rerenders.
  const onCredential = useRef(null);
  onCredential.current = async ({ credential }) => {
    if (busy.current) return;
    busy.current = true;
    setLoading(true);
    setMessage("");
    try {
      await googleLogin(credential);
      navigate(location.state?.from || "/min-traning", { replace: true });
    } catch (error) {
      setMessage(error.message || "Google-inloggningen misslyckades.");
    } finally {
      busy.current = false;
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!clientId) return;
    let active = true;
    const element = target.current;
    loadGoogle().then(() => {
      if (!active) return;
      window.google.accounts.id.initialize({ client_id: clientId, callback: response => { if (active) onCredential.current(response); }, auto_select: false });
      window.google.accounts.id.renderButton(element, { type: "standard", theme: "outline", size: "large", text: "continue_with", locale: "sv", width: Math.min(element.clientWidth, 400) });
    }).catch(error => { if (active) setMessage(error.message); });
    return () => { active = false; element?.replaceChildren(); };
  }, [clientId]);

  return (
    <div className="google-sign-in" aria-busy={loading}>
      {clientId ? <div ref={target} className="google-sign-in__button" /> : (
        <>
          <button className="google-sign-in__placeholder" type="button" disabled>Fortsätt med Google</button>
          <p>Google-inloggning är ännu inte aktiverad. Använd e-post tills vidare.</p>
        </>
      )}
      {loading && <p role="status">Loggar in med Google...</p>}
      {message && <p role="alert">{message}</p>}
      <div className="google-sign-in__divider"><span>eller med e-post</span></div>
    </div>
  );
}
