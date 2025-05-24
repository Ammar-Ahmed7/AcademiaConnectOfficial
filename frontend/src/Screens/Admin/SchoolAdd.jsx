// //   return (
// //     <Box sx={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
// //       <Typography variant="h4" align="center" gutterBottom>
// //         Add a new School
// //       </Typography>

// //       <Paper elevation={3} sx={{ padding: "20px" }}>
// //         <form onSubmit={handleSubmit}>
// //           <Grid container spacing={2}>
// //             {/* School ID - Read only */}
// //             <Grid item xs={12} sm={6}>
// //               <TextField
// //                 label="School ID"
// //                 name="ID"
// //                 value={formData.ID}
// //                 onChange={handleInputChange}
// //                 fullWidth
// //                 required
// //                 InputProps={{
// //                   readOnly: true,
// //                 }}
// //                 variant="filled"
// //               />
// //             </Grid>

// //             {/* School Email */}
// //             <Grid item xs={12} sm={6}>
// //               <TextField
// //                 label="School Email"
// //                 name="email"
// //                 value={formData.email}
// //                 onChange={handleInputChange}
// //                 fullWidth
// //                 required
// //                 type="email"
// //                 error={alert.message.includes("email")}
// //               />
// //             </Grid>

// //             {/* Password */}
// //             <Grid item xs={12} sm={6}>
// //               {/* <TextField
// //                 label="Password"
// //                 name="password"
// //                 type="password"
// //                 value={formData.password}
// //                 onChange={handleInputChange}
// //                 fullWidth
// //                 required
// //               /> */}

// //               <TextField
// //                 label="Password"
// //                 name="password"
// //                 type={showPassword ? "text" : "password"}
// //                 value={formData.password}
// //                 onChange={handleInputChange}
// //                 fullWidth
// //                 required
// //                 error={alert.message.toLowerCase().includes("password")}
// //                 // helperText="Minimum 8 characters with uppercase, lowercase, number & special character"
// //                 InputProps={{
// //                   endAdornment: (
// //                     <Button
// //                       onClick={() => setShowPassword(!showPassword)}
// //                       size="small"
// //                     >
// //                       {showPassword ? <Visibility /> : <VisibilityOff />}
// //                     </Button>
// //                   ),
// //                 }}
// //               />
// //             </Grid>

// //             {/* School Name */}
// //             <Grid item xs={12} sm={6}>
// //               <TextField
// //                 label="School Name"
// //                 name="name"
// //                 value={formData.name}
// //                 onChange={handleInputChange}
// //                 fullWidth
// //                 required
// //               />
// //             </Grid>

// //             {/* School For */}
// //             <Grid item xs={12} sm={6}>
// //               <FormControl fullWidth>
// //                 <InputLabel>School For</InputLabel>
// //                 <Select
// //                   label="School For"
// //                   name="schoolfor"
// //                   value={formData.schoolfor}
// //                   onChange={handleInputChange}
// //                 >
// //                   <MenuItem value="Girls">Girls</MenuItem>
// //                   <MenuItem value="Boys">Boys</MenuItem>
// //                 </Select>
// //               </FormControl>
// //             </Grid>

// //             {/* School Level */}
// //             <Grid item xs={12} sm={6}>
// //               <FormControl fullWidth>
// //                 <InputLabel>School Level</InputLabel>
// //                 <Select
// //                   label="School Level"
// //                   name="schoollevel"
// //                   value={formData.schoollevel}
// //                   onChange={handleInputChange}
// //                 >
// //                   <MenuItem value="Primary">Primary</MenuItem>
// //                   <MenuItem value="Middle">Secondary</MenuItem>
// //                   <MenuItem value="High">High</MenuItem>
// //                 </Select>
// //               </FormControl>
// //             </Grid>

// //             {/* Address */}
// //             <Grid item xs={12}>
// //               <TextField
// //                 label="School Address"
// //                 name="address"
// //                 value={formData.address}
// //                 onChange={handleInputChange}
// //                 fullWidth
// //                 required
// //               />
// //             </Grid>

// //             {/* Phone Number */}
// //             <Grid item xs={12} sm={6}>
// //               <TextField
// //                 label="Phone Number"
// //                 name="phoneNumber"
// //                 value={formData.phoneNumber}
// //                 onChange={handleInputChange}
// //                 fullWidth
// //                 required
// //                 error={alert.message.includes("phone number")}
// //               />
// //             </Grid>

