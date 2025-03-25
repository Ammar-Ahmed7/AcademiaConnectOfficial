// import React, { useState, useEffect } from "react";
// import {
//   TextField,
//   Button,
//   Grid,
//   Paper,
//   Typography,
//   Checkbox,
//   FormControl,
//   InputLabel,
//   Select,
//   MenuItem,
//   Snackbar,
//   Alert,
//   CircularProgress,
//   Box,
//   ListItemText,
// } from "@mui/material";
// import axios from "axios";

// const EditSchool = () => {
//   const [schools, setSchools] = useState([]); // List of schools from API
//   const [schoolId, setSchoolId] = useState(""); // Selected school ID
//   const [formData, setFormData] = useState({
//     ID: "",
//     email: "",
//     password: "",
//     name: "",
//     schoolfor: "",
//     schoollevel: "",
//     address: "",
//     phoneNumber: "",
//     establishedYear: "",
//     library: false,
//     sports: false,
//     computerLab: false,
//     scienceLab: false,
//     auditorium: false,
//     recognizedbyboard: "",
//     boardattestationId: "",
//   });

//   const [alert, setAlert] = useState({
//     open: false,
//     message: "",
//     severity: "",
//   });
//   const [loading, setLoading] = useState(false); // Loading state

//   // Fetch schools from API
//   useEffect(() => {
//     const fetchSchools = async () => {
//       try {
//         const response = await axios.get(
//           "http://localhost:4000/school/allfullname"
//         );
//         const schoolNames = response.data.map((school) => ({
//           id: school._id, // Use the real _id from the API
//           name: school.fullName, // Assuming 'fullName' is returned
//         }));
//         setSchools(schoolNames);
//       } catch (error) {
//         console.error("Error fetching school names:", error);
//         setAlert({
//           open: true,
//           message: "Failed to load school names!",
//           severity: "error",
//         });
//       }
//     };

//     fetchSchools();
//   }, []);

//   // Fetch school details when a school is selected
//   useEffect(() => {
//     if (schoolId) {
//       setLoading(true);
//       // Fetch school details by ID
//       const fetchSchoolDetails = async () => {
//         try {
//           const response = await axios.get(
//             `http://localhost:4000/school/${schoolId}`
//           );
//           const school = response.data;

//           // Populate the form with the selected school data
//           setFormData({
//             number: school.number || "",
//             email: school.email || "",
//             password: "password123", // Placeholder password
//             name: school.name || "",
//             schoolfor: school.schoolfor || "",
//             schoollevel: school.schoollevel || "",
//             address: school.address || {
//               street: "",
//               city: "",
//               district: "",
//               province: "Punjab",
//               country: "Pakistan",
//             },
//             contact: school.contact || {
//               phoneNumber: "",
//               website: "",
//             },
//             principal: school.principal || {
//               name: "",
//               email: "",
//               phoneNumber: "",
//             },
//             establishedYear: school.establishedYear || "",
//             facilities: school.facilities || {
//               library: false,
//               sports: false,
//               computerLab: false,
//               scienceLab: false,
//               auditorium: false,
//             },
//             recognizedby: school.recognizedby || {
//               board: "",
//               accreditationId: "",
//             },
//           });
//         } catch (error) {
//           console.error("Error fetching school details:", error);
//           setAlert({
//             open: true,
//             message: "Failed to load school details!",
//             severity: "error",
//           });
//         }
//         setLoading(false);
//       };

//       fetchSchoolDetails();
//     }
//   }, [schoolId]);

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });
//   };

//   const handleNestedInputChange = (key, name, value) => {
//     setFormData({
//       ...formData,
//       [key]: { ...formData[key], [name]: value },
//     });
//   };

//   const handleFacilitiesChange = (facility) => {
//     setFormData({
//       ...formData,
//       facilities: {
//         ...formData.facilities,
//         [facility]: !formData.facilities[facility],
//       },
//     });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     try {
//       setLoading(true); // Start loading
//       const response = await axios.put(
//         `http://localhost:4000/school/${schoolId}`,
//         formData
//       );

