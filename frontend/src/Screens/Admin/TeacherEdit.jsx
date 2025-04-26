// // // import React, { useState, useEffect } from "react";
// // // import {
// // //   TextField,
// // //   Button,
// // //   Grid,
// // //   Paper,
// // //   Typography,
// // //   Select,
// // //   MenuItem,
// // //   FormControl,
// // //   InputLabel,
// // //   Snackbar,
// // //   Alert,
// // //   Box,
// // //   CircularProgress,
// // //   FormControlLabel,
// // // } from "@mui/material";
// // // import supabase from "../../../supabase-client";

// // // const EditTeacher = () => {
// // //   const [cnicList, setCnicList] = useState([]); // To store all CNICs fetched from the backend
// // //   const [selectedCnic, setSelectedCnic] = useState(""); // Store selected CNIC

// // //   const [formData, setFormData] = useState({
// // //     TeacherID: "",
// // //     CNIC: "",
// // //     Name: "",
// // //     Email: "",
// // //     PhoneNumber: "",
// // //     Gender: "",
// // //     DateOfBirth: "",
// // //     Disability: "No",
// // //     DisabilityDetails: "",
// // //     Qualification: "",
// // //     ExperienceYear: 0,
// // //     HireDate: "",
// // //     SchoolID: "",
// // //     EmployeeType: "",
// // //     EmployementStatus: "",
// // //     EmployementType: "",
// // //     Address: "",
// // //   });

// // //   const [alert, setAlert] = useState({
// // //     open: false,
// // //     message: "",
// // //     severity: "",
// // //   });
// // //   const [loading, setLoading] = useState(false);

// // //   // Fetch CNIC list from the backend
// // //   useEffect(() => {
// // //     fetchCnicList();
// // //   }, []);
// // //   const fetchCnicList = async () => {
// // //     try {
// // //       const { data, error } = await supabase
// // //         .from("Teacher")
// // //         .select("CNIC")
// // //         .order("TeacherID", { ascending: true });

// // //       if (error) throw error;
// // //       setCnicList(data);
// // //       console.log(data);
// // //     } catch (error) {
// // //       console.error("Error fetching CNIC list:", error);
// // //       setAlert({
// // //         open: true,
// // //         message: "Failed to fetch CNIC list",
// // //         severity: "error",
// // //       });
// // //     }
// // //   };

// // //   // Fetch teacher details when a CNIC is selected
// // //   useEffect(() => {
// // //     if (selectedCnic) {
// // //       console.log("i am here to you");

// // //       fetchTeacherData();
// // //     }
// // //   }, [selectedCnic]);

// // //   const fetchTeacherData = async () => {
// // //     try {
// // //       const { data, error } = await supabase
// // //         .from("Teacher")
// // //         .select("*")
// // //         .eq("CNIC", selectedCnic)
// // //         .single();

// // //       if (error) throw error;

// // //       // Map Supabase data to form fields with proper null handling
// // //       const processedData = {
// // //         TeacherID: data.TeacherID || "",
// // //         CNIC: data.CNIC || "",
// // //         Name: data.Name || "",
// // //         Email: data.Email || "",
// // //         PhoneNumber: data.PhoneNumber || "",
// // //         Gender: data.Gender || "",
// // //         DateOfBirth: data.DateOfBirth ? data.DateOfBirth.split("T")[0] : "",
// // //         Disability: data.Disability || "No",
// // //         DisabilityDetails: data.DisabilityDetails || "",
// // //         Qualification: data.Qualification || "",
// // //         ExperienceYear: data.ExperienceYear || 0,
// // //         HireDate: data.HireDate ? data.HireDate.split("T")[0] : "",
// // //         SchoolID: data.SchoolID || "",
// // //         EmployeeType: data.EmployeeType || "",
// // //         EmployementStatus: data.EmployementStatus || "", // Match Supabase spelling
// // //         EmployementType: data.EmployementType || "", // Match Supabase spelling
// // //         Address: data.Address || "",
// // //       };

// // //       setFormData(processedData);
// // //     } catch (error) {
// // //       console.error("Error fetching Details:", error);
// // //       setAlert({
// // //         open: true,
// // //         message: "Failed to fetch details",
// // //         severity: "error",
// // //       });
// // //     }
// // //   };

// // //   // const handleInputChange = (e) => {
// // //   //   const { name, value, type, checked } = e.target;
// // //   //   setFormData((prev) => ({
// // //   //     ...prev,
// // //   //     [name]: type === "checkbox" ? checked : value,
// // //   //   }));
// // //   // };

// // //   const handleInputChange = (e) => {
// // //     const { name, value, type, checked } = e.target;
// // //     const inputValue = type === "checkbox"
// // //       ? checked
// // //       : type === "number"
// // //         ? Number(value) || 0  // Handle empty number inputs
// // //         : value;

// // //     setFormData((prev) => ({
// // //       ...prev,
// // //       [name]: inputValue,
// // //     }));
// // //   };

// // //   const handleSubmit = async (e) => {
// // //     e.preventDefault();
// // //     setLoading(true);

// // //     try {
// // //       const { error } = await supabase
// // //         .from("Teacher")
// // //         .update({
// // //           CNIC: formData.CNIC,
// // //           Name: formData.Name,
// // //           Email: formData.Email,
// // //           PhoneNumber: formData.PhoneNumber,
// // //           Gender: formData.Gender,
// // //           DateOfBirth: formData.DateOfBirth,
// // //           Disability: formData.Disability,
// // //           DisabilityDetails: formData.DisabilityDetails,
// // //           Qualification: formData.Qualification,
// // //           ExperienceYear: formData.ExperienceYear,
// // //           HireDate: formData.HireDate,
// // //           SchoolID: formData.SchoolID,
// // //           EmployeeType: formData.EmployeeType,
// // //           EmployementStatus: formData.EmployementStatus, // Match Supabase spelling
// // //           EmployementType: formData.EmployementType, // Match Supabase spelling
// // //           Address: formData.Address,
// // //         })
// // //         .eq("TeacherID", formData.TeacherID);

// // //       if (error) throw error;

// // //       setAlert({
// // //         open: true,
// // //         message: "Teacher updated successfully!",
// // //         severity: "success",
// // //       });
// // //     } catch (error) {
// // //       console.error("Error updating Teacher:", error.message);
// // //       setAlert({
// // //         open: true,
// // //         message: "Failed to update Teacher. Try again!",
// // //         severity: "error",
// // //       });
// // //     } finally {
// // //       setLoading(false);
// // //     }
// // //   };

// // //   const handleCloseAlert = () => setAlert({ ...alert, open: false });

// // //   return (
// // //     <Box
// // //       sx={{
// // //         padding: "20px",
// // //         maxWidth: "800px",
// // //         margin: "0 auto",
// // //         backgroundColor: "#f9f9f9",
// // //         borderRadius: "8px",
// // //         boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
// // //       }}
// // //     >
// // //       <Typography variant="h4" align="center" gutterBottom>
// // //         Edit Teacher Details
// // //       </Typography>

// // //       <Paper
// // //         sx={{
// // //           padding: "20px",
// // //           borderRadius: "8px",
// // //           backgroundColor: "#fff",
// // //         }}
// // //         elevation={3}
// // //       >
// // //         {/* CNIC Dropdown always visible with margin bottom */}
// // //         <Grid container spacing={2}>
// // //           <Grid item xs={12}>
// // //             <FormControl fullWidth sx={{ marginBottom: "20px" }}>
// // //               <InputLabel>Select CNIC</InputLabel>
// // //               <Select
// // //                 value={selectedCnic}
// // //                 onChange={(e) => setSelectedCnic(e.target.value)}
// // //                 label="Select  CNIC"
// // //               >
// // //                 {cnicList.map((teacher) => (
// // //                   <MenuItem key={teacher.CNIC} value={teacher.CNIC}>
// // //                     {teacher.CNIC}
// // //                   </MenuItem>
// // //                 ))}
// // //               </Select>
// // //             </FormControl>
// // //           </Grid>
// // //         </Grid>

// // //         {/* Form for editing teacher details */}
// // //         {selectedCnic && (
// // //           <form onSubmit={handleSubmit}>
// // //             <Grid container spacing={2}>
// // //               {/* Personal Information Section */}
// // //               <Grid item xs={12}>
// // //                 <Typography variant="h6" gutterBottom>
// // //                   Personal Information
// // //                 </Typography>
// // //               </Grid>
// // //               <Grid item xs={12} sm={6}>
// // //                 <TextField
// // //                   label="CNIC"
// // //                   fullWidth
// // //                   name="CNIC"
// // //                   value={formData.CNIC}
// // //                   onChange={handleInputChange}
// // //                   required
// // //                 />
// // //               </Grid>
// // //               <Grid item xs={12} sm={6}>
// // //                 <TextField
// // //                   label="Name"
// // //                   fullWidth
// // //                   name="Name"
// // //                   value={formData.Name}
// // //                   onChange={handleInputChange}
// // //                   required
// // //                 />
// // //               </Grid>
// // //               <Grid item xs={12} sm={6}>
// // //                 <TextField
// // //                   label="Email"
// // //                   fullWidth
// // //                   name="Email"
// // //                   value={formData.Email}
// // //                   onChange={handleInputChange}
// // //                   required
// // //                 />
// // //               </Grid>

