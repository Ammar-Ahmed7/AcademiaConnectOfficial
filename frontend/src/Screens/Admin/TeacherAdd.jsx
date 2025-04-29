// import React, { useState, useEffect } from "react";

// import {
//   Grid,
//   TextField,
//   Box,
//   Button,
//   Paper,
//   FormControl,
//   InputLabel,
//   MenuList,
//   MenuItem,
//   Select,
//   Typography,
//   Snackbar,
//   Alert,
// } from "@mui/material";
// import supabase from "../../../supabase-client";

// const TeacherAdd = () => {
//   const [schools, setSchools] = useState([]); // List of schools from API
//   const [alert, setAlert] = useState({
//     open: false,
//     message: "",
//     severity: "",
//   });
//   const [formData, setFormData] = useState({
//     ID: "T-12",
//     cnic: "",
//     name: "",
//     email: "",
//     password: "ww@123#w", // Default value
//     phoneNumber: "",
//     gender: "", // "Male" or "Female"
//     dateOfBirth: "",
//     disability: "No", // Default value
//     disabilitydetails: "", // Optional
//     qualification: "",
//     experienceyears: 0, // Default to 0 if no experience
//     hireDate: "", // Optional, defaults to current date on backend
//     SchoolId: "",
//     employeetype: "", // "Principal", "Head-Teacher", "Teacher"
//     employmentStatus: "", // "Working", "Retired", "Removed"
//     employmentType: "", // "Permanent", "Contract", "Part-Time"
//     address: "",
//   });

//   useEffect(() => {
//     fetchSchools();
//   }, []);

//   const fetchSchools = async () => {
//     try {
//       const { data, error } = await supabase
//         .from("School")
//         .select("SchoolID, SchoolName")
//         .order("SchoolID", { ascending: true });
//       console.log(data);
//       if (error) throw error;
//       setSchools(data);
//     } catch (error) {
//       console.error("Error fetching schools:", error);
//       setAlert({
//         open: true,
//         message: "Failed to load schools!",
//         severity: "error",
//       });
//     }
//   };

//   const handleInputChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: type === "checkbox" ? checked : value,
//     }));
//   };

//   // const handleSubmit = async (e) => {
//   //   e.preventDefault();
//   //    // 1. Create user in auth.users
//   //    const { data: authData, error: authError } = await supabase.auth.signUp({
//   //     email: formData.email,
//   //     password: formData.password,
//   //   });
//   //   console.log("i am here", formData.email, formData.password);

//   //   if (authError) {
//   //     console.error("Auth Error:", authError.message);
//   //     setAlert({
//   //       open: true,
//   //       message: "Failed to create auth user. Try again!",
//   //       severity: "error",
//   //     });
//   //     return;
//   //   }
//   //   const user = authData.user;
//   //   // 2. Create user in supabase.users
//   //   const { data, error: teacherError } = await supabase.from("Teacher").insert([
//   //     {
//   //       TeacherID: formData.ID,
//   //       CNIC: formData.cnic,
//   //       Name: formData.name,
//   //       Email: formData.email,
//   //       Password: formData.password, // Default value
//   //       PhoneNumber: formData.phoneNumber,
//   //       Gender: formData.gender, // "Male" or "Female"
//   //       DateOfBirth: formData.dateOfBirth,
//   //       Disability: formData.disability, // Default value
//   //       DisabilityDetails: formData.disabilitydetails, // Optional
//   //       Qualification: formData.qualification,
//   //       ExperienceYear: formData.experienceyears, // Default to 0 if no experience
//   //       HireDate: formData.hireDate, // Optional, defaults to current date on backend
//   //       SchoolID: formData.SchoolId,
//   //       EmployeeType: formData.employeetype, // "Principal", "Head-Teacher", "Teacher"
//   //       EmployementStatus: formData.employmentStatus, // "Working", "Retired", "Removed"
//   //       EmployementType: formData.employmentType, // "Permanent", "Contract", "Part-Time"
//   //       Address: formData.address,
//   //       Role: "Teacher",
//   //       user_id: user.id,
//   //     },
//   //   ]);

