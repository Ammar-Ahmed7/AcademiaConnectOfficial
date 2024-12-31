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
} from "@mui/material";

const EditTeacher = () => {
  const [cnicList, setCnicList] = useState([]); // To store all CNICs fetched from the backend
  const [selectedCnic, setSelectedCnic] = useState(""); // Store selected CNIC
  const [formData, setFormData] = useState({
    personalinformation: {
      cnic: "",
      name: "",
      email: "",
      password: "ww@123", // Default value
      phoneNumber: "",
      gender: "Male", // Default gender
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

  const [alert, setAlert] = useState({
    open: false,
    message: "",
    severity: "",
  });

  // Fetch CNIC list from the backend
  useEffect(() => {
    const fetchCnicList = async () => {
      try {
        const response = await fetch("http://localhost:4000/teacher/allcnic");

        const data = await response.json();

        if (response.ok) {
          setCnicList(data); // Set the CNIC list
        } else {
          throw new Error("Failed to fetch CNIC list");
        }
      } catch (error) {
        console.error("Error fetching CNIC list:", error);
        setAlert({
          open: true,
          message: "Failed to fetch CNIC list",
          severity: "error",
        });
      }
    };

    fetchCnicList();
  }, []);

  // Fetch teacher details when a CNIC is selected
  useEffect(() => {
    if (!selectedCnic) return;

    const fetchTeacherData = async () => {
      const trimmedCnic = selectedCnic.trim(); // Remove any leading/trailing spaces

      try {
        const response = await fetch(
          `http://localhost:4000/teacher/${trimmedCnic}`
        );
        const data = await response.json();
        if (response.ok) {
          // Convert dates to yyyy-mm-dd format
          const teacherData = {
            ...data,
            personalinformation: {
              ...data.personalinformation,
              dateOfBirth: formatDate(data.personalinformation.dateOfBirth),
            },
            schoolinformation: {
              ...data.schoolinformation,
              hireDate: formatDate(data.schoolinformation.hireDate),
            },
          };
        
          setFormData(teacherData); // Populate form data with teacher details
        } else {
          throw new Error("Failed to fetch teacher data");
        }
      } catch (error) {
        console.error("Error fetching teacher data:", error);
        setAlert({
          open: true,
          message: "Failed to load teacher data",
          severity: "error",
        });
      }
    };

    // Helper function to format the date to yyyy-mm-dd
    const formatDate = (date) => {
      if (!date) return ""; // Return an empty string if date is undefined or null
      const d = new Date(date); // Create a Date object from the ISO string
      const year = d.getFullYear(); // Get the full year (yyyy)
      const month = String(d.getMonth() + 1).padStart(2, "0"); // Get the month (01-12)
      const day = String(d.getDate()).padStart(2, "0"); // Get the day (01-31)
      return `${year}-${month}-${day}`; // Return the date in yyyy-mm-dd format
    };

    fetchTeacherData();
  }, [selectedCnic]);

  const handleCnicSelection = (event) => {
    setSelectedCnic(event.target.value);
  };

  const handleNestedChange = (parent, child, value) => {
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
      const response = await fetch(
        `http://localhost:4000/teacher/${selectedCnic}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );
  
      const responseData = await response.json(); // Parse the response body
      console.log("i am response "+ responseData.message)
  
      if (response.ok) {
        if (responseData.message === "Nothing to update. The data is identical.") {
          // Handle the case where no changes were made
          setAlert({
            open: true,
            message: "Nothing was updated. The data is identical.",
            severity: "warning",
          });
        } else {
          // Handle the case where the teacher was successfully updated
          setAlert({
            open: true,
            message: "Teacher updated successfully!",
            severity: "success",
          });
        }
      } else {
        // If the response is not ok, throw an error
        throw new Error(responseData.message || "Failed to update teacher");
      }
    } catch (error) {
      console.error("Error submitting data:", error);
      setAlert({
        open: true,
        message: "Failed to update teacher. Try again!",
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
                onChange={handleCnicSelection}
                label="Select  CNIC"
              >
                {cnicList.map((cnic) => (
                  <MenuItem key={cnic} value={cnic}>
                    {cnic}
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
                  name="cnic"
                  value={formData.personalinformation.cnic}
                  onChange={(e) =>
                    handleNestedChange(
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
                    handleNestedChange(
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
                    handleNestedChange(
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
                    handleNestedChange(
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
                    handleNestedChange(
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
                      handleNestedChange(
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
                    handleNestedChange(
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
                      handleNestedChange(
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
                    handleNestedChange(
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
                    handleNestedChange("educationaldetails", "experience", {
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
                    handleNestedChange("educationaldetails", "experience", {
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
                      handleNestedChange(
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
                    <MenuItem value="Pakistan Studies">
                      Pakistan Studies
                    </MenuItem>
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
                    handleNestedChange(
                      "schoolinformation",
                      "employeId",
                      e.target.value
                    )
                  }
                  required
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  label="School Name"
                  fullWidth
                  value={`${
                    formData?.schoolinformation?.school?.name || "N/A"
                  } for ${
                    formData?.schoolinformation?.school?.schoolfor || "N/A"
                  } ${
                    formData?.schoolinformation?.school?.address?.city || "-"
                  } ${
                    formData?.schoolinformation?.school?.address?.district ||
                    "-"
                  } 

    `}
                  InputProps={{
                    readOnly: true, // Makes the field read-only
                  }}
                />
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
                    handleNestedChange(
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
                      handleNestedChange(
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
                      handleNestedChange(
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
                      handleNestedChange(
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
                    handleNestedChange("address", "street", e.target.value)
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
                    handleNestedChange("address", "city", e.target.value)
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
                    handleNestedChange("address", "district", e.target.value)
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
                    handleNestedChange("address", "province", e.target.value)
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
                    handleNestedChange("address", "country", e.target.value)
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