// // //               <Grid item xs={12} sm={6}>
// // //                 <TextField
// // //                   label="Phone Number"
// // //                   fullWidth
// // //                   name="PhoneNumber"
// // //                   value={formData.PhoneNumber}
// // //                   onChange={handleInputChange}
// // //                   required
// // //                 />
// // //               </Grid>
// // //               <Grid item xs={12} sm={6}>
// // //                 <FormControl fullWidth required>
// // //                   <InputLabel>Gender</InputLabel>
// // //                   <Select
// // //                     label="Gender"
// // //                     name="Gender"
// // //                     value={formData.Gender || ""}
// // //                     onChange={handleInputChange}
// // //                   >
// // //                     <MenuItem value="Male">Male</MenuItem>
// // //                     <MenuItem value="Female">Female</MenuItem>
// // //                   </Select>
// // //                 </FormControl>
// // //               </Grid>
// // //               <Grid item xs={12} sm={6}>
// // //                 <TextField
// // //                   label="Date of Birth"
// // //                   type="date"
// // //                   fullWidth
// // //                   InputLabelProps={{ shrink: true }}
// // //                   name="DateOfBirth"
// // //                   value={formData.DateOfBirth}
// // //                   onChange={handleInputChange}
// // //                   required
// // //                 />
// // //               </Grid>
// // //               <Grid item xs={12} sm={6}>
// // //                 <FormControl fullWidth required>
// // //                   <InputLabel>Disability</InputLabel>
// // //                   <Select
// // //                     label="Disability"
// // //                     name="Disability"
// // //                     value={formData.Disability || ""}
// // //                     onChange={handleInputChange}
// // //                   >
// // //                     <MenuItem value="Yes">Yes</MenuItem>
// // //                     <MenuItem value="No">No</MenuItem>
// // //                   </Select>
// // //                 </FormControl>
// // //               </Grid>
// // //               {formData.Disability === "Yes" && (
// // //                 <Grid item xs={12} sm={6}>
// // //                   <TextField
// // //                     label="Disability Details"
// // //                     fullWidth
// // //                     name="DisabilityDetails"
// // //                     value={formData.DisabilityDetails}
// // //                     onChange={handleInputChange}
// // //                     required
// // //                   />
// // //                 </Grid>
// // //               )}

// // //               {/* Educational Details Section */}
// // //               <Grid item xs={12}>
// // //                 <Typography variant="h6" gutterBottom>
// // //                   Educational Details
// // //                 </Typography>
// // //               </Grid>
// // //               <Grid item xs={12} sm={6}>
// // //                 <TextField
// // //                   label="Qualification"
// // //                   fullWidth
// // //                   name="Qualification"
// // //                   value={formData.Qualification}
// // //                   onChange={handleInputChange}
// // //                   required
// // //                 />
// // //               </Grid>
// // //               <Grid item xs={12} sm={6}>
// // //                 <TextField
// // //                   label="Experience (Years)"
// // //                   type="number"
// // //                   fullWidth
// // //                   name="ExperienceYear"
// // //                   value={formData.ExperienceYear}
// // //                   onChange={handleInputChange}
// // //                   required
// // //                   inputProps={{ min: 0 }}
// // //                 />
// // //               </Grid>

// // //               {/* School Information Section */}
// // //               <Grid item xs={12}>
// // //                 <Typography variant="h6" gutterBottom>
// // //                   School Information
// // //                 </Typography>
// // //               </Grid>
// // //               <Grid item xs={12} sm={6}>
// // //                 <TextField
// // //                   label="School ID"
// // //                   fullWidth
// // //                   name="SchoolID"
// // //                   value={formData.SchoolID}
// // //                   onChange={handleInputChange}
// // //                   required
// // //                 />
// // //               </Grid>

// // //               <Grid item xs={12} sm={6}>
// // //                 <TextField
// // //                   label="Hire Date"
// // //                   type="date"
// // //                   fullWidth
// // //                   InputLabelProps={{ shrink: true }}
// // //                   name="HireDate"
// // //                   value={formData.HireDate}
// // //                   onChange={handleInputChange}
// // //                   required
// // //                 />
// // //               </Grid>
// // //               <Grid item xs={12} sm={6}>
// // //                 <FormControl fullWidth required>
// // //                   <InputLabel>Employee Type</InputLabel>
// // //                   <Select
// // //                     label="Employee Type"
// // //                     name="EmployeeType"
// // //                     value={formData.EmployeeType || ""}
// // //                     onChange={handleInputChange}
// // //                   >
// // //                     <MenuItem value="Principal">Principal</MenuItem>
// // //                     <MenuItem value="Head-Teacher">Head-Teacher</MenuItem>
// // //                     <MenuItem value="Teacher">Teacher</MenuItem>
// // //                   </Select>
// // //                 </FormControl>
// // //               </Grid>
// // //               <Grid item xs={12} sm={6}>
// // //                 <FormControl fullWidth required>
// // //                   <InputLabel>Employment Status</InputLabel>
// // //                   <Select
// // //                     label="Employment Status"
// // //                     name="EmployementStatus"
// // //                     value={formData.EmployementStatus || ""}
// // //                     onChange={handleInputChange}
// // //                   >
// // //                     <MenuItem value="Working">Working</MenuItem>
// // //                     <MenuItem value="Retired">Retired</MenuItem>
// // //                     <MenuItem value="Removed">Removed</MenuItem>
// // //                   </Select>
// // //                 </FormControl>
// // //               </Grid>
// // //               <Grid item xs={12} sm={6}>
// // //                 <FormControl fullWidth required>
// // //                   <InputLabel>Employment Type</InputLabel>
// // //                   <Select
// // //                     label="Employment Type"
// // //                     name="EmployementType"
// // //                     value={formData.EmployementType || ""}
// // //                     onChange={handleInputChange}
// // //                   >
// // //                     <MenuItem value="Permanent">Permanent</MenuItem>
// // //                     <MenuItem value="Contract">Contract</MenuItem>
// // //                     <MenuItem value="Part-Time">Part-Time</MenuItem>
// // //                   </Select>
// // //                 </FormControl>
// // //               </Grid>

// // //               {/* Address Section */}
// // //               <Grid item xs={12}>
// // //                 <Typography variant="h6" gutterBottom>
// // //                   Address
// // //                 </Typography>
// // //               </Grid>
// // //               <Grid item xs={12}>
// // //                 <TextField
// // //                   label="Address"
// // //                   fullWidth
// // //                   name="Address"
// // //                   value={formData.Address}
// // //                   onChange={handleInputChange}
// // //                 />
// // //               </Grid>

// // //               {/* Submit Button */}
// // //               <Grid item xs={12}>
// // //                 <Button
// // //                   type="submit"
// // //                   variant="contained"
// // //                   color="primary"
// // //                   fullWidth
// // //                 >
// // //                   Update Teacher
// // //                 </Button>
// // //               </Grid>
// // //             </Grid>
// // //           </form>
// // //         )}
// // //       </Paper>

// // //       <Snackbar
// // //         open={alert.open}
// // //         autoHideDuration={4000}
// // //         onClose={handleCloseAlert}
// // //       >
// // //         <Alert
// // //           onClose={handleCloseAlert}
// // //           severity={alert.severity}
// // //           sx={{ width: "100%" }}
// // //         >
// // //           {alert.message}
// // //         </Alert>
// // //       </Snackbar>
// // //     </Box>
// // //   );
// // // };

// // // export default EditTeacher;

// // import React, { useState, useEffect } from "react";
// // import { useFormik } from "formik";
// // import * as Yup from "yup";
// // import {
// //   TextField,
// //   Button,
// //   Grid,
// //   Paper,
// //   Typography,
// //   Select,
// //   MenuItem,
// //   FormControl,
// //   InputLabel,
// //   Snackbar,
// //   Alert,
// //   Box,
// //   CircularProgress,
// // } from "@mui/material";
// // import supabase from "../../../supabase-client";

// // const EditTeacher = () => {
// //   const [cnicList, setCnicList] = useState([]);
// //   const [selectedCnic, setSelectedCnic] = useState("");
// //   const [loading, setLoading] = useState(false);
// //   const [alert, setAlert] = useState({
// //     open: false,
// //     message: "",
// //     severity: "",
// //   });

// //   // Validation Schema (same as Add Teacher)
// //   const validationSchema = Yup.object().shape({
// //     CNIC: Yup.string()
// //       .matches(/^\d{13}$/, "CNIC must be 13 digits and contain only numbers")
// //       .required("CNIC is required"),
// //     Name: Yup.string()
// //       .matches(/^[A-Za-z\s]+$/, "Only alphabets and spaces are allowed")
// //       .required("Name is required"),
// //     Email: Yup.string()
// //       .email("Invalid email")
// //       .required("Email is required"),
// //     PhoneNumber: Yup.string()
// //       .matches(
// //         /^\d{9,12}$/,
// //         "Phone number must be between 9 and 12 digits and only contain numbers"
// //       )
// //       .required("Phone number is required"),
// //     Gender: Yup.string().required("Gender is required"),
// //     DateOfBirth: Yup.string().required("Date of birth is required"),
// //     Disability: Yup.string().required("Disability status is required"),
// //     DisabilityDetails: Yup.string().when("Disability", {
// //       is: "Yes",
// //       then: Yup.string().required("Disability details are required"),
// //     }),
// //     Qualification: Yup.string()
// //       .matches(
// //         /^[A-Za-z\s]+$/,
// //         "Qualification should contain only alphabets and spaces"
// //       )
// //       .required("Qualification is required"),
// //     ExperienceYear: Yup.number()
// //       .min(0, "Experience cannot be negative")
// //       .required("Experience is required")
// //       .test(
// //         "experience-less-than-age",
// //         "Experience cannot be greater than age",
// //         function (value) {
// //           const { DateOfBirth } = this.parent;
// //           const age = calculateAge(DateOfBirth);
// //           return value <= age;
// //         }
// //       ),
// //     HireDate: Yup.string()
// //       .required("Hire date is required")
// //       .test(
// //         "hireDate-after-dob",
// //         "Hire date must be after date of birth",
// //         function (value) {
// //           const { DateOfBirth } = this.parent;
// //           return new Date(value) > new Date(DateOfBirth);
// //         }
// //       ),
// //     SchoolID: Yup.string().required("School is required"),
// //     EmployeeType: Yup.string()
// //       .required("Employee type is required")
// //       .test(
// //         "unique-principal",
// //         "This school already has a principal",
// //         async function (value) {
// //           if (value !== "Principal") return true;
// //           const { SchoolID, TeacherID } = this.parent;
// //           if (!SchoolID) return true;