//   //   if (teacherError) {
//   //     console.error("Error adding Teacher:", teacherError.message);
//   //     setAlert({
//   //       open: true,
//   //       message: "Failed to add teacher. Try again!",
//   //       severity: "error",
//   //     });
//   //   } else {
//   //     setAlert({
//   //       open: true,
//   //       message: "Teacher added successfully!",
//   //       severity: "success",
//   //     });
//   //   }

//   //   setFormData({
//   //     ID: "T-",
//   //     cnic: "",
//   //     name: "",
//   //     email: "",
//   //     password: "ww@123", // Default value
//   //     phoneNumber: "",
//   //     gender: "", // "Male" or "Female"
//   //     dateOfBirth: "",
//   //     disability: "No", // Default value
//   //     disabilitydetails: "", // Optional
//   //     qualification: "",
//   //     experienceyears: 0, // Default to 0 if no experience
//   //     hireDate: "", // Optional, defaults to current date on backend
//   //     SchoolId: "",
//   //     employeetype: "", // "Principal", "Head-Teacher", "Teacher"
//   //     employmentStatus: "", // "Working", "Retired", "Removed"
//   //     employmentType: "", // "Permanent", "Contract", "Part-Time"
//   //     address: "",
//   //   });
//   // };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!formData.email || !formData.password) {
//       setAlert({
//         open: true,
//         message: "Email and Password are required.",
//         severity: "error",
//       });
//       return;
//     }

//     const { data: authData, error: authError } = await supabase.auth.signUp({
//       email: formData.email,
//       password: formData.password,
//     });

//     console.log("i am here", formData.email, formData.password);

//     if (authError) {
//       console.error("Auth Error:", authError.message);
//       setAlert({
//         open: true,
//         message: "Failed to create auth user. Try again!",
//         severity: "error",
//       });
//       return;
//     }

//     if (!authData?.user) {
//       console.error(
//         "User creation incomplete, email confirmation likely required."
//       );
//       setAlert({
//         open: true,
//         message: "User created! Please confirm the email before proceeding.",
//         severity: "warning",
//       });
//       return;
//     }

//     const user = authData.user;

//     const { data, error: teacherError } = await supabase
//       .from("Teacher")
//       .insert([
//         {
//           TeacherID: formData.ID,
//           CNIC: formData.cnic,
//           Name: formData.name,
//           Email: formData.email,
//           Password: formData.password,
//           PhoneNumber: formData.phoneNumber,
//           Gender: formData.gender,
//           DateOfBirth: formData.dateOfBirth,
//           Disability: formData.disability,
//           DisabilityDetails: formData.disabilitydetails,
//           Qualification: formData.qualification,
//           ExperienceYear: formData.experienceyears,
//           HireDate: formData.hireDate,
//           SchoolID: formData.SchoolId,
//           EmployeeType: formData.employeetype,
//           EmployementStatus: formData.employmentStatus,
//           EmployementType: formData.employmentType,
//           Address: formData.address,
//           Role: "Teacher",
//           user_id: user.id,
//         },
//       ]);

//     if (teacherError) {
//       console.error("Error adding Teacher:", teacherError.message);
//       setAlert({
//         open: true,
//         message: "Failed to add teacher. Try again!",
//         severity: "error",
//       });
//     } else {
//       setAlert({
//         open: true,
//         message: "Teacher added successfully!",
//         severity: "success",
//       });
//     }

//     setFormData({
//       ID: "T-",
//       cnic: "",
//       name: "",
//       email: "",
//       password: "ww@123",
//       phoneNumber: "",
//       gender: "",
//       dateOfBirth: "",
//       disability: "No",
//       disabilitydetails: "",
//       qualification: "",
//       experienceyears: 0,
//       hireDate: "",
//       SchoolId: "",
//       employeetype: "",
//       employmentStatus: "",
//       employmentType: "",
//       address: "",
//     });
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
//         Add Teacher
//       </Typography>

