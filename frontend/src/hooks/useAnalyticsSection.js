import { useEffect, useRef } from "react";

import { trackEvent } from "../services/analyticsService";

const VISIBILITY_STORAGE_PREFIX = "medborgatest_analytics_section_seen";

function useAnalyticsSection(eventName, metadata = {}, options = {}) {
  const sectionRef = useRef(null);

  const { threshold = 0.35, trackOncePerSession = true } = options;

  useEffect(() => {
    const sectionElement = sectionRef.current;

    if (!sectionElement || !eventName) {
      return undefined;
    }

    const storageKey = `${VISIBILITY_STORAGE_PREFIX}:${eventName}`;

    if (trackOncePerSession && sessionStorage.getItem(storageKey) === "true") {
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;

        if (!entry?.isIntersecting) {
          return;
        }

        trackEvent(eventName, metadata);

        if (trackOncePerSession) {
          sessionStorage.setItem(storageKey, "true");
        }

        observer.unobserve(sectionElement);
      },
      {
        threshold,
      },
    );

    observer.observe(sectionElement);

    return () => {
      observer.disconnect();
    };
  }, [eventName, metadata, threshold, trackOncePerSession]);

  return sectionRef;
}

export default useAnalyticsSection;
