import { CircularProgress, Stack, Typography } from "@mui/material";
import { Navigate, useLocation } from "react-router-dom";

import { useAdminAuth } from "../contexts/AdminAuthContext";

function AdminProtectedRoute({ children }) {
  const { loading, isAdminAuthenticated } = useAdminAuth();
  const location = useLocation();

  if (loading) {
    return (
      <Stack
        spacing={2}
        sx={{
          minHeight: "100vh",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CircularProgress />

        <Typography color="text.secondary">
          Kontrollerar adminbehörighet...
        </Typography>
      </Stack>
    );
  }

  if (!isAdminAuthenticated) {
    return (
      <Navigate
        to="/admin/login"
        replace
        state={{
          from: location.pathname,
        }}
      />
    );
  }

  return children;
}

export default AdminProtectedRoute;