//       <Paper
//         sx={{
//           padding: "20px",
//           borderRadius: "8px",
//           backgroundColor: "#fff",
//         }}
//         elevation={3}
//       >
//         <form onSubmit={handleSubmit}>
//           <Grid container spacing={2}>
//             {/* Personal Information Section */}
//             <Grid item xs={12}>
//               <Typography variant="h6" gutterBottom>
//                 Personal Information
//               </Typography>
//             </Grid>
//             <Grid item xs={12} sm={6}>
//               <TextField
//                 label="Name"
//                 fullWidth
//                 name="name"
//                 value={formData.name}
//                 onChange={handleInputChange}
//                 required
//               />
//             </Grid>
//             <Grid item xs={12} sm={6}>
//               <TextField
//                 label="CNIC"
//                 fullWidth
//                 name="cnic"
//                 value={formData.cnic}
//                 onChange={handleInputChange}
//                 required
//               />
//             </Grid>

//             <Grid item xs={12} sm={6}>
//               <TextField
//                 label="Email"
//                 fullWidth
//                 name="email"
//                 value={formData.email}
//                 onChange={handleInputChange}
//                 required
//               />
//             </Grid>
//             <Grid item xs={12} sm={6}>
//               <TextField
//                 label="Password"
//                 type="password"
//                 fullWidth
//                 name="password"
//                 value={formData.password}
//                 onChange={handleInputChange}
//                 required
//               />
//             </Grid>
//             <Grid item xs={12} sm={6}>
//               <TextField
//                 label="Phone Number"
//                 fullWidth
//                 name="phoneNumber"
//                 value={formData.phoneNumber}
//                 onChange={handleInputChange}
//                 required
//               />
//             </Grid>
//             <Grid item xs={12} sm={6}>
//               <FormControl fullWidth required>
//                 <InputLabel>Gender</InputLabel>
//                 <Select
//                   label="Gender"
//                   name="gender"
//                   value={formData.gender}
//                   onChange={handleInputChange}
//                 >
//                   <MenuItem value="Male">Male</MenuItem>
//                   <MenuItem value="Female">Female</MenuItem>
//                 </Select>
//               </FormControl>
//             </Grid>
//             <Grid item xs={12} sm={6}>
//               <TextField
//                 label="Date of Birth"
//                 type="date"
//                 fullWidth
//                 InputLabelProps={{ shrink: true }}
//                 name="dateOfBirth"
//                 value={formData.dateOfBirth}
//                 onChange={handleInputChange}
//                 required
//               />
//             </Grid>

//             <Grid item xs={12}>
//               <TextField
//                 label="Address"
//                 fullWidth
//                 name="address"
//                 value={formData.address}
//                 onChange={handleInputChange}
//               />
//             </Grid>

//             <Grid item xs={12} sm={6}>
//               <FormControl fullWidth required>
//                 <InputLabel>Disability</InputLabel>
//                 <Select
//                   label="Disability"
//                   name="disability"
//                   value={formData.disability}
//                   onChange={handleInputChange}
//                 >
//                   <MenuItem value="Yes">Yes</MenuItem>
//                   <MenuItem value="No">No</MenuItem>
//                 </Select>
//               </FormControl>
//             </Grid>

//             {formData.disability === "Yes" && (
//               <Grid item xs={12} sm={6}>
//                 <TextField
//                   label="Disability Details"
//                   fullWidth
//                   name="disabilitydetails"
//                   value={formData.disabilitydetails}
//                   onChange={handleInputChange}
//                   required
//                 />
//               </Grid>
//             )}

//             {/* Educational Details Section */}
//             <Grid item xs={12}>
//               <Typography variant="h6" gutterBottom>
//                 Educational Details
//               </Typography>
//             </Grid>
//             <Grid item xs={12} sm={6}>
//               <TextField
//                 label="Qualification"
//                 fullWidth
//                 name="qualification"
//                 value={formData.qualification}
//                 onChange={handleInputChange}
//                 required
//               />
//             </Grid>

