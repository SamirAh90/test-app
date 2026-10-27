import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { useAuth } from "../../contexts/AuthContext";

import "./Login.css";

const initialFormData = {
  email: "",
  password: "",
};

function LoginSection() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] = useState(initialFormData);
  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  const destination = location.state?.from || "/min-traning";

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((currentData) => ({
      ...currentData,
      [name]: value,
    }));

    setFormErrors((currentErrors) => ({
      ...currentErrors,
      [name]: "",
    }));

    setMessage("");
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.email.trim()) {
      errors.email = "Ange din e-postadress.";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Ange en giltig e-postadress.";
    }

    if (!formData.password) {
      errors.password = "Ange ditt lösenord.";
    }

    return errors;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const errors = validateForm();

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    try {
      setSubmitting(true);
      setMessage("");

      await login({
        email: formData.email.trim(),
        password: formData.password,
      });

      navigate(destination, {
        replace: true,
      });
    } catch (error) {
      console.error("Login failed:", error);
      setMessage(error.message || "Inloggningen misslyckades.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="login-page">
      <div className="login-container">
        <section className="login-card">
          <div className="login-intro">
            <span className="login-eyebrow">Välkommen tillbaka</span>

            <h1>Logga in på MedborgaTest</h1>

            <p>Fortsätt där du slutade och se dina sparade resultat.</p>
          </div>

          <form className="login-form" onSubmit={handleSubmit} noValidate>
            <label className="login-field">
              <span>E-post</span>

              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                autoComplete="email"
                placeholder="din@email.se"
                aria-invalid={Boolean(formErrors.email)}
              />

              {formErrors.email && (
                <small className="login-field__error">{formErrors.email}</small>
              )}
            </label>

            <label className="login-field">
              <span>Lösenord</span>

              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                autoComplete="current-password"
                placeholder="Ditt lösenord"
                aria-invalid={Boolean(formErrors.password)}
              />

              {formErrors.password && (
                <small className="login-field__error">
                  {formErrors.password}
                </small>
              )}
            </label>

            <button
              className="login-button"
              type="submit"
              disabled={submitting}
            >
              {submitting ? "Loggar in..." : "Logga in"}
            </button>

            {message && (
              <p className="login-message" role="alert">
                {message}
              </p>
            )}
          </form>

          <p className="login-register">
            Har du inget konto?{" "}
            <button type="button" onClick={() => navigate("/register")}>
              Skapa gratis konto
            </button>
          </p>
        </section>

        <aside className="login-benefits">
          <span className="login-eyebrow">Ditt konto</span>

          <h2>All din träning på ett ställe</h2>

          <ul>
            <li>Se dina sparade resultat</li>
            <li>Fortsätt där du slutade</li>
            <li>Repetera tidigare fel</li>
          </ul>
        </aside>
      </div>
    </main>
  );
}

export default LoginSection;
