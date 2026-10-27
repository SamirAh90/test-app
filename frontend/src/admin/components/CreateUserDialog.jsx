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

const INITIAL_FORM_DATA = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  role: "user",
  isPremium: false,
  emailVerified: false,
  isActive: true,
};

function CreateUserDialog({
  open,
  saving = false,
  error = "",
  onClose,
  onSave,
}) {
  const [formData, setFormData] = useState(INITIAL_FORM_DATA);
  const [validationError, setValidationError] = useState("");

  useEffect(() => {
    if (!open) {
      return;
    }

    setFormData(INITIAL_FORM_DATA);
    setValidationError("");
  }, [open]);

  const handleTextChange = (event) => {
    const { name, value } = event.target;

    setFormData((currentData) => ({
      ...currentData,
      [name]: value,
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

    const firstName = formData.firstName.trim();
    const lastName = formData.lastName.trim();
    const email = formData.email.trim().toLowerCase();
    const password = formData.password;

    if (!firstName || !lastName || !email || !password) {
      setValidationError("Alla obligatoriska fält måste fyllas i.");
      return;
    }

    if (password.length < 8) {
      setValidationError("Lösenordet måste innehålla minst 8 tecken.");
      return;
    }

    const validRoles = ROLE_OPTIONS.map((option) => option.value);

    if (!validRoles.includes(formData.role)) {
      setValidationError("Välj en giltig användarroll.");
      return;
    }

    await onSave({
      firstName,
      lastName,
      email,
      password,
      role: formData.role,
      isPremium: formData.isPremium,
      emailVerified: formData.emailVerified,
      isActive: formData.isActive,
    });
  };

  const handleClose = () => {
    if (!saving) {
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle>
        <Stack spacing={0.5}>
          <Typography variant="h6">Ny användare</Typography>

          <Typography variant="body2" color="text.secondary">
            Skapa ett konto och välj användarens behörighet.
          </Typography>
        </Stack>
      </DialogTitle>

      <DialogContent dividers>
        <Stack
          component="form"
          id="create-user-form"
          spacing={2.5}
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
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "repeat(2, minmax(0, 1fr))",
              },
              gap: 2,
            }}
          >
            <TextField
              required
              fullWidth
              name="firstName"
              label="Förnamn"
              value={formData.firstName}
              onChange={handleTextChange}
              disabled={saving}
            />

            <TextField
              required
              fullWidth
              name="lastName"
              label="Efternamn"
              value={formData.lastName}
              onChange={handleTextChange}
              disabled={saving}
            />
          </Box>

          <TextField
            required
            fullWidth
            type="email"
            name="email"
            label="E-post"
            value={formData.email}
            onChange={handleTextChange}
            disabled={saving}
          />

          <TextField
            required
            fullWidth
            type="password"
            name="password"
            label="Lösenord"
            value={formData.password}
            onChange={handleTextChange}
            disabled={saving}
            helperText="Minst 8 tecken."
          />

          <TextField
            select
            required
            fullWidth
            name="role"
            label="Roll"
            value={formData.role}
            onChange={handleTextChange}
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
                    name="isActive"
                    checked={formData.isActive}
                    onChange={handleSwitchChange}
                    disabled={saving}
                  />
                }
                label="Aktivt konto"
              />

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
            </Stack>
          </Box>
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
          form="create-user-form"
          variant="contained"
          disabled={saving}
          sx={{
            minWidth: 140,
          }}
        >
          {saving ? (
            <CircularProgress size={22} color="inherit" />
          ) : (
            "Skapa användare"
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default CreateUserDialog;
