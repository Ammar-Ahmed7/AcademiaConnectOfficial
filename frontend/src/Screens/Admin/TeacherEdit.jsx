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
// //   const [schoolList, setSchoolList] = useState([]);
// //   const [teacherList, setTeacherList] = useState([]);
// //   const [selectedSchool, setSelectedSchool] = useState("");
// //   const [selectedTeacher, setSelectedTeacher] = useState("");
// //   const [loading, setLoading] = useState(false);
// //   const [alert, setAlert] = useState({
// //     open: false,
// //     message: "",
// //     severity: "",
// //   });

// //   // Validation Schema with unique CNIC validation
// //   const validationSchema = Yup.object().shape({
// //     CNIC: Yup.string()
// //       .matches(/^\d{13}$/, "CNIC must be 13 digits and contain only numbers")
// //       .required("CNIC is required")
// //       .test(
// //         "unique-cnic",
// //         "This CNIC is already registered with another teacher",
// //         async function (value) {
// //           if (!value) return true;
// //           const { TeacherID } = this.parent;
// //           if (!TeacherID) return true;

// //           try {
// //             const { data, error } = await supabase
// //               .from("Teacher")
// //               .select("CNIC")
// //               .eq("CNIC", value)
// //               .neq("TeacherID", TeacherID);

// //             if (error) throw error;
// //             return data.length === 0; // true = valid (no other teacher has this CNIC)
// //           } catch (error) {
// //             console.error("Error checking CNIC:", error);
// //             return this.createError({
// //               message: "Could not validate CNIC",
// //             });
// //           }
// //         }
// //       ),
// //     Name: Yup.string()
// //       .matches(/^[A-Za-z\s]+$/, "Only alphabets and spaces are allowed")
// //       .required("Name is required"),
// //     Email: Yup.string().email("Invalid email").required("Email is required"),
// //     PhoneNumber: Yup.string()
// //       .matches(
// //         /^\d{9,12}$/,
// //         "Phone number must be between 9 and 12 digits and only contain numbers"
// //       )
// //       .required("Phone number is required")
// //       .test(
// //         "unique-phone",
// //         "This Phone Number is already registered with another teacher",
// //         async function (value) {
// //           if (!value) return true;
// //           const { TeacherID } = this.parent;
// //           if (!TeacherID) return true;

// //           try {
// //             const { data, error } = await supabase
// //               .from("Teacher")
// //               .select("PhoneNumber")
// //               .eq("PhoneNumber", value)
// //               .neq("TeacherID", TeacherID);

// //             if (error) throw error;
// //             return data.length === 0; // true = valid (no other teacher has this CNIC)
// //           } catch (error) {
// //             console.error("Error checking Phone Number:", error);
// //             return this.createError({
// //               message: "Could not validate Phone Number",
// //             });
// //           }
// //         }
// //       ),
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

// //         // Refresh teacher list for the current school to reflect any changes
// //         fetchTeachersBySchool();
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

// //   // Fetch school list on component mount
// //   useEffect(() => {
// //     fetchSchoolList();
// //   }, []);

// //   // Fetch teachers when a school is selected
// //   useEffect(() => {
// //     if (selectedSchool) {
// //       fetchTeachersBySchool();
// //       formik.setFieldValue("SchoolID", selectedSchool);
// //     } else {
// //       setTeacherList([]);
// //       setSelectedTeacher("");
// //     }
// //   }, [selectedSchool]);

// //   // Fetch teacher details when a teacher is selected
// //   useEffect(() => {
// //     if (selectedTeacher) {
// //       fetchTeacherData();
// //     }
// //   }, [selectedTeacher]);

// //   const fetchSchoolList = async () => {
// //     try {
// //       const { data, error } = await supabase
// //         .from("School")
// //         .select("SchoolID")
// //         .order("SchoolID", { ascending: true });

// //       if (error) throw error;
// //       setSchoolList(data);
// //     } catch (error) {
// //       console.error("Error fetching school list:", error);
// //       setAlert({
// //         open: true,
// //         message: "Failed to fetch school list",
// //         severity: "error",
// //       });
// //     }
// //   };

// //   const fetchTeachersBySchool = async () => {
// //     try {
// //       const { data, error } = await supabase
// //         .from("Teacher")
// //         .select("TeacherID, Name")
// //         .eq("SchoolID", selectedSchool)
// //         .order("TeacherID", { ascending: true });

// //       if (error) throw error;
// //       setTeacherList(data);
// //     } catch (error) {
// //       console.error("Error fetching teachers:", error);
// //       setAlert({
// //         open: true,
// //         message: "Failed to fetch teachers",
// //         severity: "error",
// //       });
// //     }
// //   };

// //   const fetchTeacherData = async () => {
// //     try {
// //       const { data, error } = await supabase
// //         .from("Teacher")
// //         .select("*")
// //         .eq("TeacherID", selectedTeacher)
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
// //       console.error("Error fetching teacher details:", error);
// //       setAlert({
// //         open: true,
// //         message: "Failed to fetch teacher details",
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
// //         {/* School and Teacher Selection Dropdowns */}
// //         <Grid container spacing={2}>
// //           <Grid item xs={12} sm={6}>
// //             <FormControl fullWidth sx={{ marginBottom: "20px" }}>
// //               <InputLabel>Select School</InputLabel>
// //               <Select
// //                 value={selectedSchool}
// //                 onChange={(e) => {
// //                   setSelectedSchool(e.target.value);
// //                   setSelectedTeacher(""); // Reset teacher selection
// //                 }}
// //                 label="Select School"
// //               >
// //                 {schoolList.map((school) => (
// //                   <MenuItem key={school.SchoolID} value={school.SchoolID}>
// //                     {school.SchoolID}
// //                   </MenuItem>
// //                 ))}
// //               </Select>
// //             </FormControl>
// //           </Grid>

// //           <Grid item xs={12} sm={6}>
// //             <FormControl
// //               fullWidth
// //               sx={{ marginBottom: "20px" }}
// //               disabled={!selectedSchool}
// //             >
// //               <InputLabel>Select Teacher</InputLabel>
// //               <Select
// //                 value={selectedTeacher}
// //                 onChange={(e) => setSelectedTeacher(e.target.value)}
// //                 label="Select Teacher"
// //               >
// //                 {teacherList.map((teacher) => (
// //                   <MenuItem key={teacher.TeacherID} value={teacher.TeacherID}>
// //                     {teacher.TeacherID} - {teacher.Name}
// //                   </MenuItem>
// //                 ))}
// //               </Select>
// //             </FormControl>
// //           </Grid>
// //         </Grid>

// //         {/* Form for editing teacher details */}
// //         {selectedTeacher && (
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
// //                   disabled
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
// //                   disabled
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
// //                     <MenuItem value="Vice Principal">Vice Principal</MenuItem>
// //                     <MenuItem value="Teacher">Teacher</MenuItem>
// //                   </Select>
// //                   {formik.touched.EmployeeType &&
// //                     formik.errors.EmployeeType && (
// //                       <Typography
// //                         variant="caption"
// //                         color="error"
// //                         sx={{ ml: 2 }}
// //                       >
// //                         {formik.errors.EmployeeType}
// //                       </Typography>
// //                     )}
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
// //                       <Typography
// //                         variant="caption"
// //                         color="error"
// //                         sx={{ ml: 2 }}
// //                       >
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
// //                     <MenuItem value="Regular">Regular</MenuItem>
// //                     <MenuItem value="Contract">Contract</MenuItem>
// //                     <MenuItem value="Deputation">Deputation</MenuItem>
// //                   </Select>
// //                   {formik.touched.EmployementType &&
// //                     formik.errors.EmployementType && (
// //                       <Typography
// //                         variant="caption"
// //                         color="error"
// //                         sx={{ ml: 2 }}
// //                       >
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
// //                   error={
// //                     formik.touched.Address && Boolean(formik.errors.Address)
// //                   }
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
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogContentText,
//   DialogActions,
// } from "@mui/material";
// import supabase from "../../../supabase-client";
// import InputMask from "react-input-mask";

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
//   const [openConfirmDialog, setOpenConfirmDialog] = useState(false);

