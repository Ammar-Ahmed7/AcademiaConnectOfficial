import React, { useState, useEffect } from "react";

import {
  Grid,
  TextField,
  Box,
  Button,
  Paper,
  FormControl,
  InputLabel,
  MenuList,
  MenuItem,
  Select,
  Typography,
  Snackbar,
  Alert,
} from "@mui/material";
import supabase from "../../../supabase-client";

const TeacherAdd = () => {
  const [schools, setSchools] = useState([]); // List of schools from API
  const [alert, setAlert] = useState({
    open: false,
    message: "",
    severity: "",
  });
  const [formData, setFormData] = useState({
    ID: "T-",
    cnic: "",
    name: "",
    email: "",
    password: "ww@123", // Default value
    phoneNumber: "",
    gender: "", // "Male" or "Female"
    dateOfBirth: "",
    disability: "No", // Default value
    disabilitydetails: "", // Optional
    qualification: "",
    experienceyears: 0, // Default to 0 if no experience
    hireDate: "", // Optional, defaults to current date on backend
    SchoolId: "",
    employeetype: "", // "Principal", "Head-Teacher", "Teacher"
    employmentStatus: "", // "Working", "Retired", "Removed"
    employmentType: "", // "Permanent", "Contract", "Part-Time"
    address: "",
  });

  useEffect(() => {
    fetchSchools();
  }, []);

  const fetchSchools = async () => {
    try {
      const { data, error } = await supabase
        .from("School")
        .select("SchoolID, SchoolName")
        .order("SchoolID", { ascending: true });
      console.log(data);
      if (error) throw error;
      setSchools(data);
    } catch (error) {
      console.error("Error fetching schools:", error);
      setAlert({
        open: true,
        message: "Failed to load schools!",
        severity: "error",
      });
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { data, error } = await supabase.from("Teacher").insert([
      {
        TeacherID: formData.ID,
        CNIC: formData.cnic,
        Name: formData.name,
        Email: formData.email,
        Password: formData.password, // Default value
        PhoneNumber: formData.phoneNumber,
        Gender: formData.gender, // "Male" or "Female"
        DateOfBirth: formData.dateOfBirth,
        Disability: formData.disability, // Default value
        DisabilityDetails: formData.disabilitydetails, // Optional
        Qualification: formData.qualification,
        ExperienceYear: formData.experienceyears, // Default to 0 if no experience
        HireDate: formData.hireDate, // Optional, defaults to current date on backend
        SchoolID: formData.SchoolId,
        EmployeeType: formData.employeetype, // "Principal", "Head-Teacher", "Teacher"
        EmployementStatus: formData.employmentStatus, // "Working", "Retired", "Removed"
        EmployementType: formData.employmentType, // "Permanent", "Contract", "Part-Time"
        Address: formData.address,
      },
    ]);

    if (error) {
      console.error("Error adding Teacher:", error.message);
      setAlert({
        open: true,
        message: "Failed to add teacher. Try again!",
        severity: "error",
      });
    } else {
      setAlert({
        open: true,
        message: "Teacher added successfully!",
        severity: "success",
      });
    }

    setFormData({
      ID: "T-",
      cnic: "",
      name: "",
      email: "",
      password: "ww@123", // Default value
      phoneNumber: "",
      gender: "", // "Male" or "Female"
      dateOfBirth: "",
      disability: "No", // Default value
      disabilitydetails: "", // Optional
      qualification: "",
      experienceyears: 0, // Default to 0 if no experience
      hireDate: "", // Optional, defaults to current date on backend
      SchoolId: "",
      employeetype: "", // "Principal", "Head-Teacher", "Teacher"
      employmentStatus: "", // "Working", "Retired", "Removed"
      employmentType: "", // "Permanent", "Contract", "Part-Time"
      address: "",
    });
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
        Add Teacher
      </Typography>

      <Paper
        sx={{
          padding: "20px",
          borderRadius: "8px",
          backgroundColor: "#fff",
        }}
        elevation={3}
      >
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
                label="Name"
                fullWidth
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="CNIC"
                fullWidth
                name="cnic"
                value={formData.cnic}
                onChange={handleInputChange}
                required
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                label="Email"
                fullWidth
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Password"
                type="password"
                fullWidth
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Phone Number"
                fullWidth
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel>Gender</InputLabel>
                <Select
                  label="Gender"
                  name="gender"
                  value={formData.gender}
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
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleInputChange}
                required
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Address"
                fullWidth
                name="address"
                value={formData.address}
                onChange={handleInputChange}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel>Disability</InputLabel>
                <Select
                  label="Disability"
                  name="disability"
                  value={formData.disability}
                  onChange={handleInputChange}
                >
                  <MenuItem value="Yes">Yes</MenuItem>
                  <MenuItem value="No">No</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {formData.disability === "Yes" && (
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Disability Details"
                  fullWidth
                  name="disabilitydetails"
                  value={formData.disabilitydetails}
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
                name="qualification"
                value={formData.qualification}
                onChange={handleInputChange}
                required
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                label="Experience (Years)"
                fullWidth
                name="experience"
                type="number"
                value={formData.experience}
                onChange={(e) => {
                  const value = parseInt(e.target.value, 10);
                  handleInputChange({
                    target: {
                      name: "experience",
                      value: value >= 0 ? value : 0, // Ensures non-negative values
                    },
                  });
                }}
                inputProps={{ min: 0 }} // Prevents negative values in number input
                required
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
                label="Teacher ID"
                type="text"
                fullWidth
                InputLabelProps={{ shrink: true }}
                name="ID"
                value={formData.ID}
                onChange={handleInputChange}
                required
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>School ID</InputLabel>
                <Select
                  label="School Id"
                  name="SchoolId"
                  value={formData.SchoolId}
                  onChange={handleInputChange}
                >
                  {schools.map((school) => (
                    <MenuItem key={school.SchoolID} value={school.SchoolID}>
                      {school.SchoolID} - {school.SchoolName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                label="Hire Date"
                type="date"
                fullWidth
                InputLabelProps={{ shrink: true }}
                name="hireDate"
                value={formData.hireDate}
                onChange={handleInputChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel>Employee Type</InputLabel>
                <Select
                  label="Employee Type"
                  name="employeetype"
                  value={formData.employeetype}
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
                  name="employmentStatus"
                  value={formData.employmentStatus}
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
                  name="employmentType"
                  value={formData.employmentType}
                  onChange={handleInputChange}
                >
                  <MenuItem value="Permanent">Permanent</MenuItem>
                  <MenuItem value="Contract">Contract</MenuItem>
                  <MenuItem value="Part-Time">Part-Time</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* Submit Button */}
            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
              >
                Submit
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
      {/* Snackbar for Alerts */}
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
};

export default TeacherAdd;
