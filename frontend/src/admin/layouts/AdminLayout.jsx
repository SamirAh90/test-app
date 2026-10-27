import { Box, Container, CssBaseline } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import { Outlet } from "react-router-dom";

import AdminSidebar from "../components/AdminSidebar";
import AdminTopbar from "../components/AdminTopbar";
import { useAdminAuth } from "../contexts/AdminAuthContext";
import adminTheme from "../theme/adminTheme";

function AdminLayout() {
  const { isAdmin } = useAdminAuth();

  return (
    <ThemeProvider theme={adminTheme}>
      <CssBaseline />

      <Box
        sx={{
          display: "flex",
          minHeight: "100vh",
          backgroundColor: "background.default",
        }}
      >
        <AdminSidebar isAdmin={isAdmin} />

        <Box
          sx={{
            flex: 1,
            minWidth: 0,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <AdminTopbar />

          <Box
            component="main"
            sx={{
              flex: 1,
              py: 4,
            }}
          >
            <Container maxWidth="xl">
              <Outlet />
            </Container>
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default AdminLayout;
