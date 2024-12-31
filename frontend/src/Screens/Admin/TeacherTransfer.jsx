import React, { useState, useEffect } from "react";
import axios from 'axios';
import {
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
  Button,
  TextField,
  Modal,
  InputAdornment,
} from "@mui/material";

const TransferTeacher = () => {
  const [cnicList, setCnicList] = useState([]);
  const [selectedCnic, setSelectedCnic] = useState("");
  const [teacherDetails, setTeacherDetails] = useState(null);
  const [schools, setSchools] = useState([]); // List of schools from API

  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({
    open: false,
    message: "",
    severity: "",
  });
  const [openTransferForm, setOpenTransferForm] = useState(false); // State to control the modal form
  const [newSchool, setNewSchool] = useState(""); // New school name
  const [reason, setReason] = useState(""); // Reason for transfer
  const [searchQuery, setSearchQuery] = useState(""); // Search query for CNIC list

  // Fetch the list of CNICs from the backend
  useEffect(() => {
    const fetchCnicList = async () => {
      try {
        const response = await fetch("http://localhost:4000/teacher/allcnic");
        const data = await response.json();
        if (response.ok) {
          setCnicList(data);
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
      setLoading(true);
      try {
        const response = await fetch(
          `http://localhost:4000/teacher/${selectedCnic.trim()}`
        );
        const data = await response.json();
        if (response.ok) {
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
          setTeacherDetails(teacherData);
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
      } finally {
        setLoading(false);
      }
    };

    const formatDate = (date) => {
      if (!date) return "";
      const d = new Date(date);
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, "0");
      const day = String(d.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    };

    fetchTeacherData();
  }, [selectedCnic]);

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
  const handleCnicSelection = (event) => {
    setSelectedCnic(event.target.value);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  // Filter CNIC list based on search query
  const filteredCnicList = cnicList.filter((cnic) =>
    cnic.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleTransfer = () => {
    // Open the transfer form modal when the button is clicked
    setOpenTransferForm(true);
  };

  const handleTransferSubmit = async () => {
    // Validate the form data
    if (!newSchool || !reason) {
      setAlert({
        open: true,
        message: "Please provide both the new school name and reason.",
        severity: "error",
      });
      return;
    }

    // Send the transfer data to the backend
    const transferData = {
      cnic: teacherDetails.personalinformation.cnic,
      newSchool,
      reason,
    };

    try {
      const response = await fetch("http://localhost:4000/teacher/transfer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(transferData),
      });
      const data = await response.json();
      if (response.ok) {
        setAlert({
          open: true,
          message: "Teacher transferred successfully.",
          severity: "success",
        });
        // Close the transfer form modal after successful transfer
        setOpenTransferForm(false);
      } else {
        throw new Error("Transfer failed");
      }
    } catch (error) {
      console.error("Error transferring teacher:", error);
      setAlert({
        open: true,
        message: "Failed to transfer teacher.",
        severity: "error",
      });
    }
  };

  const handleCloseAlert = () => {
    setAlert({ ...alert, open: false });
  };

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
        Transfer Teacher
      </Typography>

      <Paper
        sx={{
          padding: "20px",
          borderRadius: "8px",
          backgroundColor: "#fff",
        }}
        elevation={3}
      >
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <FormControl fullWidth sx={{ marginBottom: "20px" }}>
              <InputLabel>Select CNIC</InputLabel>
              <Select
                value={selectedCnic}
                onChange={handleCnicSelection}
                label="Select CNIC"
                renderValue={(selected) =>
                  selected ? selected : "Select CNIC"
                }
              >
                {/* Searchable field inside the dropdown */}
                <TextField
                  value={searchQuery}
                  onChange={handleSearchChange}
                  label="Search CNIC"
                  variant="outlined"
                  size="small"
                  fullWidth
                  sx={{ marginBottom: "10px" }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">🔍</InputAdornment>
                    ),
                  }}
                />

                {/* Filtered CNIC List */}
                {filteredCnicList.map((cnic) => (
                  <MenuItem key={cnic} value={cnic}>
                    {cnic}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        {loading ? (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            mt={4}
          >
            <CircularProgress />
          </Box>
        ) : (
          teacherDetails && (
            <Box mt={4}>
              <Typography variant="h6">Personal Information</Typography>
              <Grid container spacing={2} mt={2}>
                <Grid item xs={6}>
                  <Typography>
                    <strong>CNIC:</strong>{" "}
                    {teacherDetails.personalinformation.cnic}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography>
                    <strong>Name:</strong>{" "}
                    {teacherDetails.personalinformation.name}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography>
                    <strong>Email:</strong>{" "}
                    {teacherDetails.personalinformation.email}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography>
                    <strong>Phone Number:</strong>{" "}
                    {teacherDetails.personalinformation.phoneNumber}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography>
                    <strong>Gender:</strong>{" "}
                    {teacherDetails.personalinformation.gender}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography>
                    <strong>Date of Birth:</strong>{" "}
                    {teacherDetails.personalinformation.dateOfBirth}
                  </Typography>
                </Grid>
              </Grid>

              <Typography variant="h6" mt={4}>
                Educational Details
              </Typography>
              <Grid container spacing={2} mt={2}>
                <Grid item xs={6}>
                  <Typography>
                    <strong>Qualification:</strong>{" "}
                    {teacherDetails.educationaldetails.qualification}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography>
                    <strong>Experience (Years):</strong>{" "}
                    {teacherDetails.educationaldetails.experience.years}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography>
                    <strong>Subjects:</strong>{" "}
                    {teacherDetails.educationaldetails.subjects.join(", ")}
                  </Typography>
                </Grid>
              </Grid>

              <Typography variant="h6" mt={4}>
                School Information
              </Typography>
              <Grid container spacing={2} mt={2}>
                <Grid item xs={6}>
                  <Typography>
                    <strong>Employee ID:</strong>{" "}
                    {teacherDetails.schoolinformation.employeId}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography>
                    <strong>School:</strong>{" "}
                    {teacherDetails.schoolinformation.school?.name || "N/A"} for{" "}
                    {teacherDetails.schoolinformation.school?.schoolfor ||
                      "N/A"}{" "}
                    {teacherDetails.schoolinformation.school?.address.city ||
                      "N/A"}{" "}
                    {teacherDetails.schoolinformation.school?.address
                      .district || "N/A"}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography>
                    <strong>Hire Date:</strong>{" "}
                    {teacherDetails.schoolinformation.hireDate}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography>
                    <strong>Employment Type:</strong>{" "}
                    {teacherDetails.schoolinformation.employmentType}
                  </Typography>
                </Grid>
              </Grid>

              <Typography variant="h6" mt={4}>
                Address
              </Typography>
              <Grid container spacing={2} mt={2}>
                <Grid item xs={6}>
                  <Typography>
                    <strong>Street:</strong> {teacherDetails.address.street}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography>
                    <strong>City:</strong> {teacherDetails.address.city}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography>
                    <strong>District:</strong> {teacherDetails.address.district}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography>
                    <strong>Province:</strong> {teacherDetails.address.province}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography>
                    <strong>Country:</strong> {teacherDetails.address.country}
                  </Typography>
                </Grid>
              </Grid>

              <Box mt={4}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleTransfer}
                >
                  Transfer to Other School
                </Button>
              </Box>
            </Box>
          )
        )}
      </Paper>

      {/* Alert for success or failure */}
      <Snackbar
        open={alert.open}
        autoHideDuration={6000}
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

      {/* Modal for Transfer Form */}
      <Modal
        open={openTransferForm}
        onClose={() => setOpenTransferForm(false)}
        aria-labelledby="transfer-modal-title"
        aria-describedby="transfer-modal-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            maxWidth: 400,
            width: "100%",
          }}
        >
          <Typography variant="h6" id="transfer-modal-title" gutterBottom>
            New School
          </Typography>

          <Grid item xs={6}>
            <Typography>
              <strong> Previous School:</strong>{" "}
              {teacherDetails?.schoolinformation?.school?.name || "N/A"} for{" "}
              {teacherDetails?.schoolinformation?.school?.schoolfor || "N/A"}{" "}
              {teacherDetails?.schoolinformation?.school?.address.city || "N/A"}{" "}
              {teacherDetails?.schoolinformation?.school?.address.district ||
                "N/A"}
            </Typography>
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl fullWidth required>
              <InputLabel>School Name</InputLabel>
              <Select
                label="School Name"
                name="school"
                // value={formData.schoolinformation.school}
                // onChange={(e) =>
                //   handleNestedInputChange("schoolinformation", "school", e.target.value)
                // }
              >
                {schools.map((school) => (
                  <MenuItem key={school.id} value={school.id}>
                    {school.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={6}>
            <Typography>
              <strong> New School:</strong>{" "}
              {teacherDetails?.schoolinformation?.school?.name || "N/A"} for{" "}
              {teacherDetails?.schoolinformation?.school?.schoolfor || "N/A"}{" "}
              {teacherDetails?.schoolinformation?.school?.address.city || "N/A"}{" "}
              {teacherDetails?.schoolinformation?.school?.address.district ||
                "N/A"}
            </Typography>
          </Grid>

          <TextField
            label="New School Name"
            fullWidth
            value={newSchool}
            onChange={(e) => setNewSchool(e.target.value)}
            sx={{ mb: 2 }}
          />

          <TextField
            label="Reason for Transfer"
            fullWidth
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            sx={{ mb: 2 }}
          />

          <Box display="flex" justifyContent="space-between">
            <Button
              variant="contained"
              color="primary"
              onClick={handleTransferSubmit}
            >
              Update
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              onClick={() => setOpenTransferForm(false)}
            >
              Cancel
            </Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};

export default TransferTeacher;