//   // Validation Schema with unique CNIC validation
//   const validationSchema = Yup.object().shape({
//     CNIC: Yup.string()
//       // .matches(/^\d{13}$/, "CNIC must be 13 digits and contain only numbers")
//       .matches(
//         /^\d{5}-\d{7}-\d{1}$/, // Validates XXXXX-XXXXXXX-X format
//         "CNIC must be in format 31102-1234567-9 (13 digits with dashes)"
//       )
//       .required("CNIC is required")
//       .test(
//         "unique-cnic",
//         "This CNIC is already registered with another teacher",
//         async function (value) {
//           if (!value) return true;
//           const { TeacherID, DateOfBirth } = this.parent;
//           if (!TeacherID) return true;

//           try {
//             const { data, error } = await supabase
//               .from("Teacher")
//               .select("CNIC, DateOfBirth")
//               .eq("CNIC", value)
//               .neq("EmployementStatus", "Transferred")

//               .neq("TeacherID", TeacherID);

//             if (error) throw error;

//             // Filter out entries with the same dateOfBirth
//             const trulyDifferent = data.filter(
//               (rec) => rec.DateOfBirth !== DateOfBirth
//             );

//             return trulyDifferent.length === 0;
//           } catch (error) {
//             console.error("Error checking CNIC:", error);
//             return this.createError({
//               message: "Could not validate CNIC",
//             });
//           }
//         }
//       ),
//     //   }
//     // ),

//     // .test(
//     //   "unique-cnic",
//     //   "This CNIC is already registered with another teacher",
//     //   async function (value) {
//     //     if (!value) return true;
//     //     const { TeacherID } = this.parent;
//     //     if (!TeacherID) return true;

//     //     try {
//     //       const { data, error } = await supabase
//     //         .from("Teacher")
//     //         .select("CNIC")
//     //         .eq("CNIC", value)
//     //         .neq("TeacherID", TeacherID);

//     //       if (error) throw error;
//     //       return data.length === 0; // true = valid (no other teacher has this CNIC)
//     //     } catch (error) {
//     //       console.error("Error checking CNIC:", error);
//     //       return this.createError({
//     //         message: "Could not validate CNIC",
//     //       });
//     //     }
//     //   }
//     // ),
//     Name: Yup.string()
//       .matches(/^[A-Za-z\s]+$/, "Only alphabets and spaces are allowed")
//       .required("Name is required"),
//     Email: Yup.string().email("Invalid email").required("Email is required"),
//     PhoneNumber: Yup.string()
//       .matches(
//         /^\d{9,12}$/,
//         "Phone number must be between 9 and 12 digits and only contain numbers"
//       )
//       .required("Phone number is required")
//       .test(
//         "unique-phone",
//         "This Phone Number is already registered with another teacher",
//         async function (value) {
//           if (!value) return true; // empty → skip
//           const { TeacherID, DateOfBirth } = this.parent;
//           if (!TeacherID) return true; // no ID yet → skip

//           try {
//             // fetch any OTHER teachers with this phone number
//             const { data, error } = await supabase
//               .from("Teacher")
//               .select("PhoneNumber, DateOfBirth")
//               .eq("PhoneNumber", value)
//               .neq("EmployementStatus", "Transferred")

//               .neq("TeacherID", TeacherID);

//             if (error) throw error;

//             // filter out any that actually have the same dateOfBirth:
//             const trulyDifferent = data.filter(
//               (rec) => rec.DateOfBirth !== DateOfBirth
//             );

//             // if there's at least one record that has the same phone
//             // but a *different* date → fail
//             return trulyDifferent.length === 0;
//           } catch (error) {
//             console.error("Error checking Phone Number:", error);
//             return this.createError({
//               message: "Could not validate Phone Number",
//             });
//           }
//         }
//       ),

//     // .test(
//     //   "unique-phone",
//     //   "This Phone Number is already registered with another teacher",
//     //   async function (value) {
//     //     if (!value) return true;
//     //     const { TeacherID } = this.parent;
//     //     if (!TeacherID) return true;

//     //     try {
//     //       const { data, error } = await supabase
//     //         .from("Teacher")
//     //         .select("PhoneNumber")
//     //         .eq("PhoneNumber", value)
//     //         .neq("TeacherID", TeacherID);

//     //       if (error) throw error;
//     //       return data.length === 0; // true = valid (no other teacher has this CNIC)
//     //     } catch (error) {
//     //       console.error("Error checking Phone Number:", error);
//     //       return this.createError({
//     //         message: "Could not validate Phone Number",
//     //       });
//     //     }
//     //   }
//     // ),
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
//               .neq("TeacherID", TeacherID)
//               .neq("EmployementStatus", "Transferred")
//               ;

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
//     FatherName: Yup.string()
//       .matches(/^[A-Za-z\s]+$/, "Only alphabets and spaces are allowed")
//       .required("FatherName is required"),
//     Domicile: Yup.string().required("Domicile is required"),
//     BPS: Yup.string().required("BPS is required"),
//     // TeacherSubject: Yup.string().required("Teacher subject is required"),
//     // Post: Yup.string().required("Post is required"),

//     TeacherSubject: Yup.string().when(
//       "EmployeeType",
//       (EmployeeType, schema) => {
//         const type = Array.isArray(EmployeeType)
//           ? EmployeeType[0]
//           : EmployeeType;

//         return typeof type === "string" &&
//           type.trim().toLowerCase() === "teacher"
//           ? schema.required("Teacher subject is required")
//           : schema;
//       }
//     ),
//     Post: Yup.string().when("EmployeeType", (EmployeeType, schema) => {
//       const type = Array.isArray(EmployeeType) ? EmployeeType[0] : EmployeeType;

//       return typeof type === "string" && type.trim().toLowerCase() === "teacher"
//         ? schema.required("Post is required")
//         : schema;
//     }),
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
//       FatherName: "",
//       Domicile: "",
//       BPS: "",
//       TeacherSubject: "",
//       Post: "",
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
//             FatherName: values.FatherName,
//             Domicile: values.Domicile,
//             BPS: values.BPS,
//             TeacherSubject: values.TeacherSubject,
//             Post: values.Post,
//           })
//           .eq("TeacherID", values.TeacherID);

//         if (error) throw error;

//         setAlert({
//           open: true,
//           message: "Teacher updated successfully!",
//           severity: "success",
//         });

//         setSelectedSchool("");
//         setSelectedTeacher("");

//         // Refresh teacher list for the current school to reflect any changes
//         fetchTeachersBySchool();
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
//         .neq("EmployementStatus", "Transferred")
//         .order("TeacherID", { ascending: true });

//       if (error) throw error;
//       if (data.length === 0) {
//         setAlert({
//           open: true,
//           message: "No teacher found in that school!",
//           severity: "success",
//         });
//       }
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
//         FatherName: data.FatherName || "",
//         Domicile: data.Domicile || "",
//         BPS: data.BPS || "",
//         TeacherSubject: data.TeacherSubject || "",
//         Post: data.Post || "",
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

//   useEffect(() => {
//     if (formik.values.EmployeeType === "Principal") {
//       formik.setFieldValue("BPS", "Grade 18");
//     } else if (formik.values.EmployeeType === "Vice Principal") {
//       formik.setFieldValue("BPS", "Grade 17");
//     } else if (formik.values.EmployeeType === "Teacher") {
//       switch (formik.values.Post) {
//         case "Subject Specialist":
//         case "Acting Principal":
//           formik.setFieldValue("BPS", "Grade 17");
//           break;
//         case "S.S.T":
//         case "S.S.E":
//         case "S.S.T(I.T)":
//           formik.setFieldValue("BPS", "Grade 16");
//           break;
//         case "Arabic Teacher":
//         case "E.S.T":
//         case "E.S.E":
//         case "P.T.I":
//           formik.setFieldValue("BPS", "Grade 14");
//           break;
//         default:
//           formik.setFieldValue("BPS", "");
//       }
//     }
//   }, [formik.values.EmployeeType, formik.values.Post]);
  
//   const handleSubmitClick = () => {
//     console.log("Validating form...");
//     formik.validateForm().then((errors) => {
//       console.log("Validating form...", errors);

