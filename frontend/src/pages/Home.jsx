import { useEffect } from "react";
import { useTranslation } from "react-i18next";

import PublicLayout from "../components/PublicLayout/PublicLayout";

import Hero from "../sections/Hero/Hero";
import Stats from "../sections/Stats/Stats";
import SubjectGrid from "../sections/SubjectGrid/SubjectGrid";
import HowItWorks from "../sections/HowItWorks/HowItWorks";
import DemoQuestion from "../sections/DemoQuestion/DemoQuestion";
import Features from "../sections/Features/Features";
import FAQ from "../sections/FAQ/FAQ";
import CTA from "../sections/CTA/CTA";
import Disclaimer from "../sections/Disclaimer/Disclaimer";

import { trackEvent } from "../services/analyticsService";

function Home() {
  const { i18n } = useTranslation();

  const currentLanguage = i18n.language?.split("-")[0] || "sv";

  const isRtl = currentLanguage === "ar" || currentLanguage === "fa";

  useEffect(() => {
    trackEvent("landing_view");
  }, []);

  return (
    <div
      className={
        isRtl
          ? "landing-page landing-page--rtl"
          : "landing-page landing-page--ltr"
      }
      dir={isRtl ? "rtl" : "ltr"}
      lang={currentLanguage}
    >
      <PublicLayout>
        <Hero />
        <HowItWorks />
        <Stats />
        <SubjectGrid />
        <DemoQuestion />
        <Features />
        <FAQ />
        <CTA />
        <Disclaimer />
      </PublicLayout>
    </div>
  );
}

export default Home;
