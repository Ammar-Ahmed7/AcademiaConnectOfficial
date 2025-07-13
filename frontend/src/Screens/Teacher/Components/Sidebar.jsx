import { useState, useEffect } from "react";
import {
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  Avatar,
  Divider,
  useTheme,
  alpha,
  useMediaQuery,
  IconButton,
  Drawer,
  AppBar,
  Toolbar,
  Tooltip,
} from "@mui/material";
import {
  LayoutDashboard,
  Bell,
  User,
  LogOut,
  GraduationCap,
  ChevronRight,
  ChevronLeft,
  Menu,
  X,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import supabase from "../../../../supabase-client.js";

const Sidebar = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [mobileOpen, setMobileOpen] = useState(false);
  
  // Initialize state from localStorage
  const [isCollapsed, setIsCollapsed] = useState(() => {
    const savedState = localStorage.getItem("sidebarCollapsed");
    return savedState ? JSON.parse(savedState) : false;
  });

  const [userName, setUserName] = useState("");
  const [userRole, setUserRole] = useState("Teacher");

  // Determine active route based on current path
  const currentPath = location.pathname;
  const [selected, setSelected] = useState(() => {
    if (currentPath.includes("/dashboard")) return "dashboard";
    if (currentPath.includes("/notifications")) return "notifications";
    if (currentPath.includes("/profile")) return "profile";
    return "dashboard";
  });

  // Close mobile drawer when route changes
  useEffect(() => {
    if (isMobile) {
      setMobileOpen(false);
    }
  }, [location.pathname, isMobile]);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const toggleSidebar = () => {
    const newState = !isCollapsed;
    setIsCollapsed(newState);
    localStorage.setItem("sidebarCollapsed", JSON.stringify(newState));
  };

  const handleItemClick = (value) => {
    setSelected(value);
    switch (value) {
      case "dashboard":
        navigate("/teacher/dashboard");
        break;
      case "notifications":
        navigate("/teacher/notifications");
        break;
      case "profile":
        navigate("/teacher/profile");
        break;
    }
    if (isMobile) {
      setMobileOpen(false);
    }
  };

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error && error.message !== "Auth session missing!") {
        console.error("Logout Error:", error.message);
        return;
      }
      localStorage.clear();
      window.location.href = "/teacher-login";
    } catch (err) {
      console.error("Logout Error:", err);
    }
  };

  const menuItems = [
    { text: "Dashboard", icon: <LayoutDashboard size={20} />, value: "dashboard" },
    { text: "Notifications", icon: <Bell size={20} />, value: "notifications" },
    { text: "Profile", icon: <User size={20} />, value: "profile" },
  ];

  const sidebarContent = (
    <Box
      sx={{
        height: "100%",
        bgcolor: "#0a1f44",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        width: isCollapsed ? "80px" : "240px",
        transition: theme.transitions.create("width", {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.enteringScreen,
        }),
        overflowX: "hidden",
      }}
    >
      <Box>
        {/* Mobile Header with Close Button */}
        {isMobile && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              p: 2,
              borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
              bgcolor: "#0a1f44", // Ensure mobile header matches sidebar color
            }}
          >
            <Typography variant="h6" sx={{ color: "white", fontWeight: 600 }}>
              Menu
            </Typography>
            <IconButton
              onClick={handleDrawerToggle}
              sx={{ color: "white" }}
            >
              <X size={24} />
            </IconButton>
          </Box>
        )}

        {/* Logo/Profile Section - Always visible */}
        <Box
          sx={{
            p: isCollapsed ? 1.5 : 2,
            textAlign: "center",
            bgcolor: alpha("#ffffff", 0.03),
            borderBottom: "1px solid rgba(255, 255, 255, 0.05)",
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Avatar
            sx={{
              width: isCollapsed ? 40 : 60,
              height: isCollapsed ? 40 : 60,
              mb: 1,
              bgcolor: "white",
              color: "#0a1f44",
              boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
            }}
          >
            <GraduationCap size={isCollapsed ? 20 : 28} />
          </Avatar>
          {!isCollapsed && (
            <>
              <Typography variant="h6" sx={{ color: "white", fontWeight: 600, mb: 0.5 }}>
                {userName || "Teacher Portal"}
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: alpha("#ffffff", 0.7),
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 0.5,
                }}
              >
                {userRole}
                <Box
                  sx={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    bgcolor: theme.palette.success.main,
                    display: "inline-block",
                    ml: 1,
                  }}
                />
              </Typography>
            </>
          )}
        </Box>

        <Box sx={{ p: 2, mt: 1 }}>
          <List>
            {menuItems.map(({ text, icon, value }) => (
              <Tooltip title={isCollapsed ? text : ""} placement="right" key={value} disableHoverListener={isMobile}>
                <ListItem
                  button
                  selected={selected === value}
                  onClick={() => handleItemClick(value)}
                  sx={{
                    cursor: "pointer",
                    mb: 1,
                    borderRadius: 2,
                    color: selected === value ? "#0a1f44" : alpha("#ffffff", 0.85),
                    bgcolor: selected === value ? "white" : "transparent",
                    position: "relative",
                    overflow: "hidden",
                    justifyContent: isCollapsed ? 'center' : 'flex-start',
                    minHeight: 48,
                    px: isCollapsed ? 2 : 3,
                    "&:hover": {
                      bgcolor: selected === value ? "white" : alpha("#ffffff", 0.1),
                    },
                    "&::before":
                      selected === value && !isCollapsed
                        ? {
                            content: '""',
                            position: "absolute",
                            left: 0,
                            top: "50%",
                            transform: "translateY(-50%)",
                            width: 4,
                            height: "60%",
                            bgcolor: theme.palette.primary.main,
                            borderRadius: "0 4px 4px 0",
                          }
                        : {},
                  }}
                >
                  <ListItemIcon
                    sx={{
                      color: selected === value ? theme.palette.primary.main : alpha("#ffffff", 0.85),
                      minWidth: 0,
                      mr: isCollapsed ? 0 : 2,
                    }}
                  >
                    {icon}
                  </ListItemIcon>
                  {!isCollapsed && (
                    <ListItemText
                      primary={text}
                      primaryTypographyProps={{
                        fontWeight: selected === value ? 600 : 500,
                        fontSize: "0.95rem",
                      }}
                    />
                  )}
                  {!isCollapsed && selected === value && (
                    <ChevronRight size={16} style={{ color: theme.palette.primary.main }} />
                  )}
                </ListItem>
              </Tooltip>
            ))}
          </List>
        </Box>
      </Box>

      <Box sx={{ p: 2, mt: "auto" }}>
        <Divider sx={{ bgcolor: alpha("#ffffff", 0.1), my: 2 }} />
        <Tooltip title={isCollapsed ? "Logout" : ""} placement="right" disableHoverListener={isMobile}>
          <ListItem
            button
            onClick={handleLogout}
            sx={{
              cursor: "pointer",
              borderRadius: 2,
              color: alpha("#ffffff", 0.85),
              transition: "all 0.2s ease",
              justifyContent: isCollapsed ? 'center' : 'flex-start',
              minHeight: 48,
              px: isCollapsed ? 2 : 3,
              "&:hover": {
                bgcolor: theme.palette.error.dark,
                color: "white",
              },
            }}
          >
            <ListItemIcon sx={{ color: "inherit", minWidth: 0, mr: isCollapsed ? 0 : 2 }}>
              <LogOut size={20} />
            </ListItemIcon>
            {!isCollapsed && (
              <ListItemText
                primary="Logout"
                primaryTypographyProps={{
                  fontWeight: 500,
                  fontSize: "0.95rem",
                }}
              />
            )}
          </ListItem>
        </Tooltip>
      </Box>
    </Box>
  )

  return (
    <Box sx={{ position: "relative", height: "100%" }}>
      {/* Mobile App Bar - Fixed at top */}
      {isMobile && (
        <AppBar
          position="fixed"
          sx={{
            bgcolor: "#0a1f44",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            zIndex: theme.zIndex.drawer + 1,
            height: 64,
          }}
        >
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2 }}
            >
              <Menu />
            </IconButton>
            <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
              Teacher Portal
            </Typography>
          </Toolbar>
        </AppBar>
      )}

      {/* Desktop Sidebar */}
      {!isMobile && (
        <Drawer
          variant="permanent"
          open={!isCollapsed}
          sx={{
            width: isCollapsed ? 80 : 240,
            flexShrink: 0,
            "& .MuiDrawer-paper": {
              width: isCollapsed ? 80 : 240,
              boxSizing: "border-box",
              border: "none",
              transition: theme.transitions.create("width", {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen,
              }),
            },
          }}
        >
          {sidebarContent}
        </Drawer>
      )}

      {/* Mobile Drawer */}
      {isMobile && (
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: "block", md: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: 280,
              border: "none",
              bgcolor: "#0a1f44",
              zIndex: theme.zIndex.drawer,
            },
          }}
        >
          {sidebarContent}
        </Drawer>
      )}

      {/* Toggle Button - Fixed position */}
      {!isMobile && (
        <IconButton
          onClick={toggleSidebar}
          sx={{
            position: "fixed",
            top: isCollapsed ? 62 : 138,
            left: isCollapsed ? 55 : 217,
            bgcolor: "#0a1f44",
            border: `2px solid ${alpha("#ffffff", 0.2)}`,
            borderRadius: "50%",
           width: 40,
            height: 40,
            boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
            zIndex: theme.zIndex.drawer + 1,
            transition: theme.transitions.create(["left", "background-color"], {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen,
            }),
            "&:hover": {
              bgcolor: alpha("#0a1f44", 0.9),
              transform: "scale(1.05)",
            },
          }}
        >
          {isCollapsed ? (
            <ChevronRight size={16} color="#ffffff" />
          ) : (
            <ChevronLeft size={16} color="#ffffff" />
          )}
        </IconButton>
      )}
    </Box>
  )
}

export default Sidebar