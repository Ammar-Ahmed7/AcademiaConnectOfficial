import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Grid,
  Paper,
  Typography,
  Checkbox,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Snackbar,
  Alert,
  CircularProgress,
  Box,
  ListItemText,
} from "@mui/material";
import axios from "axios";

const EditSchool = () => {
  const [schools, setSchools] = useState([]); // List of schools from API
  const [schoolId, setSchoolId] = useState(""); // Selected school ID
  const [formData, setFormData] = useState({
    number: "",
    email: "",
    password: "",
    name: "",
    schoolfor: "",
    schoollevel: "",
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
  const [loading, setLoading] = useState(false); // Loading state

  // Fetch schools from API
  useEffect(() => {
    const fetchSchools = async () => {
      try {
        const response = await axios.get(
          "http://localhost:4000/school/allfullname"
        );
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

  // Fetch school details when a school is selected
  useEffect(() => {
    if (schoolId) {
      setLoading(true);
      // Fetch school details by ID
      const fetchSchoolDetails = async () => {
        try {
          const response = await axios.get(
            `http://localhost:4000/school/${schoolId}`
          );
          const school = response.data;

          // Populate the form with the selected school data
          setFormData({
            number: school.number || "",
            email: school.email || "",
            password: "password123", // Placeholder password
            name: school.name || "",
            schoolfor: school.schoolfor || "",
            schoollevel: school.schoollevel || "",
            address: school.address || {
              street: "",
              city: "",
              district: "",
              province: "Punjab",
              country: "Pakistan",
            },
            contact: school.contact || {
              phoneNumber: "",
              website: "",
            },
            principal: school.principal || {
              name: "",
              email: "",
              phoneNumber: "",
            },
            establishedYear: school.establishedYear || "",
            facilities: school.facilities || {
              library: false,
              sports: false,
              computerLab: false,
              scienceLab: false,
              auditorium: false,
            },
            recognizedby: school.recognizedby || {
              board: "",
              accreditationId: "",
            },
          });
        } catch (error) {
          console.error("Error fetching school details:", error);
          setAlert({
            open: true,
            message: "Failed to load school details!",
            severity: "error",
          });
        }
        setLoading(false);
      };

      fetchSchoolDetails();
    }
  }, [schoolId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleNestedInputChange = (key, name, value) => {
    setFormData({
      ...formData,
      [key]: { ...formData[key], [name]: value },
    });
  };

  const handleFacilitiesChange = (facility) => {
    setFormData({
      ...formData,
      facilities: {
        ...formData.facilities,
        [facility]: !formData.facilities[facility],
      },
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true); // Start loading
      const response = await axios.put(
        `http://localhost:4000/school/${schoolId}`,
        formData
      );

      // On success, show success message and reset loading state
      setAlert({
        open: true,
        message: response.data.message || "School updated successfully!",
        severity: "success",
      });
    } catch (error) {
      // Handle errors
      console.error("Error updating school:", error);
      setAlert({
        open: true,
        message: error.response?.data?.message || "Failed to update school!",
        severity: "error",
      });
    } finally {
      setLoading(false); // End loading
    }
  };

  const handleCloseAlert = () => setAlert({ ...alert, open: false });

  const handleSchoolChange = (e) => {
    setSchoolId(e.target.value); // Update selected school ID
  };

  return (
    <Paper
      sx={{
        padding: "20px",
        maxWidth: "800px",
        margin: "20px auto",
        borderRadius: "8px",
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
      }}
    >
      <Typography variant="h4" align="center" gutterBottom>
        Edit School
      </Typography>

      <FormControl fullWidth sx={{ marginBottom: "20px" }}>
        <InputLabel>Select School</InputLabel>
        <Select
          value={schoolId}
          onChange={handleSchoolChange}
          label="Select School"
        >
          {schools.map((school) => (
            <MenuItem key={school.id} value={school.id}>
              {school.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {loading ? (
        <CircularProgress />
      ) : (
        <>
          {schoolId && (
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
                          handleNestedInputChange(
                            "address",
                            "city",
                            e.target.value
                          )
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
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
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
                    Update School
                  </Button>
                </Grid>
              </Grid>
            </form>
          )}
        </>
      )}

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
    </Paper>
  );
};

export default EditSchool;
