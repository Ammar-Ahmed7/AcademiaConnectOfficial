/* eslint-disable no-unused-vars */

// Sidebar.jsx with professional theme
import { useState} from "react"
import {
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  Avatar,
  Paper,
  Tooltip,
  Divider,
  useTheme,
  alpha,
} from "@mui/material"
import { LayoutDashboard, Bell, User, Receipt, LogOut, GraduationCap, ChevronRight } from "lucide-react"
import { useNavigate, useLocation } from "react-router-dom"
import supabase from "../../../../supabase-client.js"

const Sidebar = () => {
  const theme = useTheme()
  const navigate = useNavigate()
  const location = useLocation()
  // eslint-disable-next-line no-unused-vars
  const [userName, setUserName] = useState("")
  const [userRole, setUserRole] = useState("Teacher")

  // Determine active route based on current path
  const currentPath = location.pathname
  const [selected, setSelected] = useState(() => {
    if (currentPath.includes("/dashboard")) return "dashboard"
    if (currentPath.includes("/notifications")) return "notifications"
    if (currentPath.includes("/profile")) return "profile"
    if (currentPath.includes("/salary")) return "salary"
    return "dashboard"
  })

 
  const handleItemClick = (value) => {
    setSelected(value)
    switch (value) {
      case "dashboard":
        navigate("/teacher/dashboard")
        break
      case "notifications":
        navigate("/teacher/notifications")
        break
      case "profile":
        navigate("/teacher/profile")
        break
      case "salary":
        navigate("/teacher/salary")
        break
    }
  }

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error && error.message !== "Auth session missing!") {
        console.error("Logout Error:", error.message)
        return
      }
      localStorage.clear()
      window.location.href = "/teacher-login"
    } catch (err) {
      console.error("Logout Error:", err)
    }
  }

  const menuItems = [
    { text: "Dashboard", icon: <LayoutDashboard size={20} />, value: "dashboard" },
    { text: "Notifications", icon: <Bell size={20} />, value: "notifications" },
    { text: "Profile", icon: <User size={20} />, value: "profile" },
    { text: "Salary Slips", icon: <Receipt size={20} />, value: "salary" },
  ]

  return (
    <Paper
      elevation={3}
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        height: "100vh",
        width: "240px",
        bgcolor: "#0a1f44",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        borderRight: "1px solid rgba(255, 255, 255, 0.1)",
        zIndex: 1200,
        overflow: "hidden",
      }}
    >
      <Box>
        <Box
          sx={{
            p: 3,
            textAlign: "center",
            bgcolor: alpha("#ffffff", 0.03),
            borderBottom: "1px solid rgba(255, 255, 255, 0.05)",
          }}
        >
          <Avatar
            sx={{
              width: 60,
              height: 60,
              mx: "auto",
              mb: 2,
              bgcolor: "white",
              color: "#0a1f44",
              boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
            }}
          >
            <GraduationCap size={28} />
          </Avatar>
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
        </Box>

        <Box sx={{ p: 2, mt: 1 }}>
          <List>
            {menuItems.map(({ text, icon, value }) => (
              <Tooltip title={text} placement="right" key={value}>
                <ListItem
                  className="cursor-pointer"
                  button
                  selected={selected === value}
                  onClick={() => handleItemClick(value)}
                  sx={{
                    mb: 1,
                    borderRadius: 2,
                    color: selected === value ? "#0a1f44" : alpha("#ffffff", 0.85),
                    bgcolor: selected === value ? "white" : "transparent",
                    position: "relative",
                    overflow: "hidden",
                    "&:hover": {
                      bgcolor: selected === value ? "white" : alpha("#ffffff", 0.1),
                    },
                    "&::before":
                      selected === value
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
                      minWidth: 36,
                    }}
                  >
                    {icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={text}
                    primaryTypographyProps={{
                      fontWeight: selected === value ? 600 : 500,
                      fontSize: "0.95rem",
                    }}
                  />
                  {selected === value && <ChevronRight size={16} style={{ color: theme.palette.primary.main }} />}
                </ListItem>
              </Tooltip>
            ))}
          </List>
        </Box>
      </Box>

      <Box sx={{ p: 2, mt: "auto" }}>
        <Divider sx={{ bgcolor: alpha("#ffffff", 0.1), my: 2 }} />
        <Tooltip title="Logout" placement="right">
          <ListItem
            button
            onClick={handleLogout}
            sx={{
              borderRadius: 2,
              color: alpha("#ffffff", 0.85),
              transition: "all 0.2s ease",
              "&:hover": {
                bgcolor: theme.palette.error.dark,
                color: "white",
              },
            }}
          >
            <ListItemIcon sx={{ color: "inherit", minWidth: 36 }}>
              <LogOut size={20} />
            </ListItemIcon>
            <ListItemText
              primary="Logout"
              primaryTypographyProps={{
                fontWeight: 500,
                fontSize: "0.95rem",
              }}
            />
          </ListItem>
        </Tooltip>
      </Box>
    </Paper>
  )
}

export default Sidebar