// //           try {
// //             const { data, error } = await supabase
// //               .from("Teacher")
// //               .select("*")
// //               .eq("SchoolID", SchoolID)
// //               .eq("EmployeeType", "Principal")
// //               .neq("TeacherID", TeacherID);

// //             if (error) throw error;
// //             return data.length === 0;
// //           } catch (error) {
// //             console.error("Error checking existing principal:", error);
// //             return this.createError({
// //               message: "Could not validate principal status",
// //             });
// //           }
// //         }
// //       ),
// //     EmployementStatus: Yup.string().required("Employment status is required"),
// //     EmployementType: Yup.string().required("Employment type is required"),
// //     Address: Yup.string().required("Address is required"),
// //   });

// //   const calculateAge = (dob) => {
// //     const birthDate = new Date(dob);
// //     const today = new Date();
// //     let age = today.getFullYear() - birthDate.getFullYear();
// //     const m = today.getMonth() - birthDate.getMonth();
// //     if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
// //       age--;
// //     }
// //     return age;
// //   };

// //   const formik = useFormik({
// //     initialValues: {
// //       TeacherID: "",
// //       CNIC: "",
// //       Name: "",
// //       Email: "",
// //       PhoneNumber: "",
// //       Gender: "",
// //       DateOfBirth: "",
// //       Disability: "No",
// //       DisabilityDetails: "",
// //       Qualification: "",
// //       ExperienceYear: 0,
// //       HireDate: "",
// //       SchoolID: "",
// //       EmployeeType: "",
// //       EmployementStatus: "",
// //       EmployementType: "",
// //       Address: "",
// //     },
// //     validationSchema,
// //     onSubmit: async (values) => {
// //       setLoading(true);
// //       try {
// //         const { error } = await supabase
// //           .from("Teacher")
// //           .update({
// //             CNIC: values.CNIC,
// //             Name: values.Name,
// //             Email: values.Email,
// //             PhoneNumber: values.PhoneNumber,
// //             Gender: values.Gender,
// //             DateOfBirth: values.DateOfBirth,
// //             Disability: values.Disability,
// //             DisabilityDetails: values.DisabilityDetails,
// //             Qualification: values.Qualification,
// //             ExperienceYear: values.ExperienceYear,
// //             HireDate: values.HireDate,
// //             SchoolID: values.SchoolID,
// //             EmployeeType: values.EmployeeType,
// //             EmployementStatus: values.EmployementStatus,
// //             EmployementType: values.EmployementType,
// //             Address: values.Address,
// //           })
// //           .eq("TeacherID", values.TeacherID);

// //         if (error) throw error;

// //         setAlert({
// //           open: true,
// //           message: "Teacher updated successfully!",
// //           severity: "success",
// //         });
// //       } catch (error) {
// //         console.error("Error updating Teacher:", error.message);
// //         setAlert({
// //           open: true,
// //           message: "Failed to update Teacher. Try again!",
// //           severity: "error",
// //         });
// //       } finally {
// //         setLoading(false);
// //       }
// //     },
// //   });

// //   // Fetch CNIC list from the backend
// //   useEffect(() => {
// //     fetchCnicList();
// //   }, []);

// //   const fetchCnicList = async () => {
// //     try {
// //       const { data, error } = await supabase
// //         .from("Teacher")
// //         .select("CNIC")
// //         .order("TeacherID", { ascending: true });

// //       if (error) throw error;
// //       setCnicList(data);
// //     } catch (error) {
// //       console.error("Error fetching CNIC list:", error);
// //       setAlert({
// //         open: true,
// //         message: "Failed to fetch CNIC list",
// //         severity: "error",
// //       });
// //     }
// //   };

// //   // Fetch teacher details when a CNIC is selected
// //   useEffect(() => {
// //     if (selectedCnic) {
// //       fetchTeacherData();
// //     }
// //   }, [selectedCnic]);

// //   const fetchTeacherData = async () => {
// //     try {
// //       const { data, error } = await supabase
// //         .from("Teacher")
// //         .select("*")
// //         .eq("CNIC", selectedCnic)
// //         .single();

// //       if (error) throw error;

// //       // Map Supabase data to form fields with proper null handling
// //       const processedData = {
// //         TeacherID: data.TeacherID || "",
// //         CNIC: data.CNIC || "",
// //         Name: data.Name || "",
// //         Email: data.Email || "",
// //         PhoneNumber: data.PhoneNumber || "",
// //         Gender: data.Gender || "",
// //         DateOfBirth: data.DateOfBirth ? data.DateOfBirth.split("T")[0] : "",
// //         Disability: data.Disability || "No",
// //         DisabilityDetails: data.DisabilityDetails || "",
// //         Qualification: data.Qualification || "",
// //         ExperienceYear: data.ExperienceYear || 0,
// //         HireDate: data.HireDate ? data.HireDate.split("T")[0] : "",
// //         SchoolID: data.SchoolID || "",
// //         EmployeeType: data.EmployeeType || "",
// //         EmployementStatus: data.EmployementStatus || "",
// //         EmployementType: data.EmployementType || "",
// //         Address: data.Address || "",
// //       };

// //       formik.setValues(processedData);
// //     } catch (error) {
// //       console.error("Error fetching Details:", error);
// //       setAlert({
// //         open: true,
// //         message: "Failed to fetch details",
// //         severity: "error",
// //       });
// //     }
// //   };

// //   const handleCloseAlert = () => setAlert({ ...alert, open: false });

// //   return (
// //     <Box
// //       sx={{
// //         padding: "20px",
// //         maxWidth: "800px",
// //         margin: "0 auto",
// //         backgroundColor: "#f9f9f9",
// //         borderRadius: "8px",
// //         boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
// //       }}
// //     >
// //       <Typography variant="h4" align="center" gutterBottom>
// //         Edit Teacher Details
// //       </Typography>

// //       <Paper
// //         sx={{
// //           padding: "20px",
// //           borderRadius: "8px",
// //           backgroundColor: "#fff",
// //         }}
// //         elevation={3}
// //       >
// //         {/* CNIC Dropdown */}
// //         <Grid container spacing={2}>
// //           <Grid item xs={12}>
// //             <FormControl fullWidth sx={{ marginBottom: "20px" }}>
// //               <InputLabel>Select CNIC</InputLabel>
// //               <Select
// //                 value={selectedCnic}
// //                 onChange={(e) => setSelectedCnic(e.target.value)}
// //                 label="Select CNIC"
// //               >
// //                 {cnicList.map((teacher) => (
// //                   <MenuItem key={teacher.CNIC} value={teacher.CNIC}>
// //                     {teacher.CNIC}
// //                   </MenuItem>
// //                 ))}
// //               </Select>
// //             </FormControl>
// //           </Grid>
// //         </Grid>

// //         {/* Form for editing teacher details */}
// //         {selectedCnic && (
// //           <form onSubmit={formik.handleSubmit}>
// //             <Grid container spacing={2}>
// //               {/* Personal Information Section */}
// //               <Grid item xs={12}>
// //                 <Typography variant="h6" gutterBottom>
// //                   Personal Information
// //                 </Typography>
// //               </Grid>
// //               <Grid item xs={12} sm={6}>
// //                 <TextField
// //                   label="CNIC"
// //                   fullWidth
// //                   name="CNIC"
// //                   value={formik.values.CNIC}
// //                   onChange={formik.handleChange}
// //                   onBlur={formik.handleBlur}
// //                   error={formik.touched.CNIC && Boolean(formik.errors.CNIC)}
// //                   helperText={formik.touched.CNIC && formik.errors.CNIC}
// //                   required
// //                 />
// //               </Grid>
// //               <Grid item xs={12} sm={6}>
// //                 <TextField
// //                   label="Name"
// //                   fullWidth
// //                   name="Name"
// //                   value={formik.values.Name}
// //                   onChange={formik.handleChange}
// //                   onBlur={formik.handleBlur}
// //                   error={formik.touched.Name && Boolean(formik.errors.Name)}
// //                   helperText={formik.touched.Name && formik.errors.Name}
// //                   required
// //                 />
// //               </Grid>
// //               <Grid item xs={12} sm={6}>
// //                 <TextField
// //                   label="Email"
// //                   fullWidth
// //                   name="Email"
// //                   value={formik.values.Email}
// //                   onChange={formik.handleChange}
// //                   onBlur={formik.handleBlur}
// //                   error={formik.touched.Email && Boolean(formik.errors.Email)}
// //                   helperText={formik.touched.Email && formik.errors.Email}
// //                   required
// //                 />
// //               </Grid>
// //               <Grid item xs={12} sm={6}>
// //                 <TextField
// //                   label="Phone Number"
// //                   fullWidth
// //                   name="PhoneNumber"
// //                   value={formik.values.PhoneNumber}
// //                   onChange={formik.handleChange}
// //                   onBlur={formik.handleBlur}
// //                   error={
// //                     formik.touched.PhoneNumber &&
// //                     Boolean(formik.errors.PhoneNumber)
// //                   }
// //                   helperText={
// //                     formik.touched.PhoneNumber && formik.errors.PhoneNumber
// //                   }
// //                   required
// //                 />
// //               </Grid>
// //               <Grid item xs={12} sm={6}>
// //                 <FormControl fullWidth required>
// //                   <InputLabel>Gender</InputLabel>
// //                   <Select
// //                     label="Gender"
// //                     name="Gender"
// //                     value={formik.values.Gender}
// //                     onChange={formik.handleChange}
// //                     onBlur={formik.handleBlur}
// //                     error={
// //                       formik.touched.Gender && Boolean(formik.errors.Gender)
// //                     }
// //                   >
// //                     <MenuItem value="Male">Male</MenuItem>
// //                     <MenuItem value="Female">Female</MenuItem>
// //                   </Select>
// //                   {formik.touched.Gender && formik.errors.Gender && (
// //                     <Typography variant="caption" color="error" sx={{ ml: 2 }}>
// //                       {formik.errors.Gender}
// //                     </Typography>
// //                   )}
// //                 </FormControl>
// //               </Grid>
// //               <Grid item xs={12} sm={6}>
// //                 <TextField
// //                   label="Date of Birth"
// //                   type="date"
// //                   fullWidth
// //                   InputLabelProps={{ shrink: true }}
// //                   name="DateOfBirth"
// //                   value={formik.values.DateOfBirth}
// //                   onChange={formik.handleChange}
// //                   onBlur={formik.handleBlur}
// //                   error={
// //                     formik.touched.DateOfBirth &&
// //                     Boolean(formik.errors.DateOfBirth)
// //                   }
// //                   helperText={
// //                     formik.touched.DateOfBirth && formik.errors.DateOfBirth
// //                   }
// //                   required
// //                 />
// //               </Grid>
// //               <Grid item xs={12} sm={6}>
// //                 <FormControl fullWidth required>
// //                   <InputLabel>Disability</InputLabel>
// //                   <Select
// //                     label="Disability"
// //                     name="Disability"
// //                     value={formik.values.Disability}
// //                     onChange={formik.handleChange}
// //                     onBlur={formik.handleBlur}
// //                     error={
// //                       formik.touched.Disability &&
// //                       Boolean(formik.errors.Disability)
// //                     }
// //                   >
// //                     <MenuItem value="Yes">Yes</MenuItem>
// //                     <MenuItem value="No">No</MenuItem>
// //                   </Select>
// //                   {formik.touched.Disability && formik.errors.Disability && (
// //                     <Typography variant="caption" color="error" sx={{ ml: 2 }}>
// //                       {formik.errors.Disability}
// //                     </Typography>
// //                   )}
// //                 </FormControl>
// //               </Grid>
// //               {formik.values.Disability === "Yes" && (
// //                 <Grid item xs={12} sm={6}>
// //                   <TextField
// //                     label="Disability Details"
// //                     fullWidth
// //                     name="DisabilityDetails"
// //                     value={formik.values.DisabilityDetails}
// //                     onChange={formik.handleChange}
// //                     onBlur={formik.handleBlur}
// //                     error={
// //                       formik.touched.DisabilityDetails &&
// //                       Boolean(formik.errors.DisabilityDetails)
// //                     }
// //                     helperText={
// //                       formik.touched.DisabilityDetails &&
// //                       formik.errors.DisabilityDetails
// //                     }
// //                     required
// //                   />
// //                 </Grid>
// //               )}

