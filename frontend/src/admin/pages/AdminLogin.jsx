import { useState } from "react";

import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  CssBaseline,
  Stack,
  TextField,
  ThemeProvider,
  Typography,
} from "@mui/material";

import LockRoundedIcon from "@mui/icons-material/LockRounded";

import { Navigate, useLocation, useNavigate } from "react-router-dom";

import logo from "../../assets/logo.png";

import { useAdminAuth } from "../contexts/AdminAuthContext";
import adminTheme from "../theme/adminTheme";

function AdminLogin() {
  const { login, loading, isAdminAuthenticated } = useAdminAuth();

  const navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  if (!loading && isAdminAuthenticated) {
    return <Navigate to="/admin" replace />;
  }

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((currentData) => ({
      ...currentData,
      [name]: value,
    }));

    setError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!formData.email || !formData.password) {
      setError("E-post och lösenord måste fyllas i.");
      return;
    }

    try {
      setSubmitting(true);
      setError("");

      await login({
        email: formData.email.trim(),
        password: formData.password,
      });

      const destination = location.state?.from || "/admin";

      navigate(destination, {
        replace: true,
      });
    } catch (requestError) {
      setError(requestError.message || "Inloggningen misslyckades.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ThemeProvider theme={adminTheme}>
      <CssBaseline />

      <Box
        sx={{
          minHeight: "100vh",
          display: "grid",
          placeItems: "center",
          px: 2,
          py: 5,
          background: "linear-gradient(135deg, #F8FAFC 0%, #E2E8F0 100%)",
        }}
      >
        <Card
          sx={{
            width: "100%",
            maxWidth: 440,
          }}
        >
          <CardContent
            sx={{
              p: {
                xs: 3,
                sm: 5,
              },
            }}
          >
            <Stack spacing={3}>
              <Stack alignItems="center" spacing={1.5}>
                <Box
                  component="img"
                  src={logo}
                  alt="MedborgaTest"
                  sx={{
                    width: 76,
                    height: 76,
                    objectFit: "contain",
                  }}
                />

                <Box textAlign="center">
                  <Typography variant="h4">Adminportal</Typography>

                  <Typography
                    color="text.secondary"
                    sx={{
                      mt: 0.75,
                    }}
                  >
                    Logga in som administratör eller redaktör
                  </Typography>
                </Box>
              </Stack>

              {error && <Alert severity="error">{error}</Alert>}

              <Box component="form" onSubmit={handleSubmit}>
                <Stack spacing={2.25}>
                  <TextField
                    fullWidth
                    required
                    type="email"
                    name="email"
                    label="E-post"
                    value={formData.email}
                    onChange={handleChange}
                    autoComplete="email"
                  />

                  <TextField
                    fullWidth
                    required
                    type="password"
                    name="password"
                    label="Lösenord"
                    value={formData.password}
                    onChange={handleChange}
                    autoComplete="current-password"
                  />

                  <Button
                    fullWidth
                    size="large"
                    type="submit"
                    variant="contained"
                    startIcon={submitting ? null : <LockRoundedIcon />}
                    disabled={submitting}
                    sx={{
                      minHeight: 48,
                    }}
                  >
                    {submitting ? (
                      <CircularProgress size={23} color="inherit" />
                    ) : (
                      "Logga in"
                    )}
                  </Button>
                </Stack>
              </Box>

              <Typography
                variant="caption"
                color="text.secondary"
                textAlign="center"
              >
                Endast behöriga redaktörer och administratörer har åtkomst.
              </Typography>
            </Stack>
          </CardContent>
        </Card>
      </Box>
    </ThemeProvider>
  );
}

export default AdminLogin;
