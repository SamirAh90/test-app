import { useCallback, useEffect, useMemo, useState } from "react";

import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Divider,
  LinearProgress,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";

import RefreshRoundedIcon from "@mui/icons-material/RefreshRounded";

import { useAdminAuth } from "../contexts/AdminAuthContext";
import { getAdminAnalytics } from "../services/adminApi";

/* -------------------------------- */
/* Configuration                    */
/* -------------------------------- */

const TABLE_MAX_HEIGHT = 380;

/* -------------------------------- */
/* Labels                           */
/* -------------------------------- */

const QUIZ_TYPE_LABELS = {
  demo: "Demo",
  free: "Gratis test",
  subject: "Ämnestest",
  simulator: "Provsimulator",
};

const DIFFICULTY_LABELS = {
  easy: "Lätt",
  medium: "Medel",
  hard: "Svår",
};

const EVENT_LABELS = {
  landing_view: "Startsidan visad",
  landing_hero_seen: "Övre delen visad",
  landing_stats_seen: "Provstatistik visad",
  landing_subjects_seen: "Ämnen visade",
  landing_how_it_works_seen: "Så fungerar det visat",
  landing_demo_question_seen: "Exempelfråga visad",
  landing_features_seen: "Funktioner visade",
  landing_faq_seen: "Vanliga frågor visade",
  landing_cta_seen: "Avslutande uppmaning visad",
  landing_disclaimer_seen: "Information visad",

  hero_start_training_clicked: "Börja träna klickad",
  hero_study_material_clicked: "Studiematerial öppnat",

  navbar_logo_clicked: "Logotyp klickad",
  navbar_home_clicked: "Hem klickad",
  navbar_study_material_clicked: "Studiematerial klickat",
  navbar_glossary_clicked: "Begrepp klickat",
  navbar_trainer_clicked: "Träna klickad",
  navbar_about_clicked: "Om provet klickat",
  navbar_login_clicked: "Logga in klickad",

  language_changed: "Språk ändrat",
  trainer_explanation_language_changed: "Förklaringsspråk ändrat",

  trainer_page_viewed: "Träningssidan visad",
  trainer_demo_selected: "Gratis demo vald",
  trainer_register_selected: "Skapa konto valt",
  trainer_my_training_selected: "Min träning öppnad",
  trainer_smart_training_selected: "Smart träning vald",
  trainer_simulator_selected: "Provsimulator vald",
  trainer_premium_clicked: "Premium klickad",
  trainer_header_home_clicked: "Hem från träningssidan",
  trainer_header_login_clicked: "Inloggning från träningssidan",

  trainer_started: "Träning startad",
  question_answered: "Fråga besvarad",
  free_test_completed: "Gratis test slutfört",
  results_viewed: "Resultatsidan visad",

  registration_started: "Registrering startad",
  account_created: "Konto skapat",

  premium_viewed: "Premiumsidan visad",
  checkout_started: "Betalning påbörjad",
  payment_completed: "Betalning slutförd",
};

/* -------------------------------- */
/* Helpers                          */
/* -------------------------------- */

const formatNumber = (value) =>
  new Intl.NumberFormat("sv-SE").format(Number(value || 0));

const formatPercentage = (value) => `${Number(value || 0)} %`;

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

const getEventLabel = (eventName) =>
  EVENT_LABELS[eventName] || "Okänd aktivitet";

const getEventColor = (eventName) => {
  if (eventName === "payment_completed") {
    return "success";
  }

  if (
    eventName === "checkout_started" ||
    eventName === "trainer_premium_clicked"
  ) {
    return "warning";
  }

  if (eventName === "account_created" || eventName === "registration_started") {
    return "secondary";
  }

  if (
    eventName === "trainer_demo_selected" ||
    eventName === "trainer_started" ||
    eventName === "free_test_completed"
  ) {
    return "primary";
  }

  return "default";
};

/* -------------------------------- */
/* Main page                        */
/* -------------------------------- */

