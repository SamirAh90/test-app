import { useCallback, useEffect, useState } from "react";

import { Alert, Box, Button, Snackbar, Stack, Typography } from "@mui/material";

import RefreshRoundedIcon from "@mui/icons-material/RefreshRounded";

import ConfirmDeleteDialog from "../components/ConfirmDeleteDialog";
import MaterialEditDialog from "../components/MaterialEditDialog";
import MaterialTable from "../components/MaterialTable";

import { useAdminAuth } from "../contexts/AdminAuthContext";

import {
  deleteAdminMaterial,
  getAdminMaterial,
  getAdminMaterials,
  saveAdminMaterial,
} from "../services/adminApi";

function AdminStudyMaterial() {
  const { token } = useAdminAuth();

  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState("");

  const [selectedSubject, setSelectedSubject] = useState(null);
  const [selectedMaterial, setSelectedMaterial] = useState(null);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogLoading, setDialogLoading] = useState(false);
  const [dialogError, setDialogError] = useState("");

  const [saving, setSaving] = useState(false);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [materialToDelete, setMaterialToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  const [successMessage, setSuccessMessage] = useState("");

  const loadMaterials = useCallback(async () => {
    try {
      setLoading(true);
      setPageError("");

      const response = await getAdminMaterials(token);

      setMaterials(Array.isArray(response.materials) ? response.materials : []);
    } catch (requestError) {
      console.error("Could not load admin study materials:", requestError);

      setPageError(
        requestError.message || "Studiematerialet kunde inte hämtas.",
      );
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    loadMaterials();
  }, [loadMaterials]);

  const handleOpenEditDialog = async (item) => {
    try {
      setSelectedSubject(item.subject);
      setSelectedMaterial(null);
      setDialogError("");
      setDialogOpen(true);
      setDialogLoading(true);

      const response = await getAdminMaterial(token, item.subject.id);

      setSelectedSubject(response.subject);
      setSelectedMaterial(response.material);
    } catch (requestError) {
      console.error("Could not load selected study material:", requestError);

      setDialogError(
        requestError.message || "Studiematerialet kunde inte hämtas.",
      );
    } finally {
      setDialogLoading(false);
    }
  };

  const handleCloseDialog = () => {
    if (saving) {
      return;
    }

    setDialogOpen(false);
    setSelectedSubject(null);
    setSelectedMaterial(null);
    setDialogError("");
  };

  const handleSaveMaterial = async (materialData) => {
    if (!selectedSubject) {
      return;
    }

    try {
      setSaving(true);
      setDialogError("");

      const response = await saveAdminMaterial(
        token,
        selectedSubject.id,
        materialData,
      );

      setMaterials((currentMaterials) =>
        currentMaterials.map((item) =>
          item.subject.id === selectedSubject.id
            ? {
                ...item,
                material: response.material,
                hasMaterial: true,
              }
            : item,
        ),
      );

      setDialogOpen(false);
      setSelectedSubject(null);
      setSelectedMaterial(null);

      setSuccessMessage(response.message || "Studiematerialet sparades.");
    } catch (requestError) {
      console.error("Could not save study material:", requestError);

      setDialogError(
        requestError.message || "Studiematerialet kunde inte sparas.",
      );
    } finally {
      setSaving(false);
    }
  };

  const handleOpenDeleteDialog = (item) => {
    setMaterialToDelete(item);
    setDeleteError("");
    setDeleteDialogOpen(true);
  };

  const handleCloseDeleteDialog = () => {
    if (deleting) {
      return;
    }

    setDeleteDialogOpen(false);
    setMaterialToDelete(null);
    setDeleteError("");
  };

  const confirmDelete = async () => {
    if (!materialToDelete) {
      return;
    }

    try {
      setDeleting(true);
      setDeleteError("");

      const response = await deleteAdminMaterial(
        token,
        materialToDelete.subject.id,
      );

      setMaterials((currentMaterials) =>
        currentMaterials.map((item) =>
          item.subject.id === materialToDelete.subject.id
            ? {
                ...item,
                material: null,
                hasMaterial: false,
              }
            : item,
        ),
      );

      setDeleteDialogOpen(false);
      setMaterialToDelete(null);

      setSuccessMessage(response.message || "Studiematerialet togs bort.");
    } catch (requestError) {
      console.error("Could not delete study material:", requestError);

      setDeleteError(
        requestError.message || "Studiematerialet kunde inte tas bort.",
      );
    } finally {
      setDeleting(false);
    }
  };

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
          <Typography variant="h4">Studiematerial</Typography>

          <Typography
            color="text.secondary"
            sx={{
              mt: 0.75,
            }}
          >
            Skapa, redigera och ta bort studiematerial för ämnena.
          </Typography>
        </Box>

        <Button
          variant="outlined"
          startIcon={<RefreshRoundedIcon />}
          onClick={loadMaterials}
          disabled={loading}
        >
          Uppdatera
        </Button>
      </Box>

      {pageError && (
        <Alert
          severity="error"
          action={
            <Button color="inherit" size="small" onClick={loadMaterials}>
              Försök igen
            </Button>
          }
        >
          {pageError}
        </Alert>
      )}

      <MaterialTable
        materials={materials}
        loading={loading}
        onEdit={handleOpenEditDialog}
        onDelete={handleOpenDeleteDialog}
      />

      <MaterialEditDialog
        open={dialogOpen}
        subject={selectedSubject}
        material={selectedMaterial}
        loading={dialogLoading}
        saving={saving}
        error={dialogError}
        onClose={handleCloseDialog}
        onSave={handleSaveMaterial}
      />

      <ConfirmDeleteDialog
        open={deleteDialogOpen}
        title="Ta bort studiematerial"
        itemName={materialToDelete?.subject?.name}
        description="Endast studiematerialet tas bort. Ämnet, frågorna och begreppen finns kvar."
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

export default AdminStudyMaterial;
