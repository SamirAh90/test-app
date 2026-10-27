import { useEffect, useState } from "react";

import {
  Alert,
  Box,
  Card,
  CardContent,
  CircularProgress,
  Grid,
  Stack,
  Typography,
} from "@mui/material";

import CategoryRoundedIcon from "@mui/icons-material/CategoryRounded";
import MenuBookRoundedIcon from "@mui/icons-material/MenuBookRounded";
import TranslateRoundedIcon from "@mui/icons-material/TranslateRounded";
import QuizRoundedIcon from "@mui/icons-material/QuizRounded";
import PeopleRoundedIcon from "@mui/icons-material/PeopleRounded";
import WorkspacePremiumRoundedIcon from "@mui/icons-material/WorkspacePremiumRounded";

import { useAdminAuth } from "../contexts/AdminAuthContext";
import { getAdminDashboard } from "../services/adminApi";

function StatisticCard({ title, value, icon, description }) {
  return (
    <Card>
      <CardContent>
        <Stack
          direction="row"
          alignItems="flex-start"
          justifyContent="space-between"
          spacing={2}
        >
          <Box>
            <Typography variant="body2" color="text.secondary">
              {title}
            </Typography>

            <Typography
              variant="h4"
              sx={{
                mt: 0.75,
              }}
            >
              {value}
            </Typography>

            {description && (
              <Typography variant="caption" color="text.secondary">
                {description}
              </Typography>
            )}
          </Box>

          <Box
            sx={{
              width: 44,
              height: 44,
              borderRadius: 2.5,
              display: "grid",
              placeItems: "center",
              backgroundColor: "action.hover",
              color: "secondary.main",
            }}
          >
            {icon}
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
}

function AdminDashboard() {
  const { token, adminUser } = useAdminAuth();

  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadDashboard() {
      try {
        setLoading(true);
        setError("");

        const response = await getAdminDashboard(token);

        setDashboard(response.dashboard);
      } catch (requestError) {
        console.error("Could not load admin dashboard:", requestError);

        setError(requestError.message);
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, [token]);

  if (loading) {
    return (
      <Stack
        spacing={2}
        sx={{
          minHeight: 320,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CircularProgress />

        <Typography color="text.secondary">Hämtar dashboard...</Typography>
      </Stack>
    );
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  const content = dashboard?.content || {};
  const users = dashboard?.users || {};

  return (
    <Stack spacing={4}>
      <Box>
        <Typography variant="h4">Hej {adminUser?.firstName}</Typography>

        <Typography
          color="text.secondary"
          sx={{
            mt: 0.75,
          }}
        >
          Här är en översikt över MedborgaTest.
        </Typography>
      </Box>

      <Box>
        <Typography
          variant="h6"
          sx={{
            mb: 2,
          }}
        >
          Innehåll
        </Typography>

        <Grid container spacing={2.5}>
          <Grid size={{ xs: 12, sm: 6, lg: 4 }}>
            <StatisticCard
              title="Ämnen"
              value={content.subjects ?? 0}
              description="UHR-ämnen"
              icon={<CategoryRoundedIcon />}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6, lg: 4 }}>
            <StatisticCard
              title="Studiematerial"
              value={content.studyMaterials ?? 0}
              description="Publicerade material"
              icon={<MenuBookRoundedIcon />}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6, lg: 4 }}>
            <StatisticCard
              title="Begrepp"
              value={content.glossaryTerms ?? 0}
              description="Ord och förklaringar"
              icon={<TranslateRoundedIcon />}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6, lg: 4 }}>
            <StatisticCard
              title="Frågor"
              value={content.questions ?? 0}
              description="Frågor i databasen"
              icon={<QuizRoundedIcon />}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6, lg: 4 }}>
            <StatisticCard
              title="Översättningar"
              value={content.questionTranslations ?? 0}
              description="Frågeöversättningar"
              icon={<TranslateRoundedIcon />}
            />
          </Grid>
        </Grid>
      </Box>

      {dashboard?.users && (
        <Box>
          <Typography
            variant="h6"
            sx={{
              mb: 2,
            }}
          >
            Användare
          </Typography>

          <Grid container spacing={2.5}>
            <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
              <StatisticCard
                title="Alla användare"
                value={users.total ?? 0}
                icon={<PeopleRoundedIcon />}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
              <StatisticCard
                title="Aktiva"
                value={users.active ?? 0}
                icon={<PeopleRoundedIcon />}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
              <StatisticCard
                title="Premium"
                value={users.premium ?? 0}
                icon={<WorkspacePremiumRoundedIcon />}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
              <StatisticCard
                title="Redaktörer"
                value={users.editors ?? 0}
                icon={<PeopleRoundedIcon />}
              />
            </Grid>
          </Grid>
        </Box>
      )}
    </Stack>
  );
}

export default AdminDashboard;