// //             {/* Established Year */}
// //             <Grid item xs={12} sm={6}>
// //               <TextField
// //                 label="Established Year"
// //                 name="establishedYear"
// //                 value={formData.establishedYear}
// //                 onChange={handleInputChange}
// //                 fullWidth
// //                 required
// //                 type="number"
// //                 inputProps={{
// //                   min: 1947,
// //                   max: new Date().getFullYear(),
// //                 }}
// //                 error={
// //                   formData.establishedYear &&
// //                   (!/^\d+$/.test(formData.establishedYear) ||
// //                     +formData.establishedYear < 1947 ||
// //                     +formData.establishedYear > new Date().getFullYear())
// //                 }
// //                 helperText={
// //                   formData.establishedYear &&
// //                   (!/^\d+$/.test(formData.establishedYear)
// //                     ? "Must be a valid number"
// //                     : +formData.establishedYear < 1947
// //                     ? "Year must be 1947 or later"
// //                     : +formData.establishedYear > new Date().getFullYear()
// //                     ? `Year must not exceed ${new Date().getFullYear()}`
// //                     : "")
// //                 }
// //               />
// //             </Grid>

// //             {/* Board Recognition */}
// //             <Grid item xs={12} sm={6}>
// //               <TextField
// //                 label="Recognized By Board"
// //                 name="recognizedbyboard"
// //                 value={formData.recognizedbyboard}
// //                 onChange={handleInputChange}
// //                 fullWidth
// //               />
// //             </Grid>

// //             <Grid item xs={12} sm={6}>
// //               <TextField
// //                 label="Attestation ID"
// //                 name="boardattestationId"
// //                 value={formData.boardattestationId}
// //                 onChange={handleInputChange}
// //                 fullWidth
// //               />
// //             </Grid>

// //             {/* Facilities */}
// //             <Grid item xs={12}>
// //               <Typography variant="h6" gutterBottom>
// //                 Facilities
// //               </Typography>
// //               <Grid container spacing={1} alignItems="center">
// //                 {["library", "sports", "computerLab", "scienceLab"].map(
// //                   (facility) => (
// //                     <Grid
// //                       item
// //                       key={facility}
// //                       sx={{ display: "flex", alignItems: "center" }}
// //                     >
// //                       <FormControlLabel
// //                         control={
// //                           <Checkbox
// //                             checked={formData[facility]}
// //                             onChange={handleInputChange}
// //                             name={facility}
// //                           />
// //                         }
// //                         label={
// //                           <Typography
// //                             variant="body2"
// //                             sx={{ whiteSpace: "nowrap" }}
// //                           >
// //                             {facility
// //                               .replace(/([A-Z])/g, " $1")
// //                               .replace(/^./, (str) => str.toUpperCase())}
// //                           </Typography>
// //                         }
// //                         sx={{ mr: 1 }}
// //                       />
// //                     </Grid>
// //                   )
// //                 )}
// //               </Grid>
// //             </Grid>

// //             {/* Submit Button */}
// //             <Grid item xs={12}>
// //               <Button
// //                 type="submit"
// //                 variant="contained"
// //                 color="primary"
// //                 fullWidth
// //               >
// //                 Add School
// //               </Button>
// //             </Grid>
// //           </Grid>
// //         </form>
// //       </Paper>

// //       <Snackbar
// //         open={alert.open}
// //         autoHideDuration={6000}
// //         onClose={handleCloseAlert}
// //       >
// //         <Alert onClose={handleCloseAlert} severity={alert.severity}>
// //           {alert.message}
// //         </Alert>
// //       </Snackbar>

// //     </Box>
// //   );
// // };

// // export default SchoolManagement;

// import React, { useState, useEffect } from "react";
// import {
//   TextField,
//   Button,
//   Grid,
//   Paper,
//   Typography,
//   Select,
//   MenuItem,
//   FormControl,
//   InputLabel,
//   Checkbox,
//   ListItemText,
//   Box,
//   Snackbar,
//   Alert,
//   FormControlLabel,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogContentText,
//   DialogActions,
// } from "@mui/material";
// import supabase from "../../../supabase-client";
// import Visibility from "@mui/icons-material/Visibility";
// import VisibilityOff from "@mui/icons-material/VisibilityOff";

// const SchoolManagement = () => {
//   const [formData, setFormData] = useState({
//     ID: "",
//     email: "",
//     password: "WW@123@b",
//     name: "Workers Welfare School",
//     schoolfor: "Girls",
//     schoollevel: "Primary",
//     address: "",
//     phoneNumber: "",
//     establishedYear: new Date().getFullYear(),
//     library: false,
//     sports: false,
//     computerLab: false,
//     scienceLab: false,
//     recognizedbyboard: "",
//     boardattestationId: "",
//   });

//   const [alert, setAlert] = useState({
//     open: false,
//     message: "",
//     severity: "",
//   });
//   const [showPassword, setShowPassword] = useState(false);
//   const [openDialog, setOpenDialog] = useState(false); // State for dialog

//   // Function to generate the next School ID
//   const generateSchoolId = async (schoolFor) => {
//     try {
//       // Get the maximum existing ID for the selected school type
//       const { data, error } = await supabase
//         .from("School")
//         .select("SchoolID")
//         .like("SchoolID", `S-${schoolFor.charAt(0)}%`)
//         .order("SchoolID", { ascending: false })
//         .limit(1);

