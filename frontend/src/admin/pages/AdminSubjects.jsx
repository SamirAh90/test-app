import { useCallback, useEffect, useMemo, useState } from "react";

import {
  Alert,
  Box,
  Button,
  Chip,
  Paper,
  Snackbar,
  Stack,
  Typography,
} from "@mui/material";

import AddRoundedIcon from "@mui/icons-material/AddRounded";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import RefreshRoundedIcon from "@mui/icons-material/RefreshRounded";

import { DataGrid } from "@mui/x-data-grid";

import ConfirmDeleteDialog from "../components/ConfirmDeleteDialog";
import SubjectEditDialog from "../components/SubjectEditDialog";

import { useAdminAuth } from "../contexts/AdminAuthContext";

import {
  createAdminSubject,
  deleteAdminSubject,
  getAdminSubjects,
  updateAdminSubject,
} from "../services/adminApi";

function AdminSubjects() {
  const { token } = useAdminAuth();

  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [pageError, setPageError] = useState("");
  const [dialogError, setDialogError] = useState("");
  const [deleteError, setDeleteError] = useState("");

  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState("create");
  const [selectedSubject, setSelectedSubject] = useState(null);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [subjectToDelete, setSubjectToDelete] = useState(null);

  const [successMessage, setSuccessMessage] = useState("");

  const loadSubjects = useCallback(async () => {
    try {
      setLoading(true);
      setPageError("");

      const response = await getAdminSubjects(token);

      setSubjects(Array.isArray(response.subjects) ? response.subjects : []);
    } catch (requestError) {
      console.error("Could not load admin subjects:", requestError);

      setPageError(requestError.message || "Ämnena kunde inte hämtas.");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    loadSubjects();
  }, [loadSubjects]);

  const handleOpenCreateDialog = () => {
    setDialogMode("create");
    setSelectedSubject(null);
    setDialogError("");
    setDialogOpen(true);
  };

  const handleOpenEditDialog = (subject) => {
    setDialogMode("edit");
    setSelectedSubject(subject);
    setDialogError("");
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    if (saving) {
      return;
    }

    setDialogOpen(false);
    setSelectedSubject(null);
    setDialogError("");
  };

  const handleSaveSubject = async (subjectData) => {
    try {
      setSaving(true);
      setDialogError("");

      if (dialogMode === "create") {
        const response = await createAdminSubject(token, subjectData);

        setSubjects((currentSubjects) => [
          ...currentSubjects,
          response.subject,
        ]);

        setSuccessMessage(response.message || "Ämnet skapades.");
      } else {
        if (!selectedSubject) {
          return;
        }

        const response = await updateAdminSubject(
          token,
          selectedSubject.id,
          subjectData,
        );

        setSubjects((currentSubjects) =>
          currentSubjects.map((subject) =>
            subject.id === response.subject.id ? response.subject : subject,
          ),
        );

        setSuccessMessage(response.message || "Ämnet uppdaterades.");
      }

      setDialogOpen(false);
      setSelectedSubject(null);
    } catch (requestError) {
      console.error("Could not save subject:", requestError);

      setDialogError(requestError.message || "Ämnet kunde inte sparas.");
    } finally {
      setSaving(false);
    }
  };

  const handleOpenDeleteDialog = (subject) => {
    setSubjectToDelete(subject);
    setDeleteError("");
    setDeleteDialogOpen(true);
  };

  const handleCloseDeleteDialog = () => {
    if (deleting) {
      return;
    }

    setDeleteDialogOpen(false);
    setSubjectToDelete(null);
    setDeleteError("");
  };

  const confirmDelete = async () => {
    if (!subjectToDelete) {
      return;
    }

    try {
      setDeleting(true);
      setDeleteError("");

      const response = await deleteAdminSubject(token, subjectToDelete.id);

      setSubjects((currentSubjects) =>
        currentSubjects.filter((subject) => subject.id !== subjectToDelete.id),
      );

      setDeleteDialogOpen(false);
      setSubjectToDelete(null);

      setSuccessMessage(response.message || "Ämnet togs bort.");
    } catch (requestError) {
      console.error("Could not delete subject:", requestError);

      setDeleteError(requestError.message || "Ämnet kunde inte tas bort.");
    } finally {
      setDeleting(false);
    }
  };

  const columns = useMemo(
    () => [
      {
        field: "id",
        headerName: "ID",
        width: 75,
        align: "center",
        headerAlign: "center",
      },
      {
        field: "name",
        headerName: "Ämne",
        flex: 1,
        minWidth: 240,
      },
      {
        field: "slug",
        headerName: "Slug",
        flex: 1,
        minWidth: 250,
      },
      {
        field: "description",
        headerName: "Beskrivning",
        flex: 1.5,
        minWidth: 320,
        valueGetter: (_value, row) => row.description || "Ingen beskrivning",
      },
      {
        field: "status",
        headerName: "Status",
        width: 120,
        sortable: false,
        filterable: false,
        renderCell: () => (
          <Chip
            label="Aktivt"
            color="success"
            variant="outlined"
            size="small"
          />
        ),
      },
      {
        field: "actions",
        headerName: "Åtgärder",
        width: 300,
        sortable: false,
        filterable: false,
        disableColumnMenu: true,
        renderCell: (params) => (
          <Stack
            direction="row"
            spacing={1}
            sx={{
              width: "100%",
              alignItems: "center",
              justifyContent: "flex-start",
              flexWrap: "nowrap",
            }}
          >
            <Button
              size="small"
              variant="outlined"
              startIcon={<EditRoundedIcon />}
              onClick={() => handleOpenEditDialog(params.row)}
            >
              Redigera
            </Button>

            <Button
              size="small"
              color="error"
              variant="outlined"
              startIcon={<DeleteOutlineRoundedIcon />}
              onClick={() => handleOpenDeleteDialog(params.row)}
            >
              Ta bort
            </Button>
          </Stack>
        ),
      },
    ],
    [],
  );

  return (
    <Stack spacing={3}>
      <Box
        sx={{
          display: "flex",
          alignItems: {
            xs: "flex-start",
            sm: "center",
          },
          justifyContent: "space-between",
          flexDirection: {
            xs: "column",
            sm: "row",
          },
          gap: 2,
        }}
      >
        <Box>
          <Typography variant="h4">Ämnen</Typography>

          <Typography
            color="text.secondary"
            sx={{
              mt: 0.75,
            }}
          >
            Skapa, redigera och ta bort ämnen. Ämnen med kopplat innehåll kan
            inte tas bort.
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
            onClick={loadSubjects}
            disabled={loading}
          >
            Uppdatera
          </Button>

          <Button
            variant="contained"
            startIcon={<AddRoundedIcon />}
            onClick={handleOpenCreateDialog}
          >
            Nytt ämne
          </Button>
        </Stack>
      </Box>

      {pageError && (
        <Alert
          severity="error"
          action={
            <Button color="inherit" size="small" onClick={loadSubjects}>
              Försök igen
            </Button>
          }
        >
          {pageError}
        </Alert>
      )}

      <Paper
        sx={{
          width: "100%",
          overflow: "hidden",
        }}
      >
        <DataGrid
          rows={subjects}
          columns={columns}
          loading={loading}
          showToolbar
          disableRowSelectionOnClick
          pageSizeOptions={[5, 10, 13, 25]}
          initialState={{
            pagination: {
              paginationModel: {
                page: 0,
                pageSize: 10,
              },
            },
          }}
          slotProps={{
            toolbar: {
              quickFilterProps: {
                debounceMs: 300,
              },
            },
          }}
          sx={{
            border: 0,
            minHeight: 620,

            "& .MuiDataGrid-columnHeaders": {
              backgroundColor: "background.default",
            },

            "& .MuiDataGrid-cell": {
              display: "flex",
              alignItems: "center",
              overflow: "visible",
            },

            "& .MuiDataGrid-cellContent": {
              overflow: "visible",
            },
          }}
        />
      </Paper>

      <SubjectEditDialog
        open={dialogOpen}
        mode={dialogMode}
        subject={selectedSubject}
        saving={saving}
        error={dialogError}
        onClose={handleCloseDialog}
        onSave={handleSaveSubject}
      />

      <ConfirmDeleteDialog
        open={deleteDialogOpen}
        title="Ta bort ämne"
        itemName={subjectToDelete?.name}
        description="Ämnet kan bara tas bort om det inte innehåller frågor, studiematerial, begrepp eller källor."
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

export default AdminSubjects;
