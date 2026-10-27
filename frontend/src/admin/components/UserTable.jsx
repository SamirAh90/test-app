import {
  Button,
  Chip,
  IconButton,
  Stack,
  Tooltip,
  Typography,
  useMediaQuery,
} from "@mui/material";

import { useTheme } from "@mui/material/styles";

import BlockRoundedIcon from "@mui/icons-material/BlockRounded";
import CheckCircleOutlineRoundedIcon from "@mui/icons-material/CheckCircleOutlineRounded";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";

import AdminDataGrid from "./AdminDataGrid";

const ROLE_LABELS = {
  user: "Användare",
  editor: "Redaktör",
  admin: "Administratör",
};

const formatDate = (value) => {
  if (!value) {
    return "Aldrig";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Okänt datum";
  }

  return date.toLocaleString("sv-SE", {
    dateStyle: "short",
    timeStyle: "short",
  });
};

function UserTable({
  rows = [],
  loading = false,
  onEdit = () => {},
  onActivate = () => {},
  onDeactivate = () => {},
  onDelete = () => {},
}) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const columns = [
    {
      field: "id",
      headerName: "ID",
      width: 70,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "name",
      headerName: "Namn",
      width: 210,
      sortable: false,
      valueGetter: (_value, row) =>
        `${row.firstName || ""} ${row.lastName || ""}`.trim(),
      renderCell: (params) => (
        <Tooltip title={params.value || ""}>
          <Typography
            variant="body2"
            noWrap
            sx={{
              width: "100%",
              fontWeight: 600,
            }}
          >
            {params.value || "Inget namn"}
          </Typography>
        </Tooltip>
      ),
    },
    {
      field: "email",
      headerName: "E-post",
      flex: 1,
      minWidth: 250,
      renderCell: (params) => (
        <Tooltip title={params.value || ""}>
          <Typography
            variant="body2"
            noWrap
            sx={{
              width: "100%",
            }}
          >
            {params.value}
          </Typography>
        </Tooltip>
      ),
    },
    {
      field: "role",
      headerName: "Roll",
      width: 150,
      renderCell: (params) => (
        <Chip
          label={ROLE_LABELS[params.value] || params.value}
          size="small"
          color={params.value === "admin" ? "primary" : "default"}
          variant={params.value === "admin" ? "filled" : "outlined"}
        />
      ),
    },
    {
      field: "isActive",
      headerName: "Status",
      width: 120,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <Chip
          label={params.value ? "Aktiv" : "Inaktiv"}
          size="small"
          color={params.value ? "success" : "default"}
          variant={params.value ? "filled" : "outlined"}
        />
      ),
    },
    {
      field: "isPremium",
      headerName: "Premium",
      width: 115,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <Chip
          label={params.value ? "Ja" : "Nej"}
          size="small"
          color={params.value ? "warning" : "default"}
          variant={params.value ? "filled" : "outlined"}
        />
      ),
    },
    {
      field: "emailVerified",
      headerName: "Verifierad",
      width: 120,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <Chip
          label={params.value ? "Ja" : "Nej"}
          size="small"
          color={params.value ? "success" : "default"}
          variant="outlined"
        />
      ),
    },
    {
      field: "lastLoginAt",
      headerName: "Senast inloggad",
      width: 170,
      valueFormatter: (value) => formatDate(value),
    },
    {
      field: "actions",
      headerName: "Åtgärder",
      width: isMobile ? 145 : 300,
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      renderCell: (params) => (
        <Stack
          direction="row"
          spacing={0.5}
          sx={{
            width: "100%",
            height: "100%",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {isMobile ? (
            <>
              <Tooltip title="Redigera">
                <IconButton size="small" onClick={() => onEdit(params.row)}>
                  <EditRoundedIcon fontSize="small" />
                </IconButton>
              </Tooltip>

              {params.row.isActive ? (
                <Tooltip title="Inaktivera">
                  <IconButton
                    size="small"
                    color="warning"
                    onClick={() => onDeactivate(params.row)}
                  >
                    <BlockRoundedIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              ) : (
                <Tooltip title="Aktivera">
                  <IconButton
                    size="small"
                    color="success"
                    onClick={() => onActivate(params.row)}
                  >
                    <CheckCircleOutlineRoundedIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              )}

              <Tooltip title="Ta bort permanent">
                <IconButton
                  size="small"
                  color="error"
                  onClick={() => onDelete(params.row)}
                >
                  <DeleteOutlineRoundedIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </>
          ) : (
            <>
              <Button
                size="small"
                variant="outlined"
                onClick={() => onEdit(params.row)}
                sx={{
                  minWidth: 74,
                  height: 30,
                  fontSize: 12,
                }}
              >
                Redigera
              </Button>

              {params.row.isActive ? (
                <Button
                  size="small"
                  color="warning"
                  variant="outlined"
                  onClick={() => onDeactivate(params.row)}
                  sx={{
                    minWidth: 88,
                    height: 30,
                    fontSize: 12,
                  }}
                >
                  Inaktivera
                </Button>
              ) : (
                <Button
                  size="small"
                  color="success"
                  variant="outlined"
                  onClick={() => onActivate(params.row)}
                  sx={{
                    minWidth: 78,
                    height: 30,
                    fontSize: 12,
                  }}
                >
                  Aktivera
                </Button>
              )}

              <Button
                size="small"
                color="error"
                variant="outlined"
                onClick={() => onDelete(params.row)}
                sx={{
                  minWidth: 72,
                  height: 30,
                  fontSize: 12,
                }}
              >
                Ta bort
              </Button>
            </>
          )}
        </Stack>
      ),
    },
  ];

  return (
    <AdminDataGrid
      rows={rows}
      columns={columns}
      loading={loading}
      minWidth={1500}
    />
  );
}

export default UserTable;