// //               {/* Educational Details Section */}
// //               <Grid item xs={12}>
// //                 <Typography variant="h6" gutterBottom>
// //                   Educational Details
// //                 </Typography>
// //               </Grid>
// //               <Grid item xs={12} sm={6}>
// //                 <TextField
// //                   label="Qualification"
// //                   fullWidth
// //                   name="Qualification"
// //                   value={formik.values.Qualification}
// //                   onChange={formik.handleChange}
// //                   onBlur={formik.handleBlur}
// //                   error={
// //                     formik.touched.Qualification &&
// //                     Boolean(formik.errors.Qualification)
// //                   }
// //                   helperText={
// //                     formik.touched.Qualification && formik.errors.Qualification
// //                   }
// //                   required
// //                 />
// //               </Grid>
// //               <Grid item xs={12} sm={6}>
// //                 <TextField
// //                   label="Experience (Years)"
// //                   type="number"
// //                   fullWidth
// //                   name="ExperienceYear"
// //                   value={formik.values.ExperienceYear}
// //                   onChange={(e) => {
// //                     const value = parseInt(e.target.value, 10);
// //                     formik.setFieldValue(
// //                       "ExperienceYear",
// //                       value >= 0 ? value : 0
// //                     );
// //                   }}
// //                   onBlur={formik.handleBlur}
// //                   error={
// //                     formik.touched.ExperienceYear &&
// //                     Boolean(formik.errors.ExperienceYear)
// //                   }
// //                   helperText={
// //                     formik.touched.ExperienceYear &&
// //                     formik.errors.ExperienceYear
// //                   }
// //                   inputProps={{ min: 0 }}
// //                   required
// //                 />
// //               </Grid>

// //               {/* School Information Section */}
// //               <Grid item xs={12}>
// //                 <Typography variant="h6" gutterBottom>
// //                   School Information
// //                 </Typography>
// //               </Grid>
// //               <Grid item xs={12} sm={6}>
// //                 <TextField
// //                   label="School ID"
// //                   fullWidth
// //                   name="SchoolID"
// //                   value={formik.values.SchoolID}
// //                   onChange={formik.handleChange}
// //                   onBlur={formik.handleBlur}
// //                   error={
// //                     formik.touched.SchoolID && Boolean(formik.errors.SchoolID)
// //                   }
// //                   helperText={formik.touched.SchoolID && formik.errors.SchoolID}
// //                   required
// //                 />
// //               </Grid>
// //               <Grid item xs={12} sm={6}>
// //                 <TextField
// //                   label="Hire Date"
// //                   type="date"
// //                   fullWidth
// //                   InputLabelProps={{ shrink: true }}
// //                   name="HireDate"
// //                   value={formik.values.HireDate}
// //                   onChange={formik.handleChange}
// //                   onBlur={formik.handleBlur}
// //                   error={
// //                     formik.touched.HireDate && Boolean(formik.errors.HireDate)
// //                   }
// //                   helperText={formik.touched.HireDate && formik.errors.HireDate}
// //                   required
// //                 />
// //               </Grid>
// //               <Grid item xs={12} sm={6}>
// //                 <FormControl fullWidth required>
// //                   <InputLabel>Employee Type</InputLabel>
// //                   <Select
// //                     label="Employee Type"
// //                     name="EmployeeType"
// //                     value={formik.values.EmployeeType}
// //                     onChange={formik.handleChange}
// //                     onBlur={formik.handleBlur}
// //                     error={
// //                       formik.touched.EmployeeType &&
// //                       Boolean(formik.errors.EmployeeType)
// //                     }
// //                   >
// //                     <MenuItem value="Principal">Principal</MenuItem>
// //                     <MenuItem value="Head-Teacher">Head-Teacher</MenuItem>
// //                     <MenuItem value="Teacher">Teacher</MenuItem>
// //                   </Select>
// //                   {formik.touched.EmployeeType && formik.errors.EmployeeType && (
// //                     <Typography variant="caption" color="error" sx={{ ml: 2 }}>
// //                       {formik.errors.EmployeeType}
// //                     </Typography>
// //                   )}
// //                 </FormControl>
// //               </Grid>
// //               <Grid item xs={12} sm={6}>
// //                 <FormControl fullWidth required>
// //                   <InputLabel>Employment Status</InputLabel>
// //                   <Select
// //                     label="Employment Status"
// //                     name="EmployementStatus"
// //                     value={formik.values.EmployementStatus}
// //                     onChange={formik.handleChange}
// //                     onBlur={formik.handleBlur}
// //                     error={
// //                       formik.touched.EmployementStatus &&
// //                       Boolean(formik.errors.EmployementStatus)
// //                     }
// //                   >
// //                     <MenuItem value="Working">Working</MenuItem>
// //                     <MenuItem value="Retired">Retired</MenuItem>
// //                     <MenuItem value="Removed">Removed</MenuItem>
// //                   </Select>
// //                   {formik.touched.EmployementStatus &&
// //                     formik.errors.EmployementStatus && (
// //                       <Typography variant="caption" color="error" sx={{ ml: 2 }}>
// //                         {formik.errors.EmployementStatus}
// //                       </Typography>
// //                     )}
// //                 </FormControl>
// //               </Grid>
// //               <Grid item xs={12} sm={6}>
// //                 <FormControl fullWidth required>
// //                   <InputLabel>Employment Type</InputLabel>
// //                   <Select
// //                     label="Employment Type"
// //                     name="EmployementType"
// //                     value={formik.values.EmployementType}
// //                     onChange={formik.handleChange}
// //                     onBlur={formik.handleBlur}
// //                     error={
// //                       formik.touched.EmployementType &&
// //                       Boolean(formik.errors.EmployementType)
// //                     }
// //                   >
// //                     <MenuItem value="Permanent">Permanent</MenuItem>
// //                     <MenuItem value="Contract">Contract</MenuItem>
// //                     <MenuItem value="Part-Time">Part-Time</MenuItem>
// //                   </Select>
// //                   {formik.touched.EmployementType &&
// //                     formik.errors.EmployementType && (
// //                       <Typography variant="caption" color="error" sx={{ ml: 2 }}>
// //                         {formik.errors.EmployementType}
// //                       </Typography>
// //                     )}
// //                 </FormControl>
// //               </Grid>

// //               {/* Address Section */}
// //               <Grid item xs={12}>
// //                 <Typography variant="h6" gutterBottom>
// //                   Address
// //                 </Typography>
// //               </Grid>
// //               <Grid item xs={12}>
// //                 <TextField
// //                   label="Address"
// //                   fullWidth
// //                   name="Address"
// //                   value={formik.values.Address}
// //                   onChange={formik.handleChange}
// //                   onBlur={formik.handleBlur}
// //                   error={formik.touched.Address && Boolean(formik.errors.Address)}
// //                   helperText={formik.touched.Address && formik.errors.Address}
// //                   required
// //                 />
// //               </Grid>

// //               {/* Submit Button */}
// //               <Grid item xs={12}>
// //                 <Button
// //                   type="submit"
// //                   variant="contained"
// //                   color="primary"
// //                   fullWidth
// //                   disabled={loading}
// //                 >
// //                   {loading ? <CircularProgress size={24} /> : "Update Teacher"}
// //                 </Button>
// //               </Grid>
// //             </Grid>
// //           </form>
// //         )}
// //       </Paper>

// //       <Snackbar
// //         open={alert.open}
// //         autoHideDuration={4000}
// //         onClose={handleCloseAlert}
// //       >
// //         <Alert
// //           onClose={handleCloseAlert}
// //           severity={alert.severity}
// //           sx={{ width: "100%" }}
// //         >
// //           {alert.message}
// //         </Alert>
// //       </Snackbar>
// //     </Box>
// //   );
// // };