//             <Grid item xs={12} sm={6}>
//               <TextField
//                 label="Experience (Years)"
//                 fullWidth
//                 name="experienceyears"
//                 type="number"
//                 value={formData.experience}
//                 onChange={(e) => {
//                   const value = parseInt(e.target.value, 10);
//                   handleInputChange({
//                     target: {
//                       name: "experienceyears",
//                       value: value >= 0 ? value : 0,
//                     },
//                   });
//                 }}
//                 // onChange={(e) => {
//                 //   const value = parseInt(e.target.value, 10);

//                 //   handleInputChange({
//                 //     target: {
//                 //       name: "experience",
//                 //       value: value >= 0 ? value : 0, // Ensures non-negative values
//                 //     },
//                 //   });
//                 // }}
//                 inputProps={{ min: 0 }} // Prevents negative values in number input
//                 required
//               />
//             </Grid>

//             {/* School Information Section */}
//             <Grid item xs={12}>
//               <Typography variant="h6" gutterBottom>
//                 School Information
//               </Typography>
//             </Grid>
//             <Grid item xs={12} sm={6}>
//               <TextField
//                 label="Teacher ID"
//                 type="text"
//                 fullWidth
//                 InputLabelProps={{ shrink: true }}
//                 name="ID"
//                 value={formData.ID}
//                 onChange={handleInputChange}
//                 required
//               />
//             </Grid>

//             <Grid item xs={12} sm={6}>
//               <FormControl fullWidth>
//                 <InputLabel>School ID</InputLabel>
//                 <Select
//                   label="School Id"
//                   name="SchoolId"
//                   value={formData.SchoolId}
//                   onChange={handleInputChange}
//                 >
//                   {schools.map((school) => (
//                     <MenuItem key={school.SchoolID} value={school.SchoolID}>
//                       {school.SchoolID} - {school.SchoolName}
//                     </MenuItem>
//                   ))}
//                 </Select>
//               </FormControl>
//             </Grid>

//             <Grid item xs={12} sm={6}>
//               <TextField
//                 label="Hire Date"
//                 type="date"
//                 fullWidth
//                 InputLabelProps={{ shrink: true }}
//                 name="hireDate"
//                 value={formData.hireDate}
//                 onChange={handleInputChange}
//                 required
//               />
//             </Grid>
//             <Grid item xs={12} sm={6}>
//               <FormControl fullWidth required>
//                 <InputLabel>Employee Type</InputLabel>
//                 <Select
//                   label="Employee Type"
//                   name="employeetype"
//                   value={formData.employeetype}
//                   onChange={handleInputChange}
//                 >
//                   <MenuItem value="Principal">Principal</MenuItem>
//                   <MenuItem value="Head-Teacher">Head-Teacher</MenuItem>
//                   <MenuItem value="Teacher">Teacher</MenuItem>
//                 </Select>
//               </FormControl>
//             </Grid>
//             <Grid item xs={12} sm={6}>
//               <FormControl fullWidth required>
//                 <InputLabel>Employment Status</InputLabel>
//                 <Select
//                   label="Employment Status"
//                   name="employmentStatus"
//                   value={formData.employmentStatus}
//                   onChange={handleInputChange}
//                 >
//                   <MenuItem value="Working">Working</MenuItem>
//                   <MenuItem value="Retired">Retired</MenuItem>
//                   <MenuItem value="Removed">Removed</MenuItem>
//                 </Select>
//               </FormControl>
//             </Grid>
//             <Grid item xs={12} sm={6}>
//               <FormControl fullWidth required>
//                 <InputLabel>Employment Type</InputLabel>
//                 <Select
//                   label="Employment Type"
//                   name="employmentType"
//                   value={formData.employmentType}
//                   onChange={handleInputChange}
//                 >
//                   <MenuItem value="Permanent">Permanent</MenuItem>
//                   <MenuItem value="Contract">Contract</MenuItem>
//                   <MenuItem value="Part-Time">Part-Time</MenuItem>
//                 </Select>
//               </FormControl>
//             </Grid>

