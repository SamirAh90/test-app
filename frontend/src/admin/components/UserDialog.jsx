import { useEffect, useState } from "react";

import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  MenuItem,
  Stack,
  Switch,
  TextField,
  Typography,
} from "@mui/material";

const ROLE_OPTIONS = [
  {
    value: "user",
    label: "Användare",
  },
  {
    value: "editor",
    label: "Redaktör",
  },
  {
    value: "admin",
    label: "Administratör",
  },
];

function UserDialog({
  open,
  user,
  loading = false,
  saving = false,
  error = "",
  onClose,
  onSave,
}) {
  const [formData, setFormData] = useState({
    role: "user",
    isPremium: false,
    emailVerified: false,
  });

  const [validationError, setValidationError] = useState("");

  useEffect(() => {
    if (!open) {
      return;
    }

    setFormData({
      role: user?.role || "user",
      isPremium: Boolean(user?.isPremium),
      emailVerified: Boolean(user?.emailVerified),
    });

    setValidationError("");
  }, [open, user]);

  const handleRoleChange = (event) => {
    setFormData((currentData) => ({
      ...currentData,
      role: event.target.value,
    }));

    setValidationError("");
  };

  const handleSwitchChange = (event) => {
    const { name, checked } = event.target;

    setFormData((currentData) => ({
      ...currentData,
      [name]: checked,
    }));

    setValidationError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const validRoles = ROLE_OPTIONS.map((option) => option.value);

    if (!validRoles.includes(formData.role)) {
      setValidationError("Välj en giltig användarroll.");
      return;
    }

    await onSave({
      role: formData.role,
      isPremium: formData.isPremium,
      emailVerified: formData.emailVerified,
    });
  };

  const handleClose = () => {
    if (!saving) {
      onClose();
    }
  };

  const fullName = user
    ? `${user.firstName || ""} ${user.lastName || ""}`.trim()
    : "";

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle>
        <Stack spacing={0.5}>
          <Typography variant="h6">Redigera användare</Typography>

          <Typography variant="body2" color="text.secondary">
            Hantera roll, premiumåtkomst och verifieringsstatus.
          </Typography>
        </Stack>
      </DialogTitle>

      <DialogContent dividers>
        <Stack
          component="form"
          id="user-edit-form"
          spacing={3}
          onSubmit={handleSubmit}
          sx={{
            pt: 1,
          }}
        >
          {(validationError || error) && (
            <Alert severity="error">{validationError || error}</Alert>
          )}

          <Box
            sx={{
              p: 2,
              border: 1,
              borderColor: "divider",
              borderRadius: 2,
              backgroundColor: "background.default",
            }}
          >
            <Typography
              variant="subtitle1"
              sx={{
                fontWeight: 700,
              }}
            >
              {fullName || "Okänd användare"}
            </Typography>

            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                mt: 0.5,
              }}
            >
              {user?.email || "Ingen e-postadress"}
            </Typography>

            <Typography
              variant="caption"
              color="text.secondary"
              sx={{
                display: "block",
                mt: 1,
              }}
            >
              Användar-ID: {user?.id || "—"}
            </Typography>
          </Box>

          <TextField
            select
            required
            fullWidth
            name="role"
            label="Roll"
            value={formData.role}
            onChange={handleRoleChange}
            disabled={saving}
          >
            {ROLE_OPTIONS.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>

          <Box
            sx={{
              p: 2,
              border: 1,
              borderColor: "divider",
              borderRadius: 2,
            }}
          >
            <Stack spacing={1}>
              <FormControlLabel
                control={
                  <Switch
                    name="isPremium"
                    checked={formData.isPremium}
                    onChange={handleSwitchChange}
                    disabled={saving}
                  />
                }
                label="Premiumkonto"
              />

              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  pl: 6,
                  mt: -1,
                }}
              >
                Ger användaren tillgång till premiuminnehåll.
              </Typography>
            </Stack>
          </Box>

          <Box
            sx={{
              p: 2,
              border: 1,
              borderColor: "divider",
              borderRadius: 2,
            }}
          >
            <Stack spacing={1}>
              <FormControlLabel
                control={
                  <Switch
                    name="emailVerified"
                    checked={formData.emailVerified}
                    onChange={handleSwitchChange}
                    disabled={saving}
                  />
                }
                label="E-post verifierad"
              />

              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  pl: 6,
                  mt: -1,
                }}
              >
                Visar att användarens e-postadress har verifierats.
              </Typography>
            </Stack>
          </Box>

          <Alert severity="info">
            Aktivering och inaktivering av kontot hanteras från
            användartabellen.
          </Alert>
        </Stack>
      </DialogContent>

      <DialogActions
        sx={{
          px: 3,
          py: 2,
        }}
      >
        <Button
          type="button"
          color="inherit"
          onClick={handleClose}
          disabled={saving}
        >
          Avbryt
        </Button>

        <Button
          type="submit"
          form="user-edit-form"
          variant="contained"
          disabled={loading || saving || !user}
          sx={{
            minWidth: 110,
          }}
        >
          {saving ? <CircularProgress size={22} color="inherit" /> : "Spara"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default UserDialog;
