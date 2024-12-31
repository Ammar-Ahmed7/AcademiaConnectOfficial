import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Switch,
  FormControlLabel,
  Snackbar,
  Alert,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AddIcon from "@mui/icons-material/Add";

import { DateRangePicker } from "@mui/x-date-pickers-pro/DateRangePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { useNavigate } from "react-router-dom";

const AddNotice = () => {
  const [formData, setFormData] = useState({
    title: "",
    message: "",
    Dates: [null, null],
    type: "Government",
    subType: "Holiday",
    createdBy: "Admin",
    audience: "All",
    isUrgent: false,
  });

  const [alert, setAlert] = useState({
    open: false,
    message: "",
    severity: "",
  });

  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleNestedInputChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleDateRangeChange = (newValue) => {
    setFormData({ ...formData, Dates: newValue });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.title ||
      !formData.message ||
      !formData.Dates[0] ||
      !formData.Dates[1]
    ) {
      setAlert({
        open: true,
        message:
          "Please fill all required fields and select a valid date range.",
        severity: "error",
      });
      return;
    }

    const payload = {
      ...formData,
      Dates: formData.Dates.map((date) => new Date(date).toISOString()), // Convert Dates to ISO format
    };

    try {
      const response = await fetch(
        "http://localhost:4000/notification/addNew",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (response.ok) {
        setAlert({
          open: true,
          message: "Notice posted successfully!",
          severity: "success",
        });
        setFormData({
          title: "",
          message: "",
          Dates: [null, null],
          type: "Government",
          subType: "Holiday",
          createdBy: "Admin",
          audience: "All",
          isUrgent: false,
        });
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to post notice");
      }
    } catch (error) {
      setAlert({
        open: true,
        message: error.message || "Failed to post notice. Try again!",
        severity: "error",
      });
    }
  };

  const handleGoBack = () => navigate(-1);

  const handleCloseAlert = () => setAlert({ ...alert, open: false });

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        bgcolor="#f5f5f5"
        p={4}
      >
        <Card
          sx={{
            maxWidth: 500,
            padding: 3,
            textAlign: "center",
            width: "100%",
          }}
        >
          <CardContent>
            <Typography variant="h5" fontWeight="bold" mb={2}>
              Add a Notice
            </Typography>

            <form onSubmit={handleSubmit}>
              <Box display="flex" gap={2} mb={2}>
                <FormControl fullWidth>
                  <InputLabel>Type</InputLabel>
                  <Select
                    value={formData.type}
                    name="type"
                    onChange={handleInputChange}
                  >
                    <MenuItem value="Government">Government</MenuItem>
                    <MenuItem value="School">School</MenuItem>
                  </Select>
                </FormControl>

                <FormControl fullWidth>
                  <InputLabel>Sub-Type</InputLabel>
                  <Select
                    value={formData.subType}
                    name="subType"
                    onChange={handleInputChange}
                  >
                    <MenuItem value="Holiday">Holiday</MenuItem>
                    <MenuItem value="Event">Event</MenuItem>
                  </Select>
                </FormControl>
              </Box>

              <TextField
                fullWidth
                label="Title *"
                variant="outlined"
                value={formData.title}
                name="title"
                onChange={handleInputChange}
                margin="normal"
              />

              <TextField
                fullWidth
                label="Write a Message *"
                variant="outlined"
                multiline
                rows={4}
                value={formData.message}
                name="message"
                onChange={handleInputChange}
                margin="normal"
              />

              <Box display="flex" gap={2} mb={2}>
                <TextField
                  fullWidth
                  label="Created By *"
                  variant="outlined"
                  value={formData.createdBy}
                  name="createdBy"
                  onChange={handleInputChange}
                  margin="normal"
                />

                <FormControl fullWidth margin="normal">
                  <InputLabel>Audience</InputLabel>
                  <Select
                    value={formData.audience}
                    name="audience"
                    onChange={handleInputChange}
                  >
                    <MenuItem value="All">All</MenuItem>
                    <MenuItem value="Teachers">Teachers</MenuItem>
                    <MenuItem value="Students">Students</MenuItem>
                    <MenuItem value="Schools">Schools</MenuItem>
                  </Select>
                </FormControl>
              </Box>

              <FormControlLabel
                control={
                  <Switch
                    checked={formData.isUrgent}
                    onChange={(e) =>
                      handleNestedInputChange("isUrgent", e.target.checked)
                    }
                  />
                }
                label="Mark as Urgent"
                sx={{ mb: 2 }}
              />

              <DateRangePicker
                startText="Start of Event"
                endText="End of Event"
                value={formData.Dates}
                onChange={handleDateRangeChange}
                renderInput={(startProps, endProps) => (
                  <>
                    <TextField {...startProps} fullWidth margin="normal" />
                    <Box sx={{ mx: 2 }}> to </Box>
                    <TextField {...endProps} fullWidth margin="normal" />
                  </>
                )}
              />

              <Box mt={3} display="flex" flexDirection="column" gap={2}>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<AddIcon />}
                  type="submit"
                  fullWidth
                >
                  Post Notice
                </Button>
              
              </Box>
            </form>
          </CardContent>
        </Card>

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
    </LocalizationProvider>
  );
};

export default AddNotice;
