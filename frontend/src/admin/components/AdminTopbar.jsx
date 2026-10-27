import {
  AppBar,
  Avatar,
  Box,
  Button,
  Chip,
  Toolbar,
  Typography,
} from "@mui/material";

import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";

import { useNavigate } from "react-router-dom";

import { useAdminAuth } from "../contexts/AdminAuthContext";

function AdminTopbar() {
  const { adminUser, logout } = useAdminAuth();

  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/admin/login");
  };

  return (
    <AppBar
      position="sticky"
      color="inherit"
      elevation={0}
      sx={{
        backgroundColor: "#FFFFFF",
      }}
    >
      <Toolbar
        sx={{
          minHeight: "72px !important",
          px: 3,
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <Box>
          <Typography variant="h6" color="text.primary">
            Administration
          </Typography>

          <Typography variant="body2" color="text.secondary">
            Hantera MedborgaTest
          </Typography>
        </Box>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.5,
          }}
        >
          <Chip
            label={adminUser?.role === "admin" ? "Administratör" : "Redaktör"}
            size="small"
            color={adminUser?.role === "admin" ? "primary" : "secondary"}
          />

          <Avatar
            sx={{
              width: 38,
              height: 38,
              bgcolor: "secondary.main",
              fontSize: 15,
              fontWeight: 700,
            }}
          >
            {adminUser?.firstName?.charAt(0).toUpperCase() || "A"}
          </Avatar>

          <Box
            sx={{
              display: {
                xs: "none",
                sm: "block",
              },
            }}
          >
            <Typography variant="body2" fontWeight={700}>
              {adminUser?.firstName} {adminUser?.lastName}
            </Typography>

            <Typography variant="caption" color="text.secondary">
              {adminUser?.email}
            </Typography>
          </Box>

          <Button
            variant="text"
            color="inherit"
            startIcon={<LogoutRoundedIcon />}
            onClick={handleLogout}
          >
            Logga ut
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default AdminTopbar;