//       if (error) throw error;

//       let nextNumber = 1;
//       if (data && data.length > 0) {
//         const lastId = data[0].SchoolID;
//         const lastNumber = parseInt(lastId.split("-")[2]) || 0;
//         nextNumber = lastNumber + 1;
//       }

//       return `S-${schoolFor.charAt(0)}-${nextNumber
//         .toString()
//         .padStart(2, "0")}`;
//     } catch (error) {
//       console.error("Error generating School ID:", error);
//       return `S-${schoolFor.charAt(0)}-01`; // Fallback to first ID
//     }
//   };

//   // Update ID when schoolFor changes
//   useEffect(() => {
//     const updateSchoolId = async () => {
//       const newId = await generateSchoolId(formData.schoolfor);
//       setFormData((prev) => ({ ...prev, ID: newId }));
//     };

//     updateSchoolId();
//   }, [formData.schoolfor]);

//   // Handle field change
//   const handleInputChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: type === "checkbox" ? checked : value,
//     }));
//   };

//   // Check if email already exists
//   const checkEmailExists = async (email) => {
//     const { data, error } = await supabase
//       .from("School")
//       .select("Email")
//       .eq("Email", email)
//       .maybeSingle();

//     if (error) {
//       console.error("Error checking email:", error);
//       return false;
//     }
//     return !!data;
//   };

//   // Check if phone number already exists
//   const checkPhoneExists = async (phoneNumber) => {
//     console.log("Checking phone number:", phoneNumber);
//     if (!phoneNumber) return false; // Skip check if empty

//     try {
//       const { data, error } = await supabase
//         .from("School")
//         .select("PhoneNumber")
//         .eq("PhoneNumber", phoneNumber.trim()) // Trim whitespace
//         .maybeSingle();

//       console.log("Checking phone number:", data);

//       if (error) {
//         console.error("Error checking phone number:", error);
//         throw error;
//       }

//       return !!data; // Returns true if phone exists, false otherwise
//     } catch (error) {
//       console.error("Error in phone validation:", error);
//       return false; // Assume not exists if error occurs
//     }
//   };

//   // Handle form submission
//   const handleFormSubmit = async (e) => {
//     e.preventDefault();

//     // First validate all fields before showing dialog
//     const trimmedData = {
//       ...formData,
//       email: formData.email.trim(),
//       phoneNumber: formData.phoneNumber.trim(),
//       recognizedbyboard: formData.recognizedbyboard.trim(),
//       boardattestationId: formData.boardattestationId.trim(),
//     };

//     // Validate required fields
//     if (!trimmedData.email || !formData.password || !trimmedData.phoneNumber) {
//       setAlert({
//         open: true,
//         message: "Email, Password, and Phone Number are required.",
//         severity: "error",
//       });
//       return;
//     }

//     // Validate phone number format
//     if (!/^\d{9,12}$/.test(trimmedData.phoneNumber)) {
//       setAlert({
//         open: true,
//         message:
//           "Please enter a valid phone number (9-12 digits, only numbers allowed)",
//         severity: "error",
//       });
//       return;
//     }

//     // Password validation
//     const passwordRegex =
//       /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d])[A-Za-z\d\S]{8,}$/;
//     if (!passwordRegex.test(formData.password)) {
//       setAlert({
//         open: true,
//         message:
//           "Password must be at least 8 characters long and include uppercase, lowercase, a digit, and a special character.",
//         severity: "error",
//       });
//       return;
//     }

//     // Validate board recognition fields
//     if (
//       (trimmedData.recognizedbyboard && !trimmedData.boardattestationId) ||
//       (!trimmedData.recognizedbyboard && trimmedData.boardattestationId)
//     ) {
//       setAlert({
//         open: true,
//         message:
//           "Both 'Recognized By Board' and 'Attestation ID' are required together!",
//         severity: "error",
//       });
//       return;
//     }

//     // If all validations pass, show the confirmation dialog
//     setOpenDialog(true);
//   };

//   // Handle actual submission after confirmation
//   const handleConfirmedSubmit = async () => {
//     setOpenDialog(false); // Close the dialog

//     const trimmedData = {
//       ...formData,
//       email: formData.email.trim(),
//       phoneNumber: formData.phoneNumber.trim(),
//       recognizedbyboard: formData.recognizedbyboard.trim(),
//       boardattestationId: formData.boardattestationId.trim(),
//     };

//     try {
//       // Check if email exists in DB first
//       const emailExists = await checkEmailExists(trimmedData.email);
//       if (emailExists) {
//         setAlert({
//           open: true,
//           message: "This email already exists in the database.",
//           severity: "error",
//         });
//         return;
//       }

