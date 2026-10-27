import { useCallback, useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  FormControl,
  FormControlLabel,
  InputLabel,
  LinearProgress,
  MenuItem,
  Select,
  Stack,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";

import RefreshRoundedIcon from "@mui/icons-material/RefreshRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import TodayRoundedIcon from "@mui/icons-material/TodayRounded";
import DateRangeRoundedIcon from "@mui/icons-material/DateRangeRounded";
import RestartAltRoundedIcon from "@mui/icons-material/RestartAltRounded";

import { useAdminAuth } from "../contexts/AdminAuthContext";
import AdminCouponsSection from "../components/payments/AdminCouponsSection";
import AdminPremiumCodesSection from "../components/payments/AdminPremiumCodesSection";

import {
  getAdminPaymentSettings,
  getAdminPaymentStats,
  getAdminPaymentTransactions,
  updateAdminPaymentSettings,
} from "../services/adminApi";
/* -------------------------------- */
/* Helpers                          */
/* -------------------------------- */

const formatMoney = (amount, currency = "SEK") => {
  const value = Number(amount || 0) / 100;

  return new Intl.NumberFormat("sv-SE", {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(value);
};

const formatNumber = (value) =>
  new Intl.NumberFormat("sv-SE").format(Number(value || 0));

const formatDateParts = (value) => {
  if (!value) {
    return {
      date: "—",
      time: "",
    };
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return {
      date: "—",
      time: "",
    };
  }

  return {
    date: date.toLocaleDateString("sv-SE", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }),

    time: date.toLocaleTimeString("sv-SE", {
      hour: "2-digit",
      minute: "2-digit",
    }),
  };
};

const formatDateInput = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const getPaymentMethodLabel = (method) => {
  const labels = {
    card: "Kort",
    swish: "Swish",
    klarna: "Klarna",
  };

  return labels[method] || method || "—";
};

const getStatusLabel = (status) => {
  const labels = {
    pending: "Väntande",
    paid: "Betald",
    failed: "Misslyckad",
    refunded: "Återbetald",
    cancelled: "Avbruten",
  };

  return labels[status] || status || "—";
};

const getStatusColor = (status) => {
  if (status === "paid") {
    return "success";
  }

  if (status === "failed") {
    return "error";
  }

  if (status === "refunded") {
    return "warning";
  }

  if (status === "pending") {
    return "info";
  }

  return "default";
};

/* -------------------------------- */
/* Main page                        */
/* -------------------------------- */

function AdminPayments() {
  const { token } = useAdminAuth();

  const [stats, setStats] = useState(null);
  const [transactions, setTransactions] = useState([]);

  const [premiumPrice, setPremiumPrice] = useState("499");

  const [enabledPaymentMethods, setEnabledPaymentMethods] = useState({
    card: true,
    swish: true,
    klarna: true,
  });

  const [settingsSaving, setSettingsSaving] = useState(false);
  const [settingsSuccess, setSettingsSuccess] = useState("");

  const [loading, setLoading] = useState(true);
  const [transactionsLoading, setTransactionsLoading] = useState(false);

  const [pageError, setPageError] = useState("");

  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");

  const [paymentMethod, setPaymentMethod] = useState("all");
  const [status, setStatus] = useState("all");

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [totalTransactions, setTotalTransactions] = useState(0);

  const loadPaymentSettings = useCallback(async () => {
    const response = await getAdminPaymentSettings(token);

    const settings = response.settings || {};

    setPremiumPrice(
      settings.premiumPrice
        ? String(Number(settings.premiumPrice) / 100)
        : "499",
    );

    setEnabledPaymentMethods({
      card: settings.paymentMethods?.card ?? true,
      swish: settings.paymentMethods?.swish ?? true,
      klarna: settings.paymentMethods?.klarna ?? true,
    });
  }, [token]);

  const loadStats = useCallback(async () => {
    const response = await getAdminPaymentStats(token);

    setStats(response);
  }, [token]);

  const loadTransactions = useCallback(async () => {
    try {
      setTransactionsLoading(true);
      setPageError("");

      const response = await getAdminPaymentTransactions(token, {
        status,
        paymentMethod,
        search,
        startDate,
        endDate,
        page: page + 1,
        limit: rowsPerPage,
      });

      setTransactions(
        Array.isArray(response.transactions) ? response.transactions : [],
      );

      setTotalTransactions(Number(response.pagination?.total || 0));
    } catch (error) {
      console.error("Could not load payment transactions:", error);

      setPageError(
        error.message || "Betalningstransaktionerna kunde inte hämtas.",
      );
    } finally {
      setTransactionsLoading(false);
    }
  }, [
    token,
    status,
    paymentMethod,
    search,
    startDate,
    endDate,
    page,
    rowsPerPage,
  ]);

  const loadPage = useCallback(async () => {
    try {
      setLoading(true);
      setPageError("");

      await Promise.all([
        loadPaymentSettings(),
        loadStats(),
        loadTransactions(),
      ]);
    } catch (error) {
      console.error("Could not load payments:", error);

      setPageError(
        error.message || "Betalningsinformationen kunde inte hämtas.",
      );
    } finally {
      setLoading(false);
    }
  }, [loadPaymentSettings, loadStats, loadTransactions]);

  useEffect(() => {
    loadPage();
  }, [loadPage]);

  const handleSavePaymentSettings = async () => {
    try {
      setSettingsSaving(true);
      setSettingsSuccess("");
      setPageError("");

      const priceInKronor = Number(premiumPrice);

      if (!Number.isFinite(priceInKronor) || priceInKronor <= 0) {
        setPageError("Premiumpriset måste vara större än 0.");
        return;
      }

      if (
        !enabledPaymentMethods.card &&
        !enabledPaymentMethods.swish &&
        !enabledPaymentMethods.klarna
      ) {
        setPageError("Minst ett betalsätt måste vara aktiverat.");
        return;
      }

      const premiumPriceInOre = Math.round(priceInKronor * 100);

      const response = await updateAdminPaymentSettings(token, {
        premiumPrice: premiumPriceInOre,

        paymentMethods: {
          card: enabledPaymentMethods.card,
          swish: enabledPaymentMethods.swish,
          klarna: enabledPaymentMethods.klarna,
        },
      });

      setSettingsSuccess(
        response.message || "Betalningsinställningarna sparades.",
      );
    } catch (error) {
      console.error("Could not save payment settings:", error);

      setPageError(
        error.message || "Betalningsinställningarna kunde inte sparas.",
      );
    } finally {
      setSettingsSaving(false);
    }
  };
  const handleSearch = () => {
    setPage(0);
    setSearch(searchInput.trim());
  };

  const handleToday = () => {
    const today = formatDateInput(new Date());

    setStartDate(today);
    setEndDate(today);
    setPage(0);
  };

  const handleLast7Days = () => {
    const end = new Date();
    const start = new Date();

    start.setDate(start.getDate() - 6);

    setStartDate(formatDateInput(start));
    setEndDate(formatDateInput(end));
    setPage(0);
  };

  const handleLast30Days = () => {
    const end = new Date();
    const start = new Date();

    start.setDate(start.getDate() - 29);

    setStartDate(formatDateInput(start));
    setEndDate(formatDateInput(end));
    setPage(0);
  };

  const handleResetFilters = () => {
    setSearchInput("");
    setSearch("");
    setPaymentMethod("all");
    setStatus("all");
    setStartDate("");
    setEndDate("");
    setPage(0);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(Number(event.target.value));
    setPage(0);
  };

  if (loading && !stats) {
    return (
      <Box
        sx={{
          minHeight: 320,
          display: "grid",
          placeItems: "center",
        }}
      >
        <Stack spacing={2} sx={{ alignItems: "center" }}>
          <CircularProgress />

          <Typography color="text.secondary">
            Hämtar betalningsinformation...
          </Typography>
        </Stack>
      </Box>
    );
  }

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
          <Typography variant="h4">Betalningar</Typography>

          <Typography
            color="text.secondary"
            sx={{
              mt: 0.75,
            }}
          >
            Följ intäkter, köp, återbetalningar och betalningstransaktioner.
          </Typography>
        </Box>

        <Button
          variant="outlined"
          startIcon={<RefreshRoundedIcon />}
          onClick={loadPage}
          disabled={loading || transactionsLoading}
        >
          Uppdatera
        </Button>
      </Box>

      {(loading || transactionsLoading) && <LinearProgress />}

      {pageError && (
        <Alert
          severity="error"
          action={
            <Button color="inherit" size="small" onClick={loadPage}>
              Försök igen
            </Button>
          }
        >
          {pageError}
        </Alert>
      )}

      {settingsSuccess && (
        <Alert severity="success" onClose={() => setSettingsSuccess("")}>
          {settingsSuccess}
        </Alert>
      )}

      <PaymentSectionHeader
        title="Betalningsinställningar"
        description="Hantera premiumpris och vilka betalsätt som ska vara tillgängliga."
      />

      <Card variant="outlined">
        <CardContent>
          <Stack spacing={3}>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr",
                  md: "300px 1fr",
                },
                gap: 4,
                alignItems: "start",
              }}
            >
              <Box>
                <Typography
                  variant="subtitle1"
                  sx={{
                    fontWeight: 700,
                    mb: 1,
                  }}
                >
                  Premiumpris
                </Typography>

                <TextField
                  fullWidth
                  type="number"
                  label="Pris"
                  value={premiumPrice}
                  onChange={(event) => {
                    setPremiumPrice(event.target.value);
                    setSettingsSuccess("");
                  }}
                  slotProps={{
                    input: {
                      endAdornment: (
                        <Typography
                          color="text.secondary"
                          sx={{
                            ml: 1,
                          }}
                        >
                          kr
                        </Typography>
                      ),
                    },
                  }}
                />

                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{
                    display: "block",
                    mt: 1,
                  }}
                >
                  Detta är priset användaren betalar för Premium före eventuell
                  rabatt.
                </Typography>
              </Box>

              <Box>
                <Typography
                  variant="subtitle1"
                  sx={{
                    fontWeight: 700,
                    mb: 1,
                  }}
                >
                  Betalsätt
                </Typography>

                <Stack spacing={0.5}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={enabledPaymentMethods.card}
                        onChange={(event) => {
                          setEnabledPaymentMethods((current) => ({
                            ...current,
                            card: event.target.checked,
                          }));

                          setSettingsSuccess("");
                        }}
                      />
                    }
                    label="Kort"
                  />

                  <FormControlLabel
                    control={
                      <Switch
                        checked={enabledPaymentMethods.swish}
                        onChange={(event) => {
                          setEnabledPaymentMethods((current) => ({
                            ...current,
                            swish: event.target.checked,
                          }));

                          setSettingsSuccess("");
                        }}
                      />
                    }
                    label="Swish"
                  />

                  <FormControlLabel
                    control={
                      <Switch
                        checked={enabledPaymentMethods.klarna}
                        onChange={(event) => {
                          setEnabledPaymentMethods((current) => ({
                            ...current,
                            klarna: event.target.checked,
                          }));

                          setSettingsSuccess("");
                        }}
                      />
                    }
                    label="Klarna"
                  />
                </Stack>

                <Typography variant="caption" color="text.secondary">
                  Minst ett betalsätt måste vara aktiverat.
                </Typography>
              </Box>
            </Box>

            <Box>
              <Button
                variant="contained"
                onClick={handleSavePaymentSettings}
                disabled={settingsSaving}
              >
                {settingsSaving ? "Sparar..." : "Spara betalningsinställningar"}
              </Button>
            </Box>
          </Stack>
        </CardContent>
      </Card>

      <AdminCouponsSection />

      <AdminPremiumCodesSection />

      <PaymentSectionHeader
        title="Översikt"
        description="Sammanfattning av försäljning och betalningsstatus."
      />

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, minmax(0, 1fr))",
            lg: "repeat(4, minmax(0, 1fr))",
          },
          gap: 2,
        }}
      >
        <PaymentCard
          label="Total intäkt"
          value={formatMoney(stats?.totalRevenue, stats?.currency)}
          secondary={`${formatNumber(
            stats?.completedPayments,
          )} genomförda betalningar`}
        />

        <PaymentCard
          label="Intäkt denna månad"
          value={formatMoney(stats?.revenueThisMonth, stats?.currency)}
          secondary={`${formatNumber(
            stats?.purchasesThisMonth,
          )} köp denna månad`}
        />

        <PaymentCard
          label="Köp idag"
          value={formatNumber(stats?.purchasesToday)}
          secondary="Genomförda betalningar idag"
        />

        <PaymentCard
          label="Köp denna månad"
          value={formatNumber(stats?.purchasesThisMonth)}
          secondary="Genomförda köp denna månad"
        />

        <PaymentCard
          label="Betalda"
          value={formatNumber(stats?.completedPayments)}
          secondary="Totalt genomförda betalningar"
        />

        <PaymentCard
          label="Väntande"
          value={formatNumber(stats?.pendingPayments)}
          secondary="Betalningar som ännu behandlas"
        />

        <PaymentCard
          label="Misslyckade"
          value={formatNumber(stats?.failedPayments)}
          secondary="Betalningar som inte slutfördes"
        />

        <PaymentCard
          label="Återbetalda"
          value={formatNumber(stats?.refundedPayments)}
          secondary="Genomförda återbetalningar"
        />
      </Box>

      <PaymentSectionHeader
        title="Transaktioner"
        description="Historik över alla köp och betalningsförsök."
      />

      <Card variant="outlined">
        <CardContent>
          <Stack spacing={2.5}>
            <Stack
              direction={{
                xs: "column",
                sm: "row",
              }}
              spacing={1}
              flexWrap="wrap"
              useFlexGap
            >
              <Button
                variant="outlined"
                size="small"
                startIcon={<TodayRoundedIcon />}
                onClick={handleToday}
              >
                Idag
              </Button>

              <Button
                variant="outlined"
                size="small"
                startIcon={<DateRangeRoundedIcon />}
                onClick={handleLast7Days}
              >
                7 dagar
              </Button>

              <Button
                variant="outlined"
                size="small"
                startIcon={<DateRangeRoundedIcon />}
                onClick={handleLast30Days}
              >
                30 dagar
              </Button>

              <Button
                variant="text"
                size="small"
                startIcon={<RestartAltRoundedIcon />}
                onClick={handleResetFilters}
              >
                Återställ filter
              </Button>
            </Stack>

            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr",
                  md: "2fr 1fr 1fr",
                  xl: "2fr 1fr 1fr 1fr 1fr",
                },
                gap: 2,
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  gap: 1,
                }}
              >
                <TextField
                  fullWidth
                  size="small"
                  label="Sök"
                  placeholder="Namn, e-post eller transaktions-ID"
                  value={searchInput}
                  onChange={(event) => setSearchInput(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      handleSearch();
                    }
                  }}
                />

                <Button
                  variant="contained"
                  startIcon={<SearchRoundedIcon />}
                  onClick={handleSearch}
                >
                  Sök
                </Button>
              </Box>

              <FormControl fullWidth size="small">
                <InputLabel>Betalsätt</InputLabel>

                <Select
                  value={paymentMethod}
                  label="Betalsätt"
                  onChange={(event) => {
                    setPaymentMethod(event.target.value);
                    setPage(0);
                  }}
                >
                  <MenuItem value="all">Alla</MenuItem>
                  <MenuItem value="card">Kort</MenuItem>
                  <MenuItem value="swish">Swish</MenuItem>
                  <MenuItem value="klarna">Klarna</MenuItem>
                </Select>
              </FormControl>

              <FormControl fullWidth size="small">
                <InputLabel>Status</InputLabel>

                <Select
                  value={status}
                  label="Status"
                  onChange={(event) => {
                    setStatus(event.target.value);
                    setPage(0);
                  }}
                >
                  <MenuItem value="all">Alla</MenuItem>
                  <MenuItem value="paid">Betald</MenuItem>
                  <MenuItem value="pending">Väntande</MenuItem>
                  <MenuItem value="failed">Misslyckad</MenuItem>
                  <MenuItem value="refunded">Återbetald</MenuItem>
                  <MenuItem value="cancelled">Avbruten</MenuItem>
                </Select>
              </FormControl>

              <TextField
                fullWidth
                size="small"
                type="date"
                label="Från datum"
                value={startDate}
                onChange={(event) => {
                  setStartDate(event.target.value);
                  setPage(0);
                }}
                slotProps={{
                  inputLabel: {
                    shrink: true,
                  },
                }}
              />

              <TextField
                fullWidth
                size="small"
                type="date"
                label="Till datum"
                value={endDate}
                onChange={(event) => {
                  setEndDate(event.target.value);
                  setPage(0);
                }}
                slotProps={{
                  inputLabel: {
                    shrink: true,
                  },
                }}
              />
            </Box>

            <Typography variant="body2" color="text.secondary">
              {formatNumber(totalTransactions)} transaktioner
            </Typography>

            <PaymentTable rows={transactions} loading={transactionsLoading} />

            <TablePagination
              component="div"
              count={totalTransactions}
              page={page}
              onPageChange={handleChangePage}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              rowsPerPageOptions={[10, 25, 50, 100]}
              labelRowsPerPage="Rader per sida"
              labelDisplayedRows={({ from, to, count }) =>
                `${from}–${to} av ${count}`
              }
            />
          </Stack>
        </CardContent>
      </Card>
    </Stack>
  );
}

