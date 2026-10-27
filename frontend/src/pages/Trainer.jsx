import { useEffect } from "react";

import PublicLayout from "../components/PublicLayout/PublicLayout";

import TrainerModes from "../sections/TrainerModes/TrainerModes";

import { trackEvent } from "../services/analyticsService";

function Trainer() {
  useEffect(() => {
    trackEvent("trainer_page_viewed");
  }, []);

  return (
    <PublicLayout>
      <TrainerModes />
    </PublicLayout>
  );
}

export default Trainer;
