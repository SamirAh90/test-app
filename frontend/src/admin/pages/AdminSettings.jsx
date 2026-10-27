import { useCallback, useEffect, useState } from "react";

import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  MenuItem,
  Snackbar,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";

import BackupRoundedIcon from "@mui/icons-material/BackupRounded";
import CreditCardRoundedIcon from "@mui/icons-material/CreditCardRounded";
import DeleteSweepRoundedIcon from "@mui/icons-material/DeleteSweepRounded";
import HealthAndSafetyRoundedIcon from "@mui/icons-material/HealthAndSafetyRounded";
import PreviewRoundedIcon from "@mui/icons-material/PreviewRounded";
import RefreshRoundedIcon from "@mui/icons-material/RefreshRounded";
import SaveRoundedIcon from "@mui/icons-material/SaveRounded";
import StorageRoundedIcon from "@mui/icons-material/StorageRounded";

import { useAdminAuth } from "../contexts/AdminAuthContext";

import {
  getAdminSettings,
  previewUserCleanup,
  runUserCleanup,
  updateUserCleanupSettings,
} from "../services/adminApi";

/* -------------------------------- */
/* Options                          */
/* -------------------------------- */

const RETENTION_OPTIONS = [
  {
    value: "never",
    label: "Aldrig",
  },
  {
    value: "1_year",
    label: "Efter 1 år",
  },
  {
    value: "2_years",
    label: "Efter 2 år",
  },
];

const FREQUENCY_OPTIONS = [
  {
    value: "daily",
    label: "Dagligen",
  },
  {
    value: "weekly",
    label: "Varje vecka",
  },
  {
    value: "monthly",
    label: "Varje månad",
  },
];

/* -------------------------------- */
/* Helpers                          */
/* -------------------------------- */

const formatDateTime = (value) => {
  if (!value) {
    return "Har aldrig körts";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Okänt datum";
  }

  return date.toLocaleString("sv-SE", {
    dateStyle: "medium",
    timeStyle: "short",
  });
};

const formatNumber = (value) =>
  new Intl.NumberFormat("sv-SE").format(Number(value || 0));

const formatRole = (role) => {
  const labels = {
    user: "Användare",
    editor: "Redaktör",
    admin: "Administratör",
  };

  return labels[role] || role || "—";
};

const formatEnvironment = (environment) => {
  const labels = {
    development: "Development",
    production: "Production",
    test: "Test",
  };

  return labels[environment] || environment || "Okänd";
};

const formatUptime = (seconds = 0) => {
  const normalizedSeconds = Number(seconds || 0);

  const days = Math.floor(normalizedSeconds / 86400);
  const hours = Math.floor((normalizedSeconds % 86400) / 3600);
  const minutes = Math.floor((normalizedSeconds % 3600) / 60);

  if (days > 0) {
    return `${days} d ${hours} h`;
  }

  if (hours > 0) {
    return `${hours} h ${minutes} min`;
  }

  return `${minutes} min`;
};

const getHealthColor = (status) => {
  switch (status) {
    case "online":
    case "connected":
    case "running":
      return "success";

    case "warning":
    case "not_configured":
      return "warning";

    default:
      return "error";
  }
};

const getHealthLabel = (status) => {
  switch (status) {
    case "online":
      return "Online";

    case "connected":
      return "Ansluten";

    case "running":
      return "Aktiv";

    case "warning":
      return "Varning";

    case "not_configured":
      return "Ej konfigurerad";

    default:
      return "Fel";
  }
};

/* -------------------------------- */
/* Page                             */
/* -------------------------------- */