//       // Check phone number
//       const phoneExists = await checkPhoneExists(trimmedData.phoneNumber);
//       if (phoneExists) {
//         setAlert({
//           open: true,
//           message: "This phone number is already registered.",
//           severity: "error",
//         });
//         return;
//       }

//   // STEP 1: Store current admin session BEFORE auth operations
//         const {
//           data: { session: currentAdminSession },
//           error: sessionError,
//         } = await supabase.auth.getSession();
//         if (sessionError || !currentAdminSession) {
//           showAlert("Admin session not found. Please login again.", "error");
//           return;
//         }
//         console.log("Admin session stored successfully");

//         // STEP 2: Create the auth user (this will change the current session)
//         const { data: authData, error: authError } = await supabase.auth.signUp(
//           {
//             email: trimmedData.email,
//             password: formData.password,
//           }
//         );

//         if (authError) {
//           console.error("Auth Error:", authError.message);
//           showAlert("User Already exist aginst email. Try again!", "error");
//           return;
//         }

//         if (!authData?.user) {
//           console.error(
//             "User creation incomplete, email confirmation likely required."
//           );
//           showAlert(
//             "User created! Please confirm the email before proceeding.",
//             "warning"
//           );
//           return;
//         }

//         const user = authData.user;
//         console.log("Auth user created successfully");

//         // STEP 3: IMMEDIATELY restore the admin session
//         const { error: restoreError } = await supabase.auth.setSession({
//           access_token: currentAdminSession.access_token,
//           refresh_token: currentAdminSession.refresh_token,
//         });

//         if (restoreError) {
//           console.error("Failed to restore admin session:", restoreError);
//           showAlert("Session restore failed. Please try again.", "error");
//           return;
//         }
//         console.log("Admin session restored successfully");

//       // Insert school data
//       const { error: dbError } = await supabase.from("School").insert([
//         {
//           SchoolID: formData.ID,
//           Email: trimmedData.email,
//           Password: formData.password,
//           SchoolName: formData.name,
//           SchoolFor: formData.schoolfor,
//           SchoolLevel: formData.schoollevel,
//           Address: formData.address,
//           PhoneNumber: trimmedData.phoneNumber,
//           EstablishedYear: formData.establishedYear
//             ? parseInt(formData.establishedYear)
//             : null,
//           Library: formData.library,
//           SportsGround: formData.sports,
//           ComputerLab: formData.computerLab,
//           ScienceLab: formData.scienceLab,
//           Recognizedbyboard: trimmedData.recognizedbyboard,
//           BoardattestationId: trimmedData.boardattestationId
//             ? parseInt(trimmedData.boardattestationId)
//             : null,
//           Role: "School",
//           user_id: user.id,
//         },
//       ]);

//       if (dbError) {
//         console.error("DB Error:", dbError);
//         // Rollback: delete the auth user if school creation fails
//         await supabase.auth.admin.deleteUser(user.id);

//         setAlert({
//           open: true,
//           message: "Failed to save school data. Please try again.",
//           severity: "error",
//         });
//       } else {
//         setAlert({
//           open: true,
//           message: "School added successfully!",
//           severity: "success",
//         });

//         // Reset form
//         const newId = await generateSchoolId(formData.schoolfor);
//         setFormData({
//           ID: newId,
//           email: "",
//           password: "WW@123@b",
//           name: "Workers Welfare School",
//           schoolfor: formData.schoolfor,
//           schoollevel: "Primary",
//           address: "",
//           phoneNumber: "",
//           establishedYear: new Date().getFullYear(),
//           library: false,
//           sports: false,
//           computerLab: false,
//           scienceLab: false,
//           recognizedbyboard: "",
//           boardattestationId: "",
//         });
//       }
//     } catch (err) {
//       console.error("Submission error:", err);
//       setAlert({
//         open: true,
//         message: "An unexpected error occurred. Please try again.",
//         severity: "error",
//       });
//     }
//   };

//   const handleCloseAlert = () => setAlert({ ...alert, open: false });

//   return (
//     <Box sx={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
//       <Typography variant="h4" align="center" gutterBottom>
//         Add a new School
//       </Typography>

//       <Paper elevation={3} sx={{ padding: "20px" }}>
//         <form onSubmit={handleFormSubmit}>
//           <Grid container spacing={2}>
//             {/* School ID - Read only */}
//             <Grid item xs={12} sm={6}>
//               <TextField
//                 label="School ID"
//                 name="ID"
//                 value={formData.ID}
//                 onChange={handleInputChange}
//                 fullWidth
//                 required
//                 InputProps={{
//                   readOnly: true,
//                 }}
//                 variant="filled"
//               />
//             </Grid>