//       // On success, show success message and reset loading state
//       setAlert({
//         open: true,
//         message: response.data.message || "School updated successfully!",
//         severity: "success",
//       });
//     } catch (error) {
//       // Handle errors
//       console.error("Error updating school:", error);
//       setAlert({
//         open: true,
//         message: error.response?.data?.message || "Failed to update school!",
//         severity: "error",
//       });
//     } finally {
//       setLoading(false); // End loading
//     }
//   };

//   const handleCloseAlert = () => setAlert({ ...alert, open: false });

//   const handleSchoolChange = (e) => {
//     setSchoolId(e.target.value); // Update selected school ID
//   };

//   return (
//     <Paper
//       sx={{
//         padding: "20px",
//         maxWidth: "800px",
//         margin: "20px auto",
//         borderRadius: "8px",
//         boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
//       }}
//     >
//       <Typography variant="h4" align="center" gutterBottom>
//         Edit School
//       </Typography>

//       <FormControl fullWidth sx={{ marginBottom: "20px" }}>
//         <InputLabel>Select School</InputLabel>
//         <Select
//           value={schoolId}
//           onChange={handleSchoolChange}
//           label="Select School"
//         >
//           {schools.map((school) => (
//             <MenuItem key={school.id} value={school.id}>
//               {school.name}
//             </MenuItem>
//           ))}
//         </Select>
//       </FormControl>

//       {loading ? (
//         <CircularProgress />
//       ) : (
//         <>
//           {schoolId && (
//             <form onSubmit={handleSubmit}>
//               <Grid container spacing={2}>
//                 {/* School Number */}
//                 <Grid item xs={12} sm={6}>
//                   <TextField
//                     label="School ID"
//                     name="ID"
//                     value={formData.ID}
//                     onChange={handleInputChange}
//                     fullWidth
//                     required
//                   />
//                 </Grid>

//                 {/* School Email */}
//                 <Grid item xs={12} sm={6}>
//                   <TextField
//                     label="School Email"
//                     name="email"
//                     value={formData.email}
//                     onChange={handleInputChange}
//                     fullWidth
//                     required
//                   />
//                 </Grid>

//                 {/* Password */}
//                 <Grid item xs={12} sm={6}>
//                   <TextField
//                     label="Password"
//                     name="password"
//                     type="password"
//                     value={formData.password}
//                     onChange={handleInputChange}
//                     fullWidth
//                   />
//                 </Grid>

//                 {/* School Name */}
//                 <Grid item xs={12} sm={6}>
//                   <TextField
//                     label="School Name"
//                     name="name"
//                     value={formData.name}
//                     onChange={handleInputChange}
//                     fullWidth
//                     required
//                   />
//                 </Grid>

//                 {/* School For */}
//                 <Grid item xs={12} sm={6}>
//                   <FormControl fullWidth>
//                     <InputLabel>School For</InputLabel>
//                     <Select
//                       label="School For"
//                       name="schoolfor"
//                       value={formData.schoolfor}
//                       onChange={handleInputChange}
//                     >
//                       <MenuItem value="Girls">Girls</MenuItem>
//                       <MenuItem value="Boys">Boys</MenuItem>
//                     </Select>
//                   </FormControl>
//                 </Grid>

//                 {/* School Level */}
//                 <Grid item xs={12} sm={6}>
//                   <FormControl fullWidth>
//                     <InputLabel>School Level</InputLabel>
//                     <Select
//                       label="School Level"
//                       name="schoollevel"
//                       value={formData.schoollevel}
//                       onChange={handleInputChange}
//                     >
//                       <MenuItem value="Primary">Primary</MenuItem>
//                       <MenuItem value="Middle">Middle</MenuItem>
//                       <MenuItem value="High">High</MenuItem>
//                     </Select>
//                   </FormControl>
//                 </Grid>

//                 {/* Address */}
//                 <Grid item xs={12}>
//                   <TextField
//                     label="School Address"
//                     name="address"
//                     value={formData.address}
//                     onChange={handleInputChange}
//                     fullWidth
//                     required
//                   />
//                 </Grid>

//                 {/* Phone Number */}
//                 <Grid item xs={12} sm={6}>
//                   <TextField
//                     label="Phone Number"
//                     name="phoneNumber"
//                     value={formData.phoneNumber}
//                     onChange={handleInputChange}
//                     fullWidth
//                     required
//                   />
//                 </Grid>

