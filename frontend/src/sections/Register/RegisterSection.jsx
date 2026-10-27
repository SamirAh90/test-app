import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { saveQuizAttempt } from "../../services/progressService";
import { useAuth } from "../../contexts/AuthContext";

import "./Register.css";

const initialFormData = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
};

function RegisterSection() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState(initialFormData);
  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");

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

    if (!formData.firstName.trim()) {
      errors.firstName = "Ange ditt förnamn.";
    }

    if (!formData.lastName.trim()) {
      errors.lastName = "Ange ditt efternamn.";
    }

    if (!formData.email.trim()) {
      errors.email = "Ange din e-postadress.";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Ange en giltig e-postadress.";
    }

    if (!formData.password) {
      errors.password = "Ange ett lösenord.";
    } else if (formData.password.length < 8) {
      errors.password = "Lösenordet måste innehålla minst 8 tecken.";
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

      const response = await register({
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.trim(),
        password: formData.password,
      });

      const savedDemoResult = localStorage.getItem("medborgatest_demo_result");

      if (savedDemoResult) {
        try {
          const demoResult = JSON.parse(savedDemoResult);

          await saveQuizAttempt(response.token, {
            quizType: demoResult.quizType || "demo",
            score: demoResult.score,
            totalQuestions: demoResult.totalQuestions,
            percentage: demoResult.percentage,
            answers: Array.isArray(demoResult.answers)
              ? demoResult.answers
              : [],
          });

          localStorage.removeItem("medborgatest_demo_result");
        } catch (syncError) {
          console.error("Could not sync demo result:", syncError);
        }
      }

      setFormData(initialFormData);
      setFormErrors({});

      navigate("/min-traning");
    } catch (error) {
      console.error("Registration failed:", error);

      setMessage(error.message || "Kontot kunde inte skapas.");
    } finally {
      setSubmitting(false);
    }
  };
  return (
    <main className="register-page">
      <div className="register-container">
        <section className="register-card">
          <div className="register-intro">
            <span className="register-eyebrow">Gratis konto</span>

            <h1>Fortsätt träna med MedborgaTest</h1>

            <p>
              Skapa ett gratis konto för att spara ditt resultat och få tillgång
              till fler frågor.
            </p>
          </div>

          <form className="register-form" onSubmit={handleSubmit} noValidate>
            <label className="register-field">
              <span>Förnamn</span>

              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                autoComplete="given-name"
                placeholder="Ditt förnamn"
                aria-invalid={Boolean(formErrors.firstName)}
              />

              {formErrors.firstName && (
                <small className="register-field__error">
                  {formErrors.firstName}
                </small>
              )}
            </label>

            <label className="register-field">
              <span>Efternamn</span>

              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                autoComplete="family-name"
                placeholder="Ditt efternamn"
                aria-invalid={Boolean(formErrors.lastName)}
              />

              {formErrors.lastName && (
                <small className="register-field__error">
                  {formErrors.lastName}
                </small>
              )}
            </label>

            <label className="register-field register-field--full">
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
                <small className="register-field__error">
                  {formErrors.email}
                </small>
              )}
            </label>

            <label className="register-field register-field--full">
              <span>Lösenord</span>

              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                autoComplete="new-password"
                placeholder="Minst 8 tecken"
                aria-invalid={Boolean(formErrors.password)}
              />

              {formErrors.password && (
                <small className="register-field__error">
                  {formErrors.password}
                </small>
              )}
            </label>

            <button
              className="register-button"
              type="submit"
              disabled={submitting}
            >
              {submitting ? "Skapar konto..." : "Skapa gratis konto"}
            </button>

            {message && (
              <p className="register-message" role="alert">
                {message}
              </p>
            )}
          </form>

          <p className="register-login">
            Har du redan ett konto? <Link to="/login">Logga in</Link>
          </p>
        </section>

        <aside className="register-benefits">
          <span className="register-eyebrow">Det här ingår</span>

          <h2>Fortsätt där demot slutade</h2>

          <ul>
            <li>49 fler gratis frågor</li>
            <li>Spara dina resultat</li>
            <li>Repetera felaktiga svar</li>
          </ul>
        </aside>
      </div>
    </main>
  );
}

export default RegisterSection;
