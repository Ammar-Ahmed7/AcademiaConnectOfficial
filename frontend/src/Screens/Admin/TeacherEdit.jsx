import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Grid,
  Paper,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Snackbar,
  Alert,
  Box,
  CircularProgress,
  FormControlLabel,
} from "@mui/material";
import supabase from "../../../supabase-client";

const EditTeacher = () => {
  const [cnicList, setCnicList] = useState([]); // To store all CNICs fetched from the backend
  const [selectedCnic, setSelectedCnic] = useState(""); // Store selected CNIC

  const [formData, setFormData] = useState({
    TeacherID: "",
    CNIC: "",
    Name: "",
    Email: "",
    PhoneNumber: "",
    Gender: "",
    DateOfBirth: "",
    Disability: "No",
    DisabilityDetails: "",
    Qualification: "",
    ExperienceYear: 0,
    HireDate: "",
    SchoolID: "",
    EmployeeType: "",
    EmployementStatus: "",
    EmployementType: "",
    Address: "",
  });

  const [alert, setAlert] = useState({
    open: false,
    message: "",
    severity: "",
  });
  const [loading, setLoading] = useState(false);

  // Fetch CNIC list from the backend
  useEffect(() => {
    fetchCnicList();
  }, []);
  const fetchCnicList = async () => {
    try {
      const { data, error } = await supabase
        .from("Teacher")
        .select("CNIC")
        .order("TeacherID", { ascending: true });

      if (error) throw error;
      setCnicList(data);
      console.log(data);
    } catch (error) {
      console.error("Error fetching CNIC list:", error);
      setAlert({
        open: true,
        message: "Failed to fetch CNIC list",
        severity: "error",
      });
    }
  };

  // Fetch teacher details when a CNIC is selected
  useEffect(() => {
    if (selectedCnic) {
      console.log("i am here to you");

      fetchTeacherData();
    }
  }, [selectedCnic]);

  const fetchTeacherData = async () => {
    try {
      const { data, error } = await supabase
        .from("Teacher")
        .select("*")
        .eq("CNIC", selectedCnic)
        .single();

      if (error) throw error;

      // Map Supabase data to form fields with proper null handling
      const processedData = {
        TeacherID: data.TeacherID || "",
        CNIC: data.CNIC || "",
        Name: data.Name || "",
        Email: data.Email || "",
        PhoneNumber: data.PhoneNumber || "",
        Gender: data.Gender || "",
        DateOfBirth: data.DateOfBirth ? data.DateOfBirth.split("T")[0] : "",
        Disability: data.Disability || "No",
        DisabilityDetails: data.DisabilityDetails || "",
        Qualification: data.Qualification || "",
        ExperienceYear: data.ExperienceYear || 0,
        HireDate: data.HireDate ? data.HireDate.split("T")[0] : "",
        SchoolID: data.SchoolID || "",
        EmployeeType: data.EmployeeType || "",
        EmployementStatus: data.EmployementStatus || "", // Match Supabase spelling
        EmployementType: data.EmployementType || "", // Match Supabase spelling
        Address: data.Address || "",
      };

      setFormData(processedData);
    } catch (error) {
      console.error("Error fetching Details:", error);
      setAlert({
        open: true,
        message: "Failed to fetch details",
        severity: "error",
      });
    }
  };

  // const handleInputChange = (e) => {
  //   const { name, value, type, checked } = e.target;
  //   setFormData((prev) => ({
  //     ...prev,
  //     [name]: type === "checkbox" ? checked : value,
  //   }));
  // };


  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const inputValue = type === "checkbox" 
      ? checked 
      : type === "number" 
        ? Number(value) || 0  // Handle empty number inputs
        : value;
  
    setFormData((prev) => ({
      ...prev,
      [name]: inputValue,
    }));
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase
        .from("Teacher")
        .update({
          CNIC: formData.CNIC,
          Name: formData.Name,
          Email: formData.Email,
          PhoneNumber: formData.PhoneNumber,
          Gender: formData.Gender,
          DateOfBirth: formData.DateOfBirth,
          Disability: formData.Disability,
          DisabilityDetails: formData.DisabilityDetails,
          Qualification: formData.Qualification,
          ExperienceYear: formData.ExperienceYear,
          HireDate: formData.HireDate,
          SchoolID: formData.SchoolID,
          EmployeeType: formData.EmployeeType,
          EmployementStatus: formData.EmployementStatus, // Match Supabase spelling
          EmployementType: formData.EmployementType, // Match Supabase spelling
          Address: formData.Address,
        })
        .eq("TeacherID", formData.TeacherID);

      if (error) throw error;

      setAlert({
        open: true,
        message: "Teacher updated successfully!",
        severity: "success",
      });
    } catch (error) {
      console.error("Error updating Teacher:", error.message);
      setAlert({
        open: true,
        message: "Failed to update Teacher. Try again!",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCloseAlert = () => setAlert({ ...alert, open: false });

  return (
    <Box
      sx={{
        padding: "20px",
        maxWidth: "800px",
        margin: "0 auto",
        backgroundColor: "#f9f9f9",
        borderRadius: "8px",
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
      }}
    >
      <Typography variant="h4" align="center" gutterBottom>
        Edit Teacher Details
      </Typography>

      <Paper
        sx={{
          padding: "20px",
          borderRadius: "8px",
          backgroundColor: "#fff",
        }}
        elevation={3}
      >
        {/* CNIC Dropdown always visible with margin bottom */}
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <FormControl fullWidth sx={{ marginBottom: "20px" }}>
              <InputLabel>Select CNIC</InputLabel>
              <Select
                value={selectedCnic}
                onChange={(e) => setSelectedCnic(e.target.value)}
                label="Select  CNIC"
              >
                {cnicList.map((teacher) => (
                  <MenuItem key={teacher.CNIC} value={teacher.CNIC}>
                    {teacher.CNIC}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        {/* Form for editing teacher details */}
        {selectedCnic && (
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              {/* Personal Information Section */}
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  Personal Information
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="CNIC"
                  fullWidth
                  name="CNIC"
                  value={formData.CNIC}
                  onChange={handleInputChange}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Name"
                  fullWidth
                  name="Name"
                  value={formData.Name}
                  onChange={handleInputChange}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Email"
                  fullWidth
                  name="Email"
                  value={formData.Email}
                  onChange={handleInputChange}
                  required
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  label="Phone Number"
                  fullWidth
                  name="PhoneNumber"
                  value={formData.PhoneNumber}
                  onChange={handleInputChange}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth required>
                  <InputLabel>Gender</InputLabel>
                  <Select
                    label="Gender"
                    name="Gender"
                    value={formData.Gender || ""}
                    onChange={handleInputChange}
                  >
                    <MenuItem value="Male">Male</MenuItem>
                    <MenuItem value="Female">Female</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Date of Birth"
                  type="date"
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  name="DateOfBirth"
                  value={formData.DateOfBirth}
                  onChange={handleInputChange}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth required>
                  <InputLabel>Disability</InputLabel>
                  <Select
                    label="Disability"
                    name="Disability"
                    value={formData.Disability || ""}
                    onChange={handleInputChange}
                  >
                    <MenuItem value="Yes">Yes</MenuItem>
                    <MenuItem value="No">No</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              {formData.Disability === "Yes" && (
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Disability Details"
                    fullWidth
                    name="DisabilityDetails"
                    value={formData.DisabilityDetails}
                    onChange={handleInputChange}
                    required
                  />
                </Grid>
              )}

              {/* Educational Details Section */}
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  Educational Details
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Qualification"
                  fullWidth
                  name="Qualification"
                  value={formData.Qualification}
                  onChange={handleInputChange}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Experience (Years)"
                  type="number"
                  fullWidth
                  name="ExperienceYear"
                  value={formData.ExperienceYear}
                  onChange={handleInputChange}
                  required
                  inputProps={{ min: 0 }}
                />
              </Grid>

              {/* School Information Section */}
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  School Information
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="School ID"
                  fullWidth
                  name="SchoolID"
                  value={formData.SchoolID}
                  onChange={handleInputChange}
                  required
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  label="Hire Date"
                  type="date"
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  name="HireDate"
                  value={formData.HireDate}
                  onChange={handleInputChange}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth required>
                  <InputLabel>Employee Type</InputLabel>
                  <Select
                    label="Employee Type"
                    name="EmployeeType"
                    value={formData.EmployeeType || ""}
                    onChange={handleInputChange}
                  >
                    <MenuItem value="Principal">Principal</MenuItem>
                    <MenuItem value="Head-Teacher">Head-Teacher</MenuItem>
                    <MenuItem value="Teacher">Teacher</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth required>
                  <InputLabel>Employment Status</InputLabel>
                  <Select
                    label="Employment Status"
                    name="EmployementStatus"
                    value={formData.EmployementStatus || ""}
                    onChange={handleInputChange}
                  >
                    <MenuItem value="Working">Working</MenuItem>
                    <MenuItem value="Retired">Retired</MenuItem>
                    <MenuItem value="Removed">Removed</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth required>
                  <InputLabel>Employment Type</InputLabel>
                  <Select
                    label="Employment Type"
                    name="EmployementType"
                    value={formData.EmployementType || ""}
                    onChange={handleInputChange}
                  >
                    <MenuItem value="Permanent">Permanent</MenuItem>
                    <MenuItem value="Contract">Contract</MenuItem>
                    <MenuItem value="Part-Time">Part-Time</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              {/* Address Section */}
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  Address
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Address"
                  fullWidth
                  name="Address"
                  value={formData.Address}
                  onChange={handleInputChange}
                />
              </Grid>

              {/* Submit Button */}
              <Grid item xs={12}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
                >
                  Update Teacher
                </Button>
              </Grid>
            </Grid>
          </form>
        )}
      </Paper>

      <Snackbar
        open={alert.open}
        autoHideDuration={4000}
        onClose={handleCloseAlert}
      >
        <Alert
          onClose={handleCloseAlert}
          severity={alert.severity}
          sx={{ width: "100%" }}
        >
          {alert.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default EditTeacher;
