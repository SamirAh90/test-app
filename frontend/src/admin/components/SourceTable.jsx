import {
  Button,
  Chip,
  IconButton,
  Link,
  Stack,
  Tooltip,
  Typography,
  useMediaQuery,
} from "@mui/material";

import { useTheme } from "@mui/material/styles";

import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import OpenInNewRoundedIcon from "@mui/icons-material/OpenInNewRounded";

import AdminDataGrid from "./AdminDataGrid";

function SourceTable({
  rows,
  loading,
  onEdit = () => {},
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
      field: "title",
      headerName: "Titel",
      width: 250,
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
      width: 280,
      sortable: false,
      filterable: false,
      renderCell: (params) => {
        const subjectName = params.row.Subject?.name || "Inget ämne";

        return (
          <Tooltip title={subjectName}>
            <Chip
              label={subjectName}
              size="small"
              sx={{
                maxWidth: 255,

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
      field: "url",
      headerName: "Webbadress",
      flex: 1,
      minWidth: 360,
      renderCell: (params) => (
        <Tooltip title={params.value || ""}>
          <Link
            href={params.value}
            target="_blank"
            rel="noopener noreferrer"
            underline="hover"
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 0.75,
              maxWidth: "100%",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            <Typography
              component="span"
              variant="body2"
              noWrap
              sx={{
                maxWidth: "100%",
              }}
            >
              {params.value}
            </Typography>

            <OpenInNewRoundedIcon
              sx={{
                flexShrink: 0,
                fontSize: 16,
              }}
            />
          </Link>
        </Tooltip>
      ),
    },
    {
      field: "displayOrder",
      headerName: "Ordning",
      width: 100,
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
                onClick={() => onEdit(params.row)}
                sx={{
                  minWidth: 78,
                  height: 30,
                  fontSize: 12,
                }}
              >
                Redigera
              </Button>

              <Button
                size="small"
                color="error"
                variant="outlined"
                onClick={() => onDelete(params.row)}
                sx={{
                  minWidth: 68,
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
      minWidth={1250}
    />
  );
}

export default SourceTable;