// // export default EditTeacher;

// import React, { useState, useEffect } from "react";
// import { useFormik } from "formik";
// import * as Yup from "yup";
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
//   Snackbar,
//   Alert,
//   Box,
//   CircularProgress,
// } from "@mui/material";
// import supabase from "../../../supabase-client";

// const EditTeacher = () => {
//   const [schoolList, setSchoolList] = useState([]);
//   const [teacherList, setTeacherList] = useState([]);
//   const [selectedSchool, setSelectedSchool] = useState("");
//   const [selectedTeacher, setSelectedTeacher] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [alert, setAlert] = useState({
//     open: false,
//     message: "",
//     severity: "",
//   });

//   // Validation Schema (same as Add Teacher)
//   const validationSchema = Yup.object().shape({
//     CNIC: Yup.string()
//       .matches(/^\d{13}$/, "CNIC must be 13 digits and contain only numbers")
//       .required("CNIC is required"),
//     Name: Yup.string()
//       .matches(/^[A-Za-z\s]+$/, "Only alphabets and spaces are allowed")
//       .required("Name is required"),
//     Email: Yup.string().email("Invalid email").required("Email is required"),
//     PhoneNumber: Yup.string()
//       .matches(
//         /^\d{9,12}$/,
//         "Phone number must be between 9 and 12 digits and only contain numbers"
//       )
//       .required("Phone number is required"),
//     Gender: Yup.string().required("Gender is required"),
//     DateOfBirth: Yup.string().required("Date of birth is required"),
//     Disability: Yup.string().required("Disability status is required"),
//     DisabilityDetails: Yup.string().when("Disability", {
//       is: "Yes",
//       then: Yup.string().required("Disability details are required"),
//     }),
//     Qualification: Yup.string()
//       .matches(
//         /^[A-Za-z\s]+$/,
//         "Qualification should contain only alphabets and spaces"
//       )
//       .required("Qualification is required"),
//     ExperienceYear: Yup.number()
//       .min(0, "Experience cannot be negative")
//       .required("Experience is required")
//       .test(
//         "experience-less-than-age",
//         "Experience cannot be greater than age",
//         function (value) {
//           const { DateOfBirth } = this.parent;
//           const age = calculateAge(DateOfBirth);
//           return value <= age;
//         }
//       ),
//     HireDate: Yup.string()
//       .required("Hire date is required")
//       .test(
//         "hireDate-after-dob",
//         "Hire date must be after date of birth",
//         function (value) {
//           const { DateOfBirth } = this.parent;
//           return new Date(value) > new Date(DateOfBirth);
//         }
//       ),
//     SchoolID: Yup.string().required("School is required"),
//     EmployeeType: Yup.string()
//       .required("Employee type is required")
//       .test(
//         "unique-principal",
//         "This school already has a principal",
//         async function (value) {
//           if (value !== "Principal") return true;
//           const { SchoolID, TeacherID } = this.parent;
//           if (!SchoolID) return true;

//           try {
//             const { data, error } = await supabase
//               .from("Teacher")
//               .select("*")
//               .eq("SchoolID", SchoolID)
//               .eq("EmployeeType", "Principal")
//               .neq("TeacherID", TeacherID);

//             if (error) throw error;
//             return data.length === 0;
//           } catch (error) {
//             console.error("Error checking existing principal:", error);
//             return this.createError({
//               message: "Could not validate principal status",
//             });
//           }
//         }
//       ),
//     EmployementStatus: Yup.string().required("Employment status is required"),
//     EmployementType: Yup.string().required("Employment type is required"),
//     Address: Yup.string().required("Address is required"),
//   });

//   const calculateAge = (dob) => {
//     const birthDate = new Date(dob);
//     const today = new Date();
//     let age = today.getFullYear() - birthDate.getFullYear();
//     const m = today.getMonth() - birthDate.getMonth();
//     if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
//       age--;
//     }
//     return age;
//   };

//   const formik = useFormik({
//     initialValues: {
//       TeacherID: "",
//       CNIC: "",
//       Name: "",
//       Email: "",
//       PhoneNumber: "",
//       Gender: "",
//       DateOfBirth: "",
//       Disability: "No",
//       DisabilityDetails: "",
//       Qualification: "",
//       ExperienceYear: 0,
//       HireDate: "",
//       SchoolID: "",
//       EmployeeType: "",
//       EmployementStatus: "",
//       EmployementType: "",
//       Address: "",
//     },
//     validationSchema,
//     onSubmit: async (values) => {
//       setLoading(true);
//       try {
//         const { error } = await supabase
//           .from("Teacher")
//           .update({
//             CNIC: values.CNIC,
//             Name: values.Name,
//             Email: values.Email,
//             PhoneNumber: values.PhoneNumber,
//             Gender: values.Gender,
//             DateOfBirth: values.DateOfBirth,
//             Disability: values.Disability,
//             DisabilityDetails: values.DisabilityDetails,
//             Qualification: values.Qualification,
//             ExperienceYear: values.ExperienceYear,
//             HireDate: values.HireDate,
//             SchoolID: values.SchoolID,
//             EmployeeType: values.EmployeeType,
//             EmployementStatus: values.EmployementStatus,
//             EmployementType: values.EmployementType,
//             Address: values.Address,
//           })
//           .eq("TeacherID", values.TeacherID);

//         if (error) throw error;

//         setAlert({
//           open: true,
//           message: "Teacher updated successfully!",
//           severity: "success",
//         });
//       } catch (error) {
//         console.error("Error updating Teacher:", error.message);
//         setAlert({
//           open: true,
//           message: "Failed to update Teacher. Try again!",
//           severity: "error",
//         });
//       } finally {
//         setLoading(false);
//       }
//     },
//   });

//   // Fetch school list on component mount
//   useEffect(() => {
//     fetchSchoolList();
//   }, []);

//   // Fetch teachers when a school is selected
//   useEffect(() => {
//     if (selectedSchool) {
//       fetchTeachersBySchool();
//       formik.setFieldValue("SchoolID", selectedSchool);
//     } else {
//       setTeacherList([]);
//       setSelectedTeacher("");
//     }
//   }, [selectedSchool]);

//   // Fetch teacher details when a teacher is selected
//   useEffect(() => {
//     if (selectedTeacher) {
//       fetchTeacherData();
//     }
//   }, [selectedTeacher]);

//   const fetchSchoolList = async () => {
//     try {
//       const { data, error } = await supabase
//         .from("School")
//         .select("SchoolID")
//         .order("SchoolID", { ascending: true });

//       if (error) throw error;
//       setSchoolList(data);
//     } catch (error) {
//       console.error("Error fetching school list:", error);
//       setAlert({
//         open: true,
//         message: "Failed to fetch school list",
//         severity: "error",
//       });
//     }
//   };

//   const fetchTeachersBySchool = async () => {
//     try {
//       const { data, error } = await supabase
//         .from("Teacher")
//         .select("TeacherID, Name")
//         .eq("SchoolID", selectedSchool)
//         .order("TeacherID", { ascending: true });

//       if (error) throw error;
//       setTeacherList(data);
//     } catch (error) {
//       console.error("Error fetching teachers:", error);
//       setAlert({
//         open: true,
//         message: "Failed to fetch teachers",
//         severity: "error",
//       });
//     }
//   };

//   const fetchTeacherData = async () => {
//     try {
//       const { data, error } = await supabase
//         .from("Teacher")
//         .select("*")
//         .eq("TeacherID", selectedTeacher)
//         .single();

//       if (error) throw error;

//       // Map Supabase data to form fields with proper null handling
//       const processedData = {
//         TeacherID: data.TeacherID || "",
//         CNIC: data.CNIC || "",
//         Name: data.Name || "",
//         Email: data.Email || "",
//         PhoneNumber: data.PhoneNumber || "",
//         Gender: data.Gender || "",
//         DateOfBirth: data.DateOfBirth ? data.DateOfBirth.split("T")[0] : "",
//         Disability: data.Disability || "No",
//         DisabilityDetails: data.DisabilityDetails || "",
//         Qualification: data.Qualification || "",
//         ExperienceYear: data.ExperienceYear || 0,
//         HireDate: data.HireDate ? data.HireDate.split("T")[0] : "",
//         SchoolID: data.SchoolID || "",
//         EmployeeType: data.EmployeeType || "",
//         EmployementStatus: data.EmployementStatus || "",
//         EmployementType: data.EmployementType || "",
//         Address: data.Address || "",
//       };

//       formik.setValues(processedData);
//     } catch (error) {
//       console.error("Error fetching teacher details:", error);
//       setAlert({
//         open: true,
//         message: "Failed to fetch teacher details",
//         severity: "error",
//       });
//     }
//   };

//   const handleCloseAlert = () => setAlert({ ...alert, open: false });

//   return (
//     <Box
//       sx={{
//         padding: "20px",
//         maxWidth: "800px",
//         margin: "0 auto",
//         backgroundColor: "#f9f9f9",
//         borderRadius: "8px",
//         boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
//       }}
//     >
//       <Typography variant="h4" align="center" gutterBottom>
//         Edit Teacher Details
//       </Typography>

//       <Paper
//         sx={{
//           padding: "20px",
//           borderRadius: "8px",
//           backgroundColor: "#fff",
//         }}
//         elevation={3}
//       >
//         {/* School and Teacher Selection Dropdowns */}
//         <Grid container spacing={2}>
//           <Grid item xs={12} sm={6}>
//             <FormControl fullWidth sx={{ marginBottom: "20px" }}>
//               <InputLabel>Select School</InputLabel>
//               <Select
//                 value={selectedSchool}
//                 onChange={(e) => {
//                   setSelectedSchool(e.target.value);
//                   setSelectedTeacher(""); // Reset teacher selection
//                 }}
//                 label="Select School"
//               >
//                 {schoolList.map((school) => (
//                   <MenuItem key={school.SchoolID} value={school.SchoolID}>
//                     {school.SchoolID}
//                   </MenuItem>
//                 ))}
//               </Select>
//             </FormControl>
//           </Grid>

