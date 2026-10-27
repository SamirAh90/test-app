const API_BASE_URL = "http://localhost:5000/api/analytics";

const SESSION_STORAGE_KEY = "medborgatest_analytics_session_id";

/* -------------------------------- */
/* Session ID                       */
/* -------------------------------- */

function createSessionId() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export function getAnalyticsSessionId() {
  let sessionId = localStorage.getItem(SESSION_STORAGE_KEY);

  if (!sessionId) {
    sessionId = createSessionId();

    localStorage.setItem(SESSION_STORAGE_KEY, sessionId);
  }

  return sessionId;
}

/* -------------------------------- */
/* Authentication token             */
/* -------------------------------- */

function getStoredToken() {
  return (
    localStorage.getItem("token") || localStorage.getItem("authToken") || null
  );
}

/* -------------------------------- */
/* Device information               */
/* -------------------------------- */

function getDeviceType() {
  const width = window.innerWidth;

  if (width < 768) {
    return "mobile";
  }

  if (width < 1024) {
    return "tablet";
  }

  return "desktop";
}

/* -------------------------------- */
/* Traffic information              */
/* -------------------------------- */

function getTrafficData() {
  const searchParams = new URLSearchParams(window.location.search);

  return {
    referrer: document.referrer || null,
    utmSource: searchParams.get("utm_source"),
    utmMedium: searchParams.get("utm_medium"),
    utmCampaign: searchParams.get("utm_campaign"),
    utmContent: searchParams.get("utm_content"),
    utmTerm: searchParams.get("utm_term"),
  };
}

/* -------------------------------- */
/* Track event                       */
/* -------------------------------- */

export async function trackEvent(eventName, metadata = {}) {
  try {
    const token = getStoredToken();

    const response = await fetch(`${API_BASE_URL}/events`, {
      method: "POST",

      headers: {
        "Content-Type": "application/json",

        ...(token
          ? {
              Authorization: `Bearer ${token}`,
            }
          : {}),
      },

      body: JSON.stringify({
        sessionId: getAnalyticsSessionId(),
        eventName,
        pagePath: window.location.pathname,

        metadata: {
          ...metadata,

          deviceType: getDeviceType(),
          language: document.documentElement.lang || "sv",

          ...getTrafficData(),
        },
      }),
    });

    if (!response.ok) {
      const data = await response.json().catch(() => ({}));

      console.warn(
        "Analytics event could not be saved:",
        data.message || response.statusText,
      );

      return null;
    }

    return response.json();
  } catch (error) {
    console.warn("Analytics event tracking failed:", error);

    return null;
  }
}
