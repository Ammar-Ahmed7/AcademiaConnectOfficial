/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react/prop-types */
// Updated Dashboard.jsx with better calendar (MUI X) and notification UI
import React, { useState, useEffect } from "react"
import { Box, Typography, Paper, Grid, Button, CircularProgress, Chip, useTheme, alpha } from "@mui/material"
import NotificationsIcon from "@mui/icons-material/Notifications"
import Sidebar from "../Components/Sidebar"
import { useNavigate } from "react-router-dom"
import { supabase } from "../../../../supabase-client"
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { StaticDatePicker } from '@mui/x-date-pickers/StaticDatePicker'
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile"
import DownloadIcon from "@mui/icons-material/Download"
import ClassIcon from "@mui/icons-material/Class"
import EventIcon from "@mui/icons-material/Event"
import AnnouncementIcon from "@mui/icons-material/Announcement"
import ScheduleIcon from "@mui/icons-material/Schedule"

const Dashboard = () => {
  const theme = useTheme()
  const navigate = useNavigate()
  const [assignedClasses, setAssignedClasses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [notifications, setNotifications] = useState([])
  const [loadingNotices, setLoadingNotices] = useState(true)

  const [timetableFilePath, setTimetableFilePath] = useState(null)
  const [timetableFileName, setTimetableFileName] = useState("")
  const [timetableLoading, setTimetableLoading] = useState(true)

  const [calendarValue, setCalendarValue] = useState(new Date())

  useEffect(() => {
    const fetchTimetableFile = async () => {
      try {
        setTimetableLoading(true)
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser()
        if (userError) throw userError
        if (!user) return navigate("/")

        const { data: teacherData, error: teacherError } = await supabase
          .from("Teacher")
          .select("SchoolID")
          .eq("user_id", user.id)
          .single()
        if (teacherError) throw teacherError

        const { data: timetableData, error: timetableError } = await supabase
          .from("faculty_timetables")
          .select("file_path, file_name")
          .eq("school_id", teacherData.SchoolID)
          .single()
        if (timetableError) throw timetableError

        const filePath = timetableData?.file_path
        const fileName = timetableData?.file_name

        if (!filePath) return

        const { data: urlData } = supabase.storage.from("faculty-timetables").getPublicUrl(filePath)

        setTimetableFilePath(urlData?.publicUrl || null)
        setTimetableFileName(fileName || "")
      } catch (err) {
        console.error("Error fetching timetable file:", err)
      } finally {
        setTimetableLoading(false)
      }
    }

    fetchTimetableFile()
  }, [navigate])

  useEffect(() => {
    const fetchNotificationData = async () => {
      setLoadingNotices(true)
      try {
        setLoading(true)

        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser()
        if (userError) throw userError
        if (!user) return navigate("/")

        const { data: teacherData, error: teacherError } = await supabase
          .from("Teacher")
          .select("TeacherID, SchoolID")
          .eq("user_id", user.id)
          .single()
        if (teacherError) throw teacherError

        const today = new Date().toISOString().split("T")[0]

        const { data: adminNotices, error: adminError } = await supabase
          .from("Notice")
          .select("*")
          .eq("AudienceTeacher", true)
          .eq("CreatedType", "Admin")
          .eq("Status", "ON")  // Added Status condition
          .gte("EndDate", today)

        const { data: schoolNotices, error: schoolError } = await supabase
          .from("Notice")
          .select("*")
          .eq("AudienceTeacher", true)
          .eq("CreatedType", "School")
          .eq("CreatedBy", teacherData.SchoolID)
          .eq("Status", "ON")  // Added Status condition
          .gte("EndDate", today)

        if (adminError || schoolError) throw adminError || schoolError

        const allNotices = [...(adminNotices || []), ...(schoolNotices || [])]
        const sorted = allNotices.sort((a, b) => {
          if (a.Urgent === b.Urgent) {
            return new Date(b.created_at) - new Date(a.created_at)
          }
          return b.Urgent ? 1 : -1
        })

        setNotifications(sorted)
      } catch (err) {
        console.error("Dashboard load error:", err)
        setError("Failed to load dashboard data.")
      } finally {
        setLoadingNotices(false)
      }
    }

    fetchNotificationData()
  }, [navigate])

  useEffect(() => {
    const fetchAssignedClasses = async () => {
      try {
        setLoading(true)

        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser()

        if (userError) throw userError

        if (!user) {
          navigate("/")
          return
        }

        const { data: teacherData, error: teacherError } = await supabase
          .from("Teacher")
          .select("TeacherID")
          .eq("user_id", user.id)
          .single()

        if (teacherError) throw teacherError

        if (!teacherData) {
          setError("Teacher profile not found")
          setLoading(false)
          return
        }

        const { data: assignments, error: assignmentError } = await supabase
          .from("teacher_assignments")
          .select(`
            TeacherID,
            assignment_id,
            section_id,
            subjects,
            sections:section_id (
              section_name,
              class_id,
              classes:class_id (class_name)
            )
          `)
          .eq("TeacherID", teacherData.TeacherID)

        if (assignmentError) throw assignmentError

        const allSubjectIds = assignments.flatMap((a) => (a.subjects || []).map((sub) => sub))

        const uniqueSubjectIds = [...new Set(allSubjectIds)]

        const { data: subjectDetails, error: subjectError } = await supabase
          .from("subjects")
          .select("subject_id, subject_name")
          .in("subject_id", uniqueSubjectIds)

        if (subjectError) throw subjectError

        const subjectMap = {}
        ;(subjectDetails || []).forEach((sub) => {
          subjectMap[sub.subject_id] = sub.subject_name
        })

        const formattedClasses = assignments.map((a) => {
          const subjectList = (a.subjects || []).map((id) => ({
            id,
            name: subjectMap[id] || "Unknown Subject",
            rawData: a,
          }))

          return {
            className: a.sections?.classes?.class_name || "Unknown Class",
            classID: a.sections?.class_id || null,
            section: a.sections?.section_name || "Unknown Section",
            subjects: subjectList,
            displaySubjects: subjectList.map((s) => s.name).join(", "),
            day: "—",
            time: "—",
            rawData: a,
          }
        })

        setAssignedClasses(formattedClasses)
      } catch (err) {
        console.error("Error fetching assigned classes:", err)
        setError("Failed to load assigned classes")
      } finally {
        setLoading(false)
      }
    }

    fetchAssignedClasses()
  }, [navigate])

  const handleManageClick = (classInfo) => {
    if (classInfo.subjects && classInfo.subjects.length > 0) {
      const baseData = classInfo.subjects[0].rawData
      const enhancedData = {
        ...baseData,
        allSubjects: classInfo.subjects.map((subj) => ({
          name: subj.name,
          rawData: subj.rawData,
        })),
      }
      navigate("/teacher/class-management", { state: { classInfo: enhancedData } })
    } else {
      navigate("/teacher/class-management", { state: { classInfo: classInfo.rawData } })
    }
  }

  const formatDate = (dateStr) => {
    if (!dateStr) return ""
    const date = new Date(dateStr)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  // Professional card component
  const DashboardCard = ({ title, icon, children, height = 400 }) => (
    <Paper
      elevation={2}
      sx={{
        p: 3,
        height,
        display: "flex",
        flexDirection: "column",
        background: "white",
        borderRadius: 2,
        border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
        transition: "all 0.3s ease",
        overflow: "hidden",
        "&:hover": {
          boxShadow: `0 8px 24px ${alpha(theme.palette.primary.dark, 0.12)}`,
        },
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 42,
            height: 42,
            borderRadius: 1.5,
            bgcolor: alpha(theme.palette.primary.main, 0.1),
            mr: 2,
          }}
        >
          {React.cloneElement(icon, { sx: { color: theme.palette.primary.main, fontSize: 22 } })}
        </Box>
        <Typography
          variant="h6"
          sx={{
            color: theme.palette.text.primary,
            fontWeight: 600,
            fontSize: "1.1rem",
          }}
        >
          {title}
        </Typography>
      </Box>
      {children}
    </Paper>
  )

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "#f8fafc" }}>
      <Sidebar />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 2, md: 3, lg: 4 },
          ml: "240px",
          minHeight: "100vh",
        }}
      >
        {/* Header with gradient underline */}
        <Box sx={{ mb: 4, pb: 2, borderBottom: `1px solid ${alpha(theme.palette.primary.main, 0.1)}` }}>
          <Typography
            variant="h4"
            sx={{
              color: theme.palette.text.primary,
              fontWeight: 700,
              mb: 1,
              fontSize: { xs: "1.8rem", md: "2.2rem" },
            }}
          >
            Teacher Dashboard
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: theme.palette.text.secondary,
              fontSize: "1rem",
            }}
          >
            Welcome back! Here's what's happening in your classes today.
          </Typography>
        </Box>

        <Grid container spacing={3}>
          {/* Class Timetable */}
          <Grid item xs={12} md={6}>
            <DashboardCard title="Class Timetable" icon={<ScheduleIcon />}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
  {timetableLoading ? (
    <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
      <CircularProgress size={30} sx={{ color: theme.palette.primary.main }} />
    </Box>
  ) : timetableFilePath ? (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 48,
          height: 48,
          borderRadius: 1.5,
          bgcolor: alpha(theme.palette.error.main, 0.1),
        }}
      >
        <InsertDriveFileIcon sx={{ color: theme.palette.error.main, fontSize: 24 }} />
      </Box>
      <Box sx={{ flexGrow: 1 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 600, color: theme.palette.text.primary }}>
          {timetableFileName}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Class schedule document
        </Typography>
      </Box>
      <Button
        component="a"
        href={timetableFilePath}
        download={timetableFileName}
        variant="contained"
        startIcon={<DownloadIcon />}
        sx={{
          bgcolor: theme.palette.primary.main,
          color: "white",
          borderRadius: 1.5,
          textTransform: "none",
          fontWeight: 600,
          px: 3,
          "&:hover": {
            bgcolor: theme.palette.primary.dark,
            transform: "translateY(-1px)",
          },
        }}
      >
        Download
      </Button>
    </Box>
  ) : (
    <Box sx={{ textAlign: "left", px: 2 }}>
      <ScheduleIcon sx={{ fontSize: 48, color: alpha(theme.palette.text.primary, 0.2), mb: 2 }} />
      <Typography variant="body1" color="text.secondary">
        No timetable file available for this school.
      </Typography>
    </Box>
  )}