//           <Grid item xs={12} sm={6}>
//             <FormControl
//               fullWidth
//               sx={{ marginBottom: "20px" }}
//               disabled={!selectedSchool}
//             >
//               <InputLabel>Select Teacher</InputLabel>
//               <Select
//                 value={selectedTeacher}
//                 onChange={(e) => setSelectedTeacher(e.target.value)}
//                 label="Select Teacher"
//               >
//                 {teacherList.map((teacher) => (
//                   <MenuItem key={teacher.TeacherID} value={teacher.TeacherID}>
//                     {teacher.TeacherID} - {teacher.Name}
//                   </MenuItem>
//                 ))}
//               </Select>
//             </FormControl>
//           </Grid>
//         </Grid>

//         {/* Form for editing teacher details */}
//         {selectedTeacher && (
//           <form onSubmit={formik.handleSubmit}>
//             <Grid container spacing={2}>
//               {/* Personal Information Section */}
//               <Grid item xs={12}>
//                 <Typography variant="h6" gutterBottom>
//                   Personal Information
//                 </Typography>
//               </Grid>
//               <Grid item xs={12} sm={6}>
//                 <TextField
//                   label="CNIC"
//                   fullWidth
//                   name="CNIC"
//                   value={formik.values.CNIC}
//                   onChange={formik.handleChange}
//                   onBlur={formik.handleBlur}
//                   error={formik.touched.CNIC && Boolean(formik.errors.CNIC)}
//                   helperText={formik.touched.CNIC && formik.errors.CNIC}
//                   required
//                 />
//               </Grid>
//               <Grid item xs={12} sm={6}>
//                 <TextField
//                   label="Name"
//                   fullWidth
//                   name="Name"
//                   value={formik.values.Name}
//                   onChange={formik.handleChange}
//                   onBlur={formik.handleBlur}
//                   error={formik.touched.Name && Boolean(formik.errors.Name)}
//                   helperText={formik.touched.Name && formik.errors.Name}
//                   required
//                 />
//               </Grid>
//               <Grid item xs={12} sm={6}>
//                 <TextField
//                   label="Email"
//                   fullWidth
//                   name="Email"
//                   value={formik.values.Email}
//                   onChange={formik.handleChange}
//                   onBlur={formik.handleBlur}
//                   error={formik.touched.Email && Boolean(formik.errors.Email)}
//                   helperText={formik.touched.Email && formik.errors.Email}
//                   required
//                 />
//               </Grid>
//               <Grid item xs={12} sm={6}>
//                 <TextField
//                   label="Phone Number"
//                   fullWidth
//                   name="PhoneNumber"
//                   value={formik.values.PhoneNumber}
//                   onChange={formik.handleChange}
//                   onBlur={formik.handleBlur}
//                   error={
//                     formik.touched.PhoneNumber &&
//                     Boolean(formik.errors.PhoneNumber)
//                   }
//                   helperText={
//                     formik.touched.PhoneNumber && formik.errors.PhoneNumber
//                   }
//                   required
//                 />
//               </Grid>
//               <Grid item xs={12} sm={6}>
//                 <FormControl fullWidth required>
//                   <InputLabel>Gender</InputLabel>
//                   <Select
//                     label="Gender"
//                     name="Gender"
//                     value={formik.values.Gender}
//                     onChange={formik.handleChange}
//                     onBlur={formik.handleBlur}
//                     error={
//                       formik.touched.Gender && Boolean(formik.errors.Gender)
//                     }
//                   >
//                     <MenuItem value="Male">Male</MenuItem>
//                     <MenuItem value="Female">Female</MenuItem>
//                   </Select>
//                   {formik.touched.Gender && formik.errors.Gender && (
//                     <Typography variant="caption" color="error" sx={{ ml: 2 }}>
//                       {formik.errors.Gender}
//                     </Typography>
//                   )}
//                 </FormControl>
//               </Grid>
//               <Grid item xs={12} sm={6}>
//                 <TextField
//                   label="Date of Birth"
//                   type="date"
//                   fullWidth
//                   InputLabelProps={{ shrink: true }}
//                   name="DateOfBirth"
//                   value={formik.values.DateOfBirth}
//                   onChange={formik.handleChange}
//                   onBlur={formik.handleBlur}
//                   error={
//                     formik.touched.DateOfBirth &&
//                     Boolean(formik.errors.DateOfBirth)
//                   }
//                   helperText={
//                     formik.touched.DateOfBirth && formik.errors.DateOfBirth
//                   }
//                   required
//                 />
//               </Grid>
//               <Grid item xs={12} sm={6}>
//                 <FormControl fullWidth required>
//                   <InputLabel>Disability</InputLabel>
//                   <Select
//                     label="Disability"
//                     name="Disability"
//                     value={formik.values.Disability}
//                     onChange={formik.handleChange}
//                     onBlur={formik.handleBlur}
//                     error={
//                       formik.touched.Disability &&
//                       Boolean(formik.errors.Disability)
//                     }
//                   >
//                     <MenuItem value="Yes">Yes</MenuItem>
//                     <MenuItem value="No">No</MenuItem>
//                   </Select>
//                   {formik.touched.Disability && formik.errors.Disability && (
//                     <Typography variant="caption" color="error" sx={{ ml: 2 }}>
//                       {formik.errors.Disability}
//                     </Typography>
//                   )}
//                 </FormControl>
//               </Grid>
//               {formik.values.Disability === "Yes" && (
//                 <Grid item xs={12} sm={6}>
//                   <TextField
//                     label="Disability Details"
//                     fullWidth
//                     name="DisabilityDetails"
//                     value={formik.values.DisabilityDetails}
//                     onChange={formik.handleChange}
//                     onBlur={formik.handleBlur}
//                     error={
//                       formik.touched.DisabilityDetails &&
//                       Boolean(formik.errors.DisabilityDetails)
//                     }
//                     helperText={
//                       formik.touched.DisabilityDetails &&
//                       formik.errors.DisabilityDetails
//                     }
//                     required
//                   />
//                 </Grid>
//               )}

//               {/* Educational Details Section */}
//               <Grid item xs={12}>
//                 <Typography variant="h6" gutterBottom>
//                   Educational Details
//                 </Typography>
//               </Grid>
//               <Grid item xs={12} sm={6}>
//                 <TextField
//                   label="Qualification"
//                   fullWidth
//                   name="Qualification"
//                   value={formik.values.Qualification}
//                   onChange={formik.handleChange}
//                   onBlur={formik.handleBlur}
//                   error={
//                     formik.touched.Qualification &&
//                     Boolean(formik.errors.Qualification)
//                   }
//                   helperText={
//                     formik.touched.Qualification && formik.errors.Qualification
//                   }
//                   required
//                 />
//               </Grid>
//               <Grid item xs={12} sm={6}>
//                 <TextField
//                   label="Experience (Years)"
//                   type="number"
//                   fullWidth
//                   name="ExperienceYear"
//                   value={formik.values.ExperienceYear}
//                   onChange={(e) => {
//                     const value = parseInt(e.target.value, 10);
//                     formik.setFieldValue(
//                       "ExperienceYear",
//                       value >= 0 ? value : 0
//                     );
//                   }}
//                   onBlur={formik.handleBlur}
//                   error={
//                     formik.touched.ExperienceYear &&
//                     Boolean(formik.errors.ExperienceYear)
//                   }
//                   helperText={
//                     formik.touched.ExperienceYear &&
//                     formik.errors.ExperienceYear
//                   }
//                   inputProps={{ min: 0 }}
//                   required
//                 />
//               </Grid>

//               {/* School Information Section */}
//               <Grid item xs={12}>
//                 <Typography variant="h6" gutterBottom>
//                   School Information
//                 </Typography>
//               </Grid>
//               <Grid item xs={12} sm={6}>
//                 <TextField
//                   label="School ID"
//                   fullWidth
//                   name="SchoolID"
//                   value={formik.values.SchoolID}
//                   onChange={formik.handleChange}
//                   onBlur={formik.handleBlur}
//                   error={
//                     formik.touched.SchoolID && Boolean(formik.errors.SchoolID)
//                   }
//                   helperText={formik.touched.SchoolID && formik.errors.SchoolID}
//                   required
//                   disabled
//                 />
//               </Grid>
//               <Grid item xs={12} sm={6}>
//                 <TextField
//                   label="Hire Date"
//                   type="date"
//                   fullWidth
//                   InputLabelProps={{ shrink: true }}
//                   name="HireDate"
//                   value={formik.values.HireDate}
//                   onChange={formik.handleChange}
//                   onBlur={formik.handleBlur}
//                   error={
//                     formik.touched.HireDate && Boolean(formik.errors.HireDate)
//                   }
//                   helperText={formik.touched.HireDate && formik.errors.HireDate}
//                   required
//                 />
//               </Grid>
//               <Grid item xs={12} sm={6}>
//                 <FormControl fullWidth required>
//                   <InputLabel>Employee Type</InputLabel>
//                   <Select
//                     label="Employee Type"
//                     name="EmployeeType"
//                     value={formik.values.EmployeeType}
//                     onChange={formik.handleChange}
//                     onBlur={formik.handleBlur}
//                     error={
//                       formik.touched.EmployeeType &&
//                       Boolean(formik.errors.EmployeeType)
//                     }
//                   >
//                     <MenuItem value="Principal">Principal</MenuItem>
//                     <MenuItem value="Head-Teacher">Head-Teacher</MenuItem>
//                     <MenuItem value="Teacher">Teacher</MenuItem>
//                   </Select>
//                   {formik.touched.EmployeeType &&
//                     formik.errors.EmployeeType && (
//                       <Typography
//                         variant="caption"
//                         color="error"
//                         sx={{ ml: 2 }}
//                       >
//                         {formik.errors.EmployeeType}
//                       </Typography>
//                     )}
//                 </FormControl>
//               </Grid>
//               <Grid item xs={12} sm={6}>
//                 <FormControl fullWidth required>
//                   <InputLabel>Employment Status</InputLabel>
//                   <Select
//                     label="Employment Status"
//                     name="EmployementStatus"
//                     value={formik.values.EmployementStatus}
//                     onChange={formik.handleChange}
//                     onBlur={formik.handleBlur}
//                     error={
//                       formik.touched.EmployementStatus &&
//                       Boolean(formik.errors.EmployementStatus)
//                     }
//                   >
//                     <MenuItem value="Working">Working</MenuItem>
//                     <MenuItem value="Retired">Retired</MenuItem>
//                     <MenuItem value="Removed">Removed</MenuItem>
//                   </Select>
//                   {formik.touched.EmployementStatus &&
//                     formik.errors.EmployementStatus && (
//                       <Typography
//                         variant="caption"
//                         color="error"
//                         sx={{ ml: 2 }}
//                       >
//                         {formik.errors.EmployementStatus}
//                       </Typography>
//                     )}
//                 </FormControl>
//               </Grid>
//               <Grid item xs={12} sm={6}>
//                 <FormControl fullWidth required>
//                   <InputLabel>Employment Type</InputLabel>
//                   <Select
//                     label="Employment Type"
//                     name="EmployementType"
//                     value={formik.values.EmployementType}
//                     onChange={formik.handleChange}
//                     onBlur={formik.handleBlur}
//                     error={
//                       formik.touched.EmployementType &&
//                       Boolean(formik.errors.EmployementType)
//                     }
//                   >
//                     <MenuItem value="Permanent">Permanent</MenuItem>
//                     <MenuItem value="Contract">Contract</MenuItem>
//                     <MenuItem value="Part-Time">Part-Time</MenuItem>
//                   </Select>
//                   {formik.touched.EmployementType &&
//                     formik.errors.EmployementType && (
//                       <Typography
//                         variant="caption"
//                         color="error"
//                         sx={{ ml: 2 }}
//                       >
//                         {formik.errors.EmployementType}
//                       </Typography>
//                     )}
//                 </FormControl>
//               </Grid>