//             {/* Submit Button */}
//             <Grid item xs={12}>
//               <Button
//                 type="submit"
//                 variant="contained"
//                 color="primary"
//                 fullWidth
//               >
//                 Submit
//               </Button>
//             </Grid>
//           </Grid>
//         </form>
//       </Paper>
//       {/* Snackbar for Alerts */}
//       <Snackbar
//         open={alert.open}
//         autoHideDuration={6000}
//         onClose={handleCloseAlert}
//       >
//         <Alert onClose={handleCloseAlert} severity={alert.severity}>
//           {alert.message}
//         </Alert>
//       </Snackbar>
//     </Box>
//   );
// };

// export default TeacherAdd;

import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  Grid,
  TextField,
  Box,
  Button,
  Paper,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
  Snackbar,
  Alert,
} from "@mui/material";
import supabase from "../../../supabase-client";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

const TeacherAdd = () => {
  const [schools, setSchools] = useState([]);
  const [alert, setAlert] = useState({
    open: false,
    message: "",
    severity: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const togglePasswordVisibility = () => setShowPassword((prev) => !prev);

  useEffect(() => {
    fetchSchools();
  }, []);

  const fetchSchools = async () => {
    try {
      const { data, error } = await supabase
        .from("School")
        .select("SchoolID, SchoolName")
        .order("SchoolID", { ascending: true });
      if (error) throw error;
      setSchools(data);
    } catch (error) {
      console.error("Error fetching schools:", error);
      showAlert("Failed to load schools!", "error");
    }
  };
  // const generateTeacherID = async (schoolId) => {
  //   if (!schoolId) return;

  //   const formattedSchoolId = schoolId.replace(/-/g, ""); // S-B-01 -> SB01
  //   const prefix = `T-${formattedSchoolId}-`;

  //   try {
  //     const { data, error } = await supabase
  //       .from("Teacher")
  //       .select("TeacherID")
  //       .like("TeacherID", `${prefix}%`);

  //     if (error) throw error;

  //     const existingIds = data.map((entry) =>
  //       parseInt(entry.TeacherID.split("-").pop(), 10)
  //     );
  //     console.log("i am prefix", prefix, schoolId);
      
  //     const nextNumber = (Math.max(...existingIds, 0) + 1)
  //       .toString()
  //       .padStart(2, "0");

  //     const newId = `${prefix}${nextNumber}`;
  //     formik.setFieldValue("ID", newId);
  //   } catch (err) {
  //     console.error("Failed to generate Teacher ID:", err);
  //     showAlert("Failed to generate Teacher ID", "error");
  //   }
  // };


  const generateTeacherID = async (schoolId) => {
    if (!schoolId) return;
  
    const formattedSchoolId = schoolId.replace(/-/g, "");
    const prefix = `T-${formattedSchoolId}-`;
  
    try {
      const { data, error } = await supabase
        .from("Teacher")
        .select("TeacherID")
        .filter("TeacherID", "like", `${prefix}%`);
  
      if (error) throw error;
  
      const filteredData = data.filter(entry => entry.TeacherID.startsWith(prefix));
      const existingIds = filteredData.map(entry => 
        parseInt(entry.TeacherID.split("-").pop(), 10)
      );
  
      const nextNumber = (Math.max(...existingIds, 0) + 1)
        .toString()
        .padStart(2, "0");
  
      const newId = `${prefix}${nextNumber}`;
      formik.setFieldValue("ID", newId);
    } catch (err) {
      console.error("Failed to generate Teacher ID:", err);
      showAlert("Failed to generate Teacher ID", "error");
    }
  };
  


  const showAlert = (message, severity) => {
    setAlert({ open: true, message, severity });
  };

  const handleCloseAlert = () => setAlert({ ...alert, open: false });

  // Validation Schema
  const validationSchema = Yup.object().shape({
    name: Yup.string()
      .matches(/^[A-Za-z\s]+$/, "Only alphabets and spaces are allowed")
      .required("Name is required"),

    cnic: Yup.string()
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

    email: Yup.string()
      .email("Invalid email")
      .required("Email is required")
      .test(
        "unique-email",
        "This Email is already registered",
        async function (value) {
          if (!value) return true;

          try {
            const { data, error } = await supabase
              .from("Teacher")
              .select("Email")
              .eq("Email", value);

            if (error) throw error;

            return data.length === 0; // true = valid
          } catch (error) {
            console.error("Error checking Email:", error);
            return this.createError({
              message: "Could not validate Email",
            });
          }
        }
      ),

    password: Yup.string()
      .min(8, "Password must be at least 8 characters")
      .matches(/[a-z]/, "Must contain at least one lowercase letter")
      .matches(/[A-Z]/, "Must contain at least one uppercase letter")
      .matches(/\d/, "Must contain at least one digit")
      .matches(/[@$!%*?&]/, "Must contain at least one special character")
      .required("Password is required"),

    phoneNumber: Yup.string()
      .matches(
        /^\d{9,12}$/,
        "Phone number must be between 9 and 12 digits and only contain numbers"
      )
      .required("Phone number is required")

      .test(
        "unique-phone",
        "This phone number is already in use",
        async function (value) {
          if (!value) return true;

          try {
            const { data, error } = await supabase
              .from("Teacher")
              .select("PhoneNumber")
              .eq("PhoneNumber", value);

            if (error) throw error;

            return data.length === 0; // true = valid
          } catch (error) {
            console.error("Error checking phone number:", error);
            return this.createError({
              message: "Could not validate phone number",
            });
          }
        }
      ),

    gender: Yup.string().required("Gender is required"),

    dateOfBirth: Yup.string().required("Date of birth is required"),

    hireDate: Yup.string()
      .required("Hire date is required")
      .test(
        "hireDate-after-dob",
        "Hire date must be after date of birth",
        function (value) {
          const { dateOfBirth } = this.parent;
          return new Date(value) > new Date(dateOfBirth);
        }
      ),

    qualification: Yup.string()
      .matches(
        /^[A-Za-z\s]+$/,
        "Qualification should contain only alphabets and spaces"
      )
      .required("Qualification is required"),

    experienceyears: Yup.number()
      .min(0, "Experience cannot be negative")
      .required("Experience is required")
      .test(
        "experience-less-than-age",
        "Experience cannot be greater than age",
        function (value) {
          const { dateOfBirth } = this.parent;
          const age = calculateAge(dateOfBirth);
          return value <= age;
        }
      ),

    disability: Yup.string().required("Disability status is required"),

    disabilitydetails: Yup.string().when("disability", {
      is: "Yes",
      then: Yup.string().required("Disability details are required"),
    }),

    SchoolId: Yup.string().required("School is required"),
    // employeetype: Yup.string().required("Employee type is required"),
    employeetype: Yup.string()
    .required("Employee type is required")
    .test(
      "unique-principal",
      "This school already has a principal",
      async function (value) {
        // Only validate if the selected type is Principal
        if (value !== "Principal") return true;
        
        const { SchoolId } = this.parent;
        if (!SchoolId) return true; // Skip if no school selected

        try {
          const { data, error } = await supabase
            .from("Teacher")
            .select("*")
            .eq("SchoolID", SchoolId)
            .eq("EmployeeType", "Principal");

          if (error) throw error;
          return data.length === 0; // true = valid (no existing principal)
        } catch (error) {
          console.error("Error checking existing principal:", error);
          return this.createError({
            message: "Could not validate principal status",
          });
        }
      }
    ),



    employmentStatus: Yup.string().required("Employment status is required"),
    employmentType: Yup.string().required("Employment type is required"),
    address: Yup.string().required("Address is required"),
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
      ID: "",
      cnic: "",
      name: "",
      email: "",
      password: "Ww@123#w",
      phoneNumber: "",
      gender: "",
      dateOfBirth: "",
      disability: "No",
      disabilitydetails: "",
      qualification: "",
      experienceyears: 0,
      hireDate: "",
      SchoolId: "",
      employeetype: "Teacher",
      employmentStatus: "Working",
      employmentType: "Regular",
      address: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        if (!values.email || !values.password) {
          showAlert("Email and Password are required.", "error");
          return;
        }

        const { data: authData, error: authError } = await supabase.auth.signUp(
          {
            email: values.email,
            password: values.password,
          }
        );

        if (authError) {
          console.error("Auth Error:", authError.message);
          showAlert("Failed to create auth user. Try again!", "error");
          return;
        }

        if (!authData?.user) {
          console.error(
            "User creation incomplete, email confirmation likely required."
          );
          showAlert(
            "User created! Please confirm the email before proceeding.",
            "warning"
          );
          return;
        }

        const user = authData.user;

        const { error: teacherError } = await supabase.from("Teacher").insert([
          {
            TeacherID: values.ID,
            CNIC: values.cnic,
            Name: values.name,
            Email: values.email,
            Password: values.password,
            PhoneNumber: values.phoneNumber,
            Gender: values.gender,
            DateOfBirth: values.dateOfBirth,
            Disability: values.disability,
            DisabilityDetails: values.disabilitydetails,
            Qualification: values.qualification,
            ExperienceYear: values.experienceyears,
            HireDate: values.hireDate,
            SchoolID: values.SchoolId,
            EmployeeType: values.employeetype,
            EmployementStatus: values.employmentStatus,
            EmployementType: values.employmentType,
            Address: values.address,
            Role: "Teacher",
            user_id: user.id,
          },
        ]);

        if (teacherError) {
          console.error("Error adding Teacher:", teacherError.message);
          showAlert("Failed to add teacher. Try again!", "error");
        } else {
          showAlert("Teacher added successfully!", "success");
          formik.resetForm({
            values: {
              ...formik.initialValues,
              ID: "T-",
            },
          });
        }
      } catch (error) {
        console.error("Error in form submission:", error);
        showAlert("An unexpected error occurred", "error");
      }
    },
  });

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
        Add Teacher
      </Typography>

      <Paper
        sx={{
          padding: "20px",
          borderRadius: "8px",
          backgroundColor: "#fff",
        }}
        elevation={3}
      >
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
                label="Name"
                fullWidth
                name="name"
                value={formik.values.name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.name && Boolean(formik.errors.name)}
                helperText={formik.touched.name && formik.errors.name}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="CNIC"
                fullWidth
                name="cnic"
                value={formik.values.cnic}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.cnic && Boolean(formik.errors.cnic)}
                helperText={formik.touched.cnic && formik.errors.cnic}
                required
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                label="Email"
                fullWidth
                name="email"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.email && Boolean(formik.errors.email)}
                helperText={formik.touched.email && formik.errors.email}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Password"
                type={showPassword ? "text" : "password"}
                fullWidth
                name="password"
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.password && Boolean(formik.errors.password)
                }
                helperText={formik.touched.password && formik.errors.password}
                required
                InputProps={{
                  endAdornment: (
                    <Button onClick={togglePasswordVisibility}>
                      {showPassword ? <Visibility /> : <VisibilityOff />}
                    </Button>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Phone Number"
                fullWidth
                name="phoneNumber"
                value={formik.values.phoneNumber}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.phoneNumber &&
                  Boolean(formik.errors.phoneNumber)
                }
                helperText={
                  formik.touched.phoneNumber && formik.errors.phoneNumber
                }
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel>Gender</InputLabel>
                <Select
                  label="Gender"
                  name="gender"
                  value={formik.values.gender}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.gender && Boolean(formik.errors.gender)}
                >
                  <MenuItem value="Male">Male</MenuItem>
                  <MenuItem value="Female">Female</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Date of Birth"
                type="date"
                fullWidth
                InputLabelProps={{ shrink: true }}
                name="dateOfBirth"
                value={formik.values.dateOfBirth}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.dateOfBirth &&
                  Boolean(formik.errors.dateOfBirth)
                }
                helperText={
                  formik.touched.dateOfBirth && formik.errors.dateOfBirth
                }
                required
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Address"
                fullWidth
                name="address"
                value={formik.values.address}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.address && Boolean(formik.errors.address)}
                helperText={formik.touched.address && formik.errors.address}
                required
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel>Disability</InputLabel>
                <Select
                  label="Disability"
                  name="disability"
                  value={formik.values.disability}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.disability &&
                    Boolean(formik.errors.disability)
                  }
                >
                  <MenuItem value="Yes">Yes</MenuItem>
                  <MenuItem value="No">No</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {formik.values.disability === "Yes" && (
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Disability Details"
                  fullWidth
                  name="disabilitydetails"
                  value={formik.values.disabilitydetails}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.disabilitydetails &&
                    Boolean(formik.errors.disabilitydetails)
                  }
                  helperText={
                    formik.touched.disabilitydetails &&
                    formik.errors.disabilitydetails
                  }
                  required={formik.values.disability === "Yes"}
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
                name="qualification"
                value={formik.values.qualification}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.qualification &&
                  Boolean(formik.errors.qualification)
                }
                helperText={
                  formik.touched.qualification && formik.errors.qualification
                }
                required
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                label="Experience (Years)"
                fullWidth
                name="experienceyears"
                type="number"
                value={formik.values.experienceyears}
                onChange={(e) => {
                  const value = parseInt(e.target.value, 10);
                  formik.setFieldValue(
                    "experienceyears",
                    value >= 0 ? value : 0
                  );
                }}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.experienceyears &&
                  Boolean(formik.errors.experienceyears)
                }
                helperText={
                  formik.touched.experienceyears &&
                  formik.errors.experienceyears
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
                label="Teacher ID"
                type="text"
                fullWidth
                InputLabelProps={{ shrink: true }}
                name="ID"
                value={formik.values.ID}
                disabled
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>School ID</InputLabel>
                <Select
                  label="School Id"
                  name="SchoolId"
                  value={formik.values.SchoolId}
                  onChange={async (e) => {
                    const value = e.target.value;
                    formik.setFieldValue("SchoolId", value);
                    await generateTeacherID(value);
                  }}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.SchoolId && Boolean(formik.errors.SchoolId)
                  }
                >
                  {schools.map((school) => (
                    <MenuItem key={school.SchoolID} value={school.SchoolID}>
                      {school.SchoolID} - {school.SchoolName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                label="Hire Date"
                type="date"
                fullWidth
                InputLabelProps={{ shrink: true }}
                name="hireDate"
                value={formik.values.hireDate}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.hireDate && Boolean(formik.errors.hireDate)
                }
                helperText={formik.touched.hireDate && formik.errors.hireDate}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel>Employee Type</InputLabel>
                <Select
                  label="Employee Type"
                  name="employeetype"
                  value={formik.values.employeetype}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.employeetype &&
                    Boolean(formik.errors.employeetype)
                  }
                 
                >
                  <MenuItem value="Principal">Principal</MenuItem>
                  <MenuItem value="Vice Principal">Vice Principal</MenuItem>
                  <MenuItem value="Teacher">Teacher</MenuItem>
                </Select>
                {formik.touched.employeetype && formik.errors.employeetype && (
      <Typography variant="caption" color="error" sx={{ ml: 2 }}>
        {formik.errors.employeetype}
      </Typography>
    )}
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel>Employment Status</InputLabel>
                <Select
                  label="Employment Status"
                  name="employmentStatus"
                  value={formik.values.employmentStatus}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.employmentStatus &&
                    Boolean(formik.errors.employmentStatus)
                  }
                >
                  <MenuItem value="Working">Working</MenuItem>
                  <MenuItem value="Retired">Retired</MenuItem>
                  <MenuItem value="Removed">Removed</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel>Employment Type</InputLabel>
                <Select
                  label="Employment Type"
                  name="employmentType"
                  value={formik.values.employmentType}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.employmentType &&
                    Boolean(formik.errors.employmentType)
                  }
                >
                  <MenuItem value="Regular">Regular</MenuItem>
                  <MenuItem value="Contract">Contract</MenuItem>
                  <MenuItem value="Deputation">Deputation</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* Submit Button */}
            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
              >
                Submit
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

export default TeacherAdd;
