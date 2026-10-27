import { useCallback, useEffect, useState } from "react";

import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Stack,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";

import AddRoundedIcon from "@mui/icons-material/AddRounded";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";

import { useAdminAuth } from "../../contexts/AdminAuthContext";

import {
  createAdminPremiumCode,
  deleteAdminPremiumCode,
  getAdminPremiumCodes,
  updateAdminPremiumCode,
} from "../../services/adminApi";

const EMPTY_FORM = {
  code: "",
  usageLimit: "",
  validFrom: "",
  validUntil: "",
  isActive: true,
};

const formatUsage = (premiumCode) => {
  if (premiumCode.usageLimit === null || premiumCode.usageLimit === undefined) {
    return `${premiumCode.usageCount || 0} / Obegränsat`;
  }

  return `${premiumCode.usageCount || 0} / ${premiumCode.usageLimit}`;
};

const formatDate = (value) => {
  if (!value) {
    return "Ingen gräns";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return date.toLocaleDateString("sv-SE");
};

const dateToInputValue = (value) => {
  if (!value) {
    return "";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

function AdminPremiumCodesSection() {
  const { token } = useAdminAuth();

  const [premiumCodes, setPremiumCodes] = useState([]);
  const [loading, setLoading] = useState(true);

  const [pageError, setPageError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingPremiumCode, setEditingPremiumCode] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [premiumCodeToDelete, setPremiumCodeToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const loadPremiumCodes = useCallback(async () => {
    try {
      setLoading(true);
      setPageError("");

      const response = await getAdminPremiumCodes(token);

      setPremiumCodes(
        Array.isArray(response.premiumCodes) ? response.premiumCodes : [],
      );
    } catch (error) {
      console.error("Could not load premium codes:", error);

      setPageError(error.message || "Premiumkoderna kunde inte hämtas.");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    loadPremiumCodes();
  }, [loadPremiumCodes]);

  const openCreateDialog = () => {
    setEditingPremiumCode(null);
    setForm(EMPTY_FORM);
    setPageError("");
    setSuccessMessage("");
    setDialogOpen(true);
  };

  const openEditDialog = (premiumCode) => {
    setEditingPremiumCode(premiumCode);

    setForm({
      code: premiumCode.code || "",

      usageLimit:
        premiumCode.usageLimit === null || premiumCode.usageLimit === undefined
          ? ""
          : String(premiumCode.usageLimit),

      validFrom: dateToInputValue(premiumCode.validFrom),
      validUntil: dateToInputValue(premiumCode.validUntil),
      isActive: Boolean(premiumCode.isActive),
    });

    setPageError("");
    setSuccessMessage("");
    setDialogOpen(true);
  };

  const closeDialog = () => {
    if (saving) {
      return;
    }

    setDialogOpen(false);
    setEditingPremiumCode(null);
    setForm(EMPTY_FORM);
  };

  const updateForm = (field, value) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setPageError("");
      setSuccessMessage("");

      const normalizedCode = form.code.trim().toUpperCase();

      if (!normalizedCode) {
        setPageError("Ange en premiumkod.");
        return;
      }

      const usageLimit =
        form.usageLimit === "" ? null : Number(form.usageLimit);

      if (
        usageLimit !== null &&
        (!Number.isInteger(usageLimit) || usageLimit <= 0)
      ) {
        setPageError("Användningsgränsen måste vara ett positivt heltal.");
        return;
      }

      if (
        form.validFrom &&
        form.validUntil &&
        new Date(form.validUntil) < new Date(form.validFrom)
      ) {
        setPageError("Slutdatum kan inte vara före startdatum.");
        return;
      }

      const payload = {
        code: normalizedCode,
        usageLimit,
        validFrom: form.validFrom || null,
        validUntil: form.validUntil || null,
        isActive: form.isActive,
      };

      let response;

      if (editingPremiumCode) {
        response = await updateAdminPremiumCode(
          token,
          editingPremiumCode.id,
          payload,
        );
      } else {
        response = await createAdminPremiumCode(token, payload);
      }

      setSuccessMessage(
        response.message ||
          (editingPremiumCode
            ? "Premiumkoden uppdaterades."
            : "Premiumkoden skapades."),
      );

      setDialogOpen(false);
      setEditingPremiumCode(null);
      setForm(EMPTY_FORM);

      await loadPremiumCodes();
    } catch (error) {
      console.error("Could not save premium code:", error);

      setPageError(error.message || "Premiumkoden kunde inte sparas.");
    } finally {
      setSaving(false);
    }
  };

  const openDeleteDialog = (premiumCode) => {
    setPremiumCodeToDelete(premiumCode);
    setDeleteDialogOpen(true);
    setPageError("");
    setSuccessMessage("");
  };

  const closeDeleteDialog = () => {
    if (deleting) {
      return;
    }

    setDeleteDialogOpen(false);
    setPremiumCodeToDelete(null);
  };

  const handleDelete = async () => {
    if (!premiumCodeToDelete) {
      return;
    }

    try {
      setDeleting(true);
      setPageError("");
      setSuccessMessage("");

      const response = await deleteAdminPremiumCode(
        token,
        premiumCodeToDelete.id,
      );

      setSuccessMessage(response.message || "Premiumkoden togs bort.");

      setDeleteDialogOpen(false);
      setPremiumCodeToDelete(null);

      await loadPremiumCodes();
    } catch (error) {
      console.error("Could not delete premium code:", error);

      setPageError(error.message || "Premiumkoden kunde inte tas bort.");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      <Box>
        <Stack
          direction={{
            xs: "column",
            sm: "row",
          }}
          spacing={2}
          sx={{
            justifyContent: "space-between",
            alignItems: {
              xs: "flex-start",
              sm: "center",
            },
          }}
        >
          <Box>
            <Typography
              variant="h5"
              sx={{
                fontWeight: 800,
              }}
            >
              Premiumkoder
            </Typography>

            <Typography
              color="text.secondary"
              sx={{
                mt: 0.5,
              }}
            >
              Skapa koder som ger användaren livstidsåtkomst till Premium utan
              betalning.
            </Typography>
          </Box>

          <Button
            variant="contained"
            startIcon={<AddRoundedIcon />}
            onClick={openCreateDialog}
          >
            Ny premiumkod
          </Button>
        </Stack>
      </Box>

      {pageError && (
        <Alert
          severity="error"
          sx={{
            mt: 2,
          }}
        >
          {pageError}
        </Alert>
      )}

      {successMessage && (
        <Alert
          severity="success"
          onClose={() => setSuccessMessage("")}
          sx={{
            mt: 2,
          }}
        >
          {successMessage}
        </Alert>
      )}

      <Card
        variant="outlined"
        sx={{
          mt: 2,
        }}
      >
        <CardContent>
          <TableContainer
            sx={{
              border: 1,
              borderColor: "divider",
              borderRadius: 1.5,
            }}
          >
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Kod</TableCell>
                  <TableCell>Premiumåtkomst</TableCell>
                  <TableCell>Användningar</TableCell>
                  <TableCell>Giltig från</TableCell>
                  <TableCell>Giltig till</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="right">Åtgärder</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={7}>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          py: 3,
                          textAlign: "center",
                        }}
                      >
                        Hämtar premiumkoder...
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : premiumCodes.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7}>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          py: 3,
                          textAlign: "center",
                        }}
                      >
                        Det finns inga premiumkoder ännu.
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  premiumCodes.map((premiumCode) => (
                    <TableRow key={premiumCode.id} hover>
                      <TableCell>
                        <Typography
                          variant="body2"
                          sx={{
                            fontWeight: 800,
                          }}
                        >
                          {premiumCode.code}
                        </Typography>
                      </TableCell>

                      <TableCell>Livstid</TableCell>

                      <TableCell>{formatUsage(premiumCode)}</TableCell>

                      <TableCell>{formatDate(premiumCode.validFrom)}</TableCell>

                      <TableCell>
                        {formatDate(premiumCode.validUntil)}
                      </TableCell>

                      <TableCell>
                        <Chip
                          size="small"
                          color={premiumCode.isActive ? "success" : "default"}
                          variant="outlined"
                          label={premiumCode.isActive ? "Aktiv" : "Inaktiv"}
                        />
                      </TableCell>

                      <TableCell align="right">
                        <Stack
                          direction="row"
                          spacing={0.5}
                          sx={{
                            justifyContent: "flex-end",
                          }}
                        >
                          <Button
                            size="small"
                            startIcon={<EditRoundedIcon />}
                            onClick={() => openEditDialog(premiumCode)}
                          >
                            Redigera
                          </Button>

                          <Button
                            size="small"
                            color="error"
                            startIcon={<DeleteRoundedIcon />}
                            onClick={() => openDeleteDialog(premiumCode)}
                          >
                            Ta bort
                          </Button>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onClose={closeDialog} fullWidth maxWidth="sm">
        <DialogTitle>
          {editingPremiumCode ? "Redigera premiumkod" : "Ny premiumkod"}
        </DialogTitle>

        <DialogContent>
          <Stack
            spacing={2.5}
            sx={{
              mt: 1,
            }}
          >
            <Alert severity="info">
              När en användare löser in koden får kontot Premium på livstid.
              Giltighetsdatumen nedan styr bara under vilken period själva koden
              kan användas.
            </Alert>

            <TextField
              fullWidth
              label="Kod"
              placeholder="FREEPREMIUM"
              value={form.code}
              onChange={(event) =>
                updateForm("code", event.target.value.toUpperCase())
              }
            />

            <TextField
              fullWidth
              type="number"
              label="Användningsgräns"
              helperText="Lämna tomt för obegränsad användning."
              value={form.usageLimit}
              onChange={(event) => updateForm("usageLimit", event.target.value)}
              inputProps={{
                min: 1,
              }}
            />

            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr",
                  sm: "1fr 1fr",
                },
                gap: 2,
              }}
            >
              <TextField
                fullWidth
                type="date"
                label="Giltig från"
                value={form.validFrom}
                onChange={(event) =>
                  updateForm("validFrom", event.target.value)
                }
                slotProps={{
                  inputLabel: {
                    shrink: true,
                  },
                }}
              />

              <TextField
                fullWidth
                type="date"
                label="Giltig till"
                value={form.validUntil}
                onChange={(event) =>
                  updateForm("validUntil", event.target.value)
                }
                slotProps={{
                  inputLabel: {
                    shrink: true,
                  },
                }}
              />
            </Box>

            <FormControlLabel
              control={
                <Switch
                  checked={form.isActive}
                  onChange={(event) =>
                    updateForm("isActive", event.target.checked)
                  }
                />
              }
              label="Aktiv premiumkod"
            />
          </Stack>
        </DialogContent>

        <DialogActions>
          <Button onClick={closeDialog} disabled={saving}>
            Avbryt
          </Button>

          <Button variant="contained" onClick={handleSave} disabled={saving}>
            {saving ? "Sparar..." : "Spara"}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={deleteDialogOpen}
        onClose={closeDeleteDialog}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Ta bort premiumkod?</DialogTitle>

        <DialogContent>
          <Typography>
            Är du säker på att du vill ta bort{" "}
            <strong>{premiumCodeToDelete?.code || ""}</strong>?
          </Typography>

          {Number(premiumCodeToDelete?.usageCount || 0) > 0 && (
            <Alert
              severity="warning"
              sx={{
                mt: 2,
              }}
            >
              Den här premiumkoden har redan använts och kan därför inte tas
              bort. Inaktivera den i stället.
            </Alert>
          )}
        </DialogContent>

        <DialogActions>
          <Button onClick={closeDeleteDialog} disabled={deleting}>
            Avbryt
          </Button>

          <Button
            color="error"
            variant="contained"
            onClick={handleDelete}
            disabled={
              deleting || Number(premiumCodeToDelete?.usageCount || 0) > 0
            }
          >
            {deleting ? "Tar bort..." : "Ta bort"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default AdminPremiumCodesSection;
