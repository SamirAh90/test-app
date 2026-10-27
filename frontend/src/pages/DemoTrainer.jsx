import { useLocation } from "react-router-dom";

import AppHeader from "../components/AppHeader/AppHeader";
import TrainerHeader from "../components/TrainerHeader/TrainerHeader";

import DemoQuiz from "../sections/DemoQuiz/DemoQuiz";

function DemoTrainer() {
  const location = useLocation();

  const openedFromMyTraining = location.pathname === "/min-traning/demo";

  return (
    <>
      {openedFromMyTraining ? <AppHeader /> : <TrainerHeader />}

      <DemoQuiz
        showBackToMyTraining={openedFromMyTraining}
        showHeader={false}
      />
    </>
  );
}

export default DemoTrainer;
