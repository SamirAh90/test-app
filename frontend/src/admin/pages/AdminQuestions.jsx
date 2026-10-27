import { useCallback, useEffect, useState } from "react";

import { Alert, Box, Button, Snackbar, Stack, Typography } from "@mui/material";

import AddRoundedIcon from "@mui/icons-material/AddRounded";
import RefreshRoundedIcon from "@mui/icons-material/RefreshRounded";

import QuestionEditDialog from "../components/QuestionEditDialog";
import QuestionTable from "../components/QuestionTable";

import { useAdminAuth } from "../contexts/AdminAuthContext";
import ConfirmDeleteDialog from "../components/ConfirmDeleteDialog";

import {
  createAdminQuestion,
  deleteAdminQuestion,
  getAdminQuestion,
  getAdminQuestions,
  getAdminSubjects,
  updateAdminQuestion,
} from "../services/adminApi";

function AdminQuestions() {
  const { token } = useAdminAuth();

  const [questions, setQuestions] = useState([]);
  const [subjects, setSubjects] = useState([]);

  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState("");

  const [selectedQuestion, setSelectedQuestion] = useState(null);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState("edit");
  const [dialogLoading, setDialogLoading] = useState(false);
  const [dialogError, setDialogError] = useState("");

  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [questionToDelete, setQuestionToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  const loadQuestions = useCallback(async () => {
    try {
      setLoading(true);
      setPageError("");

      const [questionsResponse, subjectsResponse] = await Promise.all([
        getAdminQuestions(token),
        getAdminSubjects(token),
      ]);

      setQuestions(
        Array.isArray(questionsResponse.questions)
          ? questionsResponse.questions
          : [],
      );

      setSubjects(
        Array.isArray(subjectsResponse.subjects)
          ? subjectsResponse.subjects
          : [],
      );
    } catch (error) {
      console.error("Could not load admin questions:", error);

      setPageError(error.message || "Frågorna kunde inte hämtas.");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    loadQuestions();
  }, [loadQuestions]);

  const handleOpenCreateDialog = () => {
    setDialogMode("create");
    setSelectedQuestion(null);
    setDialogError("");
    setDialogLoading(false);
    setDialogOpen(true);
  };

  const handleOpenEditDialog = async (row) => {
    try {
      setDialogMode("edit");
      setSelectedQuestion(null);
      setDialogError("");
      setDialogLoading(true);
      setDialogOpen(true);

      const response = await getAdminQuestion(token, row.id);

      setSelectedQuestion(response.question);
    } catch (error) {
      console.error("Could not load selected question:", error);

      setDialogError(error.message || "Frågan kunde inte hämtas.");
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
    setDialogLoading(false);
  };

  const handleSaveQuestion = async (questionData) => {
    try {
      setSaving(true);
      setDialogError("");

      let response;

      if (dialogMode === "create") {
        response = await createAdminQuestion(token, questionData);
      } else {
        if (!selectedQuestion) {
          setDialogError("Frågan kunde inte identifieras.");
          return;
        }

        response = await updateAdminQuestion(
          token,
          selectedQuestion.id,
          questionData,
        );
      }

      setDialogOpen(false);
      setSelectedQuestion(null);

      setSuccessMessage(
        response.message ||
          (dialogMode === "create"
            ? "Frågan skapades."
            : "Frågan uppdaterades."),
      );

      await loadQuestions();
    } catch (error) {
      console.error("Could not save question:", error);

      setDialogError(
        error.message ||
          (dialogMode === "create"
            ? "Frågan kunde inte skapas."
            : "Frågan kunde inte uppdateras."),
      );
    } finally {
      setSaving(false);
    }
  };
  const handleOpenDeleteDialog = (question) => {
    setQuestionToDelete(question);
    setDeleteError("");
    setDeleteDialogOpen(true);
  };

  const handleCloseDeleteDialog = () => {
    if (deleting) {
      return;
    }

    setDeleteDialogOpen(false);
    setQuestionToDelete(null);
    setDeleteError("");
  };

  const confirmDeleteQuestion = async () => {
    if (!questionToDelete) {
      return;
    }

    try {
      setDeleting(true);
      setDeleteError("");

      const response = await deleteAdminQuestion(token, questionToDelete.id);

      setQuestions((currentQuestions) =>
        currentQuestions.filter(
          (question) => question.id !== questionToDelete.id,
        ),
      );

      setDeleteDialogOpen(false);
      setQuestionToDelete(null);

      setSuccessMessage(response.message || "Frågan togs bort.");
    } catch (error) {
      console.error("Could not delete question:", error);

      setDeleteError(error.message || "Frågan kunde inte tas bort.");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <Stack spacing={3}>
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
          <Typography variant="h4">Frågor</Typography>

          <Typography
            color="text.secondary"
            sx={{
              mt: 0.75,
            }}
          >
            Hantera frågor, svar och svårighetsgrad.
          </Typography>
        </Box>

        <Stack
          direction={{
            xs: "column",
            sm: "row",
          }}
          spacing={2}
          sx={{
            width: {
              xs: "100%",
              sm: "auto",
            },
          }}
        >
          <Button
            variant="outlined"
            startIcon={<RefreshRoundedIcon />}
            onClick={loadQuestions}
            disabled={loading}
          >
            Uppdatera
          </Button>

          <Button
            variant="contained"
            startIcon={<AddRoundedIcon />}
            onClick={handleOpenCreateDialog}
          >
            Ny fråga
          </Button>
        </Stack>
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

      <QuestionTable
        rows={questions}
        loading={loading}
        onEdit={handleOpenEditDialog}
        onDelete={handleOpenDeleteDialog}
      />

      <QuestionEditDialog
        open={dialogOpen}
        mode={dialogMode}
        question={selectedQuestion}
        subjects={subjects}
        loading={dialogLoading}
        saving={saving}
        error={dialogError}
        onClose={handleCloseDialog}
        onSave={handleSaveQuestion}
      />
      <ConfirmDeleteDialog
        open={deleteDialogOpen}
        title="Ta bort fråga"
        itemName={questionToDelete?.question}
        description="Frågan, svarsalternativen och översättningarna tas bort permanent."
        deleting={deleting}
        error={deleteError}
        onClose={handleCloseDeleteDialog}
        onConfirm={confirmDeleteQuestion}
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

export default AdminQuestions;
