import { useCallback, useEffect, useMemo, useState } from "react";

import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  MenuItem,
  Snackbar,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import AddRoundedIcon from "@mui/icons-material/AddRounded";
import RefreshRoundedIcon from "@mui/icons-material/RefreshRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";

import CreateUserDialog from "../components/CreateUserDialog";
import UserDialog from "../components/UserDialog";
import UserTable from "../components/UserTable";

import { useAdminAuth } from "../contexts/AdminAuthContext";

import {
  activateAdminUser,
  createAdminUser,
  deactivateAdminUser,
  deleteAdminUser,
  getAdminUser,
  getAdminUsers,
  updateAdminUser,
} from "../services/adminApi";

const ROLE_FILTER_OPTIONS = [
  {
    value: "all",
    label: "Alla roller",
  },
  {
    value: "user",
    label: "Användare",
  },
  {
    value: "editor",
    label: "Redaktörer",
  },
  {
    value: "admin",
    label: "Administratörer",
  },
];

const STATUS_FILTER_OPTIONS = [
  {
    value: "all",
    label: "Alla statusar",
  },
  {
    value: "active",
    label: "Aktiva",
  },
  {
    value: "inactive",
    label: "Inaktiva",
  },
  {
    value: "premium",
    label: "Premium",
  },
  {
    value: "unverified",
    label: "Ej verifierade",
  },
];

