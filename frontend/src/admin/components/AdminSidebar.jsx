import {
  Box,
  Divider,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";

import AnalyticsRoundedIcon from "@mui/icons-material/AnalyticsRounded";
import CategoryRoundedIcon from "@mui/icons-material/CategoryRounded";
import DashboardRoundedIcon from "@mui/icons-material/DashboardRounded";
import LanguageRoundedIcon from "@mui/icons-material/LanguageRounded";
import LinkRoundedIcon from "@mui/icons-material/LinkRounded";
import MenuBookRoundedIcon from "@mui/icons-material/MenuBookRounded";
import PaymentsRoundedIcon from "@mui/icons-material/PaymentsRounded";
import PeopleRoundedIcon from "@mui/icons-material/PeopleRounded";
import QuizRoundedIcon from "@mui/icons-material/QuizRounded";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";
import TranslateRoundedIcon from "@mui/icons-material/TranslateRounded";

import { NavLink } from "react-router-dom";

import logo from "../../assets/logo.png";

const drawerWidth = 260;

const navigationItems = [
  {
    label: "Dashboard",
    path: "/admin",
    icon: <DashboardRoundedIcon />,
    end: true,
  },
  {
    label: "Ämnen",
    path: "/admin/subjects",
    icon: <CategoryRoundedIcon />,
  },
  {
    label: "Studiematerial",
    path: "/admin/materials",
    icon: <MenuBookRoundedIcon />,
  },
  {
    label: "Källor",
    path: "/admin/sources",
    icon: <LinkRoundedIcon />,
  },
  {
    label: "Begrepp",
    path: "/admin/glossary",
    icon: <LanguageRoundedIcon />,
  },
  {
    label: "Frågor",
    path: "/admin/questions",
    icon: <QuizRoundedIcon />,
  },
  {
    label: "Översättningar",
    path: "/admin/translations",
    icon: <TranslateRoundedIcon />,
  },
  {
    label: "Användare",
    path: "/admin/users",
    icon: <PeopleRoundedIcon />,
    adminOnly: true,
  },
  {
    label: "Analys",
    path: "/admin/analytics",
    icon: <AnalyticsRoundedIcon />,
    adminOnly: true,
  },
  {
    label: "Betalningar",
    path: "/admin/payments",
    icon: <PaymentsRoundedIcon />,
    adminOnly: true,
  },
  {
    label: "Inställningar",
    path: "/admin/settings",
    icon: <SettingsRoundedIcon />,
    adminOnly: true,
  },
];

function AdminSidebar({ isAdmin }) {
  const visibleItems = navigationItems.filter(
    (item) => !item.adminOnly || isAdmin,
  );

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,

        "& .MuiDrawer-paper": {
          width: drawerWidth,
          boxSizing: "border-box",
          backgroundColor: "#0F172A",
          color: "#FFFFFF",
          borderRight: "none",
        },
      }}
    >
      <Box
        sx={{
          minHeight: 72,
          px: 2.5,
          display: "flex",
          alignItems: "center",
          gap: 1.5,
        }}
      >
        <Box
          component="img"
          src={logo}
          alt="MedborgaTest"
          sx={{
            width: 42,
            height: 42,
            objectFit: "contain",
          }}
        />

        <Box>
          <Typography
            variant="subtitle1"
            sx={{
              fontWeight: 800,
              lineHeight: 1.2,
            }}
          >
            MedborgaTest
          </Typography>

          <Typography
            variant="caption"
            sx={{
              color: "rgba(255,255,255,0.62)",
            }}
          >
            Adminportal
          </Typography>
        </Box>
      </Box>

      <Divider
        sx={{
          borderColor: "rgba(255,255,255,0.1)",
        }}
      />

      <Box
        sx={{
          px: 1.5,
          py: 2,
        }}
      >
        <Typography
          variant="overline"
          sx={{
            display: "block",
            px: 1.5,
            mb: 0.75,
            color: "rgba(255,255,255,0.45)",
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: "0.09em",
          }}
        >
          Administration
        </Typography>

        <List disablePadding>
          {visibleItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.end}
              style={{
                color: "inherit",
                textDecoration: "none",
              }}
            >
              {({ isActive }) => (
                <ListItemButton
                  selected={isActive}
                  sx={{
                    mb: 0.5,
                    borderRadius: 2,
                    color: isActive ? "#FFFFFF" : "rgba(255,255,255,0.72)",

                    "& .MuiListItemIcon-root": {
                      color: "inherit",
                    },

                    "&.Mui-selected": {
                      backgroundColor: "rgba(255,255,255,0.12)",
                    },

                    "&.Mui-selected:hover": {
                      backgroundColor: "rgba(255,255,255,0.16)",
                    },

                    "&:hover": {
                      backgroundColor: "rgba(255,255,255,0.08)",
                    },
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 40,
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>

                  <ListItemText
                    primary={item.label}
                    slotProps={{
                      primary: {
                        sx: {
                          fontSize: 14,
                          fontWeight: isActive ? 700 : 500,
                        },
                      },
                    }}
                  />
                </ListItemButton>
              )}
            </NavLink>
          ))}
        </List>
      </Box>
    </Drawer>
  );
}

export default AdminSidebar;