function AdminSettings() {
  const { token } = useAdminAuth();

  const [settings, setSettings] = useState(null);
  const [systemInformation, setSystemInformation] = useState(null);
  const [systemHealth, setSystemHealth] = useState(null);

  const [retention, setRetention] = useState("never");
  const [frequency, setFrequency] = useState("daily");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [cleanupRunning, setCleanupRunning] = useState(false);

  const [pageError, setPageError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewUsers, setPreviewUsers] = useState([]);
  const [previewRetention, setPreviewRetention] = useState("never");
  const [previewError, setPreviewError] = useState("");

  /* -------------------------------- */
  /* Load settings                    */
  /* -------------------------------- */

  const loadSettings = useCallback(async () => {
    try {
      setLoading(true);
      setPageError("");

      const response = await getAdminSettings(token);

      const userCleanup = response.settings?.userCleanup || null;

      const loadedSystemInformation =
        response.settings?.systemInformation || null;

      const loadedSystemHealth = response.settings?.systemHealth || null;

      setSettings(userCleanup);
      setSystemInformation(loadedSystemInformation);
      setSystemHealth(loadedSystemHealth);

      setRetention(userCleanup?.retention || "never");
      setFrequency(userCleanup?.frequency || "daily");
    } catch (error) {
      console.error("Could not load admin settings:", error);

      setPageError(error.message || "Inställningarna kunde inte hämtas.");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  /* -------------------------------- */
  /* Save settings                    */
  /* -------------------------------- */

  const handleSave = async () => {
    try {
      setSaving(true);
      setPageError("");

      const response = await updateUserCleanupSettings(token, {
        retention,
        frequency,
      });

      setSuccessMessage(response.message || "Inställningarna sparades.");

      await loadSettings();
    } catch (error) {
      console.error("Could not update cleanup settings:", error);

      setPageError(error.message || "Inställningarna kunde inte sparas.");
    } finally {
      setSaving(false);
    }
  };

  /* -------------------------------- */
  /* Preview cleanup                  */
  /* -------------------------------- */

  const handlePreview = async () => {
    try {
      setPreviewLoading(true);
      setPreviewError("");
      setPreviewUsers([]);
      setPreviewOpen(true);

      const response = await previewUserCleanup(token);

      setPreviewRetention(response.retention || "never");

      setPreviewUsers(Array.isArray(response.users) ? response.users : []);
    } catch (error) {
      console.error("Could not preview cleanup users:", error);

      setPreviewError(
        error.message ||
          "Användarna som väntar på borttagning kunde inte hämtas.",
      );
    } finally {
      setPreviewLoading(false);
    }
  };

  const handleClosePreview = () => {
    if (previewLoading || cleanupRunning) {
      return;
    }

    setPreviewOpen(false);
    setPreviewUsers([]);
    setPreviewError("");
  };

  /* -------------------------------- */
  /* Run cleanup                      */
  /* -------------------------------- */

  const handleRunCleanup = async () => {
    if (retention === "never") {
      setPageError(
        "Rensningen kan inte köras när lagringstiden är inställd på Aldrig.",
      );

      return;
    }

    const confirmed = window.confirm(
      "Vill du köra rensningen nu?\n\nAlla användare som uppfyller villkoren tas bort permanent. Åtgärden kan inte ångras.",
    );

    if (!confirmed) {
      return;
    }

    try {
      setCleanupRunning(true);
      setPageError("");

      const response = await runUserCleanup(token);

      setSuccessMessage(response.message || "Rensningen slutfördes.");

      setPreviewOpen(false);
      setPreviewUsers([]);

      await loadSettings();
    } catch (error) {
      console.error("Could not run user cleanup:", error);

      setPageError(error.message || "Rensningen kunde inte genomföras.");
    } finally {
      setCleanupRunning(false);
    }
  };

  const settingsChanged =
    Boolean(settings) &&
    (retention !== settings.retention || frequency !== settings.frequency);

  const scheduledUserCount = Number(settings?.scheduledUserCount || 0);

  if (loading && !settings) {
    return (
      <Box
        sx={{
          minHeight: 300,
          display: "grid",
          placeItems: "center",
        }}
      >
        <Stack
          spacing={2}
          sx={{
            alignItems: "center",
          }}
        >
          <CircularProgress />

          <Typography color="text.secondary">
            Hämtar inställningar...
          </Typography>
        </Stack>
      </Box>
    );
  }

  return (
    <Stack spacing={2.5}>
      {/* -------------------------------- */}
      {/* Header                           */}
      {/* -------------------------------- */}

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
          <Typography
            variant="h4"
            sx={{
              fontWeight: 800,
            }}
          >
            Inställningar
          </Typography>

          <Typography
            color="text.secondary"
            sx={{
              mt: 0.5,
            }}
          >
            Hantera system, användare och administration.
          </Typography>
        </Box>

        <Button
          variant="outlined"
          size="small"
          startIcon={<RefreshRoundedIcon />}
          onClick={loadSettings}
          disabled={loading || saving || previewLoading || cleanupRunning}
        >
          Uppdatera
        </Button>
      </Box>

      {pageError && (
        <Alert severity="error" onClose={() => setPageError("")}>
          {pageError}
        </Alert>
      )}

      {/* -------------------------------- */}
      {/* Settings grid                    */}
      {/* -------------------------------- */}

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            xl: "repeat(2, minmax(0, 1fr))",
          },
          gap: 2,
          alignItems: "start",
        }}
      >
        {/* -------------------------------- */}
        {/* User cleanup                     */}
        {/* -------------------------------- */}

        <SettingsCard
          icon={<DeleteSweepRoundedIcon />}
          title="Användarrensning"
          description="Hantera inaktiva konton och automatisk rensning."
        >
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                md: "repeat(2, minmax(0, 1fr))",
              },
              gap: 1.5,
            }}
          >
            <TextField
              select
              size="small"
              fullWidth
              label="Ta bort efter"
              value={retention}
              onChange={(event) => setRetention(event.target.value)}
              disabled={saving || cleanupRunning}
            >
              {RETENTION_OPTIONS.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              select
              size="small"
              fullWidth
              label="Rensningsfrekvens"
              value={frequency}
              onChange={(event) => setFrequency(event.target.value)}
              disabled={saving || cleanupRunning}
            >
              {FREQUENCY_OPTIONS.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          </Box>

          <CompactInfoGrid>
            <CompactInfo
              label="Senaste rensning"
              value={formatDateTime(settings?.lastRun)}
            />

            <CompactInfo
              label="Planerade för borttagning"
              value={scheduledUserCount}
              warning={scheduledUserCount > 0}
            />
          </CompactInfoGrid>

          <Alert
            severity="warning"
            sx={{
              py: 0,
            }}
          >
            Borttagning är permanent.
          </Alert>

          <Stack
            direction={{
              xs: "column",
              sm: "row",
            }}
            spacing={1}
            sx={{
              flexWrap: "wrap",
            }}
          >
            <Button
              size="small"
              variant="contained"
              startIcon={<SaveRoundedIcon />}
              onClick={handleSave}
              disabled={saving || cleanupRunning || !settingsChanged}
            >
              {saving ? "Sparar..." : "Spara"}
            </Button>

            <Button
              size="small"
              variant="outlined"
              startIcon={<PreviewRoundedIcon />}
              onClick={handlePreview}
              disabled={previewLoading || saving || cleanupRunning}
            >
              Förhandsgranska
            </Button>

            <Button
              size="small"
              variant="outlined"
              color="error"
              startIcon={<DeleteSweepRoundedIcon />}
              onClick={handleRunCleanup}
              disabled={
                retention === "never" ||
                cleanupRunning ||
                saving ||
                previewLoading
              }
            >
              {cleanupRunning ? "Rensar..." : "Kör nu"}
            </Button>
          </Stack>
        </SettingsCard>

        {/* -------------------------------- */}
        {/* System information               */}
        {/* -------------------------------- */}

        <SettingsCard
          icon={<StorageRoundedIcon />}
          title="Systeminformation"
          description="Teknisk information och aktuell databasstatistik."
        >
          {systemInformation ? (
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr",
                  md: "repeat(2, minmax(0, 1fr))",
                },
                columnGap: 3,
                rowGap: 0,
              }}
            >
              <CompactRow label="Frontend" value="v1.0.0" />

              <CompactRow
                label="Backend"
                value={`v${systemInformation.backendVersion || "—"}`}
              />

              <CompactRow
                label="Databas"
                value={systemInformation.database || "—"}
              />

              <CompactRow
                label="Miljö"
                value={formatEnvironment(systemInformation.environment)}
              />

              <CompactRow
                label="Node.js"
                value={systemInformation.nodeVersion || "—"}
              />

              <CompactRow
                label="Ämnen"
                value={formatNumber(systemInformation.totalSubjects)}
              />

              <CompactRow
                label="Frågor"
                value={formatNumber(systemInformation.totalQuestions)}
              />

              <CompactRow
                label="Användare"
                value={formatNumber(systemInformation.totalUsers)}
              />

              <CompactRow
                label="Premium"
                value={formatNumber(systemInformation.totalPremiumUsers)}
              />

              <CompactRow
                label="Analysaktiviteter"
                value={formatNumber(systemInformation.totalAnalyticsEvents)}
              />
            </Box>
          ) : (
            <Alert severity="info">
              Systeminformationen kunde inte hämtas.
            </Alert>
          )}
        </SettingsCard>

        {/* -------------------------------- */}
        {/* System health                    */}
        {/* -------------------------------- */}

        <SettingsCard
          icon={<HealthAndSafetyRoundedIcon />}
          title="Systemstatus"
          description="Aktuell status för systemets viktigaste tjänster."
        >
          {systemHealth ? (
            <>
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: {
                    xs: "1fr",
                    sm: "repeat(2, minmax(0, 1fr))",
                  },
                  gap: 1.25,
                }}
              >
                <CompactHealth label="API" health={systemHealth.api} />

                <CompactHealth label="Databas" health={systemHealth.database} />

                <CompactHealth label="Analys" health={systemHealth.analytics} />

                <CompactHealth
                  label="Bakgrundsjobb"
                  health={systemHealth.backgroundJobs}
                />
              </Box>

              <CompactInfoGrid>
                <CompactInfo
                  label="Drifttid"
                  value={formatUptime(systemHealth.uptimeSeconds)}
                />

                <CompactInfo
                  label="Senast kontrollerad"
                  value={formatDateTime(systemHealth.checkedAt)}
                />
              </CompactInfoGrid>
            </>
          ) : (
            <Alert severity="info">Systemstatus kunde inte hämtas.</Alert>
          )}
        </SettingsCard>

        {/* -------------------------------- */}
        {/* Database backup placeholder      */}
        {/* -------------------------------- */}

        <SettingsCard
          icon={<BackupRoundedIcon />}
          title="Databasbackup"
          description="Skapa, ladda ner och återställ säkerhetskopior."
          badge="Nästa steg"
        >
          <CompactInfoGrid>
            <CompactInfo label="Senaste backup" value="Ingen backup ännu" />

            <CompactInfo label="Status" value="Ej konfigurerad" />
          </CompactInfoGrid>

          <Stack
            direction={{
              xs: "column",
              sm: "row",
            }}
            spacing={1}
          >
            <Button size="small" variant="contained" disabled>
              Skapa backup
            </Button>

            <Button size="small" variant="outlined" disabled>
              Återställ backup
            </Button>
          </Stack>

          <Typography variant="caption" color="text.secondary">
            Backupfunktionen kopplas till backend i nästa steg.
          </Typography>
        </SettingsCard>

        {/* -------------------------------- */}
        {/* Payment placeholder              */}
        {/* -------------------------------- */}

        <SettingsCard
          icon={<CreditCardRoundedIcon />}
          title="Betalningar"
          description="Hantera Premiumpris och betalningsalternativ."
          badge="Kommer snart"
        >
          <CompactInfoGrid>
            <CompactInfo label="Premiumpris" value="499 kr" />

            <CompactInfo label="Betalningsmodell" value="Engångsbetalning" />
          </CompactInfoGrid>

          <Box
            sx={{
              display: "flex",
              gap: 1,
              flexWrap: "wrap",
            }}
          >
            <Chip size="small" variant="outlined" label="Kort" />

            <Chip size="small" variant="outlined" label="Swish" />

            <Chip size="small" variant="outlined" label="Klarna" />
          </Box>

          <Button
            size="small"
            variant="outlined"
            disabled
            sx={{
              alignSelf: "flex-start",
            }}
          >
            Hantera betalningar
          </Button>
        </SettingsCard>
      </Box>

      {/* -------------------------------- */}
      {/* Cleanup preview dialog           */}
      {/* -------------------------------- */}

      <Dialog
        open={previewOpen}
        onClose={handleClosePreview}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>Användare planerade för borttagning</DialogTitle>

        <DialogContent dividers>
          {previewLoading ? (
            <Box
              sx={{
                minHeight: 200,
                display: "grid",
                placeItems: "center",
              }}
            >
              <CircularProgress />
            </Box>
          ) : previewError ? (
            <Alert severity="error">{previewError}</Alert>
          ) : previewUsers.length === 0 ? (
            <Alert severity="info">
              Inga användare uppfyller villkoren för borttagning.
            </Alert>
          ) : (
            <Stack spacing={2}>
              <Alert severity="warning">
                {previewUsers.length} användare kommer att tas bort om
                rensningen körs.
              </Alert>

              <TableContainer
                sx={{
                  maxHeight: 380,
                  border: 1,
                  borderColor: "divider",
                  borderRadius: 1.5,
                }}
              >
                <Table stickyHeader size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Användare</TableCell>
                      <TableCell>E-post</TableCell>
                      <TableCell>Roll</TableCell>
                      <TableCell>Premium</TableCell>
                      <TableCell>Inaktiverad</TableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {previewUsers.map((user) => (
                      <TableRow key={user.id} hover>
                        <TableCell>
                          {`${user.firstName || ""} ${
                            user.lastName || ""
                          }`.trim() || "Okänd användare"}
                        </TableCell>

                        <TableCell>{user.email}</TableCell>

                        <TableCell>{formatRole(user.role)}</TableCell>

                        <TableCell>
                          <Chip
                            size="small"
                            color={user.isPremium ? "success" : "default"}
                            variant="outlined"
                            label={user.isPremium ? "Ja" : "Nej"}
                          />
                        </TableCell>

                        <TableCell>
                          {formatDateTime(user.deactivatedAt)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Stack>
          )}
        </DialogContent>

        <DialogActions>
          <Button
            color="inherit"
            onClick={handleClosePreview}
            disabled={cleanupRunning}
          >
            Stäng
          </Button>

          {previewUsers.length > 0 && (
            <Button
              variant="contained"
              color="error"
              startIcon={<DeleteSweepRoundedIcon />}
              onClick={handleRunCleanup}
              disabled={
                cleanupRunning || previewLoading || previewRetention === "never"
              }
            >
              {cleanupRunning ? "Rensar..." : "Kör rensning nu"}
            </Button>
          )}
        </DialogActions>
      </Dialog>

      {/* -------------------------------- */}
      {/* Success                          */}
      {/* -------------------------------- */}

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

/* -------------------------------- */
/* Settings card                    */
/* -------------------------------- */

function SettingsCard({ icon, title, description, badge, children }) {
  return (
    <Card
      variant="outlined"
      sx={{
        height: "100%",
        borderRadius: 2.5,
      }}
    >
      <CardContent
        sx={{
          p: 2.5,

          "&:last-child": {
            pb: 2.5,
          },
        }}
      >
        <Stack spacing={2}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              gap: 2,
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "flex-start",
                gap: 1.25,
              }}
            >
              <Box
                sx={{
                  width: 36,
                  height: 36,
                  flexShrink: 0,
                  display: "grid",
                  placeItems: "center",
                  borderRadius: 1.5,
                  backgroundColor: "action.hover",
                  color: "primary.main",
                }}
              >
                {icon}
              </Box>

              <Box>
                <Typography
                  variant="subtitle1"
                  sx={{
                    fontWeight: 800,
                  }}
                >
                  {title}
                </Typography>

                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    mt: 0.25,
                    lineHeight: 1.45,
                  }}
                >
                  {description}
                </Typography>
              </Box>
            </Box>

            {badge && <Chip size="small" variant="outlined" label={badge} />}
          </Box>

          <Divider />

          {children}
        </Stack>
      </CardContent>
    </Card>
  );
}

