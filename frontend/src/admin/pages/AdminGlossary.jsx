import { useCallback, useEffect, useState } from "react";

import { Alert, Box, Button, Snackbar, Stack, Typography } from "@mui/material";

import AddRoundedIcon from "@mui/icons-material/AddRounded";
import RefreshRoundedIcon from "@mui/icons-material/RefreshRounded";

import ConfirmDeleteDialog from "../components/ConfirmDeleteDialog";
import GlossaryEditDialog from "../components/GlossaryEditDialog";
import GlossaryTable from "../components/GlossaryTable";

import { useAdminAuth } from "../contexts/AdminAuthContext";

import {
  createAdminGlossaryTerm,
  deleteAdminGlossaryTerm,
  getAdminGlossary,
  getAdminGlossaryTerm,
  getAdminSubjects,
  updateAdminGlossaryTerm,
} from "../services/adminApi";

function AdminGlossary() {
  const { token } = useAdminAuth();

  const [terms, setTerms] = useState([]);
  const [subjects, setSubjects] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [pageError, setPageError] = useState("");
  const [dialogError, setDialogError] = useState("");
  const [deleteError, setDeleteError] = useState("");

  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState("create");
  const [selectedTerm, setSelectedTerm] = useState(null);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [termToDelete, setTermToDelete] = useState(null);

  const [successMessage, setSuccessMessage] = useState("");

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setPageError("");

      const [glossaryResponse, subjectsResponse] = await Promise.all([
        getAdminGlossary(token),
        getAdminSubjects(token),
      ]);

      setTerms(
        Array.isArray(glossaryResponse.terms) ? glossaryResponse.terms : [],
      );

      setSubjects(
        Array.isArray(subjectsResponse.subjects)
          ? subjectsResponse.subjects
          : [],
      );
    } catch (error) {
      console.error("Could not load glossary admin data:", error);

      setPageError(error.message || "Begreppen kunde inte hämtas.");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleCreate = () => {
    setDialogMode("create");
    setSelectedTerm(null);
    setDialogError("");
    setDialogOpen(true);
  };

  const handleEdit = async (row) => {
    try {
      setDialogMode("edit");
      setSelectedTerm(null);
      setDialogError("");

      const response = await getAdminGlossaryTerm(token, row.id);

      setSelectedTerm(response.term);
      setDialogOpen(true);
    } catch (error) {
      console.error("Could not load glossary term:", error);

      setPageError(error.message || "Begreppet kunde inte hämtas.");
    }
  };

  const handleCloseEditDialog = () => {
    if (saving) {
      return;
    }

    setDialogOpen(false);
    setSelectedTerm(null);
    setDialogError("");
  };

  const handleSave = async (data) => {
    try {
      setSaving(true);
      setDialogError("");

      if (dialogMode === "create") {
        const response = await createAdminGlossaryTerm(token, data);

        setSuccessMessage(response.message || "Begreppet skapades.");
      } else {
        if (!selectedTerm) {
          return;
        }

        const response = await updateAdminGlossaryTerm(
          token,
          selectedTerm.id,
          data,
        );

        setSuccessMessage(response.message || "Begreppet uppdaterades.");
      }

      setDialogOpen(false);
      setSelectedTerm(null);

      await loadData();
    } catch (error) {
      console.error("Could not save glossary term:", error);

      setDialogError(error.message || "Begreppet kunde inte sparas.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = (term) => {
    setTermToDelete(term);
    setDeleteError("");
    setDeleteDialogOpen(true);
  };

  const handleCloseDeleteDialog = () => {
    if (deleting) {
      return;
    }

    setDeleteDialogOpen(false);
    setTermToDelete(null);
    setDeleteError("");
  };

  const confirmDelete = async () => {
    if (!termToDelete) {
      return;
    }

    try {
      setDeleting(true);
      setDeleteError("");

      const response = await deleteAdminGlossaryTerm(token, termToDelete.id);

      setDeleteDialogOpen(false);
      setTermToDelete(null);

      setSuccessMessage(response.message || "Begreppet togs bort.");

      await loadData();
    } catch (error) {
      console.error("Could not delete glossary term:", error);

      setDeleteError(error.message || "Begreppet kunde inte tas bort.");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <Stack spacing={3}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: {
            xs: "flex-start",
            sm: "center",
          },
          flexDirection: {
            xs: "column",
            sm: "row",
          },
          gap: 2,
        }}
      >
        <Box>
          <Typography variant="h4">Begrepp</Typography>

          <Typography color="text.secondary" sx={{ mt: 0.75 }}>
            Hantera ordlistan för alla ämnen.
          </Typography>
        </Box>

        <Stack
          direction={{
            xs: "column",
            sm: "row",
          }}
          spacing={2}
        >
          <Button
            variant="outlined"
            startIcon={<RefreshRoundedIcon />}
            onClick={loadData}
            disabled={loading}
          >
            Uppdatera
          </Button>

          <Button
            variant="contained"
            startIcon={<AddRoundedIcon />}
            onClick={handleCreate}
          >
            Nytt begrepp
          </Button>
        </Stack>
      </Box>

      {pageError && (
        <Alert
          severity="error"
          action={
            <Button color="inherit" size="small" onClick={loadData}>
              Försök igen
            </Button>
          }
        >
          {pageError}
        </Alert>
      )}

      <GlossaryTable
        rows={terms}
        loading={loading}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <GlossaryEditDialog
        open={dialogOpen}
        mode={dialogMode}
        term={selectedTerm}
        subjects={subjects}
        saving={saving}
        error={dialogError}
        onClose={handleCloseEditDialog}
        onSave={handleSave}
      />

      <ConfirmDeleteDialog
        open={deleteDialogOpen}
        title="Ta bort begrepp"
        itemName={termToDelete?.word}
        description="Begreppet tas bort permanent och kan inte återställas."
        deleting={deleting}
        error={deleteError}
        onClose={handleCloseDeleteDialog}
        onConfirm={confirmDelete}
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

export default AdminGlossary;