//             {/* School Email */}
//             <Grid item xs={12} sm={6}>
//               <TextField
//                 label="School Email"
//                 name="email"
//                 value={formData.email}
//                 onChange={handleInputChange}
//                 fullWidth
//                 required
//                 type="email"
//                 error={alert.message.includes("email")}
//               />
//             </Grid>

//             {/* Password */}
//             <Grid item xs={12} sm={6}>
//               <TextField
//                 label="Password"
//                 name="password"
//                 type={showPassword ? "text" : "password"}
//                 value={formData.password}
//                 onChange={handleInputChange}
//                 fullWidth
//                 required
//                 error={alert.message.toLowerCase().includes("password")}
//                 InputProps={{
//                   endAdornment: (
//                     <Button
//                       onClick={() => setShowPassword(!showPassword)}
//                       size="small"
//                     >
//                       {showPassword ? <Visibility /> : <VisibilityOff />}
//                     </Button>
//                   ),
//                 }}
//               />
//             </Grid>

//             {/* School Name */}
//             <Grid item xs={12} sm={6}>
//               <TextField
//                 label="School Name"
//                 name="name"
//                 value={formData.name}
//                 onChange={handleInputChange}
//                 fullWidth
//                 required
//               />
//             </Grid>

//             {/* School For */}
//             <Grid item xs={12} sm={6}>
//               <FormControl fullWidth>
//                 <InputLabel>School For</InputLabel>
//                 <Select
//                   label="School For"
//                   name="schoolfor"
//                   value={formData.schoolfor}
//                   onChange={handleInputChange}
//                 >
//                   <MenuItem value="Girls">Girls</MenuItem>
//                   <MenuItem value="Boys">Boys</MenuItem>
//                 </Select>
//               </FormControl>
//             </Grid>

//             {/* School Level */}
//             <Grid item xs={12} sm={6}>
//               <FormControl fullWidth>
//                 <InputLabel>School Level</InputLabel>
//                 <Select
//                   label="School Level"
//                   name="schoollevel"
//                   value={formData.schoollevel}
//                   onChange={handleInputChange}
//                 >
//                   <MenuItem value="Primary">Primary</MenuItem>
//                   <MenuItem value="Middle">Secondary</MenuItem>
//                   <MenuItem value="High">High</MenuItem>
//                 </Select>
//               </FormControl>
//             </Grid>

//             {/* Address */}
//             <Grid item xs={12}>
//               <TextField
//                 label="School Address"
//                 name="address"
//                 value={formData.address}
//                 onChange={handleInputChange}
//                 fullWidth
//                 required
//               />
//             </Grid>

//             {/* Phone Number */}
//             <Grid item xs={12} sm={6}>
//               <TextField
//                 label="Phone Number"
//                 name="phoneNumber"
//                 value={formData.phoneNumber}
//                 onChange={handleInputChange}
//                 fullWidth
//                 required
//                 error={alert.message.includes("phone number")}
//               />
//             </Grid>

//             {/* Established Year */}
//             <Grid item xs={12} sm={6}>
//               <TextField
//                 label="Established Year"
//                 name="establishedYear"
//                 value={formData.establishedYear}
//                 onChange={handleInputChange}
//                 fullWidth
//                 required
//                 type="number"
//                 inputProps={{
//                   min: 1947,
//                   max: new Date().getFullYear(),
//                 }}
//                 error={
//                   formData.establishedYear &&
//                   (!/^\d+$/.test(formData.establishedYear) ||
//                     +formData.establishedYear < 1947 ||
//                     +formData.establishedYear > new Date().getFullYear())
//                 }
//                 helperText={
//                   formData.establishedYear &&
//                   (!/^\d+$/.test(formData.establishedYear)
//                     ? "Must be a valid number"
//                     : +formData.establishedYear < 1947
//                     ? "Year must be 1947 or later"
//                     : +formData.establishedYear > new Date().getFullYear()
//                     ? `Year must not exceed ${new Date().getFullYear()}`
//                     : "")
//                 }
//               />
//             </Grid>

//             {/* Board Recognition */}
//             <Grid item xs={12} sm={6}>
//               <TextField
//                 label="Recognized By Board"
//                 name="recognizedbyboard"
//                 value={formData.recognizedbyboard}
//                 onChange={handleInputChange}
//                 fullWidth
//               />
//             </Grid>

//             <Grid item xs={12} sm={6}>
//               <TextField
//                 label="Attestation ID"
//                 name="boardattestationId"
//                 value={formData.boardattestationId}
//                 onChange={handleInputChange}
//                 fullWidth
//               />
//             </Grid>

