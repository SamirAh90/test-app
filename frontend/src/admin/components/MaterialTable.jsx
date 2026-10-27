import { Button, Chip, Paper, Stack } from "@mui/material";

import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";

import { DataGrid } from "@mui/x-data-grid";

function MaterialTable({ materials, loading, onEdit, onDelete }) {
  const rows = materials.map((item) => ({
    id: item.subject.id,
    subjectId: item.subject.id,
    subjectName: item.subject.name,
    slug: item.subject.slug,
    hasMaterial: item.hasMaterial,
    materialTitle: item.material?.title || "Inget material ännu",
    updatedAt: item.material?.updatedAt || null,
    originalItem: item,
  }));

  const columns = [
    {
      field: "id",
      headerName: "ID",
      width: 70,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "subjectName",
      headerName: "Ämne",
      flex: 1,
      minWidth: 260,
    },
    {
      field: "materialTitle",
      headerName: "Rubrik",
      flex: 1,
      minWidth: 260,
    },
    {
      field: "status",
      headerName: "Status",
      width: 140,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <Chip
          size="small"
          variant="outlined"
          color={params.row.hasMaterial ? "success" : "warning"}
          label={params.row.hasMaterial ? "Publicerat" : "Saknas"}
        />
      ),
    },
    {
      field: "updatedAt",
      headerName: "Senast uppdaterad",
      width: 180,
      valueFormatter: (value) => {
        if (!value) {
          return "—";
        }

        return new Date(value).toLocaleDateString("sv-SE");
      },
    },
    {
      field: "actions",
      headerName: "Åtgärder",
      width: 260,
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      renderCell: (params) => (
        <Stack
          direction="row"
          spacing={1}
          alignItems="center"
          sx={{
            width: "100%",
            flexWrap: "nowrap",
          }}
        >
          <Button
            size="small"
            variant="outlined"
            startIcon={<EditRoundedIcon />}
            onClick={() => onEdit(params.row.originalItem)}
          >
            {params.row.hasMaterial ? "Redigera" : "Skapa"}
          </Button>

          {params.row.hasMaterial && (
            <Button
              size="small"
              color="error"
              variant="outlined"
              startIcon={<DeleteOutlineRoundedIcon />}
              onClick={() => onDelete(params.row.originalItem)}
            >
              Ta bort
            </Button>
          )}
        </Stack>
      ),
    },
  ];

  return (
    <Paper
      sx={{
        width: "100%",
        overflow: "hidden",
      }}
    >
      <DataGrid
        rows={rows}
        columns={columns}
        loading={loading}
        showToolbar
        disableRowSelectionOnClick
        pageSizeOptions={[5, 10, 13]}
        initialState={{
          pagination: {
            paginationModel: {
              page: 0,
              pageSize: 10,
            },
          },
        }}
        slotProps={{
          toolbar: {
            quickFilterProps: {
              debounceMs: 300,
            },
          },
        }}
        sx={{
          minHeight: 620,
          border: 0,

          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: "background.default",
          },

          "& .MuiDataGrid-cell": {
            display: "flex",
            alignItems: "center",
            overflow: "visible",
          },

          "& .MuiDataGrid-cellContent": {
            overflow: "visible",
          },
        }}
      />
    </Paper>
  );
}

export default MaterialTable;
