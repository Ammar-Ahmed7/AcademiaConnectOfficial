"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../../supabase-client"; // Adjust the import path as needed

import {
  Box,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Alert,
  Paper,
  Grid,
  Divider,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Snackbar,
  InputAdornment,
} from "@mui/material";
import {
  Search as SearchIcon,
  Person as PersonIcon,
  School as SchoolIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Home as HomeIcon,
  Work as WorkIcon,
  Cake as CakeIcon,
  TransferWithinAStation as TransferIcon,
  Male as MaleIcon,
  Female as FemaleIcon,
  Badge as BadgeIcon,
  Cancel as CancelIcon,
  Apartment as ApartmentIcon,
} from "@mui/icons-material";
import { use } from "react";

function TransferTeacher() {
  const [cnic, setCnic] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [emailError, setEmailError] = useState(false);
  const [formattedCnic, setFormattedCnic] = useState("");
  const [teacherData, setTeacherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [newSchoolId, setNewSchoolId] = useState("");
  const [availableSchools, setAvailableSchools] = useState([]);
  const [success, setSuccess] = useState(null);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [alert, setAlert] = useState({
    open: false,
    severity: "info",
    message: "",
  });
  const [isFetching, setIsFetching] = useState(false);

  const checkEmailExists = async (email) => {
    try {
      const { data, error } = await supabase
        .from("Teacher")
        .select("Email")
        .eq("Email", email)
        .single();

      return !!data; // returns true if email exists
    } catch (err) {
      console.error("Error checking email:", err);
      return false;
    }
  };
  const formatCnicInput = (value) => {
    // Remove all non-digits
    const digitsOnly = value.replace(/\D/g, "");

    // Format as 31102-5522345-9 (5-7-1 format)
    let formatted = "";
    if (digitsOnly.length > 0) {
      formatted = digitsOnly.substring(0, 5);
      if (digitsOnly.length > 5) {
        formatted += "-" + digitsOnly.substring(5, 12);
        if (digitsOnly.length > 12) {
          formatted += "-" + digitsOnly.substring(12, 13);
        }
      }
    }

    return formatted;
  };

  const handleCnicChange = (e) => {
    const rawValue = e.target.value.replace(/-/g, "");
    if (rawValue.length <= 13 && /^\d*$/.test(rawValue)) {
      setCnic(rawValue);
      setFormattedCnic(formatCnicInput(rawValue));
    }
  };

  const fetchTeacherDetails = async () => {
    if (!formattedCnic) {
      setAlert({
        open: true,
        severity: "error",
        message: "Please enter a CNIC",
      });
      return;
    }

    if (formattedCnic.length !== 15) {
      setAlert({
        open: true,
        severity: "error",
        message: "CNIC must be exactly 13 digits",
      });
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);
    setIsFetching(true);
    console.log("i amCNIC", formattedCnic);

    try {
      const { data, error } = await supabase
        .from("Teacher")
        .select(
          `
    TeacherID,
    CNIC,
    Name,
    Email,
    PhoneNumber,
    Gender,
    DateOfBirth,
    ExperienceYear,
    Qualification,
    HireDate,
    EmployeeType,
    Address,
    Post,
    TeacherSubject,
    SchoolID,
    BPS,
    FatherName,
    Domicile,
    EmployementStatus,
    TransferedSchool,
    School:SchoolID (SchoolName),
    Disability,
    DisabilityDetails,
    EmployementType
    `
        )
        .eq("CNIC", formattedCnic)
        .eq("EmployementStatus", "Working")
        .single();

      // if (error) throw error

      console.log("Teacher data:", data);

      if (data) {
        setTeacherData(data);

        // Fetch all schools and filter out current one
        const { data: schoolsData, error: schoolsError } = await supabase
          .from("School")
          .select("SchoolID, SchoolName");

        if (schoolsError) throw schoolsError;

        const filteredSchools = schoolsData.filter(
          (school) => school.SchoolID !== data.SchoolID
        );

        setAvailableSchools(filteredSchools);
      } else {
        setAlert({
          open: true,
          severity: "error",
          message: "No teacher found against this CNIC",
        });
        setTeacherData(null);
      }
    } catch (err) {
      setAlert({
        open: true,
        severity: "error",
        message: err.message,
      });
      setTeacherData(null);
    } finally {
      setLoading(false);
    }
  };

  const cancelFetch = () => {
    setIsFetching(false);
    setTeacherData(null);
    setCnic("");
    setFormattedCnic("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchTeacherDetails();
  };

  const generateTeacherID = async (schoolId) => {
    if (!schoolId) return null;

    const formattedSchoolId = schoolId.replace(/-/g, "");
    const prefix = `T-${formattedSchoolId}-`;

    try {
      const { data, error } = await supabase
        .from("Teacher")
        .select("TeacherID")
        .filter("TeacherID", "like", `${prefix}%`);

      if (error) throw error;

      const filteredData = data.filter((entry) =>
        entry.TeacherID.startsWith(prefix)
      );
      const existingIds = filteredData.map((entry) =>
        Number.parseInt(entry.TeacherID.split("-").pop(), 10)
      );

      const nextNumber = (Math.max(...existingIds, 0) + 1)
        .toString()
        .padStart(2, "0");

      return `${prefix}${nextNumber}`;
    } catch (err) {
      console.error("Failed to generate Teacher ID:", err);
      throw new Error("Failed to generate Teacher ID");
    }
  };

  const handleOpenConfirmDialog = () => {
    if (!newSchoolId) {
      setAlert({
        open: true,
        severity: "error",
        message: "Please select a new school",
      });
      return;
    }
    setConfirmDialogOpen(true);
  };

  const handleCloseConfirmDialog = () => {
    setConfirmDialogOpen(false);
  };
  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleCloseAlert = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setAlert({ ...alert, open: false });
  };

  // const handleTransfer = async () => {
  //   setConfirmDialogOpen(false);

  //  if (!newSchoolId ) {
  //   setAlert({
  //     open: true,
  //     severity: "error",
  //     message: "Please select a new school ",
  //   });
  //   return;
  // }

  //   setLoading(true);
  //   setError(null);
  //   setSuccess(null);

  //   try {
  //     // Generate new teacher ID for the new school
  //     const newTeacherId = await generateTeacherID(newSchoolId);
  //     if (!newTeacherId) throw new Error("Could not generate Teacher ID");

  //     // Get the new school's name for the success message
  //     const { data: schoolData, error: schoolError } = await supabase
  //       .from("School")
  //       .select("SchoolName")
  //       .eq("SchoolID", newSchoolId)
  //       .single();

  //     if (schoolError) throw schoolError;

  //     // Create a new teacher record in the new school
  //     const { error: insertError } = await supabase.from("Teacher").insert([
  //       {
  //         TeacherID: newTeacherId,
  //         CNIC: formattedCnic, // Use formatted CNIC with dashes
  //         Name: teacherData.Name,
  //         Email: teacherData.Email,
  //         PhoneNumber: teacherData.PhoneNumber,
  //         Gender: teacherData.Gender,
  //         DateOfBirth: teacherData.DateOfBirth,
  //         ExperienceYear: teacherData.ExperienceYear,
  //         Qualification: teacherData.Qualification,
  //         HireDate: new Date().toISOString(), // New hire date for the transfer
  //         EmployeeType: teacherData.EmployeeType,
  //         Address: teacherData.Address,
  //         Post: teacherData.Post,
  //         TeacherSubject: teacherData.TeacherSubject,
  //         SchoolID: newSchoolId,
  //         BPS: teacherData.BPS,
  //         FatherName: teacherData.FatherName,
  //         Domicile: teacherData.Domicile,
  //         EmployementStatus: "Working",
  //         // Only include these fields if they exist in teacherData
  //         ...(teacherData.Disability && { Disability: teacherData.Disability }),
  //         ...(teacherData.DisabilityDetails && {
  //           DisabilityDetails: teacherData.DisabilityDetails,
  //         }),
  //         ...(teacherData.EmployementType && {
  //           EmployementType: teacherData.EmployementType,
  //         }),
  //       },
  //     ]);

  //     if (insertError) throw insertError;

  //     // Update the original teacher record
  //     const { error: updateError } = await supabase
  //       .from("Teacher")
  //       .update({
  //         EmployementStatus: "Transferred",
  //         TransferedSchool: newSchoolId,
  //         TransferDate: new Date().toISOString(),
  //       })
  //       .eq("TeacherID", teacherData.TeacherID);

  //     if (updateError) throw updateError;

  //     setAlert({
  //       open: true,
  //       severity: "success",
  //       message: `Teacher successfully transferred to ${schoolData.SchoolName} with new ID: ${newTeacherId}`,
  //     });

  //     // Refresh the data to show the transfer was successful
  //     await fetchTeacherDetails();
  //   } catch (err) {
  //     setAlert({
  //       open: true,
  //       severity: "error",
  //       message: err.message,
  //     });
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Auth event:", event, session);
      if (event === "SIGNED_OUT") {
        // Handle logout gracefully
        console.warn("Unexpected logout detected!");
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const checkSession = async () => {
    const { data, error } = await supabase.auth.getSession();
    if (error) {
      console.error("Session check failed:", error);
      return null;
    }
    return data.session;
  };

  // Usage example

  const handleTransfer = async () => {
    setConfirmDialogOpen(false);
    setLoading(true);

    // Validate inputs
    if (!newSchoolId || !newEmail) {
      setAlert({
        open: true,
        severity: "error",
        message: "Please select a new school and provide a new email",
      });
      setLoading(false);
      return;
    }

    // Validate email format
    if (!validateEmail(newEmail)) {
      setAlert({
        open: true,
        severity: "error",
        message: "Please enter a valid email address",
      });
      setLoading(false);
      return;
    }

    try {
      // 1. Store current admin session BEFORE any auth operations
      const {
        data: { session: currentSession },
        error: sessionError,
      } = await supabase.auth.getSession();
      if (sessionError || !currentSession) {
        throw new Error("Admin session not found");
      }
      console.log("Step 1 - Current admin session stored");

      // 2. Check if email already exists in Teacher table
      const { count: emailCount } = await supabase
        .from("Teacher")
        .select("*", { count: "exact", head: true })
        .eq("Email", newEmail);

      if (emailCount && emailCount > 0) {
        throw new Error("This email is already registered to another teacher");
      }
      console.log("Step 2 - Email validation passed");

      // 3. Generate new teacher ID
      const newTeacherId = await generateTeacherID(newSchoolId);
      if (!newTeacherId) throw new Error("Failed to generate Teacher ID");
      console.log("Step 3 - New teacher ID generated:", newTeacherId);

      // 4. Create auth user (this will change the current session)
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: newEmail,
        password: "Ww@123#w",
      });
      console.log("Step 4 - Auth user created, session changed");

      if (authError || !authData.user) {
        throw authError || new Error("Auth user creation failed");
      }

      // 5. IMMEDIATELY restore the admin session before any database operations
      const { error: restoreError } = await supabase.auth.setSession({
        access_token: currentSession.access_token,
        refresh_token: currentSession.refresh_token,
      });

      if (restoreError) {
        console.error("Failed to restore admin session:", restoreError);
        throw new Error("Failed to restore admin session");
      }
      console.log("Step 5 - Admin session restored successfully");

      // 6. Now perform database operations with restored admin session
      const { error: insertError } = await supabase.from("Teacher").insert([
        {
          TeacherID: newTeacherId,
          CNIC: formattedCnic,
          Name: teacherData.Name,
          Email: newEmail,
          PhoneNumber: teacherData.PhoneNumber,
          Gender: teacherData.Gender,
          DateOfBirth: teacherData.DateOfBirth,
          ExperienceYear: teacherData.ExperienceYear,
          Qualification: teacherData.Qualification,
          HireDate: new Date().toISOString(),
          EmployeeType: teacherData.EmployeeType,
          Address: teacherData.Address,
          Post: teacherData.Post,
          TeacherSubject: teacherData.TeacherSubject,
          SchoolID: newSchoolId,
          BPS: teacherData.BPS,
          FatherName: teacherData.FatherName,
          Domicile: teacherData.Domicile,
          EmployementStatus: "Working",
          user_id: authData.user.id,
          ...(teacherData.Disability && { Disability: teacherData.Disability }),
          ...(teacherData.DisabilityDetails && {
            DisabilityDetails: teacherData.DisabilityDetails,
          }),
          ...(teacherData.EmployementType && {
            EmployementType: teacherData.EmployementType,
          }),
        },
      ]);
      console.log(
        "Step 6 - Teacher record inserted:",
        insertError ? "Failed" : "Success"
      );

      if (insertError) throw insertError;

      // 7. Update original teacher record
      const { error: updateError } = await supabase
        .from("Teacher")
        .update({
          EmployementStatus: "Transferred",
          TransferedSchool: newSchoolId,
          TransferDate: new Date().toISOString(),
        })
        .eq("TeacherID", teacherData.TeacherID);
      console.log(
        "Step 7 - Original teacher updated:",
        updateError ? "Failed" : "Success"
      );

      if (updateError) throw updateError;

      // 8. Get school name for success message
      const { data: schoolData, error: schoolError } = await supabase
        .from("School")
        .select("SchoolName")
        .eq("SchoolID", newSchoolId)
        .single();

      if (schoolError) throw schoolError;

      // 9. Show success message
      setAlert({
        open: true,
        severity: "success",
        message: `Teacher successfully transferred to ${schoolData.SchoolName} with new ID: ${newTeacherId}`,
      });

      // 10. Refresh teacher data
      await fetchTeacherDetails();
    } catch (err) {
      console.error("Transfer error:", err);

      // If there was an error, try to restore the admin session one more time
      try {
        const {
          data: { session: fallbackSession },
        } = await supabase.auth.getSession();
        if (!fallbackSession) {
          // Try to get a fresh session - you might need to redirect to login
          console.warn(
            "No session found after error, user may need to re-login"
          );
        }
      } catch (sessionRestoreError) {
        console.error(
          "Failed to restore session after error:",
          sessionRestoreError
        );
      }

      setAlert({
        open: true,
        severity: "error",
        message: err.message || "Failed to complete transfer",
      });
    } finally {
      setLoading(false);
      setNewEmail("");
    }
  };

  // const handleTransfer = async () => {
  //   setConfirmDialogOpen(false);

  //   // Validate inputs
  //   if (!newSchoolId || !newEmail) {
  //     setAlert({
  //       open: true,
  //       severity: "error",
  //       message: "Please select a new school and provide a new email",
  //     });
  //     return;
  //   }

  //   // Save current session
  //   const {
  //     data: { session },
  //   } = await supabase.auth.getSession();

  //   try {
  //     // 1. Create auth user first
  //     const { data: authData, error: authError } = await supabase.auth.signUp({
  //       email: newEmail,
  //       password: "Ww@123#w",
  //       options: {
  //         // Prevent automatic session change
  //         data: {
  //           role: "teacher",
  //           teacher_id: "", // Will be updated below
  //         },
  //       },
  //     });

  //     if (authError) throw authError;
  //     if (!authData.user) throw new Error("Auth user creation failed");

  //     // 2. Create teacher record
  //     const newTeacherId = await generateTeacherID(newSchoolId);
  //     const { error: insertError } = await supabase.from("Teacher").insert([
  //       {
  //         TeacherID: newTeacherId,
  //         // ... all other fields ...
  //         user_id: authData.user.id,
  //         Email: newEmail,
  //       },
  //     ]);

  //     if (insertError) throw insertError;

  //     // 3. Update auth user with teacher ID
  //     await supabase.auth.admin.updateUserById(authData.user.id, {
  //       user_metadata: { teacher_id: newTeacherId },
  //     });

  //     // 4. Update original teacher
  //     const { error: updateError } = await supabase
  //       .from("Teacher")
  //       .update({
  //         EmployementStatus: "Transferred",
  //         TransferedSchool: newSchoolId,
  //         TransferDate: new Date().toISOString(),
  //       })
  //       .eq("TeacherID", teacherData.TeacherID);

  //     if (updateError) throw updateError;

  //     // Restore original session
  //     await supabase.auth.setSession({
  //       access_token: session.access_token,
  //       refresh_token: session.refresh_token,
  //     });

  //     setAlert({
  //       open: true,
  //       severity: "success",
  //       message: `Teacher transferred successfully! New ID: ${newTeacherId}`,
  //     });

  //     await fetchTeacherDetails();
  //   } catch (err) {
  //     setAlert({
  //       open: true,
  //       severity: "error",
  //       message: err.message,
  //     });
  //   } finally {
  //     setLoading(false);
  //     setNewEmail("");
  //   }
  // };
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const GenderIcon = ({ gender }) => {
    switch (gender) {
      case "Male":
        return <MaleIcon fontSize="small" />;
      case "Female":
        return <FemaleIcon fontSize="small" />;
      default:
        return <PersonIcon fontSize="small" />;
    }
  };

  return (
    <Box sx={{ p: 3, maxWidth: 1200, mx: "auto" }}>
      <Typography
        variant="h4"
        gutterBottom
        sx={{ mb: 4, display: "flex", alignItems: "center" }}
      >
        <TransferIcon color="primary" sx={{ mr: 1 }} />
        Teacher Transfer
      </Typography>

      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={8} md={9}>
              <TextField
                fullWidth
                label="Enter Teacher CNIC"
                variant="outlined"
                value={formattedCnic}
                onChange={handleCnicChange}
                disabled={isFetching}
                placeholder="31102-5522345-9"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <BadgeIcon color="action" />
                    </InputAdornment>
                  ),
                }}
              />
              {/* <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
                Format: XXXXX-XXXXXXX-X
              </Typography> */}
            </Grid>
            <Grid item xs={12} sm={4} md={3}>
              {!isFetching ? (
                <Button
                  fullWidth
                  type="submit"
                  variant="contained"
                  color="primary"
                  size="large"
                  disabled={loading || cnic.length !== 13}
                  startIcon={
                    loading ? (
                      <CircularProgress size={20} color="inherit" />
                    ) : (
                      <SearchIcon />
                    )
                  }
                  sx={{ height: "56px" }} // Match height with TextField
                >
                  {loading ? "Fetching..." : "Fetch Details"}
                </Button>
              ) : (
                <Button
                  fullWidth
                  variant="outlined"
                  color="error"
                  size="large"
                  onClick={cancelFetch}
                  startIcon={<CancelIcon />}
                  sx={{ height: "56px" }} // Match height with TextField
                >
                  Cancel Fetch
                </Button>
              )}
            </Grid>
          </Grid>
        </form>
      </Paper>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 3 }}>
          {success}
        </Alert>
      )}

      {teacherData && (
        <Paper elevation={3} sx={{ p: 3 }}>
          <Typography
            variant="h5"
            gutterBottom
            sx={{ mb: 3, display: "flex", alignItems: "center" }}
          >
            <SchoolIcon color="primary" sx={{ mr: 1 }} />
            Teacher Details
          </Typography>

          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <DetailItem
                icon={<PersonIcon />}
                label="Name"
                value={teacherData.Name}
              />
              <DetailItem
                icon={<PersonIcon />}
                label="Father's Name"
                value={teacherData.FatherName}
              />
              <DetailItem
                icon={<SchoolIcon />}
                label="Teacher ID"
                value={teacherData.TeacherID}
              />
              <DetailItem
                icon={<BadgeIcon />}
                label="CNIC"
                value={formattedCnic || formatCnicInput(teacherData.CNIC)}
              />
              <DetailItem
                icon={<GenderIcon gender={teacherData.Gender} />}
                label="Gender"
                value={teacherData.Gender}
              />
              <DetailItem
                icon={<CakeIcon />}
                label="Date of Birth"
                value={formatDate(teacherData.DateOfBirth)}
              />
              <DetailItem
                icon={<HomeIcon />}
                label="Domicile"
                value={teacherData.Domicile}
              />
              {teacherData.Disability && (
                <DetailItem
                  icon={<PersonIcon />}
                  label="Disability"
                  value={teacherData.Disability}
                />
              )}
              {teacherData.Disability === "Yes" &&
                teacherData.DisabilityDetails && (
                  <DetailItem
                    icon={<PersonIcon />}
                    label="Disability Details"
                    value={teacherData.DisabilityDetails}
                  />
                )}
            </Grid>

            <Grid item xs={12} md={6}>
              <DetailItem
                icon={<EmailIcon />}
                label="Email"
                value={teacherData.Email}
              />
              <DetailItem
                icon={<PhoneIcon />}
                label="Phone Number"
                value={teacherData.PhoneNumber}
              />
              <DetailItem
                icon={<HomeIcon />}
                label="Address"
                value={teacherData.Address}
              />
              <DetailItem
                icon={<WorkIcon />}
                label="BPS"
                value={teacherData.BPS}
              />
              <DetailItem
                icon={<WorkIcon />}
                label="Post"
                value={teacherData.Post}
              />
              <DetailItem
                icon={<SchoolIcon />}
                label="Qualification"
                value={teacherData.Qualification}
              />
              <DetailItem
                icon={<WorkIcon />}
                label="Experience (Years)"
                value={teacherData.ExperienceYear}
              />
            </Grid>
          </Grid>

          <Divider sx={{ my: 3 }} />

          <Typography
            variant="h6"
            gutterBottom
            sx={{ display: "flex", alignItems: "center" }}
          >
            <ApartmentIcon color="primary" sx={{ mr: 1 }} />
            Current Assignment
          </Typography>

          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid item xs={12} md={6}>
              <DetailItem
                icon={<WorkIcon />}
                label="Employee Type"
                value={teacherData.EmployeeType}
              />
              {teacherData.EmployementType && (
                <DetailItem
                  icon={<WorkIcon />}
                  label="Employment Type"
                  value={teacherData.EmployementType}
                />
              )}
              <DetailItem
                icon={<WorkIcon />}
                label="Hire Date"
                value={formatDate(teacherData.HireDate)}
              />
              <DetailItem
                icon={<WorkIcon />}
                label="Employment Status"
                value={teacherData.EmploymentStatus || "Working"}
              />
              {teacherData.TransferredSchool && (
                <DetailItem
                  icon={<ApartmentIcon />}
                  label="Transferred School"
                  value={teacherData.TransferredSchool}
                />
              )}
            </Grid>
            <Grid item xs={12} md={6}>
              <DetailItem
                icon={<ApartmentIcon />}
                label="Current School"
                value={teacherData.School?.SchoolName || "N/A"}
              />
              <DetailItem
                icon={<ApartmentIcon />}
                label="School ID"
                value={teacherData.SchoolID}
              />
              <DetailItem
                icon={<SchoolIcon />}
                label="Subject"
                value={teacherData.TeacherSubject}
              />
            </Grid>
          </Grid>

          <Divider sx={{ my: 3 }} />

          <Typography
            variant="h6"
            gutterBottom
            sx={{ display: "flex", alignItems: "center" }}
          >
            <TransferIcon color="primary" sx={{ mr: 1 }} />
            Transfer Options
          </Typography>

          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={8} md={9}>
              <FormControl fullWidth>
                <InputLabel id="new-school-label">Select New School</InputLabel>
                <Select
                  labelId="new-school-label"
                  value={newSchoolId}
                  label="Select New School"
                  onChange={(e) => setNewSchoolId(e.target.value)}
                >
                  <MenuItem value="">
                    <em>Select a school</em>
                  </MenuItem>
                  {availableSchools.map((school) => (
                    <MenuItem key={school.SchoolID} value={school.SchoolID}>
                      {school.SchoolID} - {school.SchoolName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={4} md={3}>
              <Button
                fullWidth
                variant="contained"
                color="primary"
                size="large"
                onClick={handleOpenConfirmDialog}
                disabled={loading || !newSchoolId}
                startIcon={
                  loading ? <CircularProgress size={20} /> : <TransferIcon />
                }
                sx={{ height: "56px" }} // Match height with Select
              >
                Transfer Teacher
              </Button>
            </Grid>
          </Grid>
        </Paper>
      )}
      {/* Confirmation Dialog */}
      {/* <Dialog
        open={confirmDialogOpen}
        onClose={handleCloseConfirmDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Confirm Teacher Transfer"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to transfer {teacherData?.Name} to the
            selected school? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseConfirmDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleTransfer} color="primary" autoFocus>
            Confirm Transfer
          </Button>
        </DialogActions>
      </Dialog> */}
      <Dialog
        open={confirmDialogOpen}
        onClose={handleCloseConfirmDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Confirm Teacher Transfer"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description" sx={{ mb: 2 }}>
            Are you sure you want to transfer {teacherData?.Name} to the
            selected school? Please provide a new email address for the teacher.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="new-email"
            label="New Email Address"
            type="email"
            fullWidth
            variant="standard"
            value={newEmail}
            onChange={(e) => {
              setNewEmail(e.target.value);
              setEmailError(e.target.value && !validateEmail(e.target.value));
            }}
            error={emailError}
            helperText={emailError ? "Please enter a valid email address" : ""}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseConfirmDialog} color="primary">
            Cancel
          </Button>
          <Button
            onClick={handleTransfer}
            color="primary"
            autoFocus
            disabled={!newEmail || emailError}
          >
            Confirm Transfer
          </Button>
        </DialogActions>
      </Dialog>

      {/* Alert Snackbar */}
      <Snackbar
        open={alert.open}
        autoHideDuration={6000}
        onClose={handleCloseAlert}
      >
        <Alert onClose={handleCloseAlert} severity={alert.severity}>
          {alert.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

function DetailItem({ icon, label, value }) {
  return (
    <Box sx={{ mb: 2 }}>
      <Typography
        variant="subtitle2"
        color="text.secondary"
        sx={{ display: "flex", alignItems: "center" }}
      >
        {icon}
        <Box component="span" sx={{ ml: 1 }}>
          {label}
        </Box>
      </Typography>
      <Typography variant="body1" sx={{ ml: 4 }}>
        {value || "N/A"}
      </Typography>
    </Box>
  );
}

export default TransferTeacher;