//                 {/* Established Year */}
//                 <Grid item xs={12} sm={6}>
//                   <TextField
//                     label="Established Year"
//                     name="establishedYear"
//                     value={formData.establishedYear}
//                     onChange={handleInputChange}
//                     fullWidth
//                     required
//                   />
//                 </Grid>

//                 {/* Board Recognition */}
//                 <Grid item xs={12} sm={6}>
//                   <TextField
//                     label="Recognized By Board"
//                     name="recognizedbyboard"
//                     value={formData.recognizedbyboard}
//                     onChange={handleInputChange}
//                     // required={formData.boardaccreditationId.trim() !== ""}
//                     fullWidth
//                   />
//                 </Grid>

//                 <Grid item xs={12} sm={6}>
//                   <TextField
//                     label="Attestation ID"
//                     name="boardattestationId"
//                     value={formData.boardattestationId}
//                     onChange={handleInputChange}
//                     // required={formData.recognizedbyboard.trim() !== ""}
//                     fullWidth
//                   />
//                 </Grid>

//                 {/* Facilities */}

//                 <Grid item xs={12}>
//                   <Typography variant="h6" gutterBottom>
//                     Facilities
//                   </Typography>
//                   <Grid container spacing={1} alignItems="center">
//                     {[
//                       "library",
//                       "sports",
//                       "computerLab",
//                       "scienceLab",
//                       "auditorium",
//                     ].map((facility) => (
//                       <Grid
//                         item
//                         key={facility}
//                         sx={{ display: "flex", alignItems: "center" }}
//                       >
//                         <FormControlLabel
//                           control={
//                             <Checkbox
//                               checked={formData[facility]}
//                               onChange={handleInputChange}
//                               name={facility}
//                             />
//                           }
//                           label={
//                             <Typography
//                               variant="body2"
//                               sx={{ whiteSpace: "nowrap" }}
//                             >
//                               {facility
//                                 .replace(/([A-Z])/g, " $1")
//                                 .replace(/^./, (str) => str.toUpperCase())}
//                             </Typography>
//                           }
//                           sx={{ mr: 1 }}
//                         />
//                       </Grid>
//                     ))}
//                   </Grid>
//                 </Grid>

//                 {/* Submit Button */}
//                 <Grid item xs={12}>
//                   <Button
//                     type="submit"
//                     variant="contained"
//                     color="primary"
//                     fullWidth
//                   >
//                     Update School
//                   </Button>
//                 </Grid>
//               </Grid>
//             </form>
//           )}
//         </>
//       )}

//       <Snackbar
//         open={alert.open}
//         autoHideDuration={4000}
//         onClose={handleCloseAlert}
//       >
//         <Alert
//           onClose={handleCloseAlert}
//           severity={alert.severity}
//           sx={{ width: "100%" }}
//         >
//           {alert.message}
//         </Alert>
//       </Snackbar>
//     </Paper>
//   );
// };

// export default EditSchool;

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
  FormControlLabel,
} from "@mui/material";
import supabase from "../../../supabase-client";

