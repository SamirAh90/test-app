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

function GlossaryEditDialog({
  open,
  mode,
  term,
  subjects,
  saving,
  error,
  onClose,
  onSave,
}) {
  const [formData, setFormData] = useState({
    subjectId: "",
    word: "",
    definition: "",
    displayOrder: 0,
  });

  const [validationError, setValidationError] = useState("");

  useEffect(() => {
    if (!open) {
      return;
    }

    setFormData({
      subjectId: term?.subjectId || "",
      word: term?.word || "",
      definition: term?.definition || "",
      displayOrder: term?.displayOrder ?? 0,
    });

    setValidationError("");
  }, [open, term]);

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
    const displayOrder = Number(formData.displayOrder);
    const word = formData.word.trim();
    const definition = formData.definition.trim();

    if (!Number.isInteger(subjectId) || subjectId <= 0) {
      setValidationError("Välj ett ämne.");
      return;
    }

    if (!word || !definition) {
      setValidationError("Begrepp och förklaring måste fyllas i.");
      return;
    }

    if (!Number.isInteger(displayOrder) || displayOrder < 0) {
      setValidationError("Visningsordningen måste vara ett heltal från 0.");
      return;
    }

    await onSave({
      subjectId,
      word,
      definition,
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
            {mode === "create" ? "Lägg till begrepp" : "Redigera begrepp"}
          </Typography>

          <Typography variant="body2" color="text.secondary">
            Koppla begreppet till ett av de 13 ämnena.
          </Typography>
        </Stack>
      </DialogTitle>

      <DialogContent dividers>
        <Stack
          component="form"
          id="glossary-edit-form"
          spacing={2.5}
          onSubmit={handleSubmit}
          sx={{ pt: 1 }}
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
            name="word"
            label="Begrepp"
            value={formData.word}
            onChange={handleChange}
            disabled={saving}
          />

          <TextField
            required
            fullWidth
            multiline
            minRows={4}
            name="definition"
            label="Förklaring"
            value={formData.definition}
            onChange={handleChange}
            disabled={saving}
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
          form="glossary-edit-form"
          variant="contained"
          disabled={saving}
          sx={{ minWidth: 110 }}
        >
          {saving ? (
            <CircularProgress size={22} color="inherit" />
          ) : mode === "create" ? (
            "Skapa"
          ) : (
            "Spara"
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default GlossaryEditDialog;
