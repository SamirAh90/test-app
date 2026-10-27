import { useCallback, useEffect, useMemo, useState } from "react";

import { getPaymentSettings } from "../services/api";

function usePaymentSettings() {
  const [paymentSettings, setPaymentSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadPaymentSettings = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getPaymentSettings();

      setPaymentSettings(response);
    } catch (requestError) {
      console.error("Could not load payment settings:", requestError);

      setError(
        requestError.message || "Betalningsinformationen kunde inte hämtas.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPaymentSettings();
  }, [loadPaymentSettings]);

  const premiumPrice = useMemo(() => {
    return Number(paymentSettings?.premiumPrice || 0) / 100;
  }, [paymentSettings]);

  const formattedPremiumPrice = useMemo(() => {
    if (premiumPrice <= 0) {
      return "—";
    }

    return `${new Intl.NumberFormat("sv-SE").format(premiumPrice)} kr`;
  }, [premiumPrice]);

  const paymentMethods = useMemo(
    () => ({
      card: paymentSettings?.paymentMethods?.card ?? false,
      swish: paymentSettings?.paymentMethods?.swish ?? false,
      klarna: paymentSettings?.paymentMethods?.klarna ?? false,
    }),
    [paymentSettings],
  );

  return {
    paymentSettings,
    premiumPrice,
    formattedPremiumPrice,
    paymentMethods,
    loading,
    error,
    reloadPaymentSettings: loadPaymentSettings,
  };
}

export default usePaymentSettings;