//               {/* Address Section */}
//               <Grid item xs={12}>
//                 <Typography variant="h6" gutterBottom>
//                   Address
//                 </Typography>
//               </Grid>
//               <Grid item xs={12}>
//                 <TextField
//                   label="Address"
//                   fullWidth
//                   name="Address"
//                   value={formik.values.Address}
//                   onChange={formik.handleChange}
//                   onBlur={formik.handleBlur}
//                   error={
//                     formik.touched.Address && Boolean(formik.errors.Address)
//                   }
//                   helperText={formik.touched.Address && formik.errors.Address}
//                   required
//                 />
//               </Grid>

//               {/* Submit Button */}
//               <Grid item xs={12}>
//                 <Button
//                   type="submit"
//                   variant="contained"
//                   color="primary"
//                   fullWidth
//                   disabled={loading}
//                 >
//                   {loading ? <CircularProgress size={24} /> : "Update Teacher"}
//                 </Button>
//               </Grid>
//             </Grid>
//           </form>
//         )}
//       </Paper>

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
//     </Box>
//   );
// };

// export default EditTeacher;



































import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
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
import supabase from "../../../supabase-client";

const EditTeacher = () => {
  const [schoolList, setSchoolList] = useState([]);
  const [teacherList, setTeacherList] = useState([]);
  const [selectedSchool, setSelectedSchool] = useState("");
  const [selectedTeacher, setSelectedTeacher] = useState("");
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({
    open: false,
    message: "",
    severity: "",
  });

  // Validation Schema with unique CNIC validation
  const validationSchema = Yup.object().shape({
    CNIC: Yup.string()
      .matches(/^\d{13}$/, "CNIC must be 13 digits and contain only numbers")
      .required("CNIC is required")
      .test(
        "unique-cnic",
        "This CNIC is already registered with another teacher",
        async function (value) {
          if (!value) return true;
          const { TeacherID } = this.parent;
          if (!TeacherID) return true;

          try {
            const { data, error } = await supabase
              .from("Teacher")
              .select("CNIC")
              .eq("CNIC", value)
              .neq("TeacherID", TeacherID);

            if (error) throw error;
            return data.length === 0; // true = valid (no other teacher has this CNIC)
          } catch (error) {
            console.error("Error checking CNIC:", error);
            return this.createError({
              message: "Could not validate CNIC",
            });
          }
        }
      ),
    Name: Yup.string()
      .matches(/^[A-Za-z\s]+$/, "Only alphabets and spaces are allowed")
      .required("Name is required"),
    Email: Yup.string()
      .email("Invalid email")
      .required("Email is required"),
    PhoneNumber: Yup.string()
      .matches(
        /^\d{9,12}$/,
        "Phone number must be between 9 and 12 digits and only contain numbers"
      )
      .required("Phone number is required").test(
        "unique-phone",
        "This Phone Number is already registered with another teacher",
        async function (value) {
          if (!value) return true;
          const { TeacherID } = this.parent;
          if (!TeacherID) return true;

          try {
            const { data, error } = await supabase
              .from("Teacher")
              .select("PhoneNumber")
              .eq("PhoneNumber", value)
              .neq("TeacherID", TeacherID);

            if (error) throw error;
            return data.length === 0; // true = valid (no other teacher has this CNIC)
          } catch (error) {
            console.error("Error checking Phone Number:", error);
            return this.createError({
              message: "Could not validate Phone Number",
            });
          }
        }
      ),
    Gender: Yup.string().required("Gender is required"),
    DateOfBirth: Yup.string().required("Date of birth is required"),
    Disability: Yup.string().required("Disability status is required"),
    DisabilityDetails: Yup.string().when("Disability", {
      is: "Yes",
      then: Yup.string().required("Disability details are required"),
    }),
    Qualification: Yup.string()
      .matches(
        /^[A-Za-z\s]+$/,
        "Qualification should contain only alphabets and spaces"
      )
      .required("Qualification is required"),
    ExperienceYear: Yup.number()
      .min(0, "Experience cannot be negative")
      .required("Experience is required")
      .test(
        "experience-less-than-age",
        "Experience cannot be greater than age",
        function (value) {
          const { DateOfBirth } = this.parent;
          const age = calculateAge(DateOfBirth);
          return value <= age;
        }
      ),
    HireDate: Yup.string()
      .required("Hire date is required")
      .test(
        "hireDate-after-dob",
        "Hire date must be after date of birth",
        function (value) {
          const { DateOfBirth } = this.parent;
          return new Date(value) > new Date(DateOfBirth);
        }
      ),
    SchoolID: Yup.string().required("School is required"),
    EmployeeType: Yup.string()
      .required("Employee type is required")
      .test(
        "unique-principal",
        "This school already has a principal",
        async function (value) {
          if (value !== "Principal") return true;
          const { SchoolID, TeacherID } = this.parent;
          if (!SchoolID) return true;

          try {
            const { data, error } = await supabase
              .from("Teacher")
              .select("*")
              .eq("SchoolID", SchoolID)
              .eq("EmployeeType", "Principal")
              .neq("TeacherID", TeacherID);

            if (error) throw error;
            return data.length === 0;
          } catch (error) {
            console.error("Error checking existing principal:", error);
            return this.createError({
              message: "Could not validate principal status",
            });
          }
        }
      ),
    EmployementStatus: Yup.string().required("Employment status is required"),
    EmployementType: Yup.string().required("Employment type is required"),
    Address: Yup.string().required("Address is required"),
  });

  const calculateAge = (dob) => {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const formik = useFormik({
    initialValues: {
      TeacherID: "",
      CNIC: "",
      Name: "",
      Email: "",
      PhoneNumber: "",
      Gender: "",
      DateOfBirth: "",
      Disability: "No",
      DisabilityDetails: "",
      Qualification: "",
      ExperienceYear: 0,
      HireDate: "",
      SchoolID: "",
      EmployeeType: "",
      EmployementStatus: "",
      EmployementType: "",
      Address: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      setLoading(true);
      try {
        const { error } = await supabase
          .from("Teacher")
          .update({
            CNIC: values.CNIC,
            Name: values.Name,
            Email: values.Email,
            PhoneNumber: values.PhoneNumber,
            Gender: values.Gender,
            DateOfBirth: values.DateOfBirth,
            Disability: values.Disability,
            DisabilityDetails: values.DisabilityDetails,
            Qualification: values.Qualification,
            ExperienceYear: values.ExperienceYear,
            HireDate: values.HireDate,
            SchoolID: values.SchoolID,
            EmployeeType: values.EmployeeType,
            EmployementStatus: values.EmployementStatus,
            EmployementType: values.EmployementType,
            Address: values.Address,
          })
          .eq("TeacherID", values.TeacherID);

        if (error) throw error;

        setAlert({
          open: true,
          message: "Teacher updated successfully!",
          severity: "success",
        });
        
        // Refresh teacher list for the current school to reflect any changes
        fetchTeachersBySchool();
      } catch (error) {
        console.error("Error updating Teacher:", error.message);
        setAlert({
          open: true,
          message: "Failed to update Teacher. Try again!",
          severity: "error",
        });
      } finally {
        setLoading(false);
      }
    },
  });

  // Fetch school list on component mount
  useEffect(() => {
    fetchSchoolList();
  }, []);

  // Fetch teachers when a school is selected
  useEffect(() => {
    if (selectedSchool) {
      fetchTeachersBySchool();
      formik.setFieldValue("SchoolID", selectedSchool);
    } else {
      setTeacherList([]);
      setSelectedTeacher("");
    }
  }, [selectedSchool]);

  // Fetch teacher details when a teacher is selected
  useEffect(() => {
    if (selectedTeacher) {
      fetchTeacherData();
    }
  }, [selectedTeacher]);

  const fetchSchoolList = async () => {
    try {
      const { data, error } = await supabase
        .from("School")
        .select("SchoolID")
        .order("SchoolID", { ascending: true });

      if (error) throw error;
      setSchoolList(data);
    } catch (error) {
      console.error("Error fetching school list:", error);
      setAlert({
        open: true,
        message: "Failed to fetch school list",
        severity: "error",
      });
    }
  };

  const fetchTeachersBySchool = async () => {
    try {
      const { data, error } = await supabase
        .from("Teacher")
        .select("TeacherID, Name")
        .eq("SchoolID", selectedSchool)
        .order("TeacherID", { ascending: true });

      if (error) throw error;
      setTeacherList(data);
    } catch (error) {
      console.error("Error fetching teachers:", error);
      setAlert({
        open: true,
        message: "Failed to fetch teachers",
        severity: "error",
      });
    }
  };

  const fetchTeacherData = async () => {
    try {
      const { data, error } = await supabase
        .from("Teacher")
        .select("*")
        .eq("TeacherID", selectedTeacher)
        .single();

      if (error) throw error;

      // Map Supabase data to form fields with proper null handling
      const processedData = {
        TeacherID: data.TeacherID || "",
        CNIC: data.CNIC || "",
        Name: data.Name || "",
        Email: data.Email || "",
        PhoneNumber: data.PhoneNumber || "",
        Gender: data.Gender || "",
        DateOfBirth: data.DateOfBirth ? data.DateOfBirth.split("T")[0] : "",
        Disability: data.Disability || "No",
        DisabilityDetails: data.DisabilityDetails || "",
        Qualification: data.Qualification || "",
        ExperienceYear: data.ExperienceYear || 0,
        HireDate: data.HireDate ? data.HireDate.split("T")[0] : "",
        SchoolID: data.SchoolID || "",
        EmployeeType: data.EmployeeType || "",
        EmployementStatus: data.EmployementStatus || "",
        EmployementType: data.EmployementType || "",
        Address: data.Address || "",
      };

      formik.setValues(processedData);
    } catch (error) {
      console.error("Error fetching teacher details:", error);
      setAlert({
        open: true,
        message: "Failed to fetch teacher details",
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
        {/* School and Teacher Selection Dropdowns */}
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth sx={{ marginBottom: "20px" }}>
              <InputLabel>Select School</InputLabel>
              <Select
                value={selectedSchool}
                onChange={(e) => {
                  setSelectedSchool(e.target.value);
                  setSelectedTeacher("");  // Reset teacher selection
                }}
                label="Select School"
              >
                {schoolList.map((school) => (
                  <MenuItem key={school.SchoolID} value={school.SchoolID}>
                    {school.SchoolID}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <FormControl 
              fullWidth 
              sx={{ marginBottom: "20px" }}
              disabled={!selectedSchool}
            >
              <InputLabel>Select Teacher</InputLabel>
              <Select
                value={selectedTeacher}
                onChange={(e) => setSelectedTeacher(e.target.value)}
                label="Select Teacher"
              >
                {teacherList.map((teacher) => (
                  <MenuItem key={teacher.TeacherID} value={teacher.TeacherID}>
                    {teacher.TeacherID} - {teacher.Name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        {/* Form for editing teacher details */}
        {selectedTeacher && (
          <form onSubmit={formik.handleSubmit}>
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
                  name="CNIC"
                  value={formik.values.CNIC}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.CNIC && Boolean(formik.errors.CNIC)}
                  helperText={formik.touched.CNIC && formik.errors.CNIC}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Name"
                  fullWidth
                  name="Name"
                  value={formik.values.Name}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.Name && Boolean(formik.errors.Name)}
                  helperText={formik.touched.Name && formik.errors.Name}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Email"
                  fullWidth
                  name="Email"
                  value={formik.values.Email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.Email && Boolean(formik.errors.Email)}
                  helperText={formik.touched.Email && formik.errors.Email}
                  required
                  disabled
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Phone Number"
                  fullWidth
                  name="PhoneNumber"
                  value={formik.values.PhoneNumber}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.PhoneNumber &&
                    Boolean(formik.errors.PhoneNumber)
                  }
                  helperText={
                    formik.touched.PhoneNumber && formik.errors.PhoneNumber
                  }
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth required>
                  <InputLabel>Gender</InputLabel>
                  <Select
                    label="Gender"
                    name="Gender"
                    value={formik.values.Gender}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={
                      formik.touched.Gender && Boolean(formik.errors.Gender)
                    }
                  >
                    <MenuItem value="Male">Male</MenuItem>
                    <MenuItem value="Female">Female</MenuItem>
                  </Select>
                  {formik.touched.Gender && formik.errors.Gender && (
                    <Typography variant="caption" color="error" sx={{ ml: 2 }}>
                      {formik.errors.Gender}
                    </Typography>
                  )}
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Date of Birth"
                  type="date"
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  name="DateOfBirth"
                  value={formik.values.DateOfBirth}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.DateOfBirth &&
                    Boolean(formik.errors.DateOfBirth)
                  }
                  helperText={
                    formik.touched.DateOfBirth && formik.errors.DateOfBirth
                  }
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth required>
                  <InputLabel>Disability</InputLabel>
                  <Select
                    label="Disability"
                    name="Disability"
                    value={formik.values.Disability}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={
                      formik.touched.Disability &&
                      Boolean(formik.errors.Disability)
                    }
                  >
                    <MenuItem value="Yes">Yes</MenuItem>
                    <MenuItem value="No">No</MenuItem>
                  </Select>
                  {formik.touched.Disability && formik.errors.Disability && (
                    <Typography variant="caption" color="error" sx={{ ml: 2 }}>
                      {formik.errors.Disability}
                    </Typography>
                  )}
                </FormControl>
              </Grid>
              {formik.values.Disability === "Yes" && (
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Disability Details"
                    fullWidth
                    name="DisabilityDetails"
                    value={formik.values.DisabilityDetails}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={
                      formik.touched.DisabilityDetails &&
                      Boolean(formik.errors.DisabilityDetails)
                    }
                    helperText={
                      formik.touched.DisabilityDetails &&
                      formik.errors.DisabilityDetails
                    }
                    required
                  />
                </Grid>
              )}

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
                  name="Qualification"
                  value={formik.values.Qualification}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.Qualification &&
                    Boolean(formik.errors.Qualification)
                  }
                  helperText={
                    formik.touched.Qualification && formik.errors.Qualification
                  }
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Experience (Years)"
                  type="number"
                  fullWidth
                  name="ExperienceYear"
                  value={formik.values.ExperienceYear}
                  onChange={(e) => {
                    const value = parseInt(e.target.value, 10);
                    formik.setFieldValue(
                      "ExperienceYear",
                      value >= 0 ? value : 0
                    );
                  }}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.ExperienceYear &&
                    Boolean(formik.errors.ExperienceYear)
                  }
                  helperText={
                    formik.touched.ExperienceYear &&
                    formik.errors.ExperienceYear
                  }
                  inputProps={{ min: 0 }}
                  required
                />
              </Grid>

              {/* School Information Section */}
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  School Information
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="School ID"
                  fullWidth
                  name="SchoolID"
                  value={formik.values.SchoolID}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.SchoolID && Boolean(formik.errors.SchoolID)
                  }
                  helperText={formik.touched.SchoolID && formik.errors.SchoolID}
                  required
                  disabled
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Hire Date"
                  type="date"
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  name="HireDate"
                  value={formik.values.HireDate}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.HireDate && Boolean(formik.errors.HireDate)
                  }
                  helperText={formik.touched.HireDate && formik.errors.HireDate}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth required>
                  <InputLabel>Employee Type</InputLabel>
                  <Select
                    label="Employee Type"
                    name="EmployeeType"
                    value={formik.values.EmployeeType}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={
                      formik.touched.EmployeeType &&
                      Boolean(formik.errors.EmployeeType)
                    }
                  >
                    <MenuItem value="Principal">Principal</MenuItem>
                    <MenuItem value="Head-Teacher">Head-Teacher</MenuItem>
                    <MenuItem value="Teacher">Teacher</MenuItem>
                  </Select>
                  {formik.touched.EmployeeType && formik.errors.EmployeeType && (
                    <Typography variant="caption" color="error" sx={{ ml: 2 }}>
                      {formik.errors.EmployeeType}
                    </Typography>
                  )}
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth required>
                  <InputLabel>Employment Status</InputLabel>
                  <Select
                    label="Employment Status"
                    name="EmployementStatus"
                    value={formik.values.EmployementStatus}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={
                      formik.touched.EmployementStatus &&
                      Boolean(formik.errors.EmployementStatus)
                    }
                  >
                    <MenuItem value="Working">Working</MenuItem>
                    <MenuItem value="Retired">Retired</MenuItem>
                    <MenuItem value="Removed">Removed</MenuItem>
                  </Select>
                  {formik.touched.EmployementStatus &&
                    formik.errors.EmployementStatus && (
                      <Typography variant="caption" color="error" sx={{ ml: 2 }}>
                        {formik.errors.EmployementStatus}
                      </Typography>
                    )}
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth required>
                  <InputLabel>Employment Type</InputLabel>
                  <Select
                    label="Employment Type"
                    name="EmployementType"
                    value={formik.values.EmployementType}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={
                      formik.touched.EmployementType &&
                      Boolean(formik.errors.EmployementType)
                    }
                  >
                    <MenuItem value="Permanent">Permanent</MenuItem>
                    <MenuItem value="Contract">Contract</MenuItem>
                    <MenuItem value="Part-Time">Part-Time</MenuItem>
                  </Select>
                  {formik.touched.EmployementType &&
                    formik.errors.EmployementType && (
                      <Typography variant="caption" color="error" sx={{ ml: 2 }}>
                        {formik.errors.EmployementType}
                      </Typography>
                    )}
                </FormControl>
              </Grid>

              {/* Address Section */}
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  Address
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Address"
                  fullWidth
                  name="Address"
                  value={formik.values.Address}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.Address && Boolean(formik.errors.Address)}
                  helperText={formik.touched.Address && formik.errors.Address}
                  required
                />
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
                  {loading ? <CircularProgress size={24} /> : "Update Teacher"}
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