//       if (Object.keys(errors).length === 0) {
//         setOpenConfirmDialog(true); // Open dialog if no errors
//       }
//     });
//   };
//   const handleConfirmSubmit = () => {
//     setOpenConfirmDialog(false);
//     formik.handleSubmit(); // Proceed with submission
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
//                 {/* <TextField
//                   label="CNIC"
//                   fullWidth
//                   name="CNIC"
//                   value={formik.values.CNIC}
//                   onChange={formik.handleChange}
//                   onBlur={formik.handleBlur}
//                   error={formik.touched.CNIC && Boolean(formik.errors.CNIC)}
//                   helperText={formik.touched.CNIC && formik.errors.CNIC}
//                   required
//                 /> */}

//                 <InputMask
//                   mask="99999-9999999-9" // Forces XXXXX-XXXXXXX-X format
//                   value={formik.values.CNIC}
//                   onChange={(e) => {
//                     formik.setFieldValue("CNIC", e.target.value); // Stores with dashes
//                   }}
//                   onBlur={formik.handleBlur}
//                 >
//                   {(inputProps) => (
//                     <TextField
//                       {...inputProps}
//                       label="CNIC"
//                       fullWidth
//                       name="CNIC"
//                       error={formik.touched.CNIC && Boolean(formik.errors.CNIC)}
//                       helperText={formik.touched.CNIC && formik.errors.CNIC}
//                       required
//                       placeholder="31102-1234567-9"
//                     />
//                   )}
//                 </InputMask>
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
//                   label="Father Name"
//                   fullWidth
//                   name="FatherName"
//                   value={formik.values.FatherName}
//                   onChange={formik.handleChange}
//                   onBlur={formik.handleBlur}
//                   error={
//                     formik.touched.FatherName &&
//                     Boolean(formik.errors.FatherName)
//                   }
//                   helperText={
//                     formik.touched.FatherName && formik.errors.FatherName
//                   }
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
//                   disabled
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
//                   inputProps={{
//                     max: new Date().toISOString().split("T")[0], // Sets max date to today
//                   }}
//                   required
//                 />
//               </Grid>
//               <Grid item xs={12} sm={6}>
//                 <FormControl fullWidth required>
//                   <InputLabel>Domicile</InputLabel>
//                   <Select
//                     label="Domicile"
//                     name="Domicile"
//                     value={formik.values.Domicile}
//                     onChange={formik.handleChange}
//                     onBlur={formik.handleBlur}
//                     error={
//                       formik.touched.Domicile && Boolean(formik.errors.Domicile)
//                     }
//                   >
//                     <MenuItem value="Attock">Attock</MenuItem>
//                     <MenuItem value="Bahawalnagar">Bahawalnagar</MenuItem>
//                     <MenuItem value="Bahawalpur">Bahawalpur</MenuItem>
//                     <MenuItem value="Bhakkar">Bhakkar</MenuItem>
//                     <MenuItem value="Chakwal">Chakwal</MenuItem>
//                     <MenuItem value="Chiniot">Chiniot</MenuItem>
//                     <MenuItem value="Dera Ghazi Khan">Dera Ghazi Khan</MenuItem>
//                     <MenuItem value="Faisalabad">Faisalabad</MenuItem>
//                     <MenuItem value="Gujranwala">Gujranwala</MenuItem>
//                     <MenuItem value="Gujrat">Gujrat</MenuItem>
//                     <MenuItem value="Hafizabad">Hafizabad</MenuItem>
//                     <MenuItem value="Jhang">Jhang</MenuItem>
//                     <MenuItem value="Jhelum">Jhelum</MenuItem>
//                     <MenuItem value="Kasur">Kasur</MenuItem>
//                     <MenuItem value="Khanewal">Khanewal</MenuItem>
//                     <MenuItem value="Khushab">Khushab</MenuItem>
//                     <MenuItem value="Lahore">Lahore</MenuItem>
//                     <MenuItem value="Layyah">Layyah</MenuItem>
//                     <MenuItem value="Lodhran">Lodhran</MenuItem>
//                     <MenuItem value="Mandi Bahauddin">Mandi Bahauddin</MenuItem>
//                     <MenuItem value="Mianwali">Mianwali</MenuItem>
//                     <MenuItem value="Multan">Multan</MenuItem>
//                     <MenuItem value="Muzaffargarh">Muzaffargarh</MenuItem>
//                     <MenuItem value="Narowal">Narowal</MenuItem>
//                     <MenuItem value="Nankana Sahib">Nankana Sahib</MenuItem>
//                     <MenuItem value="Okara">Okara</MenuItem>
//                     <MenuItem value="Pakpattan">Pakpattan</MenuItem>
//                     <MenuItem value="Rahim Yar Khan">Rahim Yar Khan</MenuItem>
//                     <MenuItem value="Rajanpur">Rajanpur</MenuItem>
//                     <MenuItem value="Rawalpindi">Rawalpindi</MenuItem>
//                     <MenuItem value="Sahiwal">Sahiwal</MenuItem>
//                     <MenuItem value="Sargodha">Sargodha</MenuItem>
//                     <MenuItem value="Sheikhupura">Sheikhupura</MenuItem>
//                     <MenuItem value="Sialkot">Sialkot</MenuItem>
//                     <MenuItem value="Toba Tek Singh">Toba Tek Singh</MenuItem>
//                     <MenuItem value="Vehari">Vehari</MenuItem>
//                   </Select>
//                 </FormControl>
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
//                     <MenuItem value="Vice Principal">Vice Principal</MenuItem>
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
//                     <MenuItem value="Regular">Regular</MenuItem>
//                     <MenuItem value="Contract">Contract</MenuItem>
//                     <MenuItem value="Deputation">Deputation</MenuItem>
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
//               {formik.values.EmployeeType === "Teacher" && (
//                 <Grid item xs={12} sm={6}>
//                   <FormControl fullWidth required>
//                     <InputLabel>Post</InputLabel>
//                     <Select
//                       label="Post"
//                       name="Post"
//                       value={formik.values.Post}
//                       onChange={formik.handleChange}
//                       onBlur={formik.handleBlur}
//                       error={formik.touched.Post && Boolean(formik.errors.Post)}
//                       required={formik.values.EmployeeType === "Teacher"}
//                     >
//                       <MenuItem value="Subject Specialist">
//                         Subject Specialist
//                       </MenuItem>
//                       <MenuItem value="S.S.T">S.S.T</MenuItem>
//                       <MenuItem value="S.S.E">S.S.E</MenuItem>
//                       <MenuItem value="Acting Principal">
//                         Acting Principal
//                       </MenuItem>
//                       <MenuItem value="S.S.T(I.T)">S.S.T(I.T)</MenuItem>
//                       <MenuItem value="Arabic Teacher">Arabic Teacher</MenuItem>
//                       <MenuItem value="E.S.T">E.S.T</MenuItem>
//                       <MenuItem value="E.S.E">E.S.E</MenuItem>
//                       <MenuItem value="P.T.I">P.T.I</MenuItem>
//                     </Select>
//                   </FormControl>
//                 </Grid>
//               )}

//               {formik.values.EmployeeType === "Teacher" && (
//                 <Grid item xs={12} sm={6}>
//                   <TextField
//                     label="Teacher Subject"
//                     fullWidth
//                     name="TeacherSubject"
//                     value={formik.values.TeacherSubject}
//                     onChange={formik.handleChange}
//                     onBlur={formik.handleBlur}
//                     error={
//                       formik.touched.TeacherSubject &&
//                       Boolean(formik.errors.TeacherSubject)
//                     }
//                     helperText={
//                       formik.touched.TeacherSubject &&
//                       formik.errors.TeacherSubject
//                     }
//                     required={formik.values.EmployeeType === "Teacher"}
//                   />
//                 </Grid>
//               )}
//               <Grid item xs={12} sm={6}>
//                 <TextField
//                   label="BPS"
//                   fullWidth
//                   name="BPS"
//                   value={formik.values.BPS}
//                   onChange={formik.handleChange}
//                   onBlur={formik.handleBlur}
//                   error={formik.touched.BPS && Boolean(formik.errors.BPS)}
//                   helperText={formik.touched.BPS && formik.errors.BPS}
//                   required
//                   disabled // Make it disabled since it's auto-calculated
//                 />
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
//                 {/* <Button
//                   type="submit"
//                   variant="contained"
//                   color="primary"
//                   fullWidth
//                   disabled={loading}
//                 >
//                   {loading ? <CircularProgress size={24} /> : "Update Teacher"}
//                 </Button> */}