/* -------------------------------- */
/* Compact information              */
/* -------------------------------- */

function CompactInfoGrid({ children }) {
  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: {
          xs: "1fr",
          sm: "repeat(2, minmax(0, 1fr))",
        },
        gap: 1,
      }}
    >
      {children}
    </Box>
  );
}

function CompactInfo({ label, value, warning = false }) {
  return (
    <Box
      sx={{
        px: 1.5,
        py: 1.25,
        border: 1,
        borderColor: warning ? "warning.main" : "divider",
        borderRadius: 1.5,
        backgroundColor: warning ? "warning.50" : "background.default",
      }}
    >
      <Typography variant="caption" color="text.secondary">
        {label}
      </Typography>

      <Typography
        variant="body2"
        sx={{
          mt: 0.25,
          fontWeight: 700,
        }}
      >
        {value}
      </Typography>
    </Box>
  );
}

/* -------------------------------- */
/* Compact rows                     */
/* -------------------------------- */

function CompactRow({ label, value }) {
  return (
    <Box
      sx={{
        minHeight: 38,
        py: 0.75,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 2,
        borderBottom: 1,
        borderColor: "divider",
      }}
    >
      <Typography variant="body2" color="text.secondary">
        {label}
      </Typography>

      <Typography
        variant="body2"
        sx={{
          fontWeight: 700,
          textAlign: "right",
        }}
      >
        {value}
      </Typography>
    </Box>
  );
}

/* -------------------------------- */
/* Health                           */
/* -------------------------------- */

function CompactHealth({ label, health }) {
  return (
    <Box
      sx={{
        px: 1.5,
        py: 1.25,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 1,
        border: 1,
        borderColor: "divider",
        borderRadius: 1.5,
      }}
    >
      <Typography
        variant="body2"
        sx={{
          fontWeight: 700,
        }}
      >
        {label}
      </Typography>

      <Chip
        size="small"
        color={getHealthColor(health?.status)}
        variant="outlined"
        label={getHealthLabel(health?.status)}
      />
    </Box>
  );
}

export default AdminSettings;
