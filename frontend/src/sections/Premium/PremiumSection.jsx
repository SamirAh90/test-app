import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../../contexts/AuthContext";
import usePaymentSettings from "../../hooks/usePaymentSettings";

import {
  createCheckoutSession,
  redeemPremiumCode,
  validateCoupon,
  validatePremiumCode,
} from "../../services/api";

import "./Premium.css";

function formatMoney(amountInOre) {
  const amount = Number(amountInOre || 0) / 100;

  return `${new Intl.NumberFormat("sv-SE", {
    maximumFractionDigits: 2,
  }).format(amount)} kr`;
}

function PremiumSection() {
  const navigate = useNavigate();

  const { user, token, isAuthenticated, refreshUser } = useAuth();

  const {
    paymentSettings,
    formattedPremiumPrice,
    paymentMethods,
    loading: paymentSettingsLoading,
  } = usePaymentSettings();

  const [couponCode, setCouponCode] = useState("");
  const [couponResult, setCouponResult] = useState(null);
  const [couponError, setCouponError] = useState("");
  const [couponLoading, setCouponLoading] = useState(false);

  const [premiumCode, setPremiumCode] = useState("");
  const [premiumCodeResult, setPremiumCodeResult] = useState(null);
  const [premiumCodeError, setPremiumCodeError] = useState("");
  const [premiumCodeLoading, setPremiumCodeLoading] = useState(false);
  const [premiumCodeRedeeming, setPremiumCodeRedeeming] = useState(false);

  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [checkoutError, setCheckoutError] = useState("");

  const isPremiumUser = isAuthenticated && Boolean(user?.isPremium);

  useEffect(() => {
    if (isPremiumUser) {
      navigate("/trainer", {
        replace: true,
      });
    }
  }, [isPremiumUser, navigate]);

  const enabledPaymentMethods = useMemo(() => {
    const methods = [];

    if (paymentMethods.card) {
      methods.push("Kort");
    }

    if (paymentMethods.swish) {
      methods.push("Swish");
    }

    if (paymentMethods.klarna) {
      methods.push("Klarna");
    }

    return methods;
  }, [paymentMethods]);

  const originalPrice =
    couponResult?.pricing?.originalPrice ?? paymentSettings?.premiumPrice ?? 0;

  const finalPrice =
    couponResult?.pricing?.finalPrice ?? paymentSettings?.premiumPrice ?? 0;

  const discountAmount = couponResult?.pricing?.discountAmount ?? 0;

  const handleValidateCoupon = async () => {
    const normalizedCode = couponCode.trim();

    if (!normalizedCode) {
      setCouponError("Ange en rabattkod.");
      setCouponResult(null);
      return;
    }

    try {
      setCouponLoading(true);
      setCouponError("");
      setCouponResult(null);
      setCheckoutError("");

      const response = await validateCoupon(normalizedCode);

      setCouponResult(response);
    } catch (error) {
      console.error("Could not validate coupon:", error);

      setCouponError(
        error.response?.data?.message ||
          error.message ||
          "Rabattkoden kunde inte kontrolleras.",
      );
    } finally {
      setCouponLoading(false);
    }
  };

  const handleRemoveCoupon = () => {
    setCouponCode("");
    setCouponResult(null);
    setCouponError("");
    setCheckoutError("");
  };

  const handleValidatePremiumCode = async () => {
    const normalizedCode = premiumCode.trim();

    if (!normalizedCode) {
      setPremiumCodeError("Ange en premiumkod.");
      setPremiumCodeResult(null);
      return;
    }

    try {
      setPremiumCodeLoading(true);
      setPremiumCodeError("");
      setPremiumCodeResult(null);

      const response = await validatePremiumCode(normalizedCode);

      setPremiumCodeResult(response);
    } catch (error) {
      console.error("Could not validate premium code:", error);

      setPremiumCodeError(
        error.response?.data?.message ||
          error.message ||
          "Premiumkoden kunde inte kontrolleras.",
      );
    } finally {
      setPremiumCodeLoading(false);
    }
  };

  const handleRedeemPremiumCode = async () => {
    const normalizedCode = premiumCode.trim();

    if (!normalizedCode) {
      setPremiumCodeError("Ange en premiumkod.");
      return;
    }

    if (!isAuthenticated || !token) {
      navigate("/login", {
        state: {
          from: "/premium",
        },
      });

      return;
    }

    try {
      setPremiumCodeRedeeming(true);
      setPremiumCodeError("");

      await redeemPremiumCode(normalizedCode, token);

      await refreshUser();

      navigate("/trainer", {
        replace: true,
      });
    } catch (error) {
      console.error("Could not redeem premium code:", error);

      setPremiumCodeError(
        error.response?.data?.message ||
          error.message ||
          "Premiumkoden kunde inte aktiveras.",
      );
    } finally {
      setPremiumCodeRedeeming(false);
    }
  };

  // const handleCheckout = async () => {
  //   if (!isAuthenticated || !token) {
  //     navigate("/login", {
  //       state: {
  //         from: "/premium",
  //       },
  //     });

  //     return;
  //   }

  //   try {
  //     setCheckoutLoading(true);
  //     setCheckoutError("");

  //     const response = await createCheckoutSession(
  //       token,
  //       couponResult?.valid ? couponResult.coupon.code : "",
  //     );

  //     if (!response.checkoutUrl) {
  //       throw new Error("Betalningslänken kunde inte skapas.");
  //     }

  //     window.location.href = response.checkoutUrl;
  //   } catch (error) {
  //     console.error("Could not start Stripe Checkout:", error);

  //     setCheckoutError(
  //       error.response?.data?.message ||
  //         error.message ||
  //         "Betalningen kunde inte startas.",
  //     );
  //   } finally {
  //     setCheckoutLoading(false);
  //   }
  // };

  const handleCheckout = () => {
    if (!isAuthenticated || !token) {
      navigate("/login", {
        state: {
          from: "/premium",
        },
      });

      return;
    }

    setCheckoutError(
      "Betalning är inte aktiverad ännu. MedborgaTest Premium öppnar för köp snart.",
    );
  };

  if (isPremiumUser) {
    return null;
  }

  return (
    <main className="premium-page">
      <div className="premium-container">
        <section className="premium-hero">
          <span className="premium-eyebrow">Full tillgång</span>

          <h1>Lås upp hela MedborgaTest</h1>

          <p>
            Betala en gång och få full tillgång till MedborgaTest utan löpande
            abonnemang.
          </p>
        </section>

        <div className="premium-layout">
          <section className="premium-main">
            <article className="premium-card premium-benefits">
              <span className="premium-card__label">MedborgaTest Premium</span>

              <h2>Allt du behöver för att förbereda dig</h2>

              <div className="premium-feature-list">
                <div>
                  <span>✓</span>
                  <strong>Hela frågebanken</strong>
                </div>

                <div>
                  <span>✓</span>
                  <strong>Smart träning</strong>
                </div>

                <div>
                  <span>✓</span>
                  <strong>Provsimulator</strong>
                </div>

                <div>
                  <span>✓</span>
                  <strong>Repetera fel</strong>
                </div>

                <div>
                  <span>✓</span>
                  <strong>Statistik och framsteg</strong>
                </div>

                <div>
                  <span>✓</span>
                  <strong>Framtida uppdateringar</strong>
                </div>
              </div>
            </article>

            <article className="premium-card">
              <div className="premium-card__heading">
                <div>
                  <span className="premium-card__label">Rabattkod</span>

                  <h2>Har du en rabattkod?</h2>
                </div>
              </div>

              <div className="premium-code-row">
                <input
                  type="text"
                  value={couponCode}
                  placeholder="Ange rabattkod"
                  onChange={(event) => {
                    setCouponCode(event.target.value.toUpperCase());

                    setCouponError("");
                    setCheckoutError("");

                    if (couponResult) {
                      setCouponResult(null);
                    }
                  }}
                />

                <button
                  type="button"
                  onClick={handleValidateCoupon}
                  disabled={couponLoading}
                >
                  {couponLoading ? "Kontrollerar..." : "Använd"}
                </button>
              </div>

              {couponError && (
                <p className="premium-message premium-message--error">
                  {couponError}
                </p>
              )}

              {couponResult?.valid && (
                <div className="premium-code-success">
                  <div>
                    <strong>Rabattkod {couponResult.coupon.code}</strong>

                    <span>Rabatten har lagts till.</span>
                  </div>

                  <button type="button" onClick={handleRemoveCoupon}>
                    Ta bort
                  </button>
                </div>
              )}
            </article>

            <article className="premium-card">
              <div className="premium-card__heading">
                <div>
                  <span className="premium-card__label">Premiumkod</span>

                  <h2>Har du en Premiumkod?</h2>
                </div>
              </div>

              <p className="premium-card__description">
                En giltig Premiumkod kan ge dig full tillgång utan betalning.
              </p>

              <div className="premium-code-row">
                <input
                  type="text"
                  value={premiumCode}
                  placeholder="Ange Premiumkod"
                  onChange={(event) => {
                    setPremiumCode(event.target.value.toUpperCase());

                    setPremiumCodeError("");
                    setPremiumCodeResult(null);
                  }}
                />

                <button
                  type="button"
                  onClick={handleValidatePremiumCode}
                  disabled={premiumCodeLoading}
                >
                  {premiumCodeLoading ? "Kontrollerar..." : "Kontrollera"}
                </button>
              </div>

              {premiumCodeError && (
                <p className="premium-message premium-message--error">
                  {premiumCodeError}
                </p>
              )}

              {premiumCodeResult?.valid && (
                <div className="premium-code-success">
                  <div>
                    <strong>Premiumkod godkänd</strong>

                    <span>
                      {isAuthenticated
                        ? "Koden är giltig och kan aktiveras på ditt konto."
                        : "Logga in eller skapa konto för att aktivera koden."}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={handleRedeemPremiumCode}
                    disabled={premiumCodeRedeeming}
                  >
                    {premiumCodeRedeeming
                      ? "Aktiverar..."
                      : isAuthenticated
                        ? "Aktivera Premium"
                        : "Logga in"}
                  </button>
                </div>
              )}
            </article>
          </section>

          <aside className="premium-summary">
            <div className="premium-summary__top">
              <span>Full tillgång</span>

              <strong>
                {paymentSettingsLoading ? "..." : formattedPremiumPrice}
              </strong>

              <small>Engångsbetalning · Livstidsåtkomst</small>
            </div>

            {couponResult?.valid && (
              <div className="premium-price-breakdown">
                <div>
                  <span>Ordinarie pris</span>

                  <strong>{formatMoney(originalPrice)}</strong>
                </div>

                <div>
                  <span>Rabatt</span>

                  <strong>-{formatMoney(discountAmount)}</strong>
                </div>

                <div className="premium-price-breakdown__total">
                  <span>Att betala</span>

                  <strong>{formatMoney(finalPrice)}</strong>
                </div>
              </div>
            )}

            <div className="premium-summary__payments">
              <span className="premium-summary__label">Betalsätt</span>

              <div>
                {enabledPaymentMethods.map((method) => (
                  <span className="premium-payment-method" key={method}>
                    {method}
                  </span>
                ))}
              </div>
            </div>

            <button
              type="button"
              className="premium-checkout-button"
              onClick={handleCheckout}
              disabled={
                checkoutLoading ||
                paymentSettingsLoading ||
                enabledPaymentMethods.length === 0
              }
            >
              {checkoutLoading
                ? "Startar betalning..."
                : isAuthenticated
                  ? `Köp full tillgång ${
                      couponResult?.valid
                        ? `för ${formatMoney(finalPrice)}`
                        : ""
                    }`
                  : "Logga in för att köpa"}
            </button>

            {checkoutError && (
              <p className="premium-message premium-message--error">
                {checkoutError}
              </p>
            )}

            {!isAuthenticated && (
              <p className="premium-login-note">
                Du behöver ett konto för att koppla Premium till dig.
              </p>
            )}

            <div className="premium-summary__security">
              <span>✓ Säker betalning</span>
              <span>✓ Engångsbetalning</span>
              <span>✓ Livstidsåtkomst</span>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}

export default PremiumSection;
