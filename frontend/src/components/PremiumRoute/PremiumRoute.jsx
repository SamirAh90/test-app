import { Navigate, useLocation } from "react-router-dom";

import { useAuth } from "../../contexts/AuthContext";

function PremiumRoute({ children }) {
  const { user, loading, isAuthenticated } = useAuth();

  const location = useLocation();

  if (loading) {
    return null;
  }

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        replace
        state={{
          from: location.pathname,
        }}
      />
    );
  }

  if (!user?.isPremium) {
    return (
      <Navigate
        to="/premium"
        replace
        state={{
          from: location.pathname,
        }}
      />
    );
  }

  return children;
}

export default PremiumRoute;
