import { Box, Paper } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";

function AdminDataGrid({
  rows,
  columns,
  loading = false,
  minWidth = 1200,
  pageSize = 10,
}) {
  return (
    <Paper
      sx={{
        width: "100%",
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          width: "100%",
          overflowX: "auto",
        }}
      >
        <Box
          sx={{
            minWidth: {
              xs: 900,
              md: minWidth,
            },
          }}
        >
          <DataGrid
            autoHeight
            rows={rows}
            columns={columns}
            loading={loading}
            showToolbar
            disableRowSelectionOnClick
            pageSizeOptions={[10, 25, 50]}
            initialState={{
              pagination: {
                paginationModel: {
                  page: 0,
                  pageSize,
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
              border: 0,

              "& .MuiDataGrid-columnHeaders": {
                backgroundColor: "background.default",
              },

              "& .MuiDataGrid-cell": {
                display: "flex",
                alignItems: "center",
              },

              "& .MuiDataGrid-cellContent": {
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              },

              "& .MuiDataGrid-cell[data-field='actions']": {
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              },

              "& .MuiDataGrid-cell[data-field='actions'] > div": {
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "100%",
              },
            }}
          />
        </Box>
      </Box>
    </Paper>
  );
}

export default AdminDataGrid;