//                  <Button
//                                 onClick={handleSubmitClick} // Not formik.handleSubmit
//                                 variant="contained"
//                                 color="primary"
//                                 fullWidth
//                                 disabled={loading}
//                               >
//                                 {loading ? "Updating..." : "Update Teacher"}
//                               </Button>
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

//       <Dialog
//         open={openConfirmDialog}
//         onClose={() => setOpenConfirmDialog(false)}
//       >
//         <DialogTitle>Confirm Teacher Updation</DialogTitle>
//         <DialogContent>
//           <DialogContentText>
//             Are you sure you want to update details of this teacher?
//             <br />
//             <br />
//             <strong>Name:</strong> {formik.values.Name}
//             <br />
//             <strong>CNIC:</strong> {formik.values.CNIC}
//             <br />
//             <br/>
//             It cannot be undone.
//           </DialogContentText>
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={() => setOpenConfirmDialog(false)} color="primary">
//             Cancel
//           </Button>
//           <Button
//             onClick={handleConfirmSubmit}
//             color="primary"
//             variant="contained"
//           >
//             Confirm
//           </Button>
//         </DialogActions>
//       </Dialog>
//     </Box>
//   );
// };

// export default EditTeacher;



"use client"

import { useState, useEffect } from "react"
import { useFormik } from "formik"
import * as Yup from "yup"
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  useTheme,
  useMediaQuery,
  Card,
  CardContent,
  Divider,
} from "@mui/material"
import supabase from "../../../supabase-client"
import InputMask from "react-input-mask"

