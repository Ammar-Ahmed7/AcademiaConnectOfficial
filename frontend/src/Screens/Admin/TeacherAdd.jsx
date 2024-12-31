import React, { useState, useEffect } from "react";
import axios from 'axios';

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

const TeacherAdd = () => {
  const [schools, setSchools] = useState([]); // List of schools from API
  const [alert, setAlert] = useState({
    open: false,
    message: "",
    severity: "",
  });
  const [formData, setFormData] = useState({
    personalinformation: {
      cnic: "",
      name: "",
      email: "",
      password: "ww@123", // Default value
      phoneNumber: "",
      gender: "", // "Male" or "Female"
      dateOfBirth: "",
      disability: "No", // Default value
    },
    educationaldetails: {
      qualification: "",
      experience: {
        years: 0, // Default to 0 if no experience
        details: "", // Optional
      },
      subjects: [], // Array of subjects
    },
    schoolinformation: {
      employeId: "",
      school: "", // ID of the school (e.g., from the schools array)
      hireDate: "", // Optional, defaults to current date on backend
      employeetype: "", // "Principal", "Head-Teacher", "Teacher"
      employmentStatus: "", // "Working", "Retired", "Removed"
      employmentType: "", // "Permanent", "Contract", "Part-Time"
    },
    address: {
      street: "", // Optional
      city: "", // Optional
      district: "", // Optional
      province: "Punjab", // Default value
      country: "Pakistan", // Default value
    },
 
  });


  useEffect(() => {
    const fetchSchools = async () => {
      try {
        const response = await axios.get("http://localhost:4000/school/allfullname");
        const schoolNames = response.data.map((school) => ({
          id: school._id, // Use the real _id from the API
          name: school.fullName, // Assuming 'fullName' is returned
        }));
        setSchools(schoolNames);
      } catch (error) {
        console.error("Error fetching school names:", error);
        setAlert({
          open: true,
          message: "Failed to load school names!",
          severity: "error",
        });
      }
    };

    fetchSchools();
  }, []);
  const handleNestedInputChange = (parent, child, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [parent]: {
        ...prevData[parent],
        [child]: value,
      },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:4000/teacher/addteacher", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setAlert({
          open: true,
          message: "teacher added successfully!",
          severity: "success",
        });
        setFormData(
       {
        personalinformation: {
          cnic: "",
          name: "",
          email: "",
          password: "ww@123", // Default value
          phoneNumber: "",
          gender: "", // "Male" or "Female"
          dateOfBirth: "",
          disability: "No", // Default value
        },
        educationaldetails: {
          qualification: "",
          experience: {
            years: 0, // Default to 0 if no experience
            details: "", // Optional
          },
          subjects: [], // Array of subjects
        },
        schoolinformation: {
          employeId: "",
          school: "", // ID of the school (e.g., from the schools array)
          hireDate: "", // Optional, defaults to current date on backend
          employeetype: "", // "Principal", "Head-Teacher", "Teacher"
          employmentStatus: "", // "Working", "Retired", "Removed"
          employmentType: "", // "Permanent", "Contract", "Part-Time"
        },
        address: {
          street: "", // Optional
          city: "", // Optional
          district: "", // Optional
          province: "Punjab", // Default value
          country: "Pakistan", // Default value
        },
     
       }
      );
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to add teacher");
      }
    } catch (error) {
      console.error("Error submitting data:", error);
      setAlert({
        open: true,
        message: "Failed to add teacher. Try again!",
        severity: "error",
      });
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
                label="CNIC"
                fullWidth
                name="cnic"
                value={formData.personalinformation.cnic}
                onChange={(e) =>
                  handleNestedInputChange(
                    "personalinformation",
                    "cnic",
                    e.target.value
                  )
                }
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Name"
                fullWidth
                name="name"
                value={formData.personalinformation.name}
                onChange={(e) =>
                  handleNestedInputChange(
                    "personalinformation",
                    "name",
                    e.target.value
                  )
                }
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Email"
                fullWidth
                name="email"
                value={formData.personalinformation.email}
                onChange={(e) =>
                  handleNestedInputChange(
                    "personalinformation",
                    "email",
                    e.target.value
                  )
                }
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Password"
                type="password"
                fullWidth
                name="password"
                value={formData.personalinformation.password}
                onChange={(e) =>
                  handleNestedInputChange(
                    "personalinformation",
                    "password",
                    e.target.value
                  )
                }
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Phone Number"
                fullWidth
                name="phoneNumber"
                value={formData.personalinformation.phoneNumber}
                onChange={(e) =>
                  handleNestedInputChange(
                    "personalinformation",
                    "phoneNumber",
                    e.target.value
                  )
                }
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel>Gender</InputLabel>
                <Select
                  label="Gender"
                  name="gender"
                  value={formData.personalinformation.gender}
                  onChange={(e) =>
                    handleNestedInputChange(
                      "personalinformation",
                      "gender",
                      e.target.value
                    )
                  }
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
                value={formData.personalinformation.dateOfBirth}
                onChange={(e) =>
                  handleNestedInputChange(
                    "personalinformation",
                    "dateOfBirth",
                    e.target.value
                  )
                }
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel>Disability</InputLabel>
                <Select
                  label="Disability"
                  name="disability"
                  value={formData.personalinformation.disability}
                  onChange={(e) =>
                    handleNestedInputChange(
                      "personalinformation",
                      "disability",
                      e.target.value
                    )
                  }
                >
                  <MenuItem value="Yes">Yes</MenuItem>
                  <MenuItem value="No">No</MenuItem>
                </Select>
              </FormControl>
            </Grid>

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
                value={formData.educationaldetails.qualification}
                onChange={(e) =>
                  handleNestedInputChange(
                    "educationaldetails",
                    "qualification",
                    e.target.value
                  )
                }
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Experience (Years)"
                type="number"
                fullWidth
                name="experienceYears"
                value={formData.educationaldetails.experience.years}
                onChange={(e) =>
                  handleNestedInputChange("educationaldetails", "experience", {
                    ...formData.educationaldetails.experience,
                    years: e.target.value,
                  })
                }
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Experience Details"
                fullWidth
                name="experienceDetails"
                value={formData.educationaldetails.experience.details}
                onChange={(e) =>
                  handleNestedInputChange("educationaldetails", "experience", {
                    ...formData.educationaldetails.experience,
                    details: e.target.value,
                  })
                }
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel>Subjects</InputLabel>
                <Select
                  multiple
                  label="Subjects"
                  name="subjects"
                  value={formData.educationaldetails.subjects}
                  onChange={(e) =>
                    handleNestedInputChange(
                      "educationaldetails",
                      "subjects",
                      e.target.value
                    )
                  }
                  renderValue={(selected) => selected.join(", ")}
                  MenuProps={{
                    PaperProps: {
                      style: {
                        backgroundColor: "white",
                        color: "black",
                      },
                    },
                  }}
                >
                  <MenuItem value="Physics">Physics</MenuItem>
                  <MenuItem value="Science">Science</MenuItem>
                  <MenuItem value="Math">Math</MenuItem>
                  <MenuItem value="English">English</MenuItem>
                  <MenuItem value="Urdu">Urdu</MenuItem>
                  <MenuItem value="Computer">Computer</MenuItem>
                  <MenuItem value="Islamic Studies">Islamic Studies</MenuItem>
                  <MenuItem value="Pakistan Studies">Pakistan Studies</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* School Information Section */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                School Information
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Employee ID"
                fullWidth
                name="employeeId"
                value={formData.schoolinformation.employeId}
                onChange={(e) =>
                  handleNestedInputChange(
                    "schoolinformation",
                    "employeId",
                    e.target.value
                  )
                }
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
  <FormControl fullWidth required>
    <InputLabel>School Name</InputLabel>
    <Select
      label="School Name"
      name="school"
      value={formData.schoolinformation.school}
      onChange={(e) =>
        handleNestedInputChange("schoolinformation", "school", e.target.value)
      }
    >
      {schools.map((school) => (
        <MenuItem key={school.id} value={school.id}>
          {school.name}
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
                value={formData.schoolinformation.hireDate}
                onChange={(e) =>
                  handleNestedInputChange(
                    "schoolinformation",
                    "hireDate",
                    e.target.value
                  )
                }
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel>Employee Type</InputLabel>
                <Select
                  label="Employee Type"
                  name="employeetype"
                  value={formData.schoolinformation.employeetype}
                  onChange={(e) =>
                    handleNestedInputChange(
                      "schoolinformation",
                      "employeetype",
                      e.target.value
                    )
                  }
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
                  value={formData.schoolinformation.employmentStatus}
                  onChange={(e) =>
                    handleNestedInputChange(
                      "schoolinformation",
                      "employmentStatus",
                      e.target.value
                    )
                  }
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
                  value={formData.schoolinformation.employmentType}
                  onChange={(e) =>
                    handleNestedInputChange(
                      "schoolinformation",
                      "employmentType",
                      e.target.value
                    )
                  }
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
            <Grid item xs={12} sm={6}>
              <TextField
                label="Street"
                fullWidth
                name="street"
                value={formData.address.street}
                onChange={(e) =>
                  handleNestedInputChange("address", "street", e.target.value)
                }
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="City"
                fullWidth
                name="city"
                value={formData.address.city}
                onChange={(e) =>
                  handleNestedInputChange("address", "city", e.target.value)
                }
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="District"
                fullWidth
                name="district"
                value={formData.address.district}
                onChange={(e) =>
                  handleNestedInputChange("address", "district", e.target.value)
                }
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Province"
                fullWidth
                name="province"
                value={formData.address.province}
                onChange={(e) =>
                  handleNestedInputChange("address", "province", e.target.value)
                }
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Country"
                fullWidth
                name="country"
                value={formData.address.country}
                onChange={(e) =>
                  handleNestedInputChange("address", "country", e.target.value)
                }
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