const EditSchool = () => {
  const [schools, setSchools] = useState([]);
  const [schoolId, setSchoolId] = useState("");
  const [formData, setFormData] = useState({
    ID: "",
    email: "",
    password: "",
    name: "",
    schoolfor: "",
    schoollevel: "",
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
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchSchools();
  }, []);

  useEffect(() => {
    if (schoolId) {
      fetchSchoolDetails();
    }
  }, [schoolId]);

  const fetchSchools = async () => {
    try {
      const { data, error } = await supabase
        .from("School")
        .select("*")
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

  const fetchSchoolDetails = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("School")
        .select("*")
        .eq("SchoolID", schoolId)
        .single();

      if (error) throw error;

      setFormData({
        ID: data.SchoolID,
        email: data.Email || "",
        password: "", // Do not prefill passwords
        name: data.SchoolName || "",
        schoolfor: data.SchoolFor || "",
        schoollevel: data.SchoolLevel || "",
        address: data.Address || "",
        phoneNumber: data.PhoneNumber || "",
        establishedYear: data.EstablishedYear || "",
        library: data.Library || false,
        sports: data.SportsGround || false,
        computerLab: data.ComputerLab || false,
        scienceLab: data.ScienceLab || false,
        auditorium: data.Auditorium || false,
        recognizedbyboard: data.Recognizedbyboard || "",
        boardattestationId: data.BoardattestationId || "",
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

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    event.preventDefault(); // Prevent form submission default behavior

    const boardattestationId = formData.boardattestationId
      ? String(formData.boardattestationId).trim()
      : ""; // Ensure it's a string and trim safely

    if (!boardattestationId) {
      console.error("Board Attestation ID is empty or invalid");
      return;
    }

    // Proceed with the rest of your logic
    console.log("Trimmed boardattestationId:", boardattestationId);

    setLoading(true);
    const { data, error } = await supabase
      .from("School")
      .update({
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
      })
      .eq("SchoolID", formData.ID);

    if (error) {
      setLoading(false);
      console.error("Error updating school:", error.message);
      setAlert({
        open: true,
        message: "Failed to update school. Try again!",
        severity: "error",
      });
    } else {
      setLoading(false);
      setAlert({
        open: true,
        message: "School updated successfully!",
        severity: "success",
      });
    }
  };

  const handleCloseAlert = () => setAlert({ ...alert, open: false });

  return (
    <Paper sx={{ padding: 3, maxWidth: 800, margin: "20px auto" }}>
      <Typography variant="h4" gutterBottom>
        Edit School
      </Typography>

      <FormControl fullWidth sx={{ mb: 3 }}>
        <InputLabel>Select School</InputLabel>
        <Select
          value={schoolId}
          onChange={(e) => setSchoolId(e.target.value)}
          label="Select School"
        >
          {schools.map((school) => (
            <MenuItem key={school.SchoolID} value={school.SchoolID}>
              {school.SchoolID}-{school.SchoolName}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {loading ? (
        <CircularProgress />
      ) : (
        schoolId && (
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
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

              <Grid item xs={12} sm={6}>
                <TextField
                  label="Email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  fullWidth
                  required
                />
              </Grid>

              {/* <Grid item xs={12} sm={6}>
                <TextField
                  label="Password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  fullWidth
                />
              </Grid> */}

              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>School For</InputLabel>
                  <Select
                    name="schoolFor"
                    value={formData.schoolfor}
                    onChange={handleInputChange}
                    label="School For"
                  >
                    <MenuItem value="Girls">Girls</MenuItem>
                    <MenuItem value="Boys">Boys</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>School Level</InputLabel>
                  <Select
                    name="schoolLevel"
                    value={formData.schoollevel}
                    onChange={handleInputChange}
                    label="School Level"
                  >
                    <MenuItem value="Primary">Primary</MenuItem>
                    <MenuItem value="Middle">Middle</MenuItem>
                    <MenuItem value="High">High</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

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

              <Grid item xs={12} sm={6}>
                <TextField
                  label="Established Year"
                  name="establishedYear"
                  type="number"
                  value={formData.establishedYear}
                  onChange={handleInputChange}
                  fullWidth
                  required
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  label="Address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  fullWidth
                  required
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  label="Recognized by Board"
                  name="recognizedbyboard"
                  value={formData.recognizedbyboard}
                  onChange={handleInputChange}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Attestation Id "
                  name="boardattestationId"
                  value={formData.boardattestationId}
                  onChange={handleInputChange}
                  fullWidth
                />
              </Grid>

              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  Facilities
                </Typography>
                <Grid container spacing={1}>
                  {[
                    "library",
                    "sports",
                    "computerLab",
                    "scienceLab",
                    "auditorium",
                  ].map((facility) => (
                    <Grid item key={facility}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={formData[facility]}
                            onChange={ handleInputChange}
                            name={facility}
                          />
                        }
                        label={facility
                          .replace(/([A-Z])/g, " $1")
                          .toUpperCase()}
                      />
                    </Grid>
                  ))}
                </Grid>
              </Grid>

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
        )
      )}

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
    </Paper>
  );
};

export default EditSchool;
