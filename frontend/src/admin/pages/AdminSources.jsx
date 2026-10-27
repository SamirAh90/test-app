import { useCallback, useEffect, useState } from "react";

import { Alert, Box, Button, Snackbar, Stack, Typography } from "@mui/material";

import AddRoundedIcon from "@mui/icons-material/AddRounded";
import RefreshRoundedIcon from "@mui/icons-material/RefreshRounded";

import ConfirmDeleteDialog from "../components/ConfirmDeleteDialog";
import SourceEditDialog from "../components/SourceEditDialog";
import SourceTable from "../components/SourceTable";

import { useAdminAuth } from "../contexts/AdminAuthContext";

import {
  createAdminSource,
  deleteAdminSource,
  getAdminSources,
  getAdminSubjects,
  updateAdminSource,
} from "../services/adminApi";

function AdminSources() {
  const { token } = useAdminAuth();

  const [sources, setSources] = useState([]);
  const [subjects, setSubjects] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [pageError, setPageError] = useState("");
  const [dialogError, setDialogError] = useState("");
  const [deleteError, setDeleteError] = useState("");

  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState("create");
  const [selectedSource, setSelectedSource] = useState(null);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [sourceToDelete, setSourceToDelete] = useState(null);

  const [successMessage, setSuccessMessage] = useState("");

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setPageError("");

      const [sourcesResponse, subjectsResponse] = await Promise.all([
        getAdminSources(token),
        getAdminSubjects(token),
      ]);

      setSources(
        Array.isArray(sourcesResponse.sources) ? sourcesResponse.sources : [],
      );

      setSubjects(
        Array.isArray(subjectsResponse.subjects)
          ? subjectsResponse.subjects
          : [],
      );
    } catch (error) {
      console.error("Could not load admin sources:", error);

      setPageError(error.message || "Källorna kunde inte hämtas.");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleOpenCreateDialog = () => {
    setDialogMode("create");
    setSelectedSource(null);
    setDialogError("");
    setDialogOpen(true);
  };

  const handleOpenEditDialog = (source) => {
    setDialogMode("edit");
    setSelectedSource(source);
    setDialogError("");
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    if (saving) {
      return;
    }

    setDialogOpen(false);
    setSelectedSource(null);
    setDialogError("");
  };

  const handleSaveSource = async (sourceData) => {
    try {
      setSaving(true);
      setDialogError("");

      let response;

      if (dialogMode === "create") {
        response = await createAdminSource(token, sourceData);
      } else {
        if (!selectedSource) {
          setDialogError("Källan kunde inte identifieras.");
          return;
        }

        response = await updateAdminSource(
          token,
          selectedSource.id,
          sourceData,
        );
      }

      setDialogOpen(false);
      setSelectedSource(null);

      setSuccessMessage(
        response.message ||
          (dialogMode === "create"
            ? "Källan skapades."
            : "Källan uppdaterades."),
      );

      await loadData();
    } catch (error) {
      console.error("Could not save source:", error);

      setDialogError(
        error.message ||
          (dialogMode === "create"
            ? "Källan kunde inte skapas."
            : "Källan kunde inte uppdateras."),
      );
    } finally {
      setSaving(false);
    }
  };

  const handleOpenDeleteDialog = (source) => {
    setSourceToDelete(source);
    setDeleteError("");
    setDeleteDialogOpen(true);
  };

  const handleCloseDeleteDialog = () => {
    if (deleting) {
      return;
    }

    setDeleteDialogOpen(false);
    setSourceToDelete(null);
    setDeleteError("");
  };

  const confirmDeleteSource = async () => {
    if (!sourceToDelete) {
      return;
    }

    try {
      setDeleting(true);
      setDeleteError("");

      const response = await deleteAdminSource(token, sourceToDelete.id);

      setSources((currentSources) =>
        currentSources.filter((source) => source.id !== sourceToDelete.id),
      );

      setDeleteDialogOpen(false);
      setSourceToDelete(null);

      setSuccessMessage(response.message || "Källan togs bort.");
    } catch (error) {
      console.error("Could not delete source:", error);

      setDeleteError(error.message || "Källan kunde inte tas bort.");
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
          <Typography variant="h4">Källor</Typography>

          <Typography
            color="text.secondary"
            sx={{
              mt: 0.75,
            }}
          >
            Hantera källor och länkar som hör till studiematerialets ämnen.
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
            onClick={loadData}
            disabled={loading}
          >
            Uppdatera
          </Button>

          <Button
            variant="contained"
            startIcon={<AddRoundedIcon />}
            onClick={handleOpenCreateDialog}
          >
            Ny källa
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

      <SourceTable
        rows={sources}
        loading={loading}
        onEdit={handleOpenEditDialog}
        onDelete={handleOpenDeleteDialog}
      />

      <SourceEditDialog
        open={dialogOpen}
        mode={dialogMode}
        source={selectedSource}
        subjects={subjects}
        saving={saving}
        error={dialogError}
        onClose={handleCloseDialog}
        onSave={handleSaveSource}
      />

      <ConfirmDeleteDialog
        open={deleteDialogOpen}
        title="Ta bort källa"
        itemName={sourceToDelete?.title}
        description="Källan tas bort permanent. Ämnet och övrigt innehåll påverkas inte."
        deleting={deleting}
        error={deleteError}
        onClose={handleCloseDeleteDialog}
        onConfirm={confirmDeleteSource}
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

export default AdminSources;
