import { useCallback, useEffect, useState } from "react";

import { Alert, Box, Button, Snackbar, Stack, Typography } from "@mui/material";

import RefreshRoundedIcon from "@mui/icons-material/RefreshRounded";

import TranslationDialog from "../../components/TranslationDialog/TranslationDialog";
import TranslationTable from "../../components/TranslationTable/TranslationTable";

import { useAdminAuth } from "../../admin/contexts/AdminAuthContext";

import {
  getAdminTranslationQuestions,
  getAdminQuestionTranslations,
  saveAdminQuestionTranslations,
} from "../services/adminApi";

import "./AdminTranslationsSection.css";

function AdminTranslationsSection() {
  const { token } = useAdminAuth();

  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState("");

  const [selectedQuestion, setSelectedQuestion] = useState(null);

  const [dialogOpen, setDialogOpen] = useState(false);

  const [dialogLoading, setDialogLoading] = useState(false);

  const [dialogError, setDialogError] = useState("");

  const [saving, setSaving] = useState(false);

  const [successMessage, setSuccessMessage] = useState("");

  const loadQuestions = useCallback(async () => {
    try {
      setLoading(true);
      setPageError("");

      const response = await getTranslationQuestions(token);

      setQuestions(Array.isArray(response.questions) ? response.questions : []);
    } catch (error) {
      console.error("Could not load translations:", error);

      setPageError(error.message || "Översättningarna kunde inte hämtas.");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    loadQuestions();
  }, [loadQuestions]);

  const handleOpenTranslation = async (row) => {
    try {
      setSelectedQuestion(null);
      setDialogError("");
      setDialogLoading(true);
      setDialogOpen(true);

      const response = await getQuestionTranslations(token, row.id);

      setSelectedQuestion(response.question);
    } catch (error) {
      console.error("Could not load question translations:", error);

      setDialogError(error.message || "Översättningarna kunde inte hämtas.");
    } finally {
      setDialogLoading(false);
    }
  };

  const handleCloseDialog = () => {
    if (saving) {
      return;
    }

    setDialogOpen(false);
    setSelectedQuestion(null);
    setDialogError("");
  };

  const handleSaveTranslations = async (translations) => {
    if (!selectedQuestion) {
      setDialogError("Frågan kunde inte identifieras.");

      return;
    }

    try {
      setSaving(true);
      setDialogError("");

      const response = await saveQuestionTranslations(
        token,
        selectedQuestion.id,
        translations,
      );

      setDialogOpen(false);
      setSelectedQuestion(null);

      setSuccessMessage(response.message || "Översättningarna sparades.");

      await loadQuestions();
    } catch (error) {
      console.error("Could not save translations:", error);

      setDialogError(error.message || "Översättningarna kunde inte sparas.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Stack spacing={3}>
      <Box className="admin-translations__header">
        <Box>
          <Typography variant="h4">Översättningar</Typography>

          <Typography
            color="text.secondary"
            sx={{
              mt: 0.75,
            }}
          >
            Översätt frågor, förklaringar och svarsalternativ.
          </Typography>
        </Box>

        <Button
          variant="outlined"
          startIcon={<RefreshRoundedIcon />}
          onClick={loadQuestions}
          disabled={loading}
        >
          Uppdatera
        </Button>
      </Box>

      {pageError && (
        <Alert
          severity="error"
          action={
            <Button color="inherit" size="small" onClick={loadQuestions}>
              Försök igen
            </Button>
          }
        >
          {pageError}
        </Alert>
      )}

      <TranslationTable
        rows={questions}
        loading={loading}
        onTranslate={handleOpenTranslation}
      />

      <TranslationDialog
        open={dialogOpen}
        question={selectedQuestion}
        loading={dialogLoading}
        saving={saving}
        error={dialogError}
        onClose={handleCloseDialog}
        onSave={handleSaveTranslations}
      />

      <Snackbar
        open={Boolean(successMessage)}
        autoHideDuration={3500}
        onClose={() => setSuccessMessage("")}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
      >
        <Alert
          severity="success"
          variant="filled"
          onClose={() => setSuccessMessage("")}
        >
          {successMessage}
        </Alert>
      </Snackbar>
    </Stack>
  );
}

export default AdminTranslationsSection;
