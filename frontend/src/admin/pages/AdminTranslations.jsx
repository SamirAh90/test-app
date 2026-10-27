import { useCallback, useEffect, useState } from "react";

import { Alert, Box, Button, Snackbar, Stack, Typography } from "@mui/material";

import RefreshRoundedIcon from "@mui/icons-material/RefreshRounded";

import TranslationDialog from "../components/TranslationDialog";
import TranslationTable from "../components/TranslationTable";

import { useAdminAuth } from "../contexts/AdminAuthContext";

import {
  getAdminQuestionTranslations,
  getAdminTranslationQuestions,
  saveAdminQuestionTranslations,
} from "../services/adminApi";

function AdminTranslations() {
  const { token } = useAdminAuth();

  /* -------------------------------- */
  /* Page data                        */
  /* -------------------------------- */

  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState("");

  /* -------------------------------- */
  /* Translation dialog               */
  /* -------------------------------- */

  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogLoading, setDialogLoading] = useState(false);
  const [dialogError, setDialogError] = useState("");

  /* -------------------------------- */
  /* Save state                       */
  /* -------------------------------- */

  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  /* -------------------------------- */
  /* Load all translation questions   */
  /* -------------------------------- */

  const loadQuestions = useCallback(async () => {
    try {
      setLoading(true);
      setPageError("");

      const response = await getAdminTranslationQuestions(token);

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

  /* -------------------------------- */
  /* Open translation dialog          */
  /* -------------------------------- */

  const handleOpenTranslation = async (row) => {
    try {
      setSelectedQuestion(null);
      setDialogError("");
      setDialogLoading(true);
      setDialogOpen(true);

      const response = await getAdminQuestionTranslations(token, row.id);

      setSelectedQuestion(response.question);
    } catch (error) {
      console.error("Could not load question translations:", error);

      setDialogError(error.message || "Översättningarna kunde inte hämtas.");
    } finally {
      setDialogLoading(false);
    }
  };

  /* -------------------------------- */
  /* Close translation dialog         */
  /* -------------------------------- */

  const handleCloseDialog = () => {
    if (saving) {
      return;
    }

    setDialogOpen(false);
    setSelectedQuestion(null);
    setDialogError("");
    setDialogLoading(false);
  };

  /* -------------------------------- */
  /* Save question translations       */
  /* -------------------------------- */

  const handleSaveTranslations = async (translations) => {
    if (!selectedQuestion) {
      setDialogError("Frågan kunde inte identifieras.");
      return;
    }

    try {
      setSaving(true);
      setDialogError("");

      const response = await saveAdminQuestionTranslations(
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
      {/* Page heading */}

      <Box
        sx={{
          display: "flex",
          flexDirection: {
            xs: "column",
            sm: "row",
          },
          alignItems: {
            xs: "flex-start",
            sm: "center",
          },
          justifyContent: "space-between",
          gap: 2,
        }}
      >
        <Box>
          <Typography variant="h4">Översättningar</Typography>

          <Typography
            color="text.secondary"
            sx={{
              mt: 0.75,
            }}
          >
            Översätt frågor, förklaringar och svarsalternativ till engelska,
            arabiska och persiska/dari.
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

      {/* Page error */}

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

      {/* Translation question table */}

      <TranslationTable
        rows={questions}
        loading={loading}
        onTranslate={handleOpenTranslation}
      />

      {/* Translation dialog */}

      <TranslationDialog
        open={dialogOpen}
        question={selectedQuestion}
        loading={dialogLoading}
        saving={saving}
        error={dialogError}
        onClose={handleCloseDialog}
        onSave={handleSaveTranslations}
      />

      {/* Success message */}

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

export default AdminTranslations;