</Box>
            </DashboardCard>
          </Grid>

          {/* Calendar */}
          <Grid item xs={12} md={6}>
            <DashboardCard title="Calendar" icon={<EventIcon />}>
             <Box
  sx={{
    flexGrow: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    px: 1,
    "& .MuiPickersLayout-root": {
      borderRadius: 2,
      boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.1)}`,
      border: `1px solid ${alpha(theme.palette.primary.main, 0.15)}`,
      bgcolor: "white",
    },
  }}
>
  <LocalizationProvider dateAdapter={AdapterDateFns}>
    <StaticDatePicker
      displayStaticWrapperAs="desktop"
      value={calendarValue}
      onChange={(newValue) => setCalendarValue(newValue)}
      sx={{ width: "100%" }}
    />
  </LocalizationProvider>
</Box>

            </DashboardCard>
          </Grid>

          {/* Notifications */}
          <Grid item xs={12} md={6}>
            <DashboardCard title="Notifications & Announcements" icon={<AnnouncementIcon />}>
              <Box sx={{ flexGrow: 1, overflow: "auto" }}>
                {loadingNotices ? (
                  <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
                    <CircularProgress size={30} sx={{ color: theme.palette.primary.main }} />
                  </Box>
                ) : notifications.length === 0 ? (
                  <Box sx={{ textAlign: "center", mt: 4 }}>
                    <NotificationsIcon sx={{ fontSize: 48, color: alpha(theme.palette.text.primary, 0.2), mb: 2 }} />
                    <Typography variant="body1" color="text.secondary">
                      No notifications found.
                    </Typography>
                  </Box>
                ) : (
                  notifications.map((notification, index) => (
                    <Paper
  key={index}
  elevation={1}
  sx={{
    p: 2,
    mb: 2,
    borderRadius: 2,
    border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
    background:
      notification.CreatedType === "Admin"
        ? alpha(theme.palette.info.main, 0.08)
        : alpha(theme.palette.secondary.main, 0.08),
    borderLeft: `4px solid ${
      notification.CreatedType === "Admin"
        ? theme.palette.info.main
        : theme.palette.secondary.main
    }`,
    transition: "all 0.2s ease",
    "&:hover": {
      transform: "translateX(4px)",
      boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.1)}`,
    },
  }}
