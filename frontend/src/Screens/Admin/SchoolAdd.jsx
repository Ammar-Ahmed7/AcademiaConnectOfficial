import React, { useState } from "react";
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
  Checkbox,
  ListItemText,
  Box,
  Snackbar,
  Alert,
} from "@mui/material";

const SchoolManagement = () => {
  const [formData, setFormData] = useState({
    number: "",
    email: "",
    password: "ww@123",
    name: "Workers Welfare School",
    schoolfor: "Girls",
    schoollevel: "Primary",
    address: {
      street: "",
      city: "",
      district: "",
      province: "Punjab",
      country: "Pakistan",
    },
    contact: {
      phoneNumber: "",
      website: "",
    },
    principal: {
      name: "",
      email: "",
      phoneNumber: "",
    },
    establishedYear: "",
    facilities: {
      library: false,
      sports: false,
      computerLab: false,
      scienceLab: false,
      auditorium: false,
    },
    recognizedby: {
      board: "",
      accreditationId: "",
    },
  });

  const [alert, setAlert] = useState({
    open: false,
    message: "",
    severity: "",
  });

  // Handle regular field change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle nested field change
  const handleNestedInputChange = (section, field, value) => {
    setFormData({
      ...formData,
      [section]: {
        ...formData[section],
        [field]: value,
      },
    });
  };

  // Toggle facilities
  const handleFacilitiesChange = (facility) => {
    setFormData({
      ...formData,
      facilities: {
        ...formData.facilities,
        [facility]: !formData.facilities[facility],
      },
    });
  };

  // Submit form data
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:4000/school/addschool", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setAlert({
          open: true,
          message: "School added successfully!",
          severity: "success",
        });
        setFormData({
          number: "",
          email: "",
          password: "ww@123",
          name: "Workers Welfare School",
          schoolfor: "Girls",
          schoollevel: "Primary",
          address: {
            street: "",
            city: "",
            district: "",
            province: "Punjab",
            country: "Pakistan",
          },
          contact: {
            phoneNumber: "",
            website: "",
          },
          principal: {
            name: "",
            email: "",
            phoneNumber: "",
          },
          establishedYear: "",
          facilities: {
            library: false,
            sports: false,
            computerLab: false,
            scienceLab: false,
            auditorium: false,
          },
          recognizedby: {
            board: "",
            accreditationId: "",
          },
        });
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to add school");
      }
    } catch (error) {
      console.error("Error submitting data:", error);
      setAlert({
        open: true,
        message: "Failed to add school. Try again!",
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
        Add a new School
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
            {/* School Number */}
            <Grid item xs={12} sm={6}>
              <TextField
                label="School Number"
                name="number"
                value={formData.number}
                onChange={handleInputChange}
                fullWidth
                required
              />
            </Grid>

            {/* School Email */}
            <Grid item xs={12} sm={6}>
              <TextField
                label="School Email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                fullWidth
                required
              />
            </Grid>

            {/* Password */}
            <Grid item xs={12} sm={6}>
              <TextField
                label="Password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleInputChange}
                fullWidth
              />
            </Grid>

            {/* School Name */}
            <Grid item xs={12} sm={6}>
              <TextField
                label="School Name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                fullWidth
                required
              />
            </Grid>

            {/* School For */}
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>School For</InputLabel>
                <Select
                  name="schoolfor"
                  value={formData.schoolfor}
                  onChange={handleInputChange}
                >
                  <MenuItem value="Girls">Girls</MenuItem>
                  <MenuItem value="Boys">Boys</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* School Level */}
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>School Level</InputLabel>
                <Select
                  name="schoollevel"
                  value={formData.schoollevel}
                  onChange={handleInputChange}
                >
                  <MenuItem value="Primary">Primary</MenuItem>
                  <MenuItem value="Middle">Middle</MenuItem>
                  <MenuItem value="High">High</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* Address */}
            <Grid item xs={12}>
              <Typography variant="h6">Address</Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Street"
                    value={formData.address.street}
                    onChange={(e) =>
                      handleNestedInputChange(
                        "address",
                        "street",
                        e.target.value
                      )
                    }
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="City"
                    value={formData.address.city}
                    onChange={(e) =>
                      handleNestedInputChange("address", "city", e.target.value)
                    }
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="District"
                    value={formData.address.district}
                    onChange={(e) =>
                      handleNestedInputChange(
                        "address",
                        "district",
                        e.target.value
                      )
                    }
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Province"
                    value={formData.address.province}
                    onChange={(e) =>
                      handleNestedInputChange(
                        "address",
                        "province",
                        e.target.value
                      )
                    }
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Country"
                    value={formData.address.country}
                    onChange={(e) =>
                      handleNestedInputChange(
                        "address",
                        "country",
                        e.target.value
                      )
                    }
                    fullWidth
                  />
                </Grid>
              </Grid>
            </Grid>

            {/* Contact Information */}
            <Grid item xs={12}>
              <Typography variant="h6">Contact Information</Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Phone Number"
                    value={formData.contact.phoneNumber}
                    onChange={(e) =>
                      handleNestedInputChange(
                        "contact",
                        "phoneNumber",
                        e.target.value
                      )
                    }
                    fullWidth
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Website"
                    value={formData.contact.website}
                    onChange={(e) =>
                      handleNestedInputChange(
                        "contact",
                        "website",
                        e.target.value
                      )
                    }
                    fullWidth
                  />
                </Grid>
              </Grid>
            </Grid>

            {/* Principal Information */}
            <Grid item xs={12}>
              <Typography variant="h6">Principal Information</Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Principal Name"
                    value={formData.principal.name}
                    onChange={(e) =>
                      handleNestedInputChange(
                        "principal",
                        "name",
                        e.target.value
                      )
                    }
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Principal Email"
                    value={formData.principal.email}
                    onChange={(e) =>
                      handleNestedInputChange(
                        "principal",
                        "email",
                        e.target.value
                      )
                    }
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Principal Phone Number"
                    value={formData.principal.phoneNumber}
                    onChange={(e) =>
                      handleNestedInputChange(
                        "principal",
                        "phoneNumber",
                        e.target.value
                      )
                    }
                    fullWidth
                  />
                </Grid>
              </Grid>
            </Grid>

            {/* Established Year */}
            <Grid item xs={12} sm={6}>
              <TextField
                label="Established Year"
                name="establishedYear"
                value={formData.establishedYear}
                onChange={handleInputChange}
                fullWidth
                required
              />
            </Grid>

            {/* Facilities */}

            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Facilities
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 2, // Space between items
                }}
              >
                {Object.keys(formData.facilities).map((facility) => (
                  <FormControl
                    key={facility}
                    sx={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                    }}
                  >
                    <Checkbox
                      checked={formData.facilities[facility]}
                      onChange={() => handleFacilitiesChange(facility)}
                    />
                    <ListItemText
                      primary={
                        facility.charAt(0).toUpperCase() + facility.slice(1)
                      }
                    />
                  </FormControl>
                ))}
              </Box>
            </Grid>

            {/* Recognized By */}
            <Grid item xs={12}>
              <Typography variant="h6">Recognized By</Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Board"
                    value={formData.recognizedby.board}
                    onChange={(e) =>
                      handleNestedInputChange(
                        "recognizedby",
                        "board",
                        e.target.value
                      )
                    }
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Accreditation ID"
                    value={formData.recognizedby.accreditationId}
                    onChange={(e) =>
                      handleNestedInputChange(
                        "recognizedby",
                        "accreditationId",
                        e.target.value
                      )
                    }
                    fullWidth
                  />
                </Grid>
              </Grid>
            </Grid>

            {/* Submit Button */}
            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
              >
                Add School
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

export default SchoolManagement;
