import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../contexts/AuthContext";

import { getSimulatorSession } from "../services/api";

import AppHeader from "../components/AppHeader/AppHeader";
import SimulatorRunner from "../components/Simulator/SimulatorRunner";

import "../sections/DemoQuiz/DemoQuiz.css";

function Simulator() {
  const navigate = useNavigate();

  const { token } = useAuth();

  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [simulatorStarted, setSimulatorStarted] = useState(false);

  /* -------------------------------- */
  /* Load simulator data             */
  /* -------------------------------- */

  useEffect(() => {
    async function loadSimulator() {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setLoadError("");

        const response = await getSimulatorSession(token);

        setSession(response);
      } catch (requestError) {
        console.error("Could not load simulator:", requestError);

        setLoadError(
          requestError.response?.data?.message ||
            requestError.message ||
            "Provsimulatorn kunde inte laddas.",
        );
      } finally {
        setLoading(false);
      }
    }

    loadSimulator();
  }, [token]);

  /* -------------------------------- */
  /* Start simulator                 */
  /* -------------------------------- */

  const handleStartSimulator = () => {
    if (!session?.questions?.length) {
      return;
    }

    setSimulatorStarted(true);
  };

  /* -------------------------------- */
  /* Result metadata                 */
  /* -------------------------------- */

  const resultState = useMemo(
    () => ({
      simulatorDurationMinutes: session?.durationMinutes || 90,

      simulatorTotalBankQuestions: session?.totalBankQuestions || 0,
    }),
    [session],
  );

  /* -------------------------------- */
  /* Shared styles                   */
  /* -------------------------------- */

  const backButtonStyle = {
    display: "inline-flex",
    alignItems: "center",
    gap: "7px",
    marginBottom: "20px",
    padding: "9px 13px",
    border: "1px solid #d9e2e8",
    borderRadius: "9px",
    background: "#ffffff",
    color: "#334155",
    fontSize: "13px",
    fontWeight: "700",
    cursor: "pointer",
  };

  const infoCardStyle = {
    padding: "28px",
    marginBottom: "22px",
  };

  const metaRowStyle = {
    display: "flex",
    flexWrap: "wrap",
    gap: "8px",
    marginTop: "18px",
  };

  const metaItemStyle = {
    padding: "7px 10px",
    border: "1px solid #dbe4ea",
    borderRadius: "8px",
    background: "#f8fafb",
    color: "#475569",
    fontSize: "13px",
    fontWeight: "700",
  };

  const startButtonStyle = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    marginTop: "20px",
    padding: "11px 18px",
    border: "1px solid #b9ded4",
    borderRadius: "9px",
    background: "#edf8f5",
    color: "#176b5b",
    fontSize: "14px",
    fontWeight: "800",
    cursor: "pointer",
  };

  const activeStatusStyle = {
    display: "inline-flex",
    alignItems: "center",
    gap: "7px",
    marginTop: "20px",
    padding: "8px 12px",
    border: "1px solid #d5e5df",
    borderRadius: "9px",
    background: "#f5faf8",
    color: "#2f7668",
    fontSize: "13px",
    fontWeight: "800",
  };

  /* -------------------------------- */
  /* Loading                         */
  /* -------------------------------- */

  if (loading) {
    return (
      <>
        <AppHeader />

        <main className="demo-quiz">
          <div className="demo-quiz__container">
            <section className="demo-quiz__card" style={infoCardStyle}>
              <h1>Provsimulator</h1>

              <p>Förbereder provsimulatorn...</p>
            </section>
          </div>
        </main>
      </>
    );
  }

  /* -------------------------------- */
  /* Error                           */
  /* -------------------------------- */

  if (loadError) {
    return (
      <>
        <AppHeader />

        <main className="demo-quiz">
          <div className="demo-quiz__container">
            <button
              type="button"
              style={backButtonStyle}
              onClick={() => navigate("/min-traning")}
            >
              ← Till Min träning
            </button>

            <section className="demo-quiz__card" style={infoCardStyle}>
              <h1>Provsimulatorn kunde inte startas</h1>

              <p>{loadError}</p>
            </section>
          </div>
        </main>
      </>
    );
  }

  if (!session) {
    return null;
  }

  /* -------------------------------- */
  /* Simulator page                  */
  /* -------------------------------- */

  return (
    <>
      <AppHeader />

      <main className="demo-quiz">
        <div className="demo-quiz__container">
          <button
            type="button"
            style={backButtonStyle}
            onClick={() => navigate("/min-traning")}
          >
            ← Till Min träning
          </button>

          {/* -------------------------------- */}
          {/* Permanent simulator info         */}
          {/* -------------------------------- */}

          <section className="demo-quiz__card" style={infoCardStyle}>
            <span
              style={{
                display: "block",
                marginBottom: "6px",
                color: "#64748b",
                fontSize: "12px",
                fontWeight: "700",
                textTransform: "uppercase",
                letterSpacing: "0.04em",
              }}
            >
              Premium
            </span>

            <h1
              style={{
                margin: "0 0 10px",
                color: "#0f172a",
                fontSize: "30px",
              }}
            >
              Provsimulator
            </h1>

            <p
              style={{
                margin: 0,
                maxWidth: "720px",
                color: "#64748b",
                lineHeight: "1.65",
              }}
            >
              Träningssimulator som efterliknar provets upplägg.
            </p>

            <div style={metaRowStyle}>
              <span style={metaItemStyle}>60 frågor</span>

              <span style={metaItemStyle}>90 minuter</span>

              <span style={metaItemStyle}>4 svarsalternativ</span>

              <span style={metaItemStyle}>1 rätt svar</span>
            </div>

            <p
              style={{
                margin: "16px 0 0",
                maxWidth: "720px",
                color: "#64748b",
                lineHeight: "1.6",
              }}
            >
              Du kan hoppa över frågor och gå tillbaka innan du lämnar in.
            </p>

            <p
              style={{
                margin: "8px 0 0",
                color: "#64748b",
                fontSize: "13px",
              }}
            >
              Frågebanken innehåller just nu{" "}
              <strong>{session.totalBankQuestions}</strong> frågor.
            </p>

            {!simulatorStarted ? (
              <button
                type="button"
                style={startButtonStyle}
                disabled={!session.questions?.length}
                onClick={handleStartSimulator}
              >
                Starta provsimulator
              </button>
            ) : (
              <span style={activeStatusStyle}>● Provet pågår</span>
            )}
          </section>

          {/* -------------------------------- */}
          {/* Exam appears below               */}
          {/* -------------------------------- */}

          {simulatorStarted && (
            <div
              style={{
                marginTop: "22px",
              }}
            >
              <SimulatorRunner
                questions={session.questions}
                durationMinutes={session.durationMinutes || 90}
                resultState={resultState}
              />
            </div>
          )}
        </div>
      </main>
    </>
  );
}

export default Simulator;
