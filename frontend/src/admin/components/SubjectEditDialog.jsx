import { useEffect, useState } from "react";

import {
  Alert,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

function SubjectEditDialog({
  open,
  mode = "edit",
  subject,
  saving,
  error,
  onClose,
  onSave,
}) {
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
  });

  const [validationError, setValidationError] = useState("");

  useEffect(() => {
    if (!open) {
      return;
    }

    setFormData({
      name: subject?.name || "",
      slug: subject?.slug || "",
      description: subject?.description || "",
    });

    setValidationError("");
  }, [open, subject]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((currentData) => ({
      ...currentData,
      [name]: value,
    }));

    setValidationError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const normalizedName = formData.name.trim();
    const normalizedSlug = formData.slug.trim().toLowerCase();
    const normalizedDescription = formData.description.trim();

    if (!normalizedName || !normalizedSlug) {
      setValidationError("Namn och slug måste fyllas i.");
      return;
    }

    const validSlugPattern = /^[a-z0-9-]+$/;

    if (!validSlugPattern.test(normalizedSlug)) {
      setValidationError(
        "Slug får endast innehålla små bokstäver, siffror och bindestreck.",
      );
      return;
    }

    await onSave({
      name: normalizedName,
      slug: normalizedSlug,
      description: normalizedDescription,
    });
  };

  const handleClose = () => {
    if (!saving) {
      onClose();
    }
  };

  const isCreateMode = mode === "create";

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle>
        <Stack spacing={0.5}>
          <Typography variant="h6">
            {isCreateMode ? "Skapa nytt ämne" : "Redigera ämne"}
          </Typography>

          <Typography variant="body2" color="text.secondary">
            {isCreateMode
              ? "Lägg till ett nytt ämne i MedborgaTest."
              : "Uppdatera ämnets namn, slug och beskrivning."}
          </Typography>
        </Stack>
      </DialogTitle>

      <DialogContent dividers>
        <Stack
          component="form"
          id="subject-edit-form"
          spacing={2.5}
          onSubmit={handleSubmit}
          sx={{
            pt: 1,
          }}
        >
          {(validationError || error) && (
            <Alert severity="error">{validationError || error}</Alert>
          )}

          <TextField
            required
            fullWidth
            name="name"
            label="Ämnets namn"
            value={formData.name}
            onChange={handleChange}
            disabled={saving}
            autoFocus
          />

          <TextField
            required
            fullWidth
            name="slug"
            label="Slug"
            value={formData.slug}
            onChange={handleChange}
            disabled={saving}
            helperText="Exempel: sveriges-demokratiska-system"
          />

          <TextField
            fullWidth
            multiline
            minRows={4}
            name="description"
            label="Beskrivning"
            value={formData.description}
            onChange={handleChange}
            disabled={saving}
          />
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
          form="subject-edit-form"
          variant="contained"
          disabled={saving}
          sx={{
            minWidth: 110,
          }}
        >
          {saving ? (
            <CircularProgress size={22} color="inherit" />
          ) : isCreateMode ? (
            "Skapa"
          ) : (
            "Spara"
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default SubjectEditDialog;
