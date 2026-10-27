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
  Stack,
  Tab,
  Tabs,
  TextField,
  Typography,
} from "@mui/material";

import MaterialPreview from "./MaterialPreview";
import RichTextEditor from "./RichTextEditor";

function MaterialEditDialog({
  open,
  subject,
  material,
  loading,
  saving,
  error,
  onClose,
  onSave,
}) {
  const [activeTab, setActiveTab] = useState(0);

  const [formData, setFormData] = useState({
    title: "",
    introduction: "",
    body: "",
  });

  const [validationError, setValidationError] = useState("");

  useEffect(() => {
    if (!open || !subject) {
      return;
    }

    setFormData({
      title: material?.title || subject.name || "",
      introduction: material?.introduction || subject.description || "",
      body: material?.body || "",
    });

    setActiveTab(0);
    setValidationError("");
  }, [open, subject, material]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((currentData) => ({
      ...currentData,
      [name]: value,
    }));

    setValidationError("");
  };

  const handleBodyChange = (value) => {
    setFormData((currentData) => ({
      ...currentData,
      body: value,
    }));

    setValidationError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const title = formData.title.trim();
    const introduction = formData.introduction.trim();
    const body = formData.body.trim();

    if (!title) {
      setValidationError("Rubriken måste fyllas i.");
      setActiveTab(0);
      return;
    }

    if (!body || body === "<p></p>") {
      setValidationError("Studiematerialets innehåll måste fyllas i.");
      setActiveTab(0);
      return;
    }

    await onSave({
      title,
      introduction,
      body,
    });
  };

  const handleClose = () => {
    if (!saving) {
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="lg">
      <DialogTitle>
        <Stack spacing={0.5}>
          <Typography variant="h6">Redigera studiematerial</Typography>

          <Typography variant="body2" color="text.secondary">
            {subject?.name || "Valt ämne"}
          </Typography>
        </Stack>
      </DialogTitle>

      <DialogContent dividers>
        {loading ? (
          <Stack
            spacing={2}
            sx={{
              minHeight: 360,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <CircularProgress />

            <Typography color="text.secondary">
              Hämtar studiematerial...
            </Typography>
          </Stack>
        ) : (
          <Box>
            <Tabs
              value={activeTab}
              onChange={(_event, newValue) => setActiveTab(newValue)}
              sx={{
                mb: 3,
                borderBottom: 1,
                borderColor: "divider",
              }}
            >
              <Tab label="Redigera" />
              <Tab label="Förhandsvisa" />
            </Tabs>

            {(validationError || error) && (
              <Alert severity="error" sx={{ mb: 2.5 }}>
                {validationError || error}
              </Alert>
            )}

            {activeTab === 0 && (
              <Stack
                component="form"
                id="material-edit-form"
                spacing={2.5}
                onSubmit={handleSubmit}
              >
                <TextField
                  required
                  fullWidth
                  name="title"
                  label="Rubrik"
                  value={formData.title}
                  onChange={handleChange}
                  disabled={saving}
                />

                <TextField
                  fullWidth
                  multiline
                  minRows={3}
                  name="introduction"
                  label="Introduktion"
                  value={formData.introduction}
                  onChange={handleChange}
                  disabled={saving}
                  helperText="En kort introduktion som visas under rubriken."
                />

                <Box>
                  <Typography variant="subtitle2" sx={{ mb: 1 }}>
                    Artikelinnehåll
                  </Typography>

                  <RichTextEditor
                    value={formData.body}
                    disabled={saving}
                    onChange={handleBodyChange}
                  />
                </Box>
              </Stack>
            )}

            {activeTab === 1 && (
              <MaterialPreview
                title={formData.title}
                introduction={formData.introduction}
                body={formData.body}
              />
            )}
          </Box>
        )}
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
          form="material-edit-form"
          variant="contained"
          disabled={loading || saving || activeTab !== 0}
          sx={{
            minWidth: 120,
          }}
        >
          {saving ? <CircularProgress size={22} color="inherit" /> : "Spara"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default MaterialEditDialog;