//             {/* Facilities */}
//             <Grid item xs={12}>
//               <Typography variant="h6" gutterBottom>
//                 Facilities
//               </Typography>
//               <Grid container spacing={1} alignItems="center">
//                 {["library", "sports", "computerLab", "scienceLab"].map(
//                   (facility) => (
//                     <Grid
//                       item
//                       key={facility}
//                       sx={{ display: "flex", alignItems: "center" }}
//                     >
//                       <FormControlLabel
//                         control={
//                           <Checkbox
//                             checked={formData[facility]}
//                             onChange={handleInputChange}
//                             name={facility}
//                           />
//                         }
//                         label={
//                           <Typography
//                             variant="body2"
//                             sx={{ whiteSpace: "nowrap" }}
//                           >
//                             {facility
//                               .replace(/([A-Z])/g, " $1")
//                               .replace(/^./, (str) => str.toUpperCase())}
//                           </Typography>
//                         }
//                         sx={{ mr: 1 }}
//                       />
//                     </Grid>
//                   )
//                 )}
//               </Grid>
//             </Grid>

//             {/* Submit Button */}
//             <Grid item xs={12}>
//               <Button
//                 type="submit"
//                 variant="contained"
//                 color="primary"
//                 fullWidth
//               >
//                 Add School
//               </Button>
//             </Grid>
//           </Grid>
//         </form>
//       </Paper>

//       <Snackbar
//         open={alert.open}
//         autoHideDuration={6000}
//         onClose={handleCloseAlert}
//       >
//         <Alert onClose={handleCloseAlert} severity={alert.severity}>
//           {alert.message}
//         </Alert>
//       </Snackbar>

//       {/* Confirmation Dialog */}
//       <Dialog
//         open={openDialog}
//         onClose={() => setOpenDialog(false)}
//         aria-labelledby="alert-dialog-title"
//         aria-describedby="alert-dialog-description"
//       >
//         <DialogTitle id="alert-dialog-title">
//           {"Confirm Submission"}
//         </DialogTitle>
//         <DialogContent>
//           <DialogContentText id="alert-dialog-description">
//             Are you sure you want to add this school?
//           </DialogContentText>
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={() => setOpenDialog(false)} color="primary">
//             Cancel
//           </Button>
//           <Button onClick={handleConfirmedSubmit} color="primary" autoFocus>
//             Confirm
//           </Button>
//         </DialogActions>
//       </Dialog>
//     </Box>
//   );
// };

// export default SchoolManagement;
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
  Checkbox,
  ListItemText,
  Box,
  Snackbar,
  Alert,
  FormControlLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  CircularProgress,
} from "@mui/material";
import supabase from "../../../supabase-client";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

