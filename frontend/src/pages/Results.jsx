import { useAuth } from "../contexts/AuthContext";

import AppHeader from "../components/AppHeader/AppHeader";
import PublicLayout from "../components/PublicLayout/PublicLayout";

import ResultsSection from "../sections/Results/ResultsSection";

function Results() {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return (
      <>
        <AppHeader />

        <ResultsSection />
      </>
    );
  }

  return (
    <PublicLayout>
      <ResultsSection />
    </PublicLayout>
  );
}

export default Results;
