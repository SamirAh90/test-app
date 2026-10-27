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

import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";

import AdminDataGrid from "./AdminDataGrid";

function QuestionTable({
  rows,
  loading,
  onEdit = () => {},
  onDelete = () => {},
}) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const difficultyLabels = {
    easy: "Lätt",
    medium: "Medel",
    hard: "Svår",
  };

  const difficultyColors = {
    easy: "success",
    medium: "warning",
    hard: "error",
  };

  const columns = [
    {
      field: "id",
      headerName: "ID",
      width: 70,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "question",
      headerName: "Fråga",
      flex: 1,
      minWidth: 360,
      renderCell: (params) => (
        <Tooltip title={params.value || ""}>
          <Typography
            variant="body2"
            noWrap
            sx={{
              width: "100%",
              fontWeight: 500,
            }}
          >
            {params.value}
          </Typography>
        </Tooltip>
      ),
    },
    {
      field: "subject",
      headerName: "Ämne",
      width: 260,
      sortable: false,
      filterable: false,
      renderCell: (params) => {
        const subjectName = params.row.subject?.name || "Inget ämne";

        return (
          <Tooltip title={subjectName}>
            <Chip
              label={subjectName}
              size="small"
              sx={{
                maxWidth: 240,

                "& .MuiChip-label": {
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                },
              }}
            />
          </Tooltip>
        );
      },
    },
    {
      field: "difficulty",
      headerName: "Svårighet",
      width: 120,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <Chip
          label={difficultyLabels[params.value] || params.value}
          color={difficultyColors[params.value] || "default"}
          size="small"
          variant="outlined"
        />
      ),
    },
    {
      field: "answerCount",
      headerName: "Svar",
      width: 90,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "translationCount",
      headerName: "Översättningar",
      width: 140,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "actions",
      headerName: "Åtgärder",
      width: isMobile ? 90 : 180,
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      renderCell: (params) => (
        <Stack
          direction="row"
          spacing={0.5}
          sx={{
            width: "100%",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {isMobile ? (
            <>
              <Tooltip title="Redigera">
                <IconButton
                  size="small"
                  color="primary"
                  onClick={() => onEdit(params.row)}
                >
                  <EditRoundedIcon fontSize="small" />
                </IconButton>
              </Tooltip>

              <Tooltip title="Ta bort">
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
                sx={{
                  minWidth: 78,
                  height: 30,
                  fontSize: 12,
                }}
                onClick={() => onEdit(params.row)}
              >
                Redigera
              </Button>

              <Button
                size="small"
                color="error"
                variant="outlined"
                sx={{
                  minWidth: 68,
                  height: 30,
                  fontSize: 12,
                }}
                onClick={() => onDelete(params.row)}
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
      minWidth={1250}
    />
  );
}

export default QuestionTable;