const EditTeacher = () => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))
  const isTablet = useMediaQuery(theme.breakpoints.down("md"))

  const [schoolList, setSchoolList] = useState([])
  const [teacherList, setTeacherList] = useState([])
  const [selectedSchool, setSelectedSchool] = useState("")
  const [selectedTeacher, setSelectedTeacher] = useState("")
  const [loading, setLoading] = useState(false)
  const [alert, setAlert] = useState({
    open: false,
    message: "",
    severity: "",
  })
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false)

  // Validation Schema with unique CNIC validation
  const validationSchema = Yup.object().shape({
    CNIC: Yup.string()
      .matches(
        /^\d{5}-\d{7}-\d{1}$/, // Validates XXXXX-XXXXXXX-X format
        "CNIC must be in format 31102-1234567-9 (13 digits with dashes)",
      )
      .required("CNIC is required")
      .test("unique-cnic", "This CNIC is already registered with another teacher", async function (value) {
        if (!value) return true
        const { TeacherID, DateOfBirth } = this.parent
        if (!TeacherID) return true
        try {
          const { data, error } = await supabase
            .from("Teacher")
            .select("CNIC, DateOfBirth")
            .eq("CNIC", value)
            .neq("EmployementStatus", "Transferred")
            .neq("TeacherID", TeacherID)
          if (error) throw error
          // Filter out entries with the same dateOfBirth
          const trulyDifferent = data.filter((rec) => rec.DateOfBirth !== DateOfBirth)
          return trulyDifferent.length === 0
        } catch (error) {
          console.error("Error checking CNIC:", error)
          return this.createError({
            message: "Could not validate CNIC",
          })
        }
      }),
    Name: Yup.string()
      .matches(/^[A-Za-z\s]+$/, "Only alphabets and spaces are allowed")
      .required("Name is required"),
    Email: Yup.string().email("Invalid email").required("Email is required"),
    PhoneNumber: Yup.string()
      .matches(/^\d{9,12}$/, "Phone number must be between 9 and 12 digits and only contain numbers")
      .required("Phone number is required")
      .test("unique-phone", "This Phone Number is already registered with another teacher", async function (value) {
        if (!value) return true // empty → skip
        const { TeacherID, DateOfBirth } = this.parent
        if (!TeacherID) return true // no ID yet → skip
        try {
          // fetch any OTHER teachers with this phone number
          const { data, error } = await supabase
            .from("Teacher")
            .select("PhoneNumber, DateOfBirth")
            .eq("PhoneNumber", value)
            .neq("EmployementStatus", "Transferred")
            .neq("TeacherID", TeacherID)
          if (error) throw error
          // filter out any that actually have the same dateOfBirth:
          const trulyDifferent = data.filter((rec) => rec.DateOfBirth !== DateOfBirth)
          // if there's at least one record that has the same phone
          // but a *different* date → fail
          return trulyDifferent.length === 0
        } catch (error) {
          console.error("Error checking Phone Number:", error)
          return this.createError({
            message: "Could not validate Phone Number",
          })
        }
      }),
    Gender: Yup.string().required("Gender is required"),
    DateOfBirth: Yup.string().required("Date of birth is required"),
    Disability: Yup.string().required("Disability status is required"),
    DisabilityDetails: Yup.string().when("Disability", {
      is: "Yes",
      then: Yup.string().required("Disability details are required"),
    }),
    Qualification: Yup.string()
      .matches(/^[A-Za-z\s]+$/, "Qualification should contain only alphabets and spaces")
      .required("Qualification is required"),
    ExperienceYear: Yup.number()
      .min(0, "Experience cannot be negative")
      .required("Experience is required")
      .test("experience-less-than-age", "Experience cannot be greater than age", function (value) {
        const { DateOfBirth } = this.parent
        const age = calculateAge(DateOfBirth)
        return value <= age
      }),
    HireDate: Yup.string()
      .required("Hire date is required")
      .test("hireDate-after-dob", "Hire date must be after date of birth", function (value) {
        const { DateOfBirth } = this.parent
        return new Date(value) > new Date(DateOfBirth)
      }),
    SchoolID: Yup.string().required("School is required"),
    EmployeeType: Yup.string()
      .required("Employee type is required")
      .test("unique-principal", "This school already has a principal", async function (value) {
        if (value !== "Principal") return true
        const { SchoolID, TeacherID } = this.parent
        if (!SchoolID) return true
        try {
          const { data, error } = await supabase
            .from("Teacher")
            .select("*")
            .eq("SchoolID", SchoolID)
            .eq("EmployeeType", "Principal")
            .neq("TeacherID", TeacherID)
            .neq("EmployementStatus", "Transferred")
          if (error) throw error
          return data.length === 0
        } catch (error) {
          console.error("Error checking existing principal:", error)
          return this.createError({
            message: "Could not validate principal status",
          })
        }
      }),
    EmployementStatus: Yup.string().required("Employment status is required"),
    EmployementType: Yup.string().required("Employment type is required"),
    Address: Yup.string().required("Address is required"),
    FatherName: Yup.string()
      .matches(/^[A-Za-z\s]+$/, "Only alphabets and spaces are allowed")
      .required("FatherName is required"),
    Domicile: Yup.string().required("Domicile is required"),
    BPS: Yup.string().required("BPS is required"),
    TeacherSubject: Yup.string().when("EmployeeType", (EmployeeType, schema) => {
      const type = Array.isArray(EmployeeType) ? EmployeeType[0] : EmployeeType
      return typeof type === "string" && type.trim().toLowerCase() === "teacher"
        ? schema.required("Teacher subject is required")
        : schema
    }),
    Post: Yup.string().when("EmployeeType", (EmployeeType, schema) => {
      const type = Array.isArray(EmployeeType) ? EmployeeType[0] : EmployeeType
      return typeof type === "string" && type.trim().toLowerCase() === "teacher"
        ? schema.required("Post is required")
        : schema
    }),
  })

  const calculateAge = (dob) => {
    const birthDate = new Date(dob)
    const today = new Date()
    let age = today.getFullYear() - birthDate.getFullYear()
    const m = today.getMonth() - birthDate.getMonth()
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--
    }
    return age
  }

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
      FatherName: "",
      Domicile: "",
      BPS: "",
      TeacherSubject: "",
      Post: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      setLoading(true)
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
            FatherName: values.FatherName,
            Domicile: values.Domicile,
            BPS: values.BPS,
            TeacherSubject: values.TeacherSubject,
            Post: values.Post,
          })
          .eq("TeacherID", values.TeacherID)
        if (error) throw error
        setAlert({
          open: true,
          message: "Teacher updated successfully!",
          severity: "success",
        })
        setSelectedSchool("")
        setSelectedTeacher("")
        // Refresh teacher list for the current school to reflect any changes
        fetchTeachersBySchool()
      } catch (error) {
        console.error("Error updating Teacher:", error.message)
        setAlert({
          open: true,
          message: "Failed to update Teacher. Try again!",
          severity: "error",
        })
      } finally {
        setLoading(false)
      }
    },
  })

  // Fetch school list on component mount
  useEffect(() => {
    fetchSchoolList()
  }, [])

  // Fetch teachers when a school is selected
  useEffect(() => {
    if (selectedSchool) {
      fetchTeachersBySchool()
      formik.setFieldValue("SchoolID", selectedSchool)
    } else {
      setTeacherList([])
      setSelectedTeacher("")
    }
  }, [selectedSchool])

  // Fetch teacher details when a teacher is selected
  useEffect(() => {
    if (selectedTeacher) {
      fetchTeacherData()
    }
  }, [selectedTeacher])

  const fetchSchoolList = async () => {
    try {
      const { data, error } = await supabase.from("School").select("SchoolID").order("SchoolID", { ascending: true })
      if (error) throw error
      setSchoolList(data)
    } catch (error) {
      console.error("Error fetching school list:", error)
      setAlert({
        open: true,
        message: "Failed to fetch school list",
        severity: "error",
      })
    }
  }

  const fetchTeachersBySchool = async () => {
    try {
      const { data, error } = await supabase
        .from("Teacher")
        .select("TeacherID, Name")
        .eq("SchoolID", selectedSchool)
        .neq("EmployementStatus", "Transferred")
        .order("TeacherID", { ascending: true })
      if (error) throw error
      if (data.length === 0) {
        setAlert({
          open: true,
          message: "No teacher found in that school!",
          severity: "success",
        })
      }
      setTeacherList(data)
    } catch (error) {
      console.error("Error fetching teachers:", error)
      setAlert({
        open: true,
        message: "Failed to fetch teachers",
        severity: "error",
      })
    }
  }

  const fetchTeacherData = async () => {
    try {
      const { data, error } = await supabase.from("Teacher").select("*").eq("TeacherID", selectedTeacher).single()
      if (error) throw error
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
        FatherName: data.FatherName || "",
        Domicile: data.Domicile || "",
        BPS: data.BPS || "",
        TeacherSubject: data.TeacherSubject || "",
        Post: data.Post || "",
      }
      formik.setValues(processedData)
    } catch (error) {
      console.error("Error fetching teacher details:", error)
      setAlert({
        open: true,
        message: "Failed to fetch teacher details",
        severity: "error",
      })
    }
  }

  useEffect(() => {
    if (formik.values.EmployeeType === "Principal") {
      formik.setFieldValue("BPS", "Grade 18")
    } else if (formik.values.EmployeeType === "Vice Principal") {
      formik.setFieldValue("BPS", "Grade 17")
    } else if (formik.values.EmployeeType === "Teacher") {
      switch (formik.values.Post) {
        case "Subject Specialist":
        case "Acting Principal":
          formik.setFieldValue("BPS", "Grade 17")
          break
        case "S.S.T":
        case "S.S.E":
        case "S.S.T(I.T)":
          formik.setFieldValue("BPS", "Grade 16")
          break
        case "Arabic Teacher":
        case "E.S.T":
        case "E.S.E":
        case "P.T.I":
          formik.setFieldValue("BPS", "Grade 14")
          break
        default:
          formik.setFieldValue("BPS", "")
      }
    }
  }, [formik.values.EmployeeType, formik.values.Post])

  const handleSubmitClick = () => {
    console.log("Validating form...")
    formik.validateForm().then((errors) => {
      console.log("Validating form...", errors)
      if (Object.keys(errors).length === 0) {
        setOpenConfirmDialog(true) // Open dialog if no errors
      }
    })
  }

  const handleConfirmSubmit = () => {
    setOpenConfirmDialog(false)
    formik.handleSubmit() // Proceed with submission
  }

  const handleCloseAlert = () => setAlert({ ...alert, open: false })

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="flex-start"
      bgcolor="#f5f5f5"
      p={isMobile ? 1 : isTablet ? 2 : 4}
      minHeight="100vh"
    >
      <Card
        sx={{
          width: "100%",
          maxWidth: isMobile ? "100%" : 800,
          padding: isMobile ? 1 : isTablet ? 2 : 3,
          boxShadow: 6,
          borderRadius: 2,
          margin: isMobile ? 0 : "auto",
        }}
      >
        <CardContent sx={{ padding: isMobile ? 1 : 2 }}>
          <Typography
            variant={isMobile ? "h5" : "h4"}
            align="center"
            gutterBottom
            sx={{
              fontWeight: "bold",
              color: "#3f51b5",
              mb: isMobile ? 2 : 3,
              fontSize: isMobile ? "1.5rem" : "2.125rem",
            }}
          >
            Edit Teacher Details
          </Typography>

          <Paper
            sx={{
              padding: isMobile ? 2 : 3,
              borderRadius: 2,
              backgroundColor: "#fff",
            }}
            elevation={3}
          >
            {/* School and Teacher Selection Dropdowns */}
            <Grid container spacing={isMobile ? 1.5 : 2}>
              <Grid item xs={12}>
                <Typography
                  variant={isMobile ? "subtitle1" : "h6"}
                  gutterBottom
                  sx={{
                    fontSize: isMobile ? "1rem" : "1.25rem",
                    fontWeight: "medium",
                    color: "#3f51b5",
                    mb: isMobile ? 1 : 2,
                  }}
                >
                  Teacher Selection
                </Typography>
                <Divider sx={{ mb: isMobile ? 1 : 2 }} />
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl
                  fullWidth
                  sx={{ marginBottom: isMobile ? "16px" : "20px" }}
                  size={isMobile ? "small" : "medium"}
                >
                  <InputLabel
                    sx={{
                      fontSize: isMobile ? "0.875rem" : "1rem",
                    }}
                  >
                    Select School
                  </InputLabel>
                  <Select
                    value={selectedSchool}
                    onChange={(e) => {
                      setSelectedSchool(e.target.value)
                      setSelectedTeacher("") // Reset teacher selection
                    }}
                    label="Select School"
                    sx={{
                      "& .MuiSelect-select": {
                        fontSize: isMobile ? "0.875rem" : "1rem",
                      },
                    }}
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
                  sx={{ marginBottom: isMobile ? "16px" : "20px" }}
                  disabled={!selectedSchool}
                  size={isMobile ? "small" : "medium"}
                >
                  <InputLabel
                    sx={{
                      fontSize: isMobile ? "0.875rem" : "1rem",
                    }}
                  >
                    Select Teacher
                  </InputLabel>
                  <Select
                    value={selectedTeacher}
                    onChange={(e) => setSelectedTeacher(e.target.value)}
                    label="Select Teacher"
                    sx={{
                      "& .MuiSelect-select": {
                        fontSize: isMobile ? "0.875rem" : "1rem",
                      },
                    }}
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
                <Grid container spacing={isMobile ? 1.5 : 2}>
                  {/* Personal Information Section */}
                  <Grid item xs={12}>
                    <Typography
                      variant={isMobile ? "subtitle1" : "h6"}
                      gutterBottom
                      sx={{
                        fontSize: isMobile ? "1rem" : "1.25rem",
                        fontWeight: "medium",
                        color: "#3f51b5",
                        mb: isMobile ? 1 : 2,
                        mt: isMobile ? 2 : 3,
                      }}
                    >
                      Personal Information
                    </Typography>
                    <Divider sx={{ mb: isMobile ? 1 : 2 }} />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <InputMask
                      mask="99999-9999999-9" // Forces XXXXX-XXXXXXX-X format
                      value={formik.values.CNIC}
                      onChange={(e) => {
                        formik.setFieldValue("CNIC", e.target.value) // Stores with dashes
                      }}
                      onBlur={formik.handleBlur}
                    >
                      {(inputProps) => (
                        <TextField
                          {...inputProps}
                          label="CNIC"
                          fullWidth
                          name="CNIC"
                          error={formik.touched.CNIC && Boolean(formik.errors.CNIC)}
                          helperText={formik.touched.CNIC && formik.errors.CNIC}
                          required
                          placeholder="31102-1234567-9"
                          size={isMobile ? "small" : "medium"}
                          sx={{
                            "& .MuiInputBase-root": {
                              fontSize: isMobile ? "0.875rem" : "1rem",
                            },
                            "& .MuiInputLabel-root": {
                              fontSize: isMobile ? "0.875rem" : "1rem",
                            },
                            "& .MuiFormHelperText-root": {
                              fontSize: isMobile ? "0.75rem" : "0.875rem",
                            },
                          }}
                        />
                      )}
                    </InputMask>
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
                      size={isMobile ? "small" : "medium"}
                      sx={{
                        "& .MuiInputBase-root": {
                          fontSize: isMobile ? "0.875rem" : "1rem",
                        },
                        "& .MuiInputLabel-root": {
                          fontSize: isMobile ? "0.875rem" : "1rem",
                        },
                        "& .MuiFormHelperText-root": {
                          fontSize: isMobile ? "0.75rem" : "0.875rem",
                        },
                      }}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Father Name"
                      fullWidth
                      name="FatherName"
                      value={formik.values.FatherName}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={formik.touched.FatherName && Boolean(formik.errors.FatherName)}
                      helperText={formik.touched.FatherName && formik.errors.FatherName}
                      required
                      size={isMobile ? "small" : "medium"}
                      sx={{
                        "& .MuiInputBase-root": {
                          fontSize: isMobile ? "0.875rem" : "1rem",
                        },
                        "& .MuiInputLabel-root": {
                          fontSize: isMobile ? "0.875rem" : "1rem",
                        },
                        "& .MuiFormHelperText-root": {
                          fontSize: isMobile ? "0.75rem" : "0.875rem",
                        },
                      }}
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
                      size={isMobile ? "small" : "medium"}
                      sx={{
                        "& .MuiInputBase-root": {
                          fontSize: isMobile ? "0.875rem" : "1rem",
                        },
                        "& .MuiInputLabel-root": {
                          fontSize: isMobile ? "0.875rem" : "1rem",
                        },
                        "& .MuiFormHelperText-root": {
                          fontSize: isMobile ? "0.75rem" : "0.875rem",
                        },
                      }}
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
                      error={formik.touched.PhoneNumber && Boolean(formik.errors.PhoneNumber)}
                      helperText={formik.touched.PhoneNumber && formik.errors.PhoneNumber}
                      required
                      size={isMobile ? "small" : "medium"}
                      sx={{
                        "& .MuiInputBase-root": {
                          fontSize: isMobile ? "0.875rem" : "1rem",
                        },
                        "& .MuiInputLabel-root": {
                          fontSize: isMobile ? "0.875rem" : "1rem",
                        },
                        "& .MuiFormHelperText-root": {
                          fontSize: isMobile ? "0.75rem" : "0.875rem",
                        },
                      }}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <FormControl
                      fullWidth
                      required
                      size={isMobile ? "small" : "medium"}
                      sx={{
                        "& .MuiInputBase-root": {
                          fontSize: isMobile ? "0.875rem" : "1rem",
                        },
                        "& .MuiInputLabel-root": {
                          fontSize: isMobile ? "0.875rem" : "1rem",
                        },
                      }}
                    >
                      <InputLabel>Gender</InputLabel>
                      <Select
                        label="Gender"
                        name="Gender"
                        value={formik.values.Gender}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.Gender && Boolean(formik.errors.Gender)}
                      >
                        <MenuItem value="Male">Male</MenuItem>
                        <MenuItem value="Female">Female</MenuItem>
                      </Select>
                      {formik.touched.Gender && formik.errors.Gender && (
                        <Typography
                          variant="caption"
                          color="error"
                          sx={{
                            ml: 2,
                            fontSize: isMobile ? "0.7rem" : "0.75rem",
                          }}
                        >
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
                      error={formik.touched.DateOfBirth && Boolean(formik.errors.DateOfBirth)}
                      helperText={formik.touched.DateOfBirth && formik.errors.DateOfBirth}
                      inputProps={{
                        max: new Date().toISOString().split("T")[0], // Sets max date to today
                      }}
                      required
                      size={isMobile ? "small" : "medium"}
                      sx={{
                        "& .MuiInputBase-root": {
                          fontSize: isMobile ? "0.875rem" : "1rem",
                        },
                        "& .MuiInputLabel-root": {
                          fontSize: isMobile ? "0.875rem" : "1rem",
                        },
                        "& .MuiFormHelperText-root": {
                          fontSize: isMobile ? "0.75rem" : "0.875rem",
                        },
                      }}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <FormControl
                      fullWidth
                      required
                      size={isMobile ? "small" : "medium"}
                      sx={{
                        "& .MuiInputBase-root": {
                          fontSize: isMobile ? "0.875rem" : "1rem",
                        },
                        "& .MuiInputLabel-root": {
                          fontSize: isMobile ? "0.875rem" : "1rem",
                        },
                      }}
                    >
                      <InputLabel>Domicile</InputLabel>
                      <Select
                        label="Domicile"
                        name="Domicile"
                        value={formik.values.Domicile}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.Domicile && Boolean(formik.errors.Domicile)}
                      >
                        <MenuItem value="Attock">Attock</MenuItem>
                        <MenuItem value="Bahawalnagar">Bahawalnagar</MenuItem>
                        <MenuItem value="Bahawalpur">Bahawalpur</MenuItem>
                        <MenuItem value="Bhakkar">Bhakkar</MenuItem>
                        <MenuItem value="Chakwal">Chakwal</MenuItem>
                        <MenuItem value="Chiniot">Chiniot</MenuItem>
                        <MenuItem value="Dera Ghazi Khan">Dera Ghazi Khan</MenuItem>
                        <MenuItem value="Faisalabad">Faisalabad</MenuItem>
                        <MenuItem value="Gujranwala">Gujranwala</MenuItem>
                        <MenuItem value="Gujrat">Gujrat</MenuItem>
                        <MenuItem value="Hafizabad">Hafizabad</MenuItem>
                        <MenuItem value="Jhang">Jhang</MenuItem>
                        <MenuItem value="Jhelum">Jhelum</MenuItem>
                        <MenuItem value="Kasur">Kasur</MenuItem>
                        <MenuItem value="Khanewal">Khanewal</MenuItem>
                        <MenuItem value="Khushab">Khushab</MenuItem>
                        <MenuItem value="Lahore">Lahore</MenuItem>
                        <MenuItem value="Layyah">Layyah</MenuItem>
                        <MenuItem value="Lodhran">Lodhran</MenuItem>
                        <MenuItem value="Mandi Bahauddin">Mandi Bahauddin</MenuItem>
                        <MenuItem value="Mianwali">Mianwali</MenuItem>
                        <MenuItem value="Multan">Multan</MenuItem>
                        <MenuItem value="Muzaffargarh">Muzaffargarh</MenuItem>
                        <MenuItem value="Narowal">Narowal</MenuItem>
                        <MenuItem value="Nankana Sahib">Nankana Sahib</MenuItem>
                        <MenuItem value="Okara">Okara</MenuItem>
                        <MenuItem value="Pakpattan">Pakpattan</MenuItem>
                        <MenuItem value="Rahim Yar Khan">Rahim Yar Khan</MenuItem>
                        <MenuItem value="Rajanpur">Rajanpur</MenuItem>
                        <MenuItem value="Rawalpindi">Rawalpindi</MenuItem>
                        <MenuItem value="Sahiwal">Sahiwal</MenuItem>
                        <MenuItem value="Sargodha">Sargodha</MenuItem>
                        <MenuItem value="Sheikhupura">Sheikhupura</MenuItem>
                        <MenuItem value="Sialkot">Sialkot</MenuItem>
                        <MenuItem value="Toba Tek Singh">Toba Tek Singh</MenuItem>
                        <MenuItem value="Vehari">Vehari</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <FormControl
                      fullWidth
                      required
                      size={isMobile ? "small" : "medium"}
                      sx={{
                        "& .MuiInputBase-root": {
                          fontSize: isMobile ? "0.875rem" : "1rem",
                        },
                        "& .MuiInputLabel-root": {
                          fontSize: isMobile ? "0.875rem" : "1rem",
                        },
                      }}
                    >
                      <InputLabel>Disability</InputLabel>
                      <Select
                        label="Disability"
                        name="Disability"
                        value={formik.values.Disability}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.Disability && Boolean(formik.errors.Disability)}
                      >
                        <MenuItem value="Yes">Yes</MenuItem>
                        <MenuItem value="No">No</MenuItem>
                      </Select>
                      {formik.touched.Disability && formik.errors.Disability && (
                        <Typography
                          variant="caption"
                          color="error"
                          sx={{
                            ml: 2,
                            fontSize: isMobile ? "0.7rem" : "0.75rem",
                          }}
                        >
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
                        error={formik.touched.DisabilityDetails && Boolean(formik.errors.DisabilityDetails)}
                        helperText={formik.touched.DisabilityDetails && formik.errors.DisabilityDetails}
                        required
                        size={isMobile ? "small" : "medium"}
                        sx={{
                          "& .MuiInputBase-root": {
                            fontSize: isMobile ? "0.875rem" : "1rem",
                          },
                          "& .MuiInputLabel-root": {
                            fontSize: isMobile ? "0.875rem" : "1rem",
                          },
                          "& .MuiFormHelperText-root": {
                            fontSize: isMobile ? "0.75rem" : "0.875rem",
                          },
                        }}
                      />
                    </Grid>
                  )}

                  {/* Educational Details Section */}
                  <Grid item xs={12}>
                    <Typography
                      variant={isMobile ? "subtitle1" : "h6"}
                      gutterBottom
                      sx={{
                        fontSize: isMobile ? "1rem" : "1.25rem",
                        fontWeight: "medium",
                        color: "#3f51b5",
                        mb: isMobile ? 1 : 2,
                        mt: isMobile ? 2 : 3,
                      }}
                    >
                      Educational Details
                    </Typography>
                    <Divider sx={{ mb: isMobile ? 1 : 2 }} />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Qualification"
                      fullWidth
                      name="Qualification"
                      value={formik.values.Qualification}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={formik.touched.Qualification && Boolean(formik.errors.Qualification)}
                      helperText={formik.touched.Qualification && formik.errors.Qualification}
                      required
                      size={isMobile ? "small" : "medium"}
                      sx={{
                        "& .MuiInputBase-root": {
                          fontSize: isMobile ? "0.875rem" : "1rem",
                        },
                        "& .MuiInputLabel-root": {
                          fontSize: isMobile ? "0.875rem" : "1rem",
                        },
                        "& .MuiFormHelperText-root": {
                          fontSize: isMobile ? "0.75rem" : "0.875rem",
                        },
                      }}
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
                        const value = Number.parseInt(e.target.value, 10)
                        formik.setFieldValue("ExperienceYear", value >= 0 ? value : 0)
                      }}
                      onBlur={formik.handleBlur}
                      error={formik.touched.ExperienceYear && Boolean(formik.errors.ExperienceYear)}
                      helperText={formik.touched.ExperienceYear && formik.errors.ExperienceYear}
                      inputProps={{ min: 0 }}
                      required
                      size={isMobile ? "small" : "medium"}
                      sx={{
                        "& .MuiInputBase-root": {
                          fontSize: isMobile ? "0.875rem" : "1rem",
                        },
                        "& .MuiInputLabel-root": {
                          fontSize: isMobile ? "0.875rem" : "1rem",
                        },
                        "& .MuiFormHelperText-root": {
                          fontSize: isMobile ? "0.75rem" : "0.875rem",
                        },
                      }}
                    />
                  </Grid>

                  {/* School Information Section */}
                  <Grid item xs={12}>
                    <Typography
                      variant={isMobile ? "subtitle1" : "h6"}
                      gutterBottom
                      sx={{
                        fontSize: isMobile ? "1rem" : "1.25rem",
                        fontWeight: "medium",
                        color: "#3f51b5",
                        mb: isMobile ? 1 : 2,
                        mt: isMobile ? 2 : 3,
                      }}
                    >
                      School Information
                    </Typography>
                    <Divider sx={{ mb: isMobile ? 1 : 2 }} />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="School ID"
                      fullWidth
                      name="SchoolID"
                      value={formik.values.SchoolID}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={formik.touched.SchoolID && Boolean(formik.errors.SchoolID)}
                      helperText={formik.touched.SchoolID && formik.errors.SchoolID}
                      required
                      disabled
                      size={isMobile ? "small" : "medium"}
                      sx={{
                        "& .MuiInputBase-root": {
                          fontSize: isMobile ? "0.875rem" : "1rem",
                        },
                        "& .MuiInputLabel-root": {
                          fontSize: isMobile ? "0.875rem" : "1rem",
                        },
                        "& .MuiFormHelperText-root": {
                          fontSize: isMobile ? "0.75rem" : "0.875rem",
                        },
                      }}
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
                      error={formik.touched.HireDate && Boolean(formik.errors.HireDate)}
                      helperText={formik.touched.HireDate && formik.errors.HireDate}
                      required
                      size={isMobile ? "small" : "medium"}
                      sx={{
                        "& .MuiInputBase-root": {
                          fontSize: isMobile ? "0.875rem" : "1rem",
                        },
                        "& .MuiInputLabel-root": {
                          fontSize: isMobile ? "0.875rem" : "1rem",
                        },
                        "& .MuiFormHelperText-root": {
                          fontSize: isMobile ? "0.75rem" : "0.875rem",
                        },
                      }}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <FormControl
                      fullWidth
                      required
                      size={isMobile ? "small" : "medium"}
                      sx={{
                        "& .MuiInputBase-root": {
                          fontSize: isMobile ? "0.875rem" : "1rem",
                        },
                        "& .MuiInputLabel-root": {
                          fontSize: isMobile ? "0.875rem" : "1rem",
                        },
                      }}
                    >
                      <InputLabel>Employee Type</InputLabel>
                      <Select
                        label="Employee Type"
                        name="EmployeeType"
                        value={formik.values.EmployeeType}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.EmployeeType && Boolean(formik.errors.EmployeeType)}
                      >
                        <MenuItem value="Principal">Principal</MenuItem>
                        <MenuItem value="Vice Principal">Vice Principal</MenuItem>
                        <MenuItem value="Teacher">Teacher</MenuItem>
                      </Select>
                      {formik.touched.EmployeeType && formik.errors.EmployeeType && (
                        <Typography
                          variant="caption"
                          color="error"
                          sx={{
                            ml: 2,
                            fontSize: isMobile ? "0.7rem" : "0.75rem",
                          }}
                        >
                          {formik.errors.EmployeeType}
                        </Typography>
                      )}
                    </FormControl>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <FormControl
                      fullWidth
                      required
                      size={isMobile ? "small" : "medium"}
                      sx={{
                        "& .MuiInputBase-root": {
                          fontSize: isMobile ? "0.875rem" : "1rem",
                        },
                        "& .MuiInputLabel-root": {
                          fontSize: isMobile ? "0.875rem" : "1rem",
                        },
                      }}
                    >
                      <InputLabel>Employment Status</InputLabel>
                      <Select
                        label="Employment Status"
                        name="EmployementStatus"
                        value={formik.values.EmployementStatus}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.EmployementStatus && Boolean(formik.errors.EmployementStatus)}
                      >
                        <MenuItem value="Working">Working</MenuItem>
                        <MenuItem value="Retired">Retired</MenuItem>
                        <MenuItem value="Removed">Removed</MenuItem>
                      </Select>
                      {formik.touched.EmployementStatus && formik.errors.EmployementStatus && (
                        <Typography
                          variant="caption"
                          color="error"
                          sx={{
                            ml: 2,
                            fontSize: isMobile ? "0.7rem" : "0.75rem",
                          }}
                        >
                          {formik.errors.EmployementStatus}
                        </Typography>
                      )}
                    </FormControl>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <FormControl
                      fullWidth
                      required
                      size={isMobile ? "small" : "medium"}
                      sx={{
                        "& .MuiInputBase-root": {
                          fontSize: isMobile ? "0.875rem" : "1rem",
                        },
                        "& .MuiInputLabel-root": {
                          fontSize: isMobile ? "0.875rem" : "1rem",
                        },
                      }}
                    >
                      <InputLabel>Employment Type</InputLabel>
                      <Select
                        label="Employment Type"
                        name="EmployementType"
                        value={formik.values.EmployementType}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.EmployementType && Boolean(formik.errors.EmployementType)}
                      >
                        <MenuItem value="Regular">Regular</MenuItem>
                        <MenuItem value="Contract">Contract</MenuItem>
                        <MenuItem value="Deputation">Deputation</MenuItem>
                      </Select>
                      {formik.touched.EmployementType && formik.errors.EmployementType && (
                        <Typography
                          variant="caption"
                          color="error"
                          sx={{
                            ml: 2,
                            fontSize: isMobile ? "0.7rem" : "0.75rem",
                          }}
                        >
                          {formik.errors.EmployementType}
                        </Typography>
                      )}
                    </FormControl>
                  </Grid>

                  {formik.values.EmployeeType === "Teacher" && (
                    <Grid item xs={12} sm={6}>
                      <FormControl
                        fullWidth
                        required
                        size={isMobile ? "small" : "medium"}
                        sx={{
                          "& .MuiInputBase-root": {
                            fontSize: isMobile ? "0.875rem" : "1rem",
                          },
                          "& .MuiInputLabel-root": {
                            fontSize: isMobile ? "0.875rem" : "1rem",
                          },
                        }}
                      >
                        <InputLabel>Post</InputLabel>
                        <Select
                          label="Post"
                          name="Post"
                          value={formik.values.Post}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          error={formik.touched.Post && Boolean(formik.errors.Post)}
                          required={formik.values.EmployeeType === "Teacher"}
                        >
                          <MenuItem value="Subject Specialist">Subject Specialist</MenuItem>
                          <MenuItem value="S.S.T">S.S.T</MenuItem>
                          <MenuItem value="S.S.E">S.S.E</MenuItem>
                          <MenuItem value="Acting Principal">Acting Principal</MenuItem>
                          <MenuItem value="S.S.T(I.T)">S.S.T(I.T)</MenuItem>
                          <MenuItem value="Arabic Teacher">Arabic Teacher</MenuItem>
                          <MenuItem value="E.S.T">E.S.T</MenuItem>
                          <MenuItem value="E.S.E">E.S.E</MenuItem>
                          <MenuItem value="P.T.I">P.T.I</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                  )}

                  {formik.values.EmployeeType === "Teacher" && (
                    <Grid item xs={12} sm={6}>
                      <TextField
                        label="Teacher Subject"
                        fullWidth
                        name="TeacherSubject"
                        value={formik.values.TeacherSubject}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.TeacherSubject && Boolean(formik.errors.TeacherSubject)}
                        helperText={formik.touched.TeacherSubject && formik.errors.TeacherSubject}
                        required={formik.values.EmployeeType === "Teacher"}
                        size={isMobile ? "small" : "medium"}
                        sx={{
                          "& .MuiInputBase-root": {
                            fontSize: isMobile ? "0.875rem" : "1rem",
                          },
                          "& .MuiInputLabel-root": {
                            fontSize: isMobile ? "0.875rem" : "1rem",
                          },
                          "& .MuiFormHelperText-root": {
                            fontSize: isMobile ? "0.75rem" : "0.875rem",
                          },
                        }}
                      />
                    </Grid>
                  )}

                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="BPS"
                      fullWidth
                      name="BPS"
                      value={formik.values.BPS}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={formik.touched.BPS && Boolean(formik.errors.BPS)}
                      helperText={formik.touched.BPS && formik.errors.BPS}
                      required
                      disabled // Make it disabled since it's auto-calculated
                      size={isMobile ? "small" : "medium"}
                      sx={{
                        "& .MuiInputBase-root": {
                          fontSize: isMobile ? "0.875rem" : "1rem",
                        },
                        "& .MuiInputLabel-root": {
                          fontSize: isMobile ? "0.875rem" : "1rem",
                        },
                        "& .MuiFormHelperText-root": {
                          fontSize: isMobile ? "0.75rem" : "0.875rem",
                        },
                      }}
                    />
                  </Grid>

                  {/* Address Section */}
                  <Grid item xs={12}>
                    <Typography
                      variant={isMobile ? "subtitle1" : "h6"}
                      gutterBottom
                      sx={{
                        fontSize: isMobile ? "1rem" : "1.25rem",
                        fontWeight: "medium",
                        color: "#3f51b5",
                        mb: isMobile ? 1 : 2,
                        mt: isMobile ? 2 : 3,
                      }}
                    >
                      Address
                    </Typography>
                    <Divider sx={{ mb: isMobile ? 1 : 2 }} />
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
                      multiline
                      rows={isMobile ? 2 : 3}
                      size={isMobile ? "small" : "medium"}
                      sx={{
                        "& .MuiInputBase-root": {
                          fontSize: isMobile ? "0.875rem" : "1rem",
                        },
                        "& .MuiInputLabel-root": {
                          fontSize: isMobile ? "0.875rem" : "1rem",
                        },
                        "& .MuiFormHelperText-root": {
                          fontSize: isMobile ? "0.75rem" : "0.875rem",
                        },
                      }}
                    />
                  </Grid>

                  {/* Submit Button */}
                  <Grid item xs={12}>
                    <Button
                      onClick={handleSubmitClick} // Not formik.handleSubmit
                      variant="contained"
                      color="primary"
                      fullWidth
                      disabled={loading}
                      size={isMobile ? "medium" : "large"}
                      sx={{
                        fontSize: isMobile ? "0.875rem" : "1rem",
                        padding: isMobile ? "10px 16px" : "12px 20px",
                        mt: isMobile ? 2 : 3,
                      }}
                    >
                      {loading ? (
                        <>
                          <CircularProgress size={isMobile ? 20 : 24} sx={{ mr: 1 }} />
                          Updating...
                        </>
                      ) : (
                        "Update Teacher"
                      )}
                    </Button>
                  </Grid>
                </Grid>
              </form>
            )}
          </Paper>
        </CardContent>
      </Card>

      <Snackbar
        open={alert.open}
        autoHideDuration={4000}
        onClose={handleCloseAlert}
        anchorOrigin={{
          vertical: isMobile ? "top" : "bottom",
          horizontal: "center",
        }}
      >
        <Alert
          onClose={handleCloseAlert}
          severity={alert.severity}
          sx={{
            width: isMobile ? "90vw" : "100%",
            maxWidth: isMobile ? "90vw" : "600px",
            fontSize: isMobile ? "0.875rem" : "1rem",
          }}
        >
          {alert.message}
        </Alert>
      </Snackbar>

      <Dialog
        open={openConfirmDialog}
        onClose={() => setOpenConfirmDialog(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            margin: isMobile ? 1 : 3,
            width: isMobile ? "calc(100% - 16px)" : "auto",
            maxHeight: isMobile ? "90vh" : "80vh",
          },
        }}
      >
        <DialogTitle
          sx={{
            fontSize: isMobile ? "1.1rem" : "1.25rem",
            padding: isMobile ? "12px 16px" : "16px 24px",
            color: "#3f51b5",
            fontWeight: "bold",
          }}
        >
          Confirm Teacher Update
        </DialogTitle>
        <DialogContent
          sx={{
            padding: isMobile ? "8px 16px" : "16px 24px",
            overflowY: "auto",
          }}
        >
          <DialogContentText
            sx={{
              fontSize: isMobile ? "0.875rem" : "1rem",
              mb: 2,
            }}
          >
            Are you sure you want to update details of this teacher?
          </DialogContentText>
          <Box sx={{ mt: 2 }}>
            <Typography
              sx={{
                fontSize: isMobile ? "0.875rem" : "1rem",
                mb: 1,
                wordBreak: "break-word",
              }}
            >
              <strong>Name:</strong> {formik.values.Name}
            </Typography>
            <Typography
              sx={{
                fontSize: isMobile ? "0.875rem" : "1rem",
                mb: 1,
              }}
            >
              <strong>CNIC:</strong> {formik.values.CNIC}
            </Typography>
            <Typography
              sx={{
                fontSize: isMobile ? "0.875rem" : "1rem",
                mb: 2,
                color: "#d32f2f",
                fontWeight: "medium",
              }}
            >
              It cannot be undone.
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions
          sx={{
            padding: isMobile ? "8px 16px 16px" : "8px 24px 24px",
            gap: isMobile ? 1 : 0,
            flexDirection: isMobile ? "column-reverse" : "row",
          }}
        >
          <Button
            onClick={() => setOpenConfirmDialog(false)}
            color="primary"
            size={isMobile ? "small" : "medium"}
            fullWidth={isMobile}
            sx={{ fontSize: isMobile ? "0.75rem" : "0.875rem" }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirmSubmit}
            color="primary"
            variant="contained"
            size={isMobile ? "small" : "medium"}
            fullWidth={isMobile}
            sx={{ fontSize: isMobile ? "0.75rem" : "0.875rem" }}
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default EditTeacher
