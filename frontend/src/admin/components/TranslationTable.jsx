import { Button, Chip, Stack, Tooltip, Typography } from "@mui/material";

import TranslateRoundedIcon from "@mui/icons-material/TranslateRounded";

import AdminDataGrid from "./AdminDataGrid";

const LANGUAGE_LABELS = {
  en: "EN",
  ar: "AR",
  fa: "FA",
};

function TranslationTable({
  rows = [],
  loading = false,
  onTranslate = () => {},
}) {
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
      headerName: "Svensk fråga",
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
                maxWidth: 235,

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
      field: "translations",
      headerName: "Översättningar",
      width: 250,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <Stack
          direction="row"
          spacing={0.75}
          sx={{
            width: "100%",
            alignItems: "center",
          }}
        >
          {["en", "ar", "fa"].map((language) => {
            const status = params.row.translationStatus?.[language];

            let tooltipText = `${language}: saknas`;

            if (status?.complete) {
              tooltipText = `${status.label}: komplett`;
            } else if (status?.questionTranslated) {
              tooltipText = `${status.label}: delvis översatt`;
            }

            return (
              <Tooltip key={language} title={tooltipText}>
                <Chip
                  label={LANGUAGE_LABELS[language]}
                  size="small"
                  color={
                    status?.complete
                      ? "success"
                      : status?.questionTranslated
                        ? "warning"
                        : "default"
                  }
                  variant={status?.complete ? "filled" : "outlined"}
                />
              </Tooltip>
            );
          })}
        </Stack>
      ),
    },
    {
      field: "actions",
      headerName: "Åtgärder",
      width: 150,
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      renderCell: (params) => (
        <Button
          size="small"
          variant="outlined"
          startIcon={<TranslateRoundedIcon />}
          onClick={() => onTranslate(params.row)}
          sx={{
            minWidth: 120,
            height: 32,
            fontSize: 12,
          }}
        >
          Översätt
        </Button>
      ),
    },
  ];

  return (
    <AdminDataGrid
      rows={rows}
      columns={columns}
      loading={loading}
      minWidth={1100}
    />
  );
}

export default TranslationTable;
