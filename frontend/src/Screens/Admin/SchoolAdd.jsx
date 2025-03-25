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
  FormControlLabel,
} from "@mui/material";
import supabase from "../../../supabase-client";

const SchoolManagement = () => {
  const [formData, setFormData] = useState({
    ID: "S-",
    email: "",
    password: "ww@123",
    name: "Workers Welfare School",
    schoolfor: "Girls",
    schoollevel: "Primary",
    address: "",
    phoneNumber: "",
    establishedYear: "",
    library: false,
    sports: false,
    computerLab: false,
    scienceLab: false,
    auditorium: false,
    recognizedbyboard: "",
    boardattestationId: "",
  });

  const [alert, setAlert] = useState({
    open: false,
    message: "",
    severity: "",
  });

  // Handle field change
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      (formData.recognizedbyboard.trim() &&
        !formData.boardattestationId.trim()) ||
      (!formData.recognizedbyboard.trim() &&
        formData.boardattestationId.trim())
    ) {
      setAlert({
        open: true,
        message:
          "Both 'Recognized By Board' and 'Attestation ID' are required together!",
        severity: "error",
      });
      return;
    }

    const { data, error } = await supabase.from("School").insert([
      {
        SchoolID: formData.ID, // Ensure UUID format in Supabase
        Email: formData.email,
        Password: formData.password, // Store securely (hash on backend)
        SchoolName: formData.name,
        SchoolFor: formData.schoolfor,
        SchoolLevel: formData.schoollevel,
        Address: formData.address,
        PhoneNumber: formData.phoneNumber,
        EstablishedYear: formData.establishedYear
          ? parseInt(formData.establishedYear)
          : null,
        Library: formData.library,
        SportsGround: formData.sports,
        ComputerLab: formData.computerLab,
        ScienceLab: formData.scienceLab,
        Recognizedbyboard: formData.recognizedbyboard,
        BoardattestationId: formData.boardattestationId
          ? parseInt(formData.boardattestationId)
          : null,
      },
    ]);

    if (error) {
      console.error("Error adding school:", error.message);
      setAlert({
        open: true,
        message: "Failed to add school. Try again!",
        severity: "error",
      });
    } else {
      setAlert({
        open: true,
        message: "School added successfully!",
        severity: "success",
      });
      // Reset form after successful submission
      setFormData({
        ID: "S-",
        email: "",
        password: "ww@123",
        name: "Workers Welfare School",
        schoolfor: "Girls",
        schoollevel: "Primary",
        address: "",
        phoneNumber: "",
        establishedYear: "",
        library: false,
        sports: false,
        computerLab: false,
        scienceLab: false,
        auditorium: false,
        recognizedbyboard: "",
        boardattestationId: "",
      });
    }
  };

  const handleCloseAlert = () => setAlert({ ...alert, open: false });

  return (
    <Box sx={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
      <Typography variant="h4" align="center" gutterBottom>
        Add a new School
      </Typography>

      <Paper elevation={3} sx={{ padding: "20px" }}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            {/* School ID */}
            <Grid item xs={12} sm={6}>
              <TextField
                label="School ID"
                name="ID"
                value={formData.ID}
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
                  label="School For"
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
                  label="School Level"
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
              <TextField
                label="School Address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                fullWidth
                required
              />
            </Grid>

            {/* Phone Number */}
            <Grid item xs={12} sm={6}>
              <TextField
                label="Phone Number"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                fullWidth
                required
              />
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

            {/* Board Recognition */}
            <Grid item xs={12} sm={6}>
              <TextField
                label="Recognized By Board"
                name="recognizedbyboard"
                value={formData.recognizedbyboard}
                onChange={handleInputChange}
                // required={formData.boardaccreditationId.trim() !== ""}
                fullWidth
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                label="Attestation ID"
                name="boardattestationId"
                value={formData.boardattestationId}
                onChange={handleInputChange}
                // required={formData.recognizedbyboard.trim() !== ""}
                fullWidth
              />
            </Grid>

            {/* Facilities */}

            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Facilities
              </Typography>
              <Grid container spacing={1} alignItems="center">
                {[
                  "library",
                  "sports",
                  "computerLab",
                  "scienceLab",
                  "auditorium",
                ].map((facility) => (
                  <Grid
                    item
                    key={facility}
                    sx={{ display: "flex", alignItems: "center" }}
                  >
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={formData[facility]}
                          onChange={handleInputChange}
                          name={facility}
                        />
                      }
                      label={
                        <Typography
                          variant="body2"
                          sx={{ whiteSpace: "nowrap" }}
                        >
                          {facility
                            .replace(/([A-Z])/g, " $1")
                            .replace(/^./, (str) => str.toUpperCase())}
                        </Typography>
                      }
                      sx={{ mr: 1 }}
                    />
                  </Grid>
                ))}
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