/* -------------------------------- */
/* Reusable components              */
/* -------------------------------- */

function PaymentSectionHeader({ title, description }) {
  return (
    <Box>
      <Typography
        variant="h5"
        sx={{
          fontWeight: 800,
        }}
      >
        {title}
      </Typography>

      <Typography
        color="text.secondary"
        sx={{
          mt: 0.5,
        }}
      >
        {description}
      </Typography>
    </Box>
  );
}

function PaymentCard({ label, value, secondary }) {
  return (
    <Card variant="outlined">
      <CardContent>
        <Typography variant="body2" color="text.secondary">
          {label}
        </Typography>

        <Typography
          variant="h4"
          sx={{
            mt: 0.75,
            fontWeight: 800,
          }}
        >
          {value}
        </Typography>

        <Typography
          variant="caption"
          color="text.secondary"
          sx={{
            display: "block",
            mt: 1,
          }}
        >
          {secondary}
        </Typography>
      </CardContent>
    </Card>
  );
}

function PaymentTable({ rows, loading }) {
  return (
    <TableContainer
      sx={{
        maxHeight: 500,
        overflowY: "auto",
        border: 1,
        borderColor: "divider",
        borderRadius: 1.5,
      }}
    >
      <Table stickyHeader size="small">
        <TableHead>
          <TableRow>
            <TableCell>Datum</TableCell>
            <TableCell>Användare</TableCell>
            <TableCell>E-post</TableCell>
            <TableCell>Betalsätt</TableCell>
            <TableCell>Belopp</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Leverantör</TableCell>
            <TableCell>Transaktions-ID</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {loading && rows.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8}>
                <Box
                  sx={{
                    py: 4,
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <CircularProgress size={28} />
                </Box>
              </TableCell>
            </TableRow>
          ) : rows.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8}>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    py: 3,
                    textAlign: "center",
                  }}
                >
                  Inga transaktioner hittades.
                </Typography>
              </TableCell>
            </TableRow>
          ) : (
            rows.map((transaction) => {
              const formattedDate = formatDateParts(transaction.createdAt);

              const fullName = transaction.user
                ? `${transaction.user.firstName || ""} ${
                    transaction.user.lastName || ""
                  }`.trim()
                : "Anonym";

              return (
                <TableRow key={transaction.id} hover>
                  <TableCell>
                    <Stack spacing={0}>
                      <Typography
                        variant="body2"
                        sx={{
                          whiteSpace: "nowrap",
                        }}
                      >
                        {formattedDate.date}
                      </Typography>

                      {formattedDate.time && (
                        <Typography variant="caption" color="text.secondary">
                          {formattedDate.time}
                        </Typography>
                      )}
                    </Stack>
                  </TableCell>

                  <TableCell>
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: 600,
                        whiteSpace: "nowrap",
                      }}
                    >
                      {fullName || "Anonym"}
                    </Typography>
                  </TableCell>

                  <TableCell>
                    {transaction.email || transaction.user?.email || "—"}
                  </TableCell>

                  <TableCell>
                    {getPaymentMethodLabel(transaction.paymentMethod)}
                  </TableCell>

                  <TableCell>
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: 700,
                        whiteSpace: "nowrap",
                      }}
                    >
                      {formatMoney(transaction.amount, transaction.currency)}
                    </Typography>
                  </TableCell>

                  <TableCell>
                    <Chip
                      size="small"
                      variant="outlined"
                      color={getStatusColor(transaction.status)}
                      label={getStatusLabel(transaction.status)}
                    />
                  </TableCell>

                  <TableCell>{transaction.provider || "—"}</TableCell>

                  <TableCell>
                    <Typography
                      variant="body2"
                      sx={{
                        maxWidth: 220,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                      title={transaction.providerTransactionId || ""}
                    >
                      {transaction.providerTransactionId || "—"}
                    </Typography>
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default AdminPayments;
