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
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Select,
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
  createAdminCoupon,
  deleteAdminCoupon,
  getAdminCoupons,
  updateAdminCoupon,
} from "../../services/adminApi";

const EMPTY_FORM = {
  code: "",
  discountType: "percentage",
  discountValue: "",
  usageLimit: "",
  validFrom: "",
  validUntil: "",
  isActive: true,
};

const formatDiscount = (coupon) => {
  if (coupon.discountType === "percentage") {
    return `${coupon.discountValue}%`;
  }

  return `${new Intl.NumberFormat("sv-SE").format(
    Number(coupon.discountValue || 0) / 100,
  )} kr`;
};

const formatUsage = (coupon) => {
  if (coupon.usageLimit === null || coupon.usageLimit === undefined) {
    return `${coupon.usageCount || 0} / Obegränsat`;
  }

  return `${coupon.usageCount || 0} / ${coupon.usageLimit}`;
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

function AdminCouponsSection() {
  const { token } = useAdminAuth();

  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);

  const [pageError, setPageError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [couponToDelete, setCouponToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const loadCoupons = useCallback(async () => {
    try {
      setLoading(true);
      setPageError("");

      const response = await getAdminCoupons(token);

      setCoupons(Array.isArray(response.coupons) ? response.coupons : []);
    } catch (error) {
      console.error("Could not load coupons:", error);

      setPageError(error.message || "Rabattkoderna kunde inte hämtas.");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    loadCoupons();
  }, [loadCoupons]);

  const openCreateDialog = () => {
    setEditingCoupon(null);
    setForm(EMPTY_FORM);
    setPageError("");
    setSuccessMessage("");
    setDialogOpen(true);
  };

  const openEditDialog = (coupon) => {
    setEditingCoupon(coupon);

    setForm({
      code: coupon.code || "",
      discountType: coupon.discountType || "percentage",

      discountValue:
        coupon.discountType === "fixed"
          ? String(Number(coupon.discountValue || 0) / 100)
          : String(coupon.discountValue || ""),

      usageLimit:
        coupon.usageLimit === null || coupon.usageLimit === undefined
          ? ""
          : String(coupon.usageLimit),

      validFrom: dateToInputValue(coupon.validFrom),
      validUntil: dateToInputValue(coupon.validUntil),
      isActive: Boolean(coupon.isActive),
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
    setEditingCoupon(null);
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
        setPageError("Ange en rabattkod.");
        return;
      }

      const enteredDiscountValue = Number(form.discountValue);

      if (!Number.isFinite(enteredDiscountValue) || enteredDiscountValue <= 0) {
        setPageError("Rabatten måste vara större än 0.");
        return;
      }

      if (form.discountType === "percentage" && enteredDiscountValue > 100) {
        setPageError("Procentrabatten kan inte vara högre än 100%.");
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

      const discountValue =
        form.discountType === "fixed"
          ? Math.round(enteredDiscountValue * 100)
          : Math.round(enteredDiscountValue);

      const payload = {
        code: normalizedCode,
        discountType: form.discountType,
        discountValue,
        usageLimit,
        validFrom: form.validFrom || null,
        validUntil: form.validUntil || null,
        isActive: form.isActive,
      };

      let response;

      if (editingCoupon) {
        response = await updateAdminCoupon(token, editingCoupon.id, payload);
      } else {
        response = await createAdminCoupon(token, payload);
      }

      setSuccessMessage(
        response.message ||
          (editingCoupon
            ? "Rabattkoden uppdaterades."
            : "Rabattkoden skapades."),
      );

      setDialogOpen(false);
      setEditingCoupon(null);
      setForm(EMPTY_FORM);

      await loadCoupons();
    } catch (error) {
      console.error("Could not save coupon:", error);

      setPageError(error.message || "Rabattkoden kunde inte sparas.");
    } finally {
      setSaving(false);
    }
  };

  const openDeleteDialog = (coupon) => {
    setCouponToDelete(coupon);
    setDeleteDialogOpen(true);
    setPageError("");
    setSuccessMessage("");
  };

  const closeDeleteDialog = () => {
    if (deleting) {
      return;
    }

    setDeleteDialogOpen(false);
    setCouponToDelete(null);
  };

  const handleDelete = async () => {
    if (!couponToDelete) {
      return;
    }

    try {
      setDeleting(true);
      setPageError("");
      setSuccessMessage("");

      const response = await deleteAdminCoupon(token, couponToDelete.id);

      setSuccessMessage(response.message || "Rabattkoden togs bort.");

      setDeleteDialogOpen(false);
      setCouponToDelete(null);

      await loadCoupons();
    } catch (error) {
      console.error("Could not delete coupon:", error);

      setPageError(error.message || "Rabattkoden kunde inte tas bort.");
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
              Rabattkoder
            </Typography>

            <Typography
              color="text.secondary"
              sx={{
                mt: 0.5,
              }}
            >
              Skapa rabattkoder som används vid köp av Premium.
            </Typography>
          </Box>

          <Button
            variant="contained"
            startIcon={<AddRoundedIcon />}
            onClick={openCreateDialog}
          >
            Ny rabattkod
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
                  <TableCell>Rabatt</TableCell>
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
                        Hämtar rabattkoder...
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : coupons.length === 0 ? (
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
                        Det finns inga rabattkoder ännu.
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  coupons.map((coupon) => (
                    <TableRow key={coupon.id} hover>
                      <TableCell>
                        <Typography
                          variant="body2"
                          sx={{
                            fontWeight: 800,
                          }}
                        >
                          {coupon.code}
                        </Typography>
                      </TableCell>

                      <TableCell>{formatDiscount(coupon)}</TableCell>

                      <TableCell>{formatUsage(coupon)}</TableCell>

                      <TableCell>{formatDate(coupon.validFrom)}</TableCell>

                      <TableCell>{formatDate(coupon.validUntil)}</TableCell>

                      <TableCell>
                        <Chip
                          size="small"
                          color={coupon.isActive ? "success" : "default"}
                          variant="outlined"
                          label={coupon.isActive ? "Aktiv" : "Inaktiv"}
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
                            onClick={() => openEditDialog(coupon)}
                          >
                            Redigera
                          </Button>

                          <Button
                            size="small"
                            color="error"
                            startIcon={<DeleteRoundedIcon />}
                            onClick={() => openDeleteDialog(coupon)}
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
          {editingCoupon ? "Redigera rabattkod" : "Ny rabattkod"}
        </DialogTitle>

        <DialogContent>
          <Stack
            spacing={2.5}
            sx={{
              mt: 1,
            }}
          >
            <TextField
              fullWidth
              label="Kod"
              placeholder="EXEMPEL20"
              value={form.code}
              onChange={(event) =>
                updateForm("code", event.target.value.toUpperCase())
              }
            />

            <FormControl fullWidth>
              <InputLabel>Typ av rabatt</InputLabel>

              <Select
                value={form.discountType}
                label="Typ av rabatt"
                onChange={(event) => {
                  updateForm("discountType", event.target.value);

                  updateForm("discountValue", "");
                }}
              >
                <MenuItem value="percentage">Procent</MenuItem>

                <MenuItem value="fixed">Fast belopp</MenuItem>
              </Select>
            </FormControl>

            <TextField
              fullWidth
              type="number"
              label={
                form.discountType === "percentage"
                  ? "Rabatt i procent"
                  : "Rabatt i kronor"
              }
              value={form.discountValue}
              onChange={(event) =>
                updateForm("discountValue", event.target.value)
              }
              inputProps={{
                min: 1,
                max: form.discountType === "percentage" ? 100 : undefined,
              }}
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
              label="Aktiv rabattkod"
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
        <DialogTitle>Ta bort rabattkod?</DialogTitle>

        <DialogContent>
          <Typography>
            Är du säker på att du vill ta bort{" "}
            <strong>{couponToDelete?.code || ""}</strong>?
          </Typography>

          {Number(couponToDelete?.usageCount || 0) > 0 && (
            <Alert
              severity="warning"
              sx={{
                mt: 2,
              }}
            >
              Den här rabattkoden har redan använts och kan därför inte tas
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
            disabled={deleting || Number(couponToDelete?.usageCount || 0) > 0}
          >
            {deleting ? "Tar bort..." : "Ta bort"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default AdminCouponsSection;