function AdminUsers() {
  const { token, user: currentAdmin } = useAdminAuth();

  /* -------------------------------- */
  /* Page data                        */
  /* -------------------------------- */

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState("");

  /* -------------------------------- */
  /* Search and filters               */
  /* -------------------------------- */

  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  /* -------------------------------- */
  /* Create-user dialog               */
  /* -------------------------------- */

  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [createDialogError, setCreateDialogError] = useState("");
  const [creating, setCreating] = useState(false);

  /* -------------------------------- */
  /* Edit-user dialog                 */
  /* -------------------------------- */

  const [selectedUser, setSelectedUser] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogLoading, setDialogLoading] = useState(false);
  const [dialogError, setDialogError] = useState("");
  const [saving, setSaving] = useState(false);

  /* -------------------------------- */
  /* Row actions                      */
  /* -------------------------------- */

  const [actionUserId, setActionUserId] = useState(null);

  /* -------------------------------- */
  /* Messages                         */
  /* -------------------------------- */

  const [successMessage, setSuccessMessage] = useState("");

  /* -------------------------------- */
  /* Load users                       */
  /* -------------------------------- */

  const loadUsers = useCallback(async () => {
    try {
      setLoading(true);
      setPageError("");

      const response = await getAdminUsers(token);

      setUsers(Array.isArray(response.users) ? response.users : []);
    } catch (error) {
      console.error("Could not load admin users:", error);

      setPageError(error.message || "Användarna kunde inte hämtas.");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  /* -------------------------------- */
  /* User statistics                  */
  /* -------------------------------- */

  const userStatistics = useMemo(() => {
    return users.reduce(
      (statistics, user) => {
        statistics.total += 1;

        if (user.isActive) {
          statistics.active += 1;
        } else {
          statistics.inactive += 1;
        }

        if (user.isPremium) {
          statistics.premium += 1;
        }

        if (user.role === "admin") {
          statistics.admins += 1;
        }

        return statistics;
      },
      {
        total: 0,
        active: 0,
        inactive: 0,
        premium: 0,
        admins: 0,
      },
    );
  }, [users]);

  /* -------------------------------- */
  /* Filter users                     */
  /* -------------------------------- */

  const filteredUsers = useMemo(() => {
    const normalizedSearchTerm = searchTerm.trim().toLowerCase();

    return users.filter((user) => {
      const fullName =
        `${user.firstName || ""} ${user.lastName || ""}`.toLowerCase();

      const email = (user.email || "").toLowerCase();

      const matchesSearch =
        !normalizedSearchTerm ||
        fullName.includes(normalizedSearchTerm) ||
        email.includes(normalizedSearchTerm) ||
        String(user.id).includes(normalizedSearchTerm);

      const matchesRole = roleFilter === "all" || user.role === roleFilter;

      let matchesStatus = true;

      if (statusFilter === "active") {
        matchesStatus = Boolean(user.isActive);
      }

      if (statusFilter === "inactive") {
        matchesStatus = !user.isActive;
      }

      if (statusFilter === "premium") {
        matchesStatus = Boolean(user.isPremium);
      }

      if (statusFilter === "unverified") {
        matchesStatus = !user.emailVerified;
      }

      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [users, searchTerm, roleFilter, statusFilter]);

  /* -------------------------------- */
  /* Clear filters                    */
  /* -------------------------------- */

  const handleClearFilters = () => {
    setSearchTerm("");
    setRoleFilter("all");
    setStatusFilter("all");
  };

  const hasActiveFilters =
    searchTerm.trim() || roleFilter !== "all" || statusFilter !== "all";

  /* -------------------------------- */
  /* Open create-user dialog          */
  /* -------------------------------- */

  const handleOpenCreateDialog = () => {
    setCreateDialogError("");
    setCreateDialogOpen(true);
  };

  /* -------------------------------- */
  /* Close create-user dialog         */
  /* -------------------------------- */

  const handleCloseCreateDialog = () => {
    if (creating) {
      return;
    }

    setCreateDialogOpen(false);
    setCreateDialogError("");
  };

  /* -------------------------------- */
  /* Create user                      */
  /* -------------------------------- */

  const handleCreateUser = async (userData) => {
    try {
      setCreating(true);
      setCreateDialogError("");

      const response = await createAdminUser(token, userData);

      setCreateDialogOpen(false);

      setSuccessMessage(response.message || "Användaren skapades.");

      await loadUsers();
    } catch (error) {
      console.error("Could not create user:", error);

      setCreateDialogError(error.message || "Användaren kunde inte skapas.");
    } finally {
      setCreating(false);
    }
  };

  /* -------------------------------- */
  /* Open edit dialog                 */
  /* -------------------------------- */

  const handleOpenEditDialog = async (row) => {
    try {
      setSelectedUser(null);
      setDialogError("");
      setDialogLoading(true);
      setDialogOpen(true);

      const response = await getAdminUser(token, row.id);

      setSelectedUser(response.user);
    } catch (error) {
      console.error("Could not load selected user:", error);

      setDialogError(error.message || "Användaren kunde inte hämtas.");
    } finally {
      setDialogLoading(false);
    }
  };

  /* -------------------------------- */
  /* Close edit dialog                */
  /* -------------------------------- */

  const handleCloseDialog = () => {
    if (saving) {
      return;
    }

    setDialogOpen(false);
    setSelectedUser(null);
    setDialogError("");
    setDialogLoading(false);
  };

  /* -------------------------------- */
  /* Save edited user                 */
  /* -------------------------------- */

  const handleSaveUser = async (userData) => {
    if (!selectedUser) {
      setDialogError("Användaren kunde inte identifieras.");
      return;
    }

    try {
      setSaving(true);
      setDialogError("");

      const response = await updateAdminUser(token, selectedUser.id, userData);

      setDialogOpen(false);
      setSelectedUser(null);

      setSuccessMessage(response.message || "Användaren uppdaterades.");

      await loadUsers();
    } catch (error) {
      console.error("Could not update user:", error);

      setDialogError(error.message || "Användaren kunde inte uppdateras.");
    } finally {
      setSaving(false);
    }
  };

  /* -------------------------------- */
  /* Deactivate user                  */
  /* -------------------------------- */

  const handleDeactivateUser = async (user) => {
    if (currentAdmin?.id === user.id) {
      setPageError("Du kan inte inaktivera ditt eget konto.");
      return;
    }

    const fullName = `${user.firstName || ""} ${user.lastName || ""}`.trim();

    const confirmed = window.confirm(
      `Vill du inaktivera ${fullName}?\n\nAnvändaren kommer inte längre att kunna logga in.`,
    );

    if (!confirmed) {
      return;
    }

    try {
      setActionUserId(user.id);
      setPageError("");

      const response = await deactivateAdminUser(token, user.id);

      setSuccessMessage(response.message || "Användaren inaktiverades.");

      await loadUsers();
    } catch (error) {
      console.error("Could not deactivate user:", error);

      setPageError(error.message || "Användaren kunde inte inaktiveras.");
    } finally {
      setActionUserId(null);
    }
  };

  /* -------------------------------- */
  /* Activate user                    */
  /* -------------------------------- */

  const handleActivateUser = async (user) => {
    try {
      setActionUserId(user.id);
      setPageError("");

      const response = await activateAdminUser(token, user.id);

      setSuccessMessage(response.message || "Användaren aktiverades.");

      await loadUsers();
    } catch (error) {
      console.error("Could not activate user:", error);

      setPageError(error.message || "Användaren kunde inte aktiveras.");
    } finally {
      setActionUserId(null);
    }
  };

  /* -------------------------------- */
  /* Delete user permanently          */
  /* -------------------------------- */

  const handleDeleteUser = async (user) => {
    if (currentAdmin?.id === user.id) {
      setPageError("Du kan inte ta bort ditt eget konto.");
      return;
    }

    const fullName = `${user.firstName || ""} ${user.lastName || ""}`.trim();

    const confirmed = window.confirm(
      `Ta bort användaren permanent?\n\n${fullName}\n${user.email}\n\nKontot, quizhistoriken, resultaten och statistiken tas bort. Åtgärden kan inte ångras.`,
    );

    if (!confirmed) {
      return;
    }

    try {
      setActionUserId(user.id);
      setPageError("");

      const response = await deleteAdminUser(token, user.id);

      setSuccessMessage(response.message || "Användaren togs bort.");

      await loadUsers();
    } catch (error) {
      console.error("Could not delete user:", error);

      setPageError(error.message || "Användaren kunde inte tas bort.");
    } finally {
      setActionUserId(null);
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
          <Typography variant="h4">Användare</Typography>

          <Typography
            color="text.secondary"
            sx={{
              mt: 0.75,
            }}
          >
            Hantera roller, kontostatus, premiumåtkomst och verifiering.
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
            onClick={loadUsers}
            disabled={loading || creating || saving || Boolean(actionUserId)}
          >
            Uppdatera
          </Button>

          <Button
            variant="contained"
            startIcon={<AddRoundedIcon />}
            onClick={handleOpenCreateDialog}
            disabled={loading || creating || saving || Boolean(actionUserId)}
          >
            Ny användare
          </Button>
        </Stack>
      </Box>

      {/* Statistics */}

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, minmax(0, 1fr))",
            lg: "repeat(5, minmax(0, 1fr))",
          },
          gap: 2,
        }}
      >
        <UserStatisticCard label="Totalt" value={userStatistics.total} />

        <UserStatisticCard label="Aktiva" value={userStatistics.active} />

        <UserStatisticCard label="Inaktiva" value={userStatistics.inactive} />

        <UserStatisticCard label="Premium" value={userStatistics.premium} />

        <UserStatisticCard
          label="Administratörer"
          value={userStatistics.admins}
        />
      </Box>

      {/* Search and filters */}

      <Card variant="outlined">
        <CardContent>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                md: "minmax(280px, 1fr) 220px 220px auto",
              },
              alignItems: "center",
              gap: 2,
            }}
          >
            <TextField
              fullWidth
              size="small"
              label="Sök användare"
              placeholder="Namn, e-post eller ID"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              slotProps={{
                input: {
                  startAdornment: (
                    <SearchRoundedIcon
                      sx={{
                        mr: 1,
                        color: "text.secondary",
                      }}
                    />
                  ),
                },
              }}
            />

            <TextField
              select
              fullWidth
              size="small"
              label="Roll"
              value={roleFilter}
              onChange={(event) => setRoleFilter(event.target.value)}
            >
              {ROLE_FILTER_OPTIONS.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              select
              fullWidth
              size="small"
              label="Status"
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
            >
              {STATUS_FILTER_OPTIONS.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>

            <Button
              color="inherit"
              onClick={handleClearFilters}
              disabled={!hasActiveFilters}
            >
              Rensa
            </Button>
          </Box>

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              mt: 2,
            }}
          >
            Visar {filteredUsers.length} av {users.length} användare.
          </Typography>
        </CardContent>
      </Card>

      {/* Page error */}

      {pageError && (
        <Alert
          severity="error"
          onClose={() => setPageError("")}
          action={
            <Button color="inherit" size="small" onClick={loadUsers}>
              Försök igen
            </Button>
          }
        >
          {pageError}
        </Alert>
      )}

      {/* User table */}

      <UserTable
        rows={filteredUsers}
        loading={loading || creating || saving || Boolean(actionUserId)}
        onEdit={handleOpenEditDialog}
        onActivate={handleActivateUser}
        onDeactivate={handleDeactivateUser}
        onDelete={handleDeleteUser}
      />

      {/* Create-user dialog */}

      <CreateUserDialog
        open={createDialogOpen}
        saving={creating}
        error={createDialogError}
        onClose={handleCloseCreateDialog}
        onSave={handleCreateUser}
      />

      {/* Edit-user dialog */}

      <UserDialog
        open={dialogOpen}
        user={selectedUser}
        loading={dialogLoading}
        saving={saving}
        error={dialogError}
        onClose={handleCloseDialog}
        onSave={handleSaveUser}
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

function UserStatisticCard({ label, value }) {
  return (
    <Card variant="outlined">
      <CardContent>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            mb: 0.75,
          }}
        >
          {label}
        </Typography>

        <Typography
          variant="h4"
          sx={{
            fontWeight: 800,
          }}
        >
          {value}
        </Typography>
      </CardContent>
    </Card>
  );
}

export default AdminUsers;
