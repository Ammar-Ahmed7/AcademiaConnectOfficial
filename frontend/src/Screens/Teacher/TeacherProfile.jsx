import React, { useEffect, useState } from "react";
import { Box, Typography, Avatar, Grid, Paper, Divider, Button, TextField } from "@mui/material";
import { Edit as EditIcon, Email as EmailIcon, Person as PersonIcon, Lock as LockIcon } from "@mui/icons-material";
import { useNavigate } from "react-router-dom"; 

const Profile = () => {
  const [profileData, setProfileData] = useState({
    firstName: "",
    email: "",
    password: "",
    disability: "",
    gender: "",
  });
  const [editedData, setEditedData] = useState({
    firstName: "",
    password: "",
    disability: "",
    gender: "",
  });
  const [isEditMode, setIsEditMode] = useState(false); // Track edit mode state
  const navigate = useNavigate();

  useEffect(() => {
    // Retrieve the email from sessionStorage
    const storedEmail = sessionStorage.getItem("userEmail");

    if (!storedEmail) {
      alert("No email found in session. Please log in first.");
      return;
    }

    // Fetch data from the server
    fetch("http://localhost:4000/teacher/teacher-dashboard", {
      method: "POST",
      headers: {
        "Content-Type": "application/json", // Specify JSON format
      },
      body: JSON.stringify({ email: storedEmail }), // Send the email as part of the request
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch teacher data");
        }
        return response.json();
      })
      .then((data) => {
        // Update state with fetched data
        setProfileData({
          firstName: data.firstName || "Unknown",
          email: data.email || storedEmail,
          password: data.password || "********",
          disability: data.disability || "Unknown",
          gender: data.gender || "Unknown",
        });

        // Set initial edited data
        setEditedData({
          firstName: data.firstName || "Unknown",
          password: data.password || "********",
          disability: data.disability || "Unknown",
          gender: data.gender || "Unknown",
        });
      })
      .catch((error) => {
        console.error("Error fetching teacher data:", error);
      });
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem("userEmail");
    navigate('/ChoseRole');
  };

  const handleEditClick = () => {
    setIsEditMode(true); // Enable edit mode
  };

  const handleSaveChanges = () => {
    // Send updated data to backend (PUT or PATCH request)
    fetch("http://localhost:4000/teacher/update-profile", {
      method: "PUT", // Use PUT or PATCH depending on your backend
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: profileData.email,  // Send email directly
        firstName: editedData.firstName,
        password: editedData.password,
        disability: editedData.disability,
        gender: editedData.gender,
      }), // Send the updated data
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to update profile");
        }
        return response.json();
      })
      .then((data) => {
        // If successful, update the profile data locally
        setProfileData(editedData);
       
        setIsEditMode(false);
        alert("Profile updated successfully!");
      })
      .catch((error) => {
        console.error("Error updating profile:", error);
        alert("Failed to update profile.");
      });
  };
  

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const { firstName, email, password, disability, gender } = profileData;

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        backgroundColor: "#f5f5f5",
        padding: 2,
      }}
    >
      <Paper
        elevation={3}
        sx={{
          width: "100%",
          maxWidth: 500,
          padding: 3,
          borderRadius: 3,
          textAlign: "center",
          backgroundColor: "#ffffff",
        }}
      >
        <Avatar
          sx={{
            width: 100,
            height: 100,
            margin: "0 auto",
            backgroundColor: "#1976d2",
            fontSize: 50,
          }}
        >
          {firstName.charAt(0).toUpperCase() || "?"}
        </Avatar>
        <Typography variant="h5" sx={{ marginTop: 2, fontWeight: "bold" }}>
          {firstName || "Unknown"}
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ display: "flex", alignItems: "center", justifyContent: "center", marginTop: 1 }}
        >
          <EmailIcon fontSize="small" sx={{ marginRight: 1 }} /> {email || "Unknown"}
        </Typography>

        <Divider sx={{ marginY: 3 }} />

        {/* Editable fields */}
        {isEditMode ? (
          <>
            <TextField
              label="First Name"
              variant="outlined"
              name="firstName"
              value={editedData.firstName}
              onChange={handleChange}
              fullWidth
              sx={{ marginBottom: 2 }}
            />
            <TextField
              label="Password"
              variant="outlined"
              name="password"
              type="password"
              value={editedData.password}
              onChange={handleChange}
              fullWidth
              sx={{ marginBottom: 2 }}
            />
            <TextField
              label="Disability"
              variant="outlined"
              name="disability"
              value={editedData.disability}
              onChange={handleChange}
              fullWidth
              sx={{ marginBottom: 2 }}
            />
            <TextField
              label="Gender"
              variant="outlined"
              name="gender"
              value={editedData.gender}
              onChange={handleChange}
              fullWidth
              sx={{ marginBottom: 2 }}
            />
          </>
        ) : (
          <>
            <Typography variant="body1" sx={{ marginBottom: 2 }}>
              <PersonIcon fontSize="small" sx={{ marginRight: 1 }} />
              <strong>Gender:</strong> {gender || "Unknown"}
            </Typography>
            <Typography variant="body1" sx={{ marginBottom: 2 }}>
              <LockIcon fontSize="small" sx={{ marginRight: 1 }} />
              <strong>Password:</strong> {password || "********"}
            </Typography>
            <Typography variant="body1" sx={{ marginBottom: 2 }}>
              <PersonIcon fontSize="small" sx={{ marginRight: 1 }} />
              <strong>Disability:</strong> {disability || "Unknown"}
            </Typography>
          </>
        )}

        <Grid container spacing={2}>
          <Grid item xs={6}>
            {isEditMode ? (
              <Button
                variant="contained"
                onClick={handleSaveChanges}
                fullWidth
                sx={{ textTransform: "none" }}
              >
                Save Changes
              </Button>
            ) : (
              <Button
                variant="contained"
                startIcon={<EditIcon />}
                fullWidth
                sx={{ textTransform: "none" }}
                onClick={handleEditClick}
              >
                Edit Profile
              </Button>
            )}
          </Grid>
          <Grid item xs={6}>
            <Button
              variant="outlined"
              color="secondary"
              fullWidth
              sx={{ textTransform: "none" }}
              onClick={handleLogout}
            >
              Logout
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default Profile;