function AdminAnalytics() {
  const { token } = useAdminAuth();

  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState("");

  const loadAnalytics = useCallback(async () => {
    try {
      setLoading(true);
      setPageError("");

      const response = await getAdminAnalytics(token);

      setAnalytics(response.analytics || null);
    } catch (error) {
      console.error("Could not load admin analytics:", error);

      setPageError(error.message || "Analysinformationen kunde inte hämtas.");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    loadAnalytics();
  }, [loadAnalytics]);

  const overview = analytics?.overview || {};
  const marketing = analytics?.marketing || {};
  const learning = analytics?.learning || {};

  const conversionFunnel = Array.isArray(marketing.conversionFunnel)
    ? marketing.conversionFunnel
    : [];

  const landingSections = Array.isArray(marketing.landingSections)
    ? marketing.landingSections
    : [];

  const topEvents = Array.isArray(marketing.topEvents)
    ? marketing.topEvents
    : [];

  const recentEvents = Array.isArray(marketing.recentEvents)
    ? marketing.recentEvents
    : [];

  const popularSubjects = Array.isArray(learning.popularSubjects)
    ? learning.popularSubjects
    : [];

  const hardestSubjects = Array.isArray(learning.hardestSubjects)
    ? learning.hardestSubjects
    : [];

  const hardestQuestions = Array.isArray(learning.hardestQuestions)
    ? learning.hardestQuestions
    : [];

  const latestAttempts = Array.isArray(learning.latestAttempts)
    ? learning.latestAttempts
    : [];

  const funnelSummary = useMemo(() => {
    const landingVisitors = Number(overview.landingVisitors || 0);
    const trainerVisitors = Number(overview.trainerVisitors || 0);
    const accountsCreated = Number(overview.accountsCreated || 0);
    const completedPayments = Number(overview.completedPayments || 0);

    return {
      landingToTrainer:
        landingVisitors > 0
          ? Math.round((trainerVisitors / landingVisitors) * 100)
          : 0,

      landingToAccount:
        landingVisitors > 0
          ? Math.round((accountsCreated / landingVisitors) * 100)
          : 0,

      landingToPayment:
        landingVisitors > 0
          ? Math.round((completedPayments / landingVisitors) * 100)
          : 0,
    };
  }, [
    overview.landingVisitors,
    overview.trainerVisitors,
    overview.accountsCreated,
    overview.completedPayments,
  ]);

  if (loading && !analytics) {
    return (
      <Box
        sx={{
          minHeight: 320,
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
            Hämtar analysinformation...
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
          <Typography variant="h4">Analys</Typography>

          <Typography
            color="text.secondary"
            sx={{
              mt: 0.75,
            }}
          >
            Följ användare, konvertering, quizresultat och populära ämnen.
          </Typography>
        </Box>

        <Button
          variant="outlined"
          startIcon={<RefreshRoundedIcon />}
          onClick={loadAnalytics}
          disabled={loading}
        >
          Uppdatera
        </Button>
      </Box>

      {loading && <LinearProgress />}

      {pageError && (
        <Alert
          severity="error"
          action={
            <Button color="inherit" size="small" onClick={loadAnalytics}>
              Försök igen
            </Button>
          }
        >
          {pageError}
        </Alert>
      )}

      {!analytics && !loading && !pageError && (
        <Alert severity="info">
          Det finns ännu ingen analysinformation att visa.
        </Alert>
      )}

      {analytics && (
        <>
          <AnalyticsSectionHeader
            title="Översikt"
            description="Sammanfattning av användare, aktivitet och quizresultat."
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
            <AnalyticsCard
              label="Unika besökare"
              value={formatNumber(overview.uniqueVisitors)}
              secondary={`${formatNumber(
                overview.totalAnalyticsEvents,
              )} registrerade aktiviteter`}
            />

            <AnalyticsCard
              label="Totalt användare"
              value={formatNumber(overview.totalUsers)}
              secondary={`${formatNumber(
                overview.activeUsers,
              )} aktiva användare`}
            />

            <AnalyticsCard
              label="Premiumanvändare"
              value={formatNumber(overview.premiumUsers)}
              secondary={`${formatNumber(
                overview.inactiveUsers,
              )} inaktiva användare`}
            />

            <AnalyticsCard
              label="Quizförsök"
              value={formatNumber(overview.totalQuizAttempts)}
              secondary={`${formatNumber(
                overview.answeredQuestions,
              )} besvarade frågor`}
            />

            <AnalyticsCard
              label="Genomsnittligt resultat"
              value={formatPercentage(overview.averagePercentage)}
              secondary={`${formatNumber(
                overview.correctAnswers,
              )} korrekta svar`}
            />

            <AnalyticsCard
              label="Startsidesbesökare"
              value={formatNumber(overview.landingVisitors)}
              secondary={`${funnelSummary.landingToTrainer} % gick till träning`}
            />

            <AnalyticsCard
              label="Skapade konton"
              value={formatNumber(overview.accountsCreated)}
              secondary={`${funnelSummary.landingToAccount} % av startsidesbesökarna`}
            />

            <AnalyticsCard
              label="Slutförda betalningar"
              value={formatNumber(overview.completedPayments)}
              secondary={`${funnelSummary.landingToPayment} % total konvertering`}
            />
          </Box>

          <AnalyticsSectionHeader
            title="Konvertering"
            description="Se hur användarna rör sig från startsidan till konto och betalning."
          />

          <Card variant="outlined">
            <CardContent>
              {conversionFunnel.length === 0 ? (
                <EmptyMessage text="Ingen konverteringsdata finns ännu." />
              ) : (
                <AnalyticsTableContainer>
                  <Table stickyHeader size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Steg</TableCell>
                        <TableCell align="right">Besökare</TableCell>
                        <TableCell align="right">Från föregående</TableCell>
                        <TableCell align="right">Från startsidan</TableCell>
                        <TableCell align="right">Bortfall</TableCell>
                      </TableRow>
                    </TableHead>

                    <TableBody>
                      {conversionFunnel.map((step) => (
                        <TableRow key={step.eventName} hover>
                          <TableCell>
                            <Typography
                              variant="body2"
                              sx={{
                                fontWeight: 700,
                              }}
                            >
                              {step.position}. {step.label}
                            </Typography>
                          </TableCell>

                          <TableCell align="right">
                            {formatNumber(step.visitors)}
                          </TableCell>

                          <TableCell align="right">
                            <PercentageChip
                              value={step.conversionFromPrevious}
                            />
                          </TableCell>

                          <TableCell align="right">
                            {formatPercentage(step.conversionFromLanding)}
                          </TableCell>

                          <TableCell align="right">
                            <Stack
                              direction="row"
                              spacing={1}
                              sx={{
                                justifyContent: "flex-end",
                                alignItems: "center",
                              }}
                            >
                              <span>
                                {formatNumber(step.dropOffFromPrevious)}
                              </span>

                              {step.dropOffPercentage > 0 && (
                                <Chip
                                  size="small"
                                  color="warning"
                                  variant="outlined"
                                  label={formatPercentage(
                                    step.dropOffPercentage,
                                  )}
                                />
                              )}
                            </Stack>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </AnalyticsTableContainer>
              )}
            </CardContent>
          </Card>

          <AnalyticsSectionHeader
            title="Startsidan"
            description="Visar hur långt besökarna kommer på landningssidan."
          />

          <Card variant="outlined">
            <CardContent>
              {landingSections.length === 0 ? (
                <EmptyMessage text="Ingen data om landningssidans sektioner finns ännu." />
              ) : (
                <Box
                  sx={{
                    maxHeight: 400,
                    overflowY: "auto",
                    pr: 1,
                  }}
                >
                  <Stack spacing={2}>
                    {landingSections.map((section) => (
                      <Box key={section.eventName}>
                        <Stack
                          direction="row"
                          spacing={2}
                          sx={{
                            mb: 0.75,
                            justifyContent: "space-between",
                            alignItems: "center",
                          }}
                        >
                          <Box>
                            <Typography
                              variant="body2"
                              sx={{
                                fontWeight: 700,
                              }}
                            >
                              {section.position}. {section.label}
                            </Typography>

                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              {formatNumber(section.visitors)} besökare
                            </Typography>
                          </Box>

                          <Chip
                            size="small"
                            variant="outlined"
                            label={`${formatPercentage(
                              section.conversionFromLanding,
                            )} från startsidan`}
                          />
                        </Stack>

                        <LinearProgress
                          variant="determinate"
                          value={Math.min(
                            Number(section.conversionFromLanding || 0),
                            100,
                          )}
                          sx={{
                            height: 8,
                            borderRadius: 999,
                          }}
                        />
                      </Box>
                    ))}
                  </Stack>
                </Box>
              )}
            </CardContent>
          </Card>

          <AnalyticsSectionHeader
            title="Lärande"
            description="Populära ämnen och områden där användarna har störst svårigheter."
          />

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                lg: "repeat(2, minmax(0, 1fr))",
              },
              gap: 3,
            }}
          >
            <SubjectAnalyticsTable
              title="Populäraste ämnen"
              rows={popularSubjects}
              emptyText="Inga ämnesresultat finns ännu."
            />

            <SubjectAnalyticsTable
              title="Svåraste ämnen"
              rows={hardestSubjects}
              emptyText="Inga ämnesresultat finns ännu."
              showWrongAnswers
            />
          </Box>

          <AnalyticsSectionHeader
            title="Svåraste frågor"
            description="Frågor med högst andel felaktiga svar."
          />

          <Card variant="outlined">
            <CardContent>
              {hardestQuestions.length === 0 ? (
                <EmptyMessage text="Det finns ännu inte tillräckligt med frågedata." />
              ) : (
                <AnalyticsTableContainer>
                  <Table stickyHeader size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Fråga</TableCell>
                        <TableCell>Ämne</TableCell>
                        <TableCell>Svårighet</TableCell>
                        <TableCell align="right">Svar</TableCell>
                        <TableCell align="right">Fel</TableCell>
                        <TableCell align="right">Felprocent</TableCell>
                      </TableRow>
                    </TableHead>

                    <TableBody>
                      {hardestQuestions.map((item) => (
                        <TableRow key={item.questionId} hover>
                          <TableCell
                            sx={{
                              maxWidth: 420,
                            }}
                          >
                            <Typography
                              variant="body2"
                              sx={{
                                fontWeight: 600,
                              }}
                            >
                              {item.question}
                            </Typography>
                          </TableCell>

                          <TableCell>{item.subject?.name || "—"}</TableCell>

                          <TableCell>
                            <Chip
                              size="small"
                              variant="outlined"
                              label={
                                DIFFICULTY_LABELS[item.difficulty] ||
                                item.difficulty ||
                                "—"
                              }
                            />
                          </TableCell>

                          <TableCell align="right">
                            {formatNumber(item.totalAnswers)}
                          </TableCell>

                          <TableCell align="right">
                            {formatNumber(item.wrongAnswers)}
                          </TableCell>

                          <TableCell align="right">
                            <Chip
                              size="small"
                              color={
                                item.wrongPercentage >= 70
                                  ? "error"
                                  : item.wrongPercentage >= 40
                                    ? "warning"
                                    : "default"
                              }
                              label={formatPercentage(item.wrongPercentage)}
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </AnalyticsTableContainer>
              )}
            </CardContent>
          </Card>

          <AnalyticsSectionHeader
            title="Vanligaste aktiviteter"
            description="De aktiviteter som har registrerats flest gånger."
          />

          <Card variant="outlined">
            <CardContent>
              {topEvents.length === 0 ? (
                <EmptyMessage text="Inga aktiviteter har registrerats ännu." />
              ) : (
                <AnalyticsTableContainer>
                  <Table stickyHeader size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Aktivitet</TableCell>
                        <TableCell align="right">Totalt antal</TableCell>
                        <TableCell align="right">Unika besökare</TableCell>
                      </TableRow>
                    </TableHead>

                    <TableBody>
                      {topEvents.map((event) => (
                        <TableRow key={event.eventName} hover>
                          <TableCell>
                            <Chip
                              size="small"
                              variant="outlined"
                              color={getEventColor(event.eventName)}
                              label={getEventLabel(event.eventName)}
                            />
                          </TableCell>

                          <TableCell align="right">
                            {formatNumber(event.totalEvents)}
                          </TableCell>

                          <TableCell align="right">
                            {formatNumber(event.uniqueVisitors)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </AnalyticsTableContainer>
              )}
            </CardContent>
          </Card>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                xl: "repeat(2, minmax(0, 1fr))",
              },
              gap: 3,
            }}
          >
            <LatestAttemptsTable rows={latestAttempts} />
            <RecentEventsTable rows={recentEvents} />
          </Box>
        </>
      )}
    </Stack>
  );
}

/* -------------------------------- */
/* Reusable components              */
/* -------------------------------- */

function AnalyticsSectionHeader({ title, description }) {
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

function AnalyticsCard({ label, value, secondary }) {
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

function PercentageChip({ value }) {
  const normalizedValue = Number(value || 0);

  return (
    <Chip
      size="small"
      color={
        normalizedValue >= 70
          ? "success"
          : normalizedValue >= 40
            ? "warning"
            : "error"
      }
      variant="outlined"
      label={formatPercentage(normalizedValue)}
    />
  );
}

function AnalyticsTableContainer({ children }) {
  return (
    <TableContainer
      sx={{
        maxHeight: TABLE_MAX_HEIGHT,
        overflowY: "auto",
        border: 1,
        borderColor: "divider",
        borderRadius: 1.5,
      }}
    >
      {children}
    </TableContainer>
  );
}

function SubjectAnalyticsTable({
  title,
  rows,
  emptyText,
  showWrongAnswers = false,
}) {
  return (
    <Card variant="outlined">
      <CardContent>
        <Typography
          variant="h6"
          sx={{
            mb: 2,
            fontWeight: 800,
          }}
        >
          {title}
        </Typography>

        <Divider sx={{ mb: 2 }} />

        {rows.length === 0 ? (
          <EmptyMessage text={emptyText} />
        ) : (
          <AnalyticsTableContainer>
            <Table stickyHeader size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Ämne</TableCell>
                  <TableCell align="right">Svar</TableCell>

                  {showWrongAnswers && <TableCell align="right">Fel</TableCell>}

                  <TableCell align="right">Resultat</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {rows.map((item) => (
                  <TableRow key={item.subjectId} hover>
                    <TableCell>{item.subject?.name || "Okänt ämne"}</TableCell>

                    <TableCell align="right">
                      {formatNumber(item.totalAnswers)}
                    </TableCell>

                    {showWrongAnswers && (
                      <TableCell align="right">
                        {formatNumber(item.wrongAnswers)}
                      </TableCell>
                    )}

                    <TableCell align="right">
                      <PercentageChip value={item.accuracy} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </AnalyticsTableContainer>
        )}
      </CardContent>
    </Card>
  );
}

function LatestAttemptsTable({ rows }) {
  return (
    <Card variant="outlined">
      <CardContent>
        <Typography
          variant="h6"
          sx={{
            mb: 2,
            fontWeight: 800,
          }}
        >
          Senaste quizförsöken
        </Typography>

        <Divider sx={{ mb: 2 }} />

        {rows.length === 0 ? (
          <EmptyMessage text="Inga quizförsök finns ännu." />
        ) : (
          <AnalyticsTableContainer>
            <Table stickyHeader size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Användare</TableCell>
                  <TableCell>Typ</TableCell>
                  <TableCell align="right">Resultat</TableCell>
                  <TableCell>Datum</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {rows.map((attempt) => {
                  const fullName = attempt.user
                    ? `${attempt.user.firstName || ""} ${
                        attempt.user.lastName || ""
                      }`.trim()
                    : "Anonym";

                  return (
                    <TableRow key={attempt.id} hover>
                      <TableCell>
                        <Typography
                          variant="body2"
                          sx={{
                            fontWeight: 600,
                          }}
                        >
                          {fullName || "Anonym"}
                        </Typography>
                      </TableCell>

                      <TableCell>
                        {QUIZ_TYPE_LABELS[attempt.quizType] ||
                          attempt.quizType ||
                          "—"}
                      </TableCell>

                      <TableCell align="right">
                        <Chip
                          size="small"
                          label={`${attempt.score}/${attempt.totalQuestions} · ${attempt.percentage}%`}
                        />
                      </TableCell>

                      <TableCell>
                        <CompactDate value={attempt.completedAt} />
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </AnalyticsTableContainer>
        )}
      </CardContent>
    </Card>
  );
}

function RecentEventsTable({ rows }) {
  return (
    <Card variant="outlined">
      <CardContent>
        <Typography
          variant="h6"
          sx={{
            mb: 2,
            fontWeight: 800,
          }}
        >
          Senaste aktiviteter
        </Typography>

        <Divider sx={{ mb: 2 }} />

        {rows.length === 0 ? (
          <EmptyMessage text="Inga aktiviteter finns ännu." />
        ) : (
          <AnalyticsTableContainer>
            <Table stickyHeader size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Aktivitet</TableCell>
                  <TableCell>Användare</TableCell>
                  <TableCell>Sida</TableCell>
                  <TableCell>Datum</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {rows.map((event) => {
                  const fullName = event.user
                    ? `${event.user.firstName || ""} ${
                        event.user.lastName || ""
                      }`.trim()
                    : "Anonym";

                  return (
                    <TableRow key={event.id} hover>
                      <TableCell>
                        <Chip
                          size="small"
                          variant="outlined"
                          color={getEventColor(event.eventName)}
                          label={getEventLabel(event.eventName)}
                        />
                      </TableCell>

                      <TableCell>{fullName || "Anonym"}</TableCell>

                      <TableCell>
                        <Typography
                          variant="body2"
                          sx={{
                            maxWidth: 160,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                          title={event.pagePath || ""}
                        >
                          {event.pagePath || "—"}
                        </Typography>
                      </TableCell>

                      <TableCell>
                        <CompactDate value={event.createdAt} />
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </AnalyticsTableContainer>
        )}
      </CardContent>
    </Card>
  );
}

function CompactDate({ value }) {
  const formattedDate = formatDateParts(value);

  return (
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
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{
            whiteSpace: "nowrap",
          }}
        >
          {formattedDate.time}
        </Typography>
      )}
    </Stack>
  );
}

function EmptyMessage({ text }) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      sx={{
        py: 2,
      }}
    >
      {text}
    </Typography>
  );
}

export default AdminAnalytics;