>
<Box
  sx={{
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: 36,
    height: 36,
    borderRadius: 1.5,
    bgcolor:
      notification.CreatedType === "Admin"
        ? theme.palette.info.main
        : theme.palette.secondary.main,
    flexShrink: 0,
  }}
>
  <NotificationsIcon sx={{ color: "white", fontSize: 18 }} />
</Box>
                        <Box sx={{ flexGrow: 1 }}>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                            <Typography variant="subtitle1" sx={{ fontWeight: 600, color: theme.palette.text.primary }}>
                              {notification.Title}
                            </Typography>
                            {notification.Urgent && (
                              <Chip
                                label="Urgent"
                                size="small"
                                sx={{
                                  bgcolor: theme.palette.error.main,
                                  color: "white",
                                  fontSize: "10px",
                                  height: 20,
                                  fontWeight: 600,
                                }}
                              />
                            )}
                          </Box>
                          <Typography
                            variant="caption"
                            sx={{ color: theme.palette.text.secondary, display: "block", mb: 1 }}
                          >
                            {`${formatDate(notification.StartDate)} - ${formatDate(notification.EndDate)}`}
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{ color: theme.palette.text.secondary, lineHeight: 1.5, mb: 1 }}
                          >
                            {notification.Message}
                          </Typography>
                          <Typography variant="caption" sx={{ color: alpha(theme.palette.text.primary, 0.6) }}>
                            From: {notification.CreatedType}
                          </Typography>
                        </Box>
                      
                    
                    </Paper>
                  ))
                )}
              </Box>
            </DashboardCard>
          </Grid>

          {/* Assigned Classes */}
          <Grid item xs={12} md={6}>
            <DashboardCard title="Assigned Classes" icon={<ClassIcon />}>
              <Box sx={{ flexGrow: 1, overflow: "auto" }}>
                {loading ? (
                  <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
                    <CircularProgress size={30} sx={{ color: theme.palette.primary.main }} />
                  </Box>
                ) : error ? (
                  <Typography color="error" sx={{ p: 2, textAlign: "center" }}>
                    {error}
                  </Typography>
                ) : assignedClasses.length === 0 ? (
                  <Box sx={{ textAlign: "center", mt: 4 }}>
                    <ClassIcon sx={{ fontSize: 48, color: alpha(theme.palette.text.primary, 0.2), mb: 2 }} />
                    <Typography variant="body1" color="text.secondary">
                      No classes assigned yet.
                    </Typography>
                  </Box>
                ) : (
                  assignedClasses.map((class_, index) => (
                    <Paper
                      key={index}
                      elevation={1}
                      sx={{
                        p: 2.5,
                        mb: 2,
                        borderRadius: 2,
                        border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        transition: "all 0.2s ease",
                        "&:hover": {
                          transform: "translateY(-2px)",
                          boxShadow: `0 6px 16px ${alpha(theme.palette.primary.main, 0.1)}`,
                        },
                      }}
                    >
                      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            width: 36,
                            height: 36,
                            borderRadius: 1.5,
                            bgcolor: alpha(theme.palette.primary.main, 0.1),
                          }}
                        >
                          <ClassIcon sx={{ color: theme.palette.primary.main, fontSize: 18 }} />
                        </Box>
                        <Box>
                          <Typography variant="subtitle1" sx={{ fontWeight: 600, color: theme.palette.text.primary }}>
                            {class_.className} - {class_.section}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {class_.displaySubjects || class_.subject}
                          </Typography>
                        </Box>
                      </Box>
                      <Button
                        variant="contained"
                        size="small"
                        onClick={() => handleManageClick(class_)}
                        sx={{
                          bgcolor: theme.palette.primary.main,
                          color: "white",
                          borderRadius: 1.5,
                          textTransform: "none",
                          fontWeight: 600,
                          px: 2.5,
                          "&:hover": {
                            bgcolor: theme.palette.primary.dark,
                            transform: "translateY(-1px)",
                          },
                        }}
                      >
                        Manage
                      </Button>
                    </Paper>
                  ))
                )}
              </Box>
            </DashboardCard>
          </Grid>
        </Grid>
      </Box>
    </Box>
  )
}

export default Dashboard