const SchoolManagement = () => {
  const [formData, setFormData] = useState({
    ID: "",
    email: "",
    password: "WW@123@b",
    name: "Workers Welfare School",
    schoolfor: "Girls",
    schoollevel: "Primary",
    address: "",
    phoneNumber: "",
    establishedYear: new Date().getFullYear(),
    library: false,
    sports: false,
    computerLab: false,
    scienceLab: false,
    recognizedbyboard: "",
    boardattestationId: "",
  });

  const [alert, setAlert] = useState({
    open: false,
    message: "",
    severity: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [loading, setLoading] = useState(false); // Loading state

  // Function to generate the next School ID
  const generateSchoolId = async (schoolFor) => {
    try {
      // Get the maximum existing ID for the selected school type
      const { data, error } = await supabase
        .from("School")
        .select("SchoolID")
        .like("SchoolID", `S-${schoolFor.charAt(0)}%`)
        .order("SchoolID", { ascending: false })
        .limit(1);

      if (error) throw error;

      let nextNumber = 1;
      if (data && data.length > 0) {
        const lastId = data[0].SchoolID;
        const lastNumber = parseInt(lastId.split("-")[2]) || 0;
        nextNumber = lastNumber + 1;
      }

      return `S-${schoolFor.charAt(0)}-${nextNumber
        .toString()
        .padStart(2, "0")}`;
    } catch (error) {
      console.error("Error generating School ID:", error);
      return `S-${schoolFor.charAt(0)}-01`; // Fallback to first ID
    }
  };

  // Update ID when schoolFor changes
  useEffect(() => {
    const updateSchoolId = async () => {
      const newId = await generateSchoolId(formData.schoolfor);
      setFormData((prev) => ({ ...prev, ID: newId }));
    };

    updateSchoolId();
  }, [formData.schoolfor]);

  // Handle field change
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Check if email already exists
  const checkEmailExists = async (email) => {
    const { data, error } = await supabase
      .from("School")
      .select("Email")
      .eq("Email", email)
      .maybeSingle();

    if (error) {
      console.error("Error checking email:", error);
      return false;
    }
    return !!data;
  };

  // Check if phone number already exists
  const checkPhoneExists = async (phoneNumber) => {
    console.log("Checking phone number:", phoneNumber);
    if (!phoneNumber) return false; // Skip check if empty

    try {
      const { data, error } = await supabase
        .from("School")
        .select("PhoneNumber")
        .eq("PhoneNumber", phoneNumber.trim()) // Trim whitespace
        .maybeSingle();

      console.log("Checking phone number:", data);

      if (error) {
        console.error("Error checking phone number:", error);
        throw error;
      }

      return !!data; // Returns true if phone exists, false otherwise
    } catch (error) {
      console.error("Error in phone validation:", error);
      return false; // Assume not exists if error occurs
    }
  };

  // Handle form submission
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Start loading

    // First validate all fields before showing dialog
    const trimmedData = {
      ...formData,
      email: formData.email.trim(),
      phoneNumber: formData.phoneNumber.trim(),
      recognizedbyboard: formData.recognizedbyboard.trim(),
      boardattestationId: formData.boardattestationId.trim(),
    };

    // Validate required fields
    if (!trimmedData.email || !formData.password || !trimmedData.phoneNumber) {
      setAlert({
        open: true,
        message: "Email, Password, and Phone Number are required.",
        severity: "error",
      });
      setLoading(false);
      return;
    }

    // Validate phone number format
    if (!/^\d{9,12}$/.test(trimmedData.phoneNumber)) {
      setAlert({
        open: true,
        message:
          "Please enter a valid phone number (9-12 digits, only numbers allowed)",
        severity: "error",
      });
      setLoading(false);
      return;
    }

    // Password validation
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d])[A-Za-z\d\S]{8,}$/;
    if (!passwordRegex.test(formData.password)) {
      setAlert({
        open: true,
        message:
          "Password must be at least 8 characters long and include uppercase, lowercase, a digit, and a special character.",
        severity: "error",
      });
      setLoading(false);
      return;
    }

    // Validate board recognition fields
    if (
      (trimmedData.recognizedbyboard && !trimmedData.boardattestationId) ||
      (!trimmedData.recognizedbyboard && trimmedData.boardattestationId)
    ) {
      setAlert({
        open: true,
        message:
          "Both 'Recognized By Board' and 'Attestation ID' are required together!",
        severity: "error",
      });
      setLoading(false);
      return;
    }

    // If all validations pass, show the confirmation dialog
    setOpenDialog(true);
    setLoading(false);
  };

  // Handle actual submission after confirmation
  const handleConfirmedSubmit = async () => {
    setOpenDialog(false); // Close the dialog
    setLoading(true); // Start loading

    const trimmedData = {
      ...formData,
      email: formData.email.trim(),
      phoneNumber: formData.phoneNumber.trim(),
      recognizedbyboard: formData.recognizedbyboard.trim(),
      boardattestationId: formData.boardattestationId.trim(),
    };

    try {
      // Check if email exists in DB first
      const emailExists = await checkEmailExists(trimmedData.email);
      if (emailExists) {
        setAlert({
          open: true,
          message: "This email already exists in the database.",
          severity: "error",
        });
        setLoading(false);
        return;
      }

      // Check phone number
      const phoneExists = await checkPhoneExists(trimmedData.phoneNumber);
      if (phoneExists) {
        setAlert({
          open: true,
          message: "This phone number is already registered.",
          severity: "error",
        });
        setLoading(false);
        return;
      }

      // STEP 1: Store current admin session BEFORE auth operations
      const {
        data: { session: currentAdminSession },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (sessionError || !currentAdminSession) {
        setAlert({
          open: true,
          message: "Admin session not found. Please login again.",
          severity: "error",
        });
        setLoading(false);
        return;
      }
      console.log("Admin session stored successfully");

      // STEP 2: Create the auth user (this will change the current session)
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: trimmedData.email,
        password: formData.password,
        options: {
          data: {
            role: "School",
            school_name: formData.name,
          },
        },
      });

      if (authError) {
        console.error("Auth Error:", authError.message);
        setAlert({
          open: true,
          message: "User already exists against this email. Try again!",
          severity: "error",
        });
        setLoading(false);
        return;
      }

      if (!authData?.user) {
        console.error(
          "User creation incomplete, email confirmation likely required."
        );
        setAlert({
          open: true,
          message: "User created! Please confirm the email before proceeding.",
          severity: "warning",
        });
        setLoading(false);
        return;
      }

      const user = authData.user;
      console.log("Auth user created successfully");

      // STEP 3: IMMEDIATELY restore the admin session
      const { error: restoreError } = await supabase.auth.setSession({
        access_token: currentAdminSession.access_token,
        refresh_token: currentAdminSession.refresh_token,
      });

      if (restoreError) {
        console.error("Failed to restore admin session:", restoreError);
        setAlert({
          open: true,
          message: "Session restore failed. Please try again.",
          severity: "error",
        });
        setLoading(false);
        return;
      }
      console.log("Admin session restored successfully");

      // Insert school data
      const { error: dbError } = await supabase.from("School").insert([
        {
          SchoolID: formData.ID,
          Email: trimmedData.email,
          Password: formData.password,
          SchoolName: formData.name,
          SchoolFor: formData.schoolfor,
          SchoolLevel: formData.schoollevel,
          Address: formData.address,
          PhoneNumber: trimmedData.phoneNumber,
          EstablishedYear: formData.establishedYear
            ? parseInt(formData.establishedYear)
            : null,
          Library: formData.library,
          SportsGround: formData.sports,
          ComputerLab: formData.computerLab,
          ScienceLab: formData.scienceLab,
          Recognizedbyboard: trimmedData.recognizedbyboard,
          BoardattestationId: trimmedData.boardattestationId
            ? parseInt(trimmedData.boardattestationId)
            : null,
          Role: "School",
          user_id: user.id,
        },
      ]);

      if (dbError) {
        console.error("DB Error:", dbError);
        // Rollback: delete the auth user if school creation fails
        await supabase.auth.admin.deleteUser(user.id);

        setAlert({
          open: true,
          message: "Failed to save school data. Please try again.",
          severity: "error",
        });
      } else {
        setAlert({
          open: true,
          message: "School added successfully!",
          severity: "success",
        });

        // Reset form
        const newId = await generateSchoolId(formData.schoolfor);
        setFormData({
          ID: newId,
          email: "",
          password: "WW@123@b",
          name: "Workers Welfare School",
          schoolfor: formData.schoolfor,
          schoollevel: "Primary",
          address: "",
          phoneNumber: "",
          establishedYear: new Date().getFullYear(),
          library: false,
          sports: false,
          computerLab: false,
          scienceLab: false,
          recognizedbyboard: "",
          boardattestationId: "",
        });
      }
    } catch (err) {
      console.error("Submission error:", err);
      setAlert({
        open: true,
        message: "An unexpected error occurred. Please try again.",
        severity: "error",
      });
    } finally {
      setLoading(false); // Stop loading in any case
    }
  };

  const handleCloseAlert = () => setAlert({ ...alert, open: false });

  return (
    <Box sx={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
      <Typography variant="h4" align="center" gutterBottom>
        Add a new School
      </Typography>

      <Paper elevation={3} sx={{ padding: "20px" }}>
        <form onSubmit={handleFormSubmit}>
          <Grid container spacing={2}>
            {/* School ID - Read only */}
            <Grid item xs={12} sm={6}>
              <TextField
                label="School ID"
                name="ID"
                value={formData.ID}
                onChange={handleInputChange}
                fullWidth
                required
                InputProps={{
                  readOnly: true,
                }}
                variant="filled"
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
                type="email"
                error={alert.message.includes("email")}
              />
            </Grid>

            {/* Password */}
            <Grid item xs={12} sm={6}>
              <TextField
                label="Password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={handleInputChange}
                fullWidth
                required
                error={alert.message.toLowerCase().includes("password")}
                InputProps={{
                  endAdornment: (
                    <Button
                      onClick={() => setShowPassword(!showPassword)}
                      size="small"
                    >
                      {showPassword ? <Visibility /> : <VisibilityOff />}
                    </Button>
                  ),
                }}
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
                  <MenuItem value="Middle">Secondary</MenuItem>
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
                error={alert.message.includes("phone number")}
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
                type="number"
                inputProps={{
                  min: 1947,
                  max: new Date().getFullYear(),
                }}
                error={
                  formData.establishedYear &&
                  (!/^\d+$/.test(formData.establishedYear) ||
                    +formData.establishedYear < 1947 ||
                    +formData.establishedYear > new Date().getFullYear())
                }
                helperText={
                  formData.establishedYear &&
                  (!/^\d+$/.test(formData.establishedYear)
                    ? "Must be a valid number"
                    : +formData.establishedYear < 1947
                    ? "Year must be 1947 or later"
                    : +formData.establishedYear > new Date().getFullYear()
                    ? `Year must not exceed ${new Date().getFullYear()}`
                    : "")
                }
              />
            </Grid>

            {/* Board Recognition */}
            <Grid item xs={12} sm={6}>
              <TextField
                label="Recognized By Board"
                name="recognizedbyboard"
                value={formData.recognizedbyboard}
                onChange={handleInputChange}
                fullWidth
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                label="Attestation ID"
                name="boardattestationId"
                value={formData.boardattestationId}
                onChange={handleInputChange}
                fullWidth
              />
            </Grid>

            {/* Facilities */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Facilities
              </Typography>
              <Grid container spacing={1} alignItems="center">
                {["library", "sports", "computerLab", "scienceLab"].map(
                  (facility) => (
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
                  )
                )}
              </Grid>
            </Grid>

            {/* Submit Button */}
            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} /> : "Add School"}
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

      {/* Confirmation Dialog */}
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Confirm Submission"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to add this school?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setOpenDialog(false)}
            color="primary"
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirmedSubmit}
            color="primary"
            autoFocus
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : "Confirm"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SchoolManagement;
