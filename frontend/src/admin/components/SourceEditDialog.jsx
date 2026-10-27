import { useEffect, useState } from "react";

import {
  Alert,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

function SourceEditDialog({
  open,
  mode = "create",
  source,
  subjects = [],
  saving = false,
  error = "",
  onClose,
  onSave,
}) {
  const [formData, setFormData] = useState({
    subjectId: "",
    title: "",
    url: "",
    displayOrder: 0,
  });

  const [validationError, setValidationError] = useState("");

  const isCreateMode = mode === "create";

  useEffect(() => {
    if (!open) {
      return;
    }

    setFormData({
      subjectId: source?.subjectId || "",
      title: source?.title || "",
      url: source?.url || "",
      displayOrder: source?.displayOrder ?? 0,
    });

    setValidationError("");
  }, [open, source]);

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

    const subjectId = Number(formData.subjectId);
    const title = formData.title.trim();
    const url = formData.url.trim();
    const displayOrder = Number(formData.displayOrder);

    if (!Number.isInteger(subjectId) || subjectId <= 0) {
      setValidationError("Välj ett ämne.");
      return;
    }

    if (!title) {
      setValidationError("Källans titel måste fyllas i.");
      return;
    }

    try {
      const parsedUrl = new URL(url);

      if (!["http:", "https:"].includes(parsedUrl.protocol)) {
        throw new Error("Invalid protocol");
      }
    } catch {
      setValidationError(
        "Ange en giltig webbadress som börjar med http eller https.",
      );
      return;
    }

    if (!Number.isInteger(displayOrder) || displayOrder < 0) {
      setValidationError("Visningsordningen måste vara ett heltal från 0.");
      return;
    }

    await onSave({
      subjectId,
      title,
      url,
      displayOrder,
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
          <Typography variant="h6">
            {isCreateMode ? "Skapa ny källa" : "Redigera källa"}
          </Typography>

          <Typography variant="body2" color="text.secondary">
            Koppla källan till ett ämne och ange webbadressen.
          </Typography>
        </Stack>
      </DialogTitle>

      <DialogContent dividers>
        <Stack
          component="form"
          id="source-edit-form"
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
            select
            required
            fullWidth
            name="subjectId"
            label="Ämne"
            value={formData.subjectId}
            onChange={handleChange}
            disabled={saving}
          >
            {subjects.map((subject) => (
              <MenuItem key={subject.id} value={subject.id}>
                {subject.name}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            required
            fullWidth
            name="title"
            label="Titel"
            value={formData.title}
            onChange={handleChange}
            disabled={saving}
            autoFocus
          />

          <TextField
            required
            fullWidth
            type="url"
            name="url"
            label="Webbadress"
            value={formData.url}
            onChange={handleChange}
            disabled={saving}
            placeholder="https://www.example.se/"
            helperText="Webbadressen måste börja med http:// eller https://"
          />

          <TextField
            required
            fullWidth
            type="number"
            name="displayOrder"
            label="Visningsordning"
            value={formData.displayOrder}
            onChange={handleChange}
            disabled={saving}
            slotProps={{
              htmlInput: {
                min: 0,
                step: 1,
              },
            }}
            helperText="Lägre nummer visas först inom ämnet."
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
          form="source-edit-form"
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

export default SourceEditDialog;
