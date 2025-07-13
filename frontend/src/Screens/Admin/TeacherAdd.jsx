// // "use client";

// // import { useState, useEffect } from "react";
// // import { useFormik } from "formik";
// // import * as Yup from "yup";
// // // import * as yup from "yup";
// // import {
// //   Grid,
// //   TextField,
// //   Box,
// //   Button,
// //   Paper,
// //   FormControl,
// //   InputLabel,
// //   MenuItem,
// //   Select,
// //   Typography,
// //   Snackbar,
// //   Alert,
// //   Dialog,
// //   DialogTitle,
// //   DialogContent,
// //   DialogContentText,
// //   DialogActions,
// //   useTheme,
// //   useMediaQuery,
// //   Card,
// //   CardContent,
// //   Divider,
// //   CircularProgress,
// // } from "@mui/material";
// // import InputMask from "react-input-mask";
// // import supabase from "../../../supabase-client";
// // import Visibility from "@mui/icons-material/Visibility";
// // import VisibilityOff from "@mui/icons-material/VisibilityOff";

// // const TeacherAdd = () => {
// //   const theme = useTheme();
// //   const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
// //   const isTablet = useMediaQuery(theme.breakpoints.down("md"));

// //   const [schools, setSchools] = useState([]);
// //   const [alert, setAlert] = useState({
// //     open: false,
// //     message: "",
// //     severity: "",
// //   });
// //   const [loading, setLoading] = useState(false);
// //   const [showPassword, setShowPassword] = useState(false);
// //   const togglePasswordVisibility = () => setShowPassword((prev) => !prev);
// //   const [openConfirmDialog, setOpenConfirmDialog] = useState(false);

// //   useEffect(() => {
// //     fetchSchools();
// //   }, []);

// //   const fetchSchools = async () => {
// //     try {
// //       const { data, error } = await supabase
// //         .from("School")
// //         .select("SchoolID, SchoolName")
// //         .order("SchoolID", { ascending: true });
// //       if (error) throw error;
// //       setSchools(data);
// //     } catch (error) {
// //       console.error("Error fetching schools:", error);
// //       showAlert("Failed to load schools!", "error");
// //     }
// //   };

// //   const generateTeacherID = async (schoolId) => {
// //     if (!schoolId) return;
// //     const formattedSchoolId = schoolId.replace(/-/g, "");
// //     const prefix = `T-${formattedSchoolId}-`;
// //     try {
// //       const { data, error } = await supabase
// //         .from("Teacher")
// //         .select("TeacherID")
// //         .filter("TeacherID", "like", `${prefix}%`);
// //       if (error) throw error;
// //       const filteredData = data.filter((entry) =>
// //         entry.TeacherID.startsWith(prefix)
// //       );
// //       const existingIds = filteredData.map((entry) =>
// //         Number.parseInt(entry.TeacherID.split("-").pop(), 10)
// //       );
// //       const nextNumber = (Math.max(...existingIds, 0) + 1)
// //         .toString()
// //         .padStart(2, "0");
// //       const newId = `${prefix}${nextNumber}`;
// //       formik.setFieldValue("ID", newId);
// //     } catch (err) {
// //       console.error("Failed to generate Teacher ID:", err);
// //       showAlert("Failed to generate Teacher ID", "error");
// //     }
// //   };

// //   const showAlert = (message, severity) => {
// //     setAlert({ open: true, message, severity });
// //   };

// //   const handleCloseAlert = () => setAlert({ ...alert, open: false });

// //   // Validation Schema
// //   // const validationSchema = Yup.object().shape({
// //   //   name: Yup.string()
// //   //     .matches(/^[A-Za-z\s]+$/, "Only alphabets and spaces are allowed")
// //   //     .required("Name is required"),
// //   //   cnic: Yup.string()
// //   //     .required("CNIC is required")
// //   //     .matches(
// //   //       /^\d{5}-\d{7}-\d{1}$/, // Validates XXXXX-XXXXXXX-X format
// //   //       "CNIC must be in format 31102-1234567-9 (13 digits with dashes)"
// //   //     )
// //   //     .test("unique-cnic", "This CNIC is already registered", async (value) => {
// //   //       if (!value) return true;
// //   //       try {
// //   //         const { data, error } = await supabase
// //   //           .from("Teacher")
// //   //           .select("CNIC")
// //   //           .eq("CNIC", value); // Checks exact formatted CNIC (with dashes)
// //   //         if (error) throw error;
// //   //         return data.length === 0; // True if CNIC doesn't exist
// //   //       } catch (error) {
// //   //         console.error("CNIC validation error:", error);
// //   //         return false;
// //   //       }
// //   //     }),
// //   //   email: Yup.string()
// //   //     .email("Invalid email")
// //   //     .required("Email is required")
// //   //     .test(
// //   //       "unique-email",
// //   //       "This Email is already registered",
// //   //       async function (value) {
// //   //         if (!value) return true;
// //   //         try {
// //   //           const { data, error } = await supabase
// //   //             .from("Teacher")
// //   //             .select("Email")
// //   //             .eq("Email", value);
// //   //           if (error) throw error;
// //   //           return data.length === 0; // true = valid
// //   //         } catch (error) {
// //   //           console.error("Error checking Email:", error);
// //   //           return this.createError({
// //   //             message: "Could not validate Email",
// //   //           });
// //   //         }
// //   //       }
// //   //     ),
// //   //   password: Yup.string()
// //   //     .min(8, "Password must be at least 8 characters")
// //   //     .matches(/[a-z]/, "Must contain at least one lowercase letter")
// //   //     .matches(/[A-Z]/, "Must contain at least one uppercase letter")
// //   //     .matches(/\d/, "Must contain at least one digit")
// //   //     .matches(/[@$!%*?&]/, "Must contain at least one special character")
// //   //     .required("Password is required"),
// //   //   phoneNumber: Yup.string()
// //   //     .matches(
// //   //       /^\d{9,12}$/,
// //   //       "Phone number must be between 9 and 12 digits and only contain numbers"
// //   //     )
// //   //     .required("Phone number is required")
// //   //     .test(
// //   //       "unique-phone",
// //   //       "This phone number is already in use",
// //   //       async function (value) {
// //   //         if (!value) return true;
// //   //         try {
// //   //           const { data, error } = await supabase
// //   //             .from("Teacher")
// //   //             .select("PhoneNumber")
// //   //             .eq("PhoneNumber", value);
// //   //           if (error) throw error;
// //   //           return data.length === 0; // true = valid
// //   //         } catch (error) {
// //   //           console.error("Error checking phone number:", error);
// //   //           return this.createError({
// //   //             message: "Could not validate phone number",
// //   //           });
// //   //         }
// //   //       }
// //   //     ),
// //   //   gender: Yup.string().required("Gender is required"),
// //   //   dateOfBirth: Yup.string().required("Date of birth is required"),
// //   //   hireDate: Yup.string()
// //   //     .required("Hire date is required")
// //   //     .test(
// //   //       "hireDate-after-dob",
// //   //       "Hire date must be after date of birth",
// //   //       function (value) {
// //   //         const { dateOfBirth } = this.parent;
// //   //         return new Date(value) > new Date(dateOfBirth);
// //   //       }
// //   //     ),
// //   //   qualification: Yup.string()
// //   //     .matches(
// //   //       /^[A-Za-z\s]+$/,
// //   //       "Qualification should contain only alphabets and spaces"
// //   //     )
// //   //     .required("Qualification is required"),
// //   //   experienceyears: Yup.number()
// //   //     .min(0, "Experience cannot be negative")
// //   //     .required("Experience is required")
// //   //     .test(
// //   //       "experience-less-than-age",
// //   //       "Experience cannot be greater than age",
// //   //       function (value) {
// //   //         const { dateOfBirth } = this.parent;
// //   //         const age = calculateAge(dateOfBirth);
// //   //         return value <= age;
// //   //       }
// //   //     ),
// //   //   // disability: Yup.string().required("Disability status is required"),

// //   //   disability: Yup.string()
// //   //     .required("Disability status is required")
// //   //     .test("debug-disability", "Debug", function (value) {
// //   //       console.log("[VALIDATION] Disability field value:", value);
// //   //       console.log("[VALIDATION] Parent object:", this.parent);
// //   //       return true; // Always passes, just for debugging
// //   //     }),

// //   //   // disabilitydetails: Yup.string().when("disability", {
// //   //   //   is: "Yes",
// //   //   //   then: Yup.string().required("Disability details are required"),
// //   //   // }),
// //   //   disabilitydetails: Yup.string().when("disability", (disability, schema) => {
// //   //     console.log("Disability value:", disability); // Debug log
// //   //     return disability === "Yes" 
// //   //       ? schema.required("Disability details are required")
// //   //       : schema;
// //   //   }),

// //   //   // disabilitydetails: Yup.string().when("disability", (disability, schema) => {
// //   //   //   return disability === "Yes"
// //   //   //     ? schema.required("Disability details are required")
// //   //   //     : schema;
// //   //   // }),

// //   //   // disabilitydetails: Yup.string().when("disability", {
// //   //   //   is: (val) => val === "Yes", // Use a function for more reliable comparison
// //   //   //   then: (schema) => schema.required("Disability details are required"),
// //   //   //   otherwise: (schema) => schema.notRequired(),
// //   //   // }),

// //   //   // disabilitydetails: Yup.string().when("disability", (disability, schema) => {
// //   //   //   console.log("Disability value during validation:", disability);
// //   //   //   console.log("Schema type:", typeof schema);

// //   //   //   try {
// //   //   //     return disability === "Yes"
// //   //   //       ? schema.required("Disability details are required")
// //   //   //       : schema;
// //   //   //   } catch (error) {
// //   //   //     console.error("Error in when clause:", error);
// //   //   //     throw error;
// //   //   //   }
// //   //   // }),

// //   //   SchoolId: Yup.string().required("School is required"),
// //   //   employeetype: Yup.string()
// //   //     .required("Employee type is required")
// //   //     .test(
// //   //       "unique-principal",
// //   //       "This school already has a principal",
// //   //       async function (value) {
// //   //         // Only validate if the selected type is Principal
// //   //         if (value !== "Principal") return true;
// //   //         const { SchoolId } = this.parent;
// //   //         if (!SchoolId) return true; // Skip if no school selected
// //   //         try {
// //   //           const { data, error } = await supabase
// //   //             .from("Teacher")
// //   //             .select("*")
// //   //             .eq("SchoolID", SchoolId)
// //   //             .eq("EmployeeType", "Principal")
// //   //             .neq("EmployementStatus", "Transferred");
// //   //           if (error) throw error;
// //   //           return data.length === 0; // true = valid (no existing principal)
// //   //         } catch (error) {
// //   //           console.error("Error checking existing principal:", error);
// //   //           return this.createError({
// //   //             message: "Could not validate principal status",
// //   //           });
// //   //         }
// //   //       }
// //   //     ),
// //   //   employmentStatus: Yup.string().required("Employment status is required"),
// //   //   employmentType: Yup.string().required("Employment type is required"),
// //   //   address: Yup.string().required("Address is required"),
// //   //   fathername: Yup.string()
// //   //     .matches(/^[A-Za-z\s]+$/, "Only alphabets and spaces are allowed")
// //   //     .required("FatherName is required"),
// //   //   domicile: Yup.string().required("Domicile is required"),
// //   //   bps: Yup.string().required("BPS is required"),
// //   //   // teachersubject: Yup.string().when("employeetype", (employeetype, schema) => {
// //   //   //   const type = Array.isArray(employeetype) ? employeetype[0] : employeetype
// //   //   //   return typeof type === "string" && type.trim().toLowerCase() === "teacher"
// //   //   //     ? schema.required("Teacher subject is required")
// //   //   //     : schema
// //   //   // }),

// //   //   teachersubject: Yup.string().when("employeetype", {
// //   //     is: "Teacher", // Direct comparison
// //   //     then: Yup.string().required("Teacher subject is required"),
// //   //   }),

// //   //   post: Yup.string().when("employeetype", (employeetype, schema) => {
// //   //     const type = Array.isArray(employeetype) ? employeetype[0] : employeetype;
// //   //     return typeof type === "string" && type.trim().toLowerCase() === "teacher"
// //   //       ? schema.required("Post  is required")
// //   //       : schema;
// //   //   }),
// //   // });

// //   const validationSchema = Yup.object().shape({
// //     name: Yup.string()
// //       .matches(/^[A-Za-z\s]+$/, "Only alphabets and spaces are allowed")
// //       .required("Name is required"),
  
// //     cnic: Yup.string()
// //       .required("CNIC is required")
// //       .matches(/^\d{5}-\d{7}-\d{1}$/, "CNIC must be in format 31102-1234567-9")
// //       .test("unique-cnic", "This CNIC is already registered", async (value) => {
// //         if (!value) return true;
// //         const { data, error } = await supabase.from("Teacher").select("CNIC").eq("CNIC", value);
// //         if (error) return false;
// //         return data.length === 0;
// //       }),
  
// //     email: Yup.string()
// //       .email("Invalid email")
// //       .required("Email is required")
// //       .test("unique-email", "This Email is already registered", async function (value) {
// //         if (!value) return true;
// //         const { data, error } = await supabase.from("Teacher").select("Email").eq("Email", value);
// //         if (error) return this.createError({ message: "Could not validate Email" });
// //         return data.length === 0;
// //       }),
  
// //     password: Yup.string()
// //       .min(8, "Password must be at least 8 characters")
// //       .matches(/[a-z]/, "Must contain at least one lowercase letter")
// //       .matches(/[A-Z]/, "Must contain at least one uppercase letter")
// //       .matches(/\d/, "Must contain at least one digit")
// //       .matches(/[@$!%*?&]/, "Must contain at least one special character")
// //       .required("Password is required"),
  
// //     phoneNumber: Yup.string()
// //       .matches(/^\d{9,12}$/, "Phone number must be between 9 and 12 digits")
// //       .required("Phone number is required")
// //       .test("unique-phone", "This phone number is already in use", async function (value) {
// //         if (!value) return true;
// //         const { data, error } = await supabase.from("Teacher").select("PhoneNumber").eq("PhoneNumber", value);
// //         if (error) return this.createError({ message: "Could not validate phone number" });
// //         return data.length === 0;
// //       }),
  
// //     gender: Yup.string().required("Gender is required"),
// //     dateOfBirth: Yup.string().required("Date of birth is required"),
  
// //     hireDate: Yup.string()
// //       .required("Hire date is required")
// //       .test("hireDate-after-dob", "Hire date must be after date of birth", function (value) {
// //         const { dateOfBirth } = this.parent;
// //         return new Date(value) > new Date(dateOfBirth);
// //       }),
  
// //     qualification: Yup.string()
// //       .matches(/^[A-Za-z\s]+$/, "Qualification should contain only alphabets and spaces")
// //       .required("Qualification is required"),
  
// //     experienceyears: Yup.number()
// //       .min(0, "Experience cannot be negative")
// //       .required("Experience is required")
// //       .test("experience-less-than-age", "Experience cannot be greater than age", function (value) {
// //         const { dateOfBirth } = this.parent;
// //         const age = calculateAge(dateOfBirth);
// //         return value <= age;
// //       }),
  
// //     disability: Yup.string().required("Disability status is required"),
  
// //     disabilitydetails: Yup.string().when("disability", {
// //       is: "Yes",
// //       then: Yup.string().required("Disability details are required"),
// //       otherwise: Yup.string().notRequired()
// //     }),
  
// //     SchoolId: Yup.string().required("School is required"),
  
// //     employeetype: Yup.string()
// //       .required("Employee type is required")
// //       .test("unique-principal", "This school already has a principal", async function (value) {
// //         if (value !== "Principal") return true;
// //         const { SchoolId } = this.parent;
// //         if (!SchoolId) return true;
// //         const { data, error } = await supabase
// //           .from("Teacher")
// //           .select("*")
// //           .eq("SchoolID", SchoolId)
// //           .eq("EmployeeType", "Principal")
// //           .neq("EmployementStatus", "Transferred");
// //         if (error) return this.createError({ message: "Could not validate principal status" });
// //         return data.length === 0;
// //       }),
  
// //     employmentStatus: Yup.string().required("Employment status is required"),
// //     employmentType: Yup.string().required("Employment type is required"),
// //     address: Yup.string().required("Address is required"),
  
// //     fathername: Yup.string()
// //       .matches(/^[A-Za-z\s]+$/, "Only alphabets and spaces are allowed")
// //       .required("Father Name is required"),
  
// //     domicile: Yup.string().required("Domicile is required"),
// //     bps: Yup.string().required("BPS is required"),
  
// //     teachersubject: Yup.string().when("employeetype", {
// //       is: "Teacher",
// //       then: Yup.string().required("Teacher subject is required"),
// //       otherwise: Yup.string().notRequired()
// //     }),
  
// //     post: Yup.string().when("employeetype", {
// //       is: "Teacher",
// //       then: Yup.string().required("Post is required"),
// //       otherwise: Yup.string().notRequired()
// //     }),
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
// //       ID: "",
// //       cnic: "",
// //       name: "",
// //       email: "",
// //       password: "Ww@123#w",
// //       phoneNumber: "",
// //       gender: "",
// //       dateOfBirth: "",
// //       disability: "No",
// //       disabilitydetails: "",
// //       qualification: "",
// //       experienceyears: 0,
// //       hireDate: "",
// //       SchoolId: "",
// //       employeetype: "Teacher",
// //       employmentStatus: "Working",
// //       employmentType: "Regular",
// //       address: "",
// //       fathername: "",
// //       domicile: "",
// //       bps: "",
// //       teachersubject: "",
// //       post: "",
// //     },
// //     validationSchema,
// //     onSubmit: async (values) => {
// //       setLoading(true);
// //       try {
// //         if (!values.email || !values.password) {
// //           showAlert("Email and Password are required.", "error");
// //           return;
// //         }
// //         // STEP 1: Store current admin session BEFORE auth operations
// //         const {
// //           data: { session: currentAdminSession },
// //           error: sessionError,
// //         } = await supabase.auth.getSession();
// //         if (sessionError || !currentAdminSession) {
// //           showAlert("Admin session not found. Please login again.", "error");
// //           return;
// //         }
// //         console.log("Admin session stored successfully");

// //         // STEP 2: Create the auth user (this will change the current session)
// //         const { data: authData, error: authError } = await supabase.auth.signUp(
// //           {
// //             email: values.email,
// //             password: values.password,
// //           }
// //         );
// //         if (authError) {
// //           console.error("Auth Error:", authError.message);
// //           showAlert("User Already exist aginst email. Try again!", "error");
// //           return;
// //         }
// //         if (!authData?.user) {
// //           console.error(
// //             "User creation incomplete, email confirmation likely required."
// //           );
// //           showAlert(
// //             "User created! Please confirm the email before proceeding.",
// //             "warning"
// //           );
// //           return;
// //         }
// //         const user = authData.user;
// //         console.log("Auth user created successfully");

// //         // STEP 3: IMMEDIATELY restore the admin session
// //         const { error: restoreError } = await supabase.auth.setSession({
// //           access_token: currentAdminSession.access_token,
// //           refresh_token: currentAdminSession.refresh_token,
// //         });
// //         if (restoreError) {
// //           console.error("Failed to restore admin session:", restoreError);
// //           showAlert("Session restore failed. Please try again.", "error");
// //           return;
// //         }
// //         console.log("Admin session restored successfully");

// //         // STEP 4: Now insert teacher data with restored admin session
// //         const { error: teacherError } = await supabase.from("Teacher").insert([
// //           {
// //             TeacherID: values.ID,
// //             CNIC: values.cnic,
// //             Name: values.name,
// //             Email: values.email,
// //             Password: values.password,
// //             PhoneNumber: values.phoneNumber,
// //             Gender: values.gender,
// //             DateOfBirth: values.dateOfBirth,
// //             Disability: values.disability,
// //             DisabilityDetails: values.disabilitydetails,
// //             Qualification: values.qualification,
// //             ExperienceYear: values.experienceyears,
// //             HireDate: values.hireDate,
// //             SchoolID: values.SchoolId,
// //             EmployeeType: values.employeetype,
// //             EmployementStatus: values.employmentStatus,
// //             EmployementType: values.employmentType,
// //             Address: values.address,
// //             Role: "Teacher",
// //             user_id: user.id,
// //             FatherName: values.fathername,
// //             Domicile: values.domicile,
// //             BPS: values.bps,
// //             TeacherSubject: values.teachersubject,
// //             Post: values.post,
// //           },
// //         ]);
// //         if (teacherError) {
// //           console.error("Error adding Teacher:", teacherError.message);
// //           showAlert("Failed to add teacher. Try again!", "error");
// //           // Optional: Clean up the auth user if teacher creation failed
// //           // Note: This requires admin privileges
// //           try {
// //             await supabase.auth.admin?.deleteUser(user.id);
// //             console.log("Cleaned up auth user due to teacher creation failure");
// //           } catch (cleanupError) {
// //             console.warn("Could not clean up auth user:", cleanupError);
// //           }
// //         } else {
// //           showAlert("Teacher added successfully!", "success");
// //           formik.resetForm({
// //             values: {
// //               ...formik.initialValues,
// //               ID: "T-",
// //             },
// //           });
// //         }
// //       } catch (error) {
// //         console.error("Error in form submission:", error);
// //         showAlert("An unexpected error occurred", "error");
// //         // Try to restore admin session in case of any error
// //         try {
// //           const {
// //             data: { session: fallbackSession },
// //           } = await supabase.auth.getSession();
// //           if (!fallbackSession) {
// //             console.warn(
// //               "No session found after error - admin may need to re-login"
// //             );
// //             showAlert(
// //               "Session lost. Please refresh and login again.",
// //               "warning"
// //             );
// //           }
// //         } catch (sessionCheckError) {
// //           console.error(
// //             "Failed to check session after error:",
// //             sessionCheckError
// //           );
// //         }
// //       } finally {
// //         setLoading(false); // Re-enable button when done (success or error)
// //       }
// //     },
// //   });

// //   useEffect(() => {
// //     if (formik.values.employeetype === "Principal") {
// //       formik.setFieldValue("bps", "Grade 18");
// //     } else if (formik.values.employeetype === "Vice Principal") {
// //       formik.setFieldValue("bps", "Grade 17");
// //     } else if (formik.values.employeetype === "Teacher") {
// //       switch (formik.values.post) {
// //         case "Subject Specialist":
// //         case "Acting Principal":
// //           formik.setFieldValue("bps", "Grade 17");
// //           break;
// //         case "S.S.T":
// //         case "S.S.E":
// //         case "S.S.T(I.T)":
// //           formik.setFieldValue("bps", "Grade 16");
// //           break;
// //         case "Arabic Teacher":
// //         case "E.S.T":
// //         case "E.S.E":
// //         case "P.T.I":
// //           formik.setFieldValue("bps", "Grade 14");
// //           break;
// //         default:
// //           formik.setFieldValue("bps", "");
// //       }
// //     }
// //   }, [formik.values.employeetype, formik.values.post]);

// //   const handleSubmitClick = () => {
// //     console.log("Validating form...");
// //     formik.validateForm().then((errors) => {
// //       console.log("Validating form...", errors);
// //       if (Object.keys(errors).length === 0) {
// //         setOpenConfirmDialog(true); // Open dialog if no errors
// //       }
// //     });
// //   };

// //   const handleConfirmSubmit = () => {
// //     setOpenConfirmDialog(false);
// //     formik.handleSubmit(); // Proceed with submission
// //   };

// //   return (
// //     <Box
// //       display="flex"
// //       justifyContent="center"
// //       alignItems="flex-start"
// //       bgcolor="#f5f5f5"
// //       p={isMobile ? 1 : isTablet ? 2 : 4}
// //       minHeight="100vh"
// //     >
// //       <Card
// //         sx={{
// //           width: "100%",
// //           maxWidth: isMobile ? "100%" : 800,
// //           padding: isMobile ? 1 : isTablet ? 2 : 3,
// //           boxShadow: 6,
// //           borderRadius: 2,
// //           margin: isMobile ? 0 : "auto",
// //         }}
// //       >
// //         <CardContent sx={{ padding: isMobile ? 1 : 2 }}>
// //           <Typography
// //             variant={isMobile ? "h5" : "h4"}
// //             align="center"
// //             gutterBottom
// //             sx={{
// //               fontWeight: "bold",
// //               color: "#3f51b5",
// //               mb: isMobile ? 2 : 3,
// //               fontSize: isMobile ? "1.5rem" : "2.125rem",
// //             }}
// //           >
// //             Add Teacher
// //           </Typography>

// //           <Paper
// //             sx={{
// //               padding: isMobile ? 2 : 3,
// //               borderRadius: 2,
// //               backgroundColor: "#fff",
// //             }}
// //             elevation={3}
// //           >
// //             <form onSubmit={formik.handleSubmit}>
// //               <Grid container spacing={isMobile ? 1.5 : 2}>
// //                 {/* Personal Information Section */}
// //                 <Grid item xs={12}>
// //                   <Typography
// //                     variant={isMobile ? "subtitle1" : "h6"}
// //                     gutterBottom
// //                     sx={{
// //                       fontSize: isMobile ? "1rem" : "1.25rem",
// //                       fontWeight: "medium",
// //                       color: "#3f51b5",
// //                       mb: isMobile ? 1 : 2,
// //                     }}
// //                   >
// //                     Personal Information
// //                   </Typography>
// //                   <Divider sx={{ mb: isMobile ? 1 : 2 }} />
// //                 </Grid>

// //                 <Grid item xs={12} sm={6}>
// //                   <TextField
// //                     label="Name"
// //                     fullWidth
// //                     name="name"
// //                     value={formik.values.name}
// //                     onChange={formik.handleChange}
// //                     onBlur={formik.handleBlur}
// //                     error={formik.touched.name && Boolean(formik.errors.name)}
// //                     helperText={formik.touched.name && formik.errors.name}
// //                     required
// //                     size={isMobile ? "small" : "medium"}
// //                     sx={{
// //                       "& .MuiInputBase-root": {
// //                         fontSize: isMobile ? "0.875rem" : "1rem",
// //                       },
// //                       "& .MuiInputLabel-root": {
// //                         fontSize: isMobile ? "0.875rem" : "1rem",
// //                       },
// //                       "& .MuiFormHelperText-root": {
// //                         fontSize: isMobile ? "0.75rem" : "0.875rem",
// //                       },
// //                     }}
// //                   />
// //                 </Grid>

// //                 <Grid item xs={12} sm={6}>
// //                   <TextField
// //                     label="Father Name"
// //                     fullWidth
// //                     name="fathername"
// //                     value={formik.values.fathername}
// //                     onChange={formik.handleChange}
// //                     onBlur={formik.handleBlur}
// //                     error={
// //                       formik.touched.fathername &&
// //                       Boolean(formik.errors.fathername)
// //                     }
// //                     helperText={
// //                       formik.touched.fathername && formik.errors.fathername
// //                     }
// //                     required
// //                     size={isMobile ? "small" : "medium"}
// //                     sx={{
// //                       "& .MuiInputBase-root": {
// //                         fontSize: isMobile ? "0.875rem" : "1rem",
// //                       },
// //                       "& .MuiInputLabel-root": {
// //                         fontSize: isMobile ? "0.875rem" : "1rem",
// //                       },
// //                       "& .MuiFormHelperText-root": {
// //                         fontSize: isMobile ? "0.75rem" : "0.875rem",
// //                       },
// //                     }}
// //                   />
// //                 </Grid>

// //                 <Grid item xs={12} sm={6}>
// //                   <InputMask
// //                     mask="99999-9999999-9" // Forces XXXXX-XXXXXXX-X format
// //                     value={formik.values.cnic}
// //                     onChange={(e) => {
// //                       formik.setFieldValue("cnic", e.target.value); // Stores with dashes
// //                     }}
// //                     onBlur={formik.handleBlur}
// //                   >
// //                     {(inputProps) => (
// //                       <TextField
// //                         {...inputProps}
// //                         label="CNIC"
// //                         fullWidth
// //                         name="cnic"
// //                         error={
// //                           formik.touched.cnic && Boolean(formik.errors.cnic)
// //                         }
// //                         helperText={formik.touched.cnic && formik.errors.cnic}
// //                         required
// //                         placeholder="31102-1234567-9"
// //                         size={isMobile ? "small" : "medium"}
// //                         sx={{
// //                           "& .MuiInputBase-root": {
// //                             fontSize: isMobile ? "0.875rem" : "1rem",
// //                           },
// //                           "& .MuiInputLabel-root": {
// //                             fontSize: isMobile ? "0.875rem" : "1rem",
// //                           },
// //                           "& .MuiFormHelperText-root": {
// //                             fontSize: isMobile ? "0.75rem" : "0.875rem",
// //                           },
// //                         }}
// //                       />
// //                     )}
// //                   </InputMask>
// //                 </Grid>

// //                 <Grid item xs={12} sm={6}>
// //                   <TextField
// //                     label="Email"
// //                     fullWidth
// //                     name="email"
// //                     value={formik.values.email}
// //                     onChange={formik.handleChange}
// //                     onBlur={formik.handleBlur}
// //                     error={formik.touched.email && Boolean(formik.errors.email)}
// //                     helperText={formik.touched.email && formik.errors.email}
// //                     required
// //                     size={isMobile ? "small" : "medium"}
// //                     sx={{
// //                       "& .MuiInputBase-root": {
// //                         fontSize: isMobile ? "0.875rem" : "1rem",
// //                       },
// //                       "& .MuiInputLabel-root": {
// //                         fontSize: isMobile ? "0.875rem" : "1rem",
// //                       },
// //                       "& .MuiFormHelperText-root": {
// //                         fontSize: isMobile ? "0.75rem" : "0.875rem",
// //                       },
// //                     }}
// //                   />
// //                 </Grid>

// //                 <Grid item xs={12} sm={6}>
// //                   <TextField
// //                     label="Password"
// //                     type={showPassword ? "text" : "password"}
// //                     fullWidth
// //                     name="password"
// //                     value={formik.values.password}
// //                     onChange={formik.handleChange}
// //                     onBlur={formik.handleBlur}
// //                     error={
// //                       formik.touched.password && Boolean(formik.errors.password)
// //                     }
// //                     helperText={
// //                       formik.touched.password && formik.errors.password
// //                     }
// //                     required
// //                     size={isMobile ? "small" : "medium"}
// //                     InputProps={{
// //                       endAdornment: (
// //                         <Button
// //                           onClick={togglePasswordVisibility}
// //                           size="small"
// //                           sx={{ minWidth: "auto", p: 0.5 }}
// //                         >
// //                           {showPassword ? <Visibility /> : <VisibilityOff />}
// //                         </Button>
// //                       ),
// //                     }}
// //                     sx={{
// //                       "& .MuiInputBase-root": {
// //                         fontSize: isMobile ? "0.875rem" : "1rem",
// //                       },
// //                       "& .MuiInputLabel-root": {
// //                         fontSize: isMobile ? "0.875rem" : "1rem",
// //                       },
// //                       "& .MuiFormHelperText-root": {
// //                         fontSize: isMobile ? "0.75rem" : "0.875rem",
// //                       },
// //                     }}
// //                   />
// //                 </Grid>

// //                 <Grid item xs={12} sm={6}>
// //                   <TextField
// //                     label="Phone Number"
// //                     fullWidth
// //                     name="phoneNumber"
// //                     value={formik.values.phoneNumber}
// //                     onChange={formik.handleChange}
// //                     onBlur={formik.handleBlur}
// //                     error={
// //                       formik.touched.phoneNumber &&
// //                       Boolean(formik.errors.phoneNumber)
// //                     }
// //                     helperText={
// //                       formik.touched.phoneNumber && formik.errors.phoneNumber
// //                     }
// //                     required
// //                     size={isMobile ? "small" : "medium"}
// //                     sx={{
// //                       "& .MuiInputBase-root": {
// //                         fontSize: isMobile ? "0.875rem" : "1rem",
// //                       },
// //                       "& .MuiInputLabel-root": {
// //                         fontSize: isMobile ? "0.875rem" : "1rem",
// //                       },
// //                       "& .MuiFormHelperText-root": {
// //                         fontSize: isMobile ? "0.75rem" : "0.875rem",
// //                       },
// //                     }}
// //                   />
// //                 </Grid>

// //                 <Grid item xs={12} sm={6}>
// //                   <FormControl
// //                     fullWidth
// //                     required
// //                     size={isMobile ? "small" : "medium"}
// //                     sx={{
// //                       "& .MuiInputBase-root": {
// //                         fontSize: isMobile ? "0.875rem" : "1rem",
// //                       },
// //                       "& .MuiInputLabel-root": {
// //                         fontSize: isMobile ? "0.875rem" : "1rem",
// //                       },
// //                     }}
// //                   >
// //                     <InputLabel>Gender</InputLabel>
// //                     <Select
// //                       label="Gender"
// //                       name="gender"
// //                       value={formik.values.gender}
// //                       onChange={formik.handleChange}
// //                       onBlur={formik.handleBlur}
// //                       error={
// //                         formik.touched.gender && Boolean(formik.errors.gender)
// //                       }
// //                     >
// //                       <MenuItem value="Male">Male</MenuItem>
// //                       <MenuItem value="Female">Female</MenuItem>
// //                     </Select>
// //                   </FormControl>
// //                 </Grid>

// //                 <Grid item xs={12} sm={6}>
// //                   <TextField
// //                     label="Date of Birth"
// //                     type="date"
// //                     fullWidth
// //                     InputLabelProps={{ shrink: true }}
// //                     name="dateOfBirth"
// //                     value={formik.values.dateOfBirth}
// //                     onChange={formik.handleChange}
// //                     onBlur={formik.handleBlur}
// //                     error={
// //                       formik.touched.dateOfBirth &&
// //                       Boolean(formik.errors.dateOfBirth)
// //                     }
// //                     helperText={
// //                       formik.touched.dateOfBirth && formik.errors.dateOfBirth
// //                     }
// //                     inputProps={{
// //                       max: new Date().toISOString().split("T")[0], // Sets max date to today
// //                     }}
// //                     required
// //                     size={isMobile ? "small" : "medium"}
// //                     sx={{
// //                       "& .MuiInputBase-root": {
// //                         fontSize: isMobile ? "0.875rem" : "1rem",
// //                       },
// //                       "& .MuiInputLabel-root": {
// //                         fontSize: isMobile ? "0.875rem" : "1rem",
// //                       },
// //                       "& .MuiFormHelperText-root": {
// //                         fontSize: isMobile ? "0.75rem" : "0.875rem",
// //                       },
// //                     }}
// //                   />
// //                 </Grid>

// //                 <Grid item xs={12} sm={6}>
// //                   <FormControl
// //                     fullWidth
// //                     required
// //                     size={isMobile ? "small" : "medium"}
// //                     sx={{
// //                       "& .MuiInputBase-root": {
// //                         fontSize: isMobile ? "0.875rem" : "1rem",
// //                       },
// //                       "& .MuiInputLabel-root": {
// //                         fontSize: isMobile ? "0.875rem" : "1rem",
// //                       },
// //                     }}
// //                   >
// //                     <InputLabel>Domicile</InputLabel>
// //                     <Select
// //                       label="Domicile"
// //                       name="domicile"
// //                       value={formik.values.domicile}
// //                       onChange={formik.handleChange}
// //                       onBlur={formik.handleBlur}
// //                       error={
// //                         formik.touched.domicile &&
// //                         Boolean(formik.errors.domicile)
// //                       }
// //                     >
// //                       <MenuItem value="Attock">Attock</MenuItem>
// //                       <MenuItem value="Bahawalnagar">Bahawalnagar</MenuItem>
// //                       <MenuItem value="Bahawalpur">Bahawalpur</MenuItem>
// //                       <MenuItem value="Bhakkar">Bhakkar</MenuItem>
// //                       <MenuItem value="Chakwal">Chakwal</MenuItem>
// //                       <MenuItem value="Chiniot">Chiniot</MenuItem>
// //                       <MenuItem value="Dera Ghazi Khan">
// //                         Dera Ghazi Khan
// //                       </MenuItem>
// //                       <MenuItem value="Faisalabad">Faisalabad</MenuItem>
// //                       <MenuItem value="Gujranwala">Gujranwala</MenuItem>
// //                       <MenuItem value="Gujrat">Gujrat</MenuItem>
// //                       <MenuItem value="Hafizabad">Hafizabad</MenuItem>
// //                       <MenuItem value="Jhang">Jhang</MenuItem>
// //                       <MenuItem value="Jhelum">Jhelum</MenuItem>
// //                       <MenuItem value="Kasur">Kasur</MenuItem>
// //                       <MenuItem value="Khanewal">Khanewal</MenuItem>
// //                       <MenuItem value="Khushab">Khushab</MenuItem>
// //                       <MenuItem value="Lahore">Lahore</MenuItem>
// //                       <MenuItem value="Layyah">Layyah</MenuItem>
// //                       <MenuItem value="Lodhran">Lodhran</MenuItem>
// //                       <MenuItem value="Mandi Bahauddin">
// //                         Mandi Bahauddin
// //                       </MenuItem>
// //                       <MenuItem value="Mianwali">Mianwali</MenuItem>
// //                       <MenuItem value="Multan">Multan</MenuItem>
// //                       <MenuItem value="Muzaffargarh">Muzaffargarh</MenuItem>
// //                       <MenuItem value="Narowal">Narowal</MenuItem>
// //                       <MenuItem value="Nankana Sahib">Nankana Sahib</MenuItem>
// //                       <MenuItem value="Okara">Okara</MenuItem>
// //                       <MenuItem value="Pakpattan">Pakpattan</MenuItem>
// //                       <MenuItem value="Rahim Yar Khan">Rahim Yar Khan</MenuItem>
// //                       <MenuItem value="Rajanpur">Rajanpur</MenuItem>
// //                       <MenuItem value="Rawalpindi">Rawalpindi</MenuItem>
// //                       <MenuItem value="Sahiwal">Sahiwal</MenuItem>
// //                       <MenuItem value="Sargodha">Sargodha</MenuItem>
// //                       <MenuItem value="Sheikhupura">Sheikhupura</MenuItem>
// //                       <MenuItem value="Sialkot">Sialkot</MenuItem>
// //                       <MenuItem value="Toba Tek Singh">Toba Tek Singh</MenuItem>
// //                       <MenuItem value="Vehari">Vehari</MenuItem>
// //                     </Select>
// //                   </FormControl>
// //                 </Grid>

// //                 <Grid item xs={12}>
// //                   <TextField
// //                     label="Address"
// //                     fullWidth
// //                     name="address"
// //                     value={formik.values.address}
// //                     onChange={formik.handleChange}
// //                     onBlur={formik.handleBlur}
// //                     error={
// //                       formik.touched.address && Boolean(formik.errors.address)
// //                     }
// //                     helperText={formik.touched.address && formik.errors.address}
// //                     required
// //                     multiline
// //                     rows={isMobile ? 2 : 3}
// //                     size={isMobile ? "small" : "medium"}
// //                     sx={{
// //                       "& .MuiInputBase-root": {
// //                         fontSize: isMobile ? "0.875rem" : "1rem",
// //                       },
// //                       "& .MuiInputLabel-root": {
// //                         fontSize: isMobile ? "0.875rem" : "1rem",
// //                       },
// //                       "& .MuiFormHelperText-root": {
// //                         fontSize: isMobile ? "0.75rem" : "0.875rem",
// //                       },
// //                     }}
// //                   />
// //                 </Grid>

// //                 <Grid item xs={12} sm={6}>
// //                   <FormControl
// //                     fullWidth
// //                     required
// //                     size={isMobile ? "small" : "medium"}
// //                     sx={{
// //                       "& .MuiInputBase-root": {
// //                         fontSize: isMobile ? "0.875rem" : "1rem",
// //                       },
// //                       "& .MuiInputLabel-root": {
// //                         fontSize: isMobile ? "0.875rem" : "1rem",
// //                       },
// //                     }}
// //                   >
// //                     <InputLabel>Disability</InputLabel>
// //                     <Select
// //                       label="Disability"
// //                       name="disability"
// //                       value={formik.values.disability}
// //                       onChange={formik.handleChange}
// //                       onBlur={formik.handleBlur}
// //                       error={
// //                         formik.touched.disability &&
// //                         Boolean(formik.errors.disability)
// //                       }
// //                     >
// //                       <MenuItem value="Yes">Yes</MenuItem>
// //                       <MenuItem value="No">No</MenuItem>
// //                     </Select>
// //                   </FormControl>
// //                 </Grid>

// //                 {formik.values.disability === "Yes" && (
// //                   <Grid item xs={12} sm={6}>
// //                     <TextField
// //                       label="Disability Details"
// //                       fullWidth
// //                       name="disabilitydetails"
// //                       value={formik.values.disabilitydetails}
// //                       onChange={formik.handleChange}
// //                       onBlur={formik.handleBlur}
// //                       error={
// //                         formik.touched.disabilitydetails
// //                          &&
// //                         Boolean(formik.errors.disabilitydetails)
// //                       }
// //                       helperText={
// //                         formik.touched.disabilitydetails &&
// //                         formik.errors.disabilitydetails
// //                       }
// //                       required={formik.values.disability === "Yes"}
// //                       size={isMobile ? "small" : "medium"}
// //                       sx={{
// //                         "& .MuiInputBase-root": {
// //                           fontSize: isMobile ? "0.875rem" : "1rem",
// //                         },
// //                         "& .MuiInputLabel-root": {
// //                           fontSize: isMobile ? "0.875rem" : "1rem",
// //                         },
// //                         "& .MuiFormHelperText-root": {
// //                           fontSize: isMobile ? "0.75rem" : "0.875rem",
// //                         },
// //                       }}
// //                     />
// //                   </Grid>
// //                 )}

// //                 {/* Educational Details Section */}
// //                 <Grid item xs={12}>
// //                   <Typography
// //                     variant={isMobile ? "subtitle1" : "h6"}
// //                     gutterBottom
// //                     sx={{
// //                       fontSize: isMobile ? "1rem" : "1.25rem",
// //                       fontWeight: "medium",
// //                       color: "#3f51b5",
// //                       mb: isMobile ? 1 : 2,
// //                       mt: isMobile ? 2 : 3,
// //                     }}
// //                   >
// //                     Educational Details
// //                   </Typography>
// //                   <Divider sx={{ mb: isMobile ? 1 : 2 }} />
// //                 </Grid>

// //                 <Grid item xs={12} sm={6}>
// //                   <TextField
// //                     label="Qualification"
// //                     fullWidth
// //                     name="qualification"
// //                     value={formik.values.qualification}
// //                     onChange={formik.handleChange}
// //                     onBlur={formik.handleBlur}
// //                     error={
// //                       formik.touched.qualification &&
// //                       Boolean(formik.errors.qualification)
// //                     }
// //                     helperText={
// //                       formik.touched.qualification &&
// //                       formik.errors.qualification
// //                     }
// //                     required
// //                     size={isMobile ? "small" : "medium"}
// //                     sx={{
// //                       "& .MuiInputBase-root": {
// //                         fontSize: isMobile ? "0.875rem" : "1rem",
// //                       },
// //                       "& .MuiInputLabel-root": {
// //                         fontSize: isMobile ? "0.875rem" : "1rem",
// //                       },
// //                       "& .MuiFormHelperText-root": {
// //                         fontSize: isMobile ? "0.75rem" : "0.875rem",
// //                       },
// //                     }}
// //                   />
// //                 </Grid>

// //                 <Grid item xs={12} sm={6}>
// //                   <TextField
// //                     label="Experience (Years)"
// //                     fullWidth
// //                     name="experienceyears"
// //                     type="number"
// //                     value={formik.values.experienceyears}
// //                     onChange={(e) => {
// //                       const value = Number.parseInt(e.target.value, 10);
// //                       formik.setFieldValue(
// //                         "experienceyears",
// //                         value >= 0 ? value : 0
// //                       );
// //                     }}
// //                     onBlur={formik.handleBlur}
// //                     error={
// //                       formik.touched.experienceyears &&
// //                       Boolean(formik.errors.experienceyears)
// //                     }
// //                     helperText={
// //                       formik.touched.experienceyears &&
// //                       formik.errors.experienceyears
// //                     }
// //                     inputProps={{ min: 0 }}
// //                     required
// //                     size={isMobile ? "small" : "medium"}
// //                     sx={{
// //                       "& .MuiInputBase-root": {
// //                         fontSize: isMobile ? "0.875rem" : "1rem",
// //                       },
// //                       "& .MuiInputLabel-root": {
// //                         fontSize: isMobile ? "0.875rem" : "1rem",
// //                       },
// //                       "& .MuiFormHelperText-root": {
// //                         fontSize: isMobile ? "0.75rem" : "0.875rem",
// //                       },
// //                     }}
// //                   />
// //                 </Grid>

// //                 {/* School Information Section */}
// //                 <Grid item xs={12}>
// //                   <Typography
// //                     variant={isMobile ? "subtitle1" : "h6"}
// //                     gutterBottom
// //                     sx={{
// //                       fontSize: isMobile ? "1rem" : "1.25rem",
// //                       fontWeight: "medium",
// //                       color: "#3f51b5",
// //                       mb: isMobile ? 1 : 2,
// //                       mt: isMobile ? 2 : 3,
// //                     }}
// //                   >
// //                     School Information
// //                   </Typography>
// //                   <Divider sx={{ mb: isMobile ? 1 : 2 }} />
// //                 </Grid>

// //                 <Grid item xs={12} sm={6}>
// //                   <TextField
// //                     label="Teacher ID"
// //                     type="text"
// //                     fullWidth
// //                     InputLabelProps={{ shrink: true }}
// //                     name="ID"
// //                     value={formik.values.ID}
// //                     disabled
// //                     size={isMobile ? "small" : "medium"}
// //                     sx={{
// //                       "& .MuiInputBase-root": {
// //                         fontSize: isMobile ? "0.875rem" : "1rem",
// //                       },
// //                       "& .MuiInputLabel-root": {
// //                         fontSize: isMobile ? "0.875rem" : "1rem",
// //                       },
// //                     }}
// //                   />
// //                 </Grid>

// //                 <Grid item xs={12} sm={6}>
// //                   <FormControl
// //                     fullWidth
// //                     size={isMobile ? "small" : "medium"}
// //                     sx={{
// //                       "& .MuiInputBase-root": {
// //                         fontSize: isMobile ? "0.875rem" : "1rem",
// //                       },
// //                       "& .MuiInputLabel-root": {
// //                         fontSize: isMobile ? "0.875rem" : "1rem",
// //                       },
// //                     }}
// //                   >
// //                     <InputLabel>School ID</InputLabel>
// //                     <Select
// //                       label="School Id"
// //                       name="SchoolId"
// //                       value={formik.values.SchoolId}
// //                       onChange={async (e) => {
// //                         const value = e.target.value;
// //                         formik.setFieldValue("SchoolId", value);
// //                         await generateTeacherID(value);
// //                       }}
// //                       onBlur={formik.handleBlur}
// //                       error={
// //                         formik.touched.SchoolId &&
// //                         Boolean(formik.errors.SchoolId)
// //                       }
// //                     >
// //                       {schools.map((school) => (
// //                         <MenuItem key={school.SchoolID} value={school.SchoolID}>
// //                           {school.SchoolID} - {school.SchoolName}
// //                         </MenuItem>
// //                       ))}
// //                     </Select>
// //                   </FormControl>
// //                 </Grid>

// //                 <Grid item xs={12} sm={6}>
// //                   <TextField
// //                     label="Hire Date"
// //                     type="date"
// //                     fullWidth
// //                     InputLabelProps={{ shrink: true }}
// //                     name="hireDate"
// //                     value={formik.values.hireDate}
// //                     onChange={formik.handleChange}
// //                     onBlur={formik.handleBlur}
// //                     error={
// //                       formik.touched.hireDate && Boolean(formik.errors.hireDate)
// //                     }
// //                     helperText={
// //                       formik.touched.hireDate && formik.errors.hireDate
// //                     }
// //                     required
// //                     size={isMobile ? "small" : "medium"}
// //                     sx={{
// //                       "& .MuiInputBase-root": {
// //                         fontSize: isMobile ? "0.875rem" : "1rem",
// //                       },
// //                       "& .MuiInputLabel-root": {
// //                         fontSize: isMobile ? "0.875rem" : "1rem",
// //                       },
// //                       "& .MuiFormHelperText-root": {
// //                         fontSize: isMobile ? "0.75rem" : "0.875rem",
// //                       },
// //                     }}
// //                   />
// //                 </Grid>

// //                 <Grid item xs={12} sm={6}>
// //                   <FormControl
// //                     fullWidth
// //                     required
// //                     size={isMobile ? "small" : "medium"}
// //                     sx={{
// //                       "& .MuiInputBase-root": {
// //                         fontSize: isMobile ? "0.875rem" : "1rem",
// //                       },
// //                       "& .MuiInputLabel-root": {
// //                         fontSize: isMobile ? "0.875rem" : "1rem",
// //                       },
// //                     }}
// //                   >
// //                     <InputLabel>Employee Type</InputLabel>
// //                     <Select
// //                       label="Employee Type"
// //                       name="employeetype"
// //                       value={formik.values.employeetype}
// //                       onChange={formik.handleChange}
// //                       onBlur={formik.handleBlur}
// //                       error={
// //                         formik.touched.employeetype &&
// //                         Boolean(formik.errors.employeetype)
// //                       }
// //                     >
// //                       <MenuItem value="Principal">Principal</MenuItem>
// //                       <MenuItem value="Vice Principal">Vice Principal</MenuItem>
// //                       <MenuItem value="Teacher">Teacher</MenuItem>
// //                     </Select>
// //                     {formik.touched.employeetype &&
// //                       formik.errors.employeetype && (
// //                         <Typography
// //                           variant="caption"
// //                           color="error"
// //                           sx={{
// //                             ml: 2,
// //                             fontSize: isMobile ? "0.7rem" : "0.75rem",
// //                           }}
// //                         >
// //                           {formik.errors.employeetype}
// //                         </Typography>
// //                       )}
// //                   </FormControl>
// //                 </Grid>

// //                 <Grid item xs={12} sm={6}>
// //                   <FormControl
// //                     fullWidth
// //                     required
// //                     size={isMobile ? "small" : "medium"}
// //                     sx={{
// //                       "& .MuiInputBase-root": {
// //                         fontSize: isMobile ? "0.875rem" : "1rem",
// //                       },
// //                       "& .MuiInputLabel-root": {
// //                         fontSize: isMobile ? "0.875rem" : "1rem",
// //                       },
// //                     }}
// //                   >
// //                     <InputLabel>Employment Status</InputLabel>
// //                     <Select
// //                       label="Employment Status"
// //                       name="employmentStatus"
// //                       value={formik.values.employmentStatus}
// //                       onChange={formik.handleChange}
// //                       onBlur={formik.handleBlur}
// //                       error={
// //                         formik.touched.employmentStatus &&
// //                         Boolean(formik.errors.employmentStatus)
// //                       }
// //                     >
// //                       <MenuItem value="Working">Working</MenuItem>
// //                       <MenuItem value="Retired">Retired</MenuItem>
// //                       <MenuItem value="Removed">Removed</MenuItem>
// //                     </Select>
// //                   </FormControl>
// //                 </Grid>

// //                 <Grid item xs={12} sm={6}>
// //                   <FormControl
// //                     fullWidth
// //                     required
// //                     size={isMobile ? "small" : "medium"}
// //                     sx={{
// //                       "& .MuiInputBase-root": {
// //                         fontSize: isMobile ? "0.875rem" : "1rem",
// //                       },
// //                       "& .MuiInputLabel-root": {
// //                         fontSize: isMobile ? "0.875rem" : "1rem",
// //                       },
// //                     }}
// //                   >
// //                     <InputLabel>Employment Type</InputLabel>
// //                     <Select
// //                       label="Employment Type"
// //                       name="employmentType"
// //                       value={formik.values.employmentType}
// //                       onChange={formik.handleChange}
// //                       onBlur={formik.handleBlur}
// //                       error={
// //                         formik.touched.employmentType &&
// //                         Boolean(formik.errors.employmentType)
// //                       }
// //                     >
// //                       <MenuItem value="Regular">Regular</MenuItem>
// //                       <MenuItem value="Contract">Contract</MenuItem>
// //                       <MenuItem value="Deputation">Deputation</MenuItem>
// //                     </Select>
// //                   </FormControl>
// //                 </Grid>

// //                 {formik.values.employeetype === "Teacher" && (
// //                   <Grid item xs={12} sm={6}>
// //                     <FormControl
// //                       fullWidth
// //                       required
// //                       size={isMobile ? "small" : "medium"}
// //                       sx={{
// //                         "& .MuiInputBase-root": {
// //                           fontSize: isMobile ? "0.875rem" : "1rem",
// //                         },
// //                         "& .MuiInputLabel-root": {
// //                           fontSize: isMobile ? "0.875rem" : "1rem",
// //                         },
// //                       }}
// //                     >
// //                       <InputLabel>Post</InputLabel>
// //                       <Select
// //                         label="Post"
// //                         name="post"
// //                         value={formik.values.post}
// //                         onChange={formik.handleChange}
// //                         onBlur={formik.handleBlur}
// //                         error={
// //                           formik.touched.post && Boolean(formik.errors.post)
// //                         }
// //                         required={formik.values.employeetype === "Teacher"}
// //                       >
// //                         <MenuItem value="Subject Specialist">
// //                           Subject Specialist
// //                         </MenuItem>
// //                         <MenuItem value="S.S.T">S.S.T</MenuItem>
// //                         <MenuItem value="S.S.E">S.S.E</MenuItem>
// //                         <MenuItem value="Acting Principal">
// //                           Acting Principal
// //                         </MenuItem>
// //                         <MenuItem value="S.S.T(I.T)">S.S.T(I.T)</MenuItem>
// //                         <MenuItem value="Arabic Teacher">
// //                           Arabic Teacher
// //                         </MenuItem>
// //                         <MenuItem value="E.S.T">E.S.T</MenuItem>
// //                         <MenuItem value="E.S.E">E.S.E</MenuItem>
// //                         <MenuItem value="P.T.I">P.T.I</MenuItem>
// //                       </Select>
// //                     </FormControl>
// //                   </Grid>
// //                 )}

// //                 {formik.values.employeetype === "Teacher" && (
// //                   <Grid item xs={12} sm={6}>
// //                     <TextField
// //                       label="Teacher Subject"
// //                       fullWidth
// //                       name="teachersubject"
// //                       value={formik.values.teachersubject}
// //                       onChange={formik.handleChange}
// //                       onBlur={formik.handleBlur}
// //                       error={
// //                         formik.touched.teachersubject &&
// //                         Boolean(formik.errors.teachersubject)
// //                       }
// //                       helperText={
// //                         formik.touched.teachersubject &&
// //                         formik.errors.teachersubject
// //                       }
// //                       required={formik.values.employeetype === "Teacher"}
// //                       size={isMobile ? "small" : "medium"}
// //                       sx={{
// //                         "& .MuiInputBase-root": {
// //                           fontSize: isMobile ? "0.875rem" : "1rem",
// //                         },
// //                         "& .MuiInputLabel-root": {
// //                           fontSize: isMobile ? "0.875rem" : "1rem",
// //                         },
// //                         "& .MuiFormHelperText-root": {
// //                           fontSize: isMobile ? "0.75rem" : "0.875rem",
// //                         },
// //                       }}
// //                     />
// //                   </Grid>
// //                 )}

// //                 <Grid item xs={12} sm={6}>
// //                   <TextField
// //                     label="BPS"
// //                     fullWidth
// //                     name="bps"
// //                     value={formik.values.bps}
// //                     onChange={formik.handleChange}
// //                     onBlur={formik.handleBlur}
// //                     error={formik.touched.bps && Boolean(formik.errors.bps)}
// //                     helperText={formik.touched.bps && formik.errors.bps}
// //                     required
// //                     disabled // Make it disabled since it's auto-calculated
// //                     size={isMobile ? "small" : "medium"}
// //                     sx={{
// //                       "& .MuiInputBase-root": {
// //                         fontSize: isMobile ? "0.875rem" : "1rem",
// //                       },
// //                       "& .MuiInputLabel-root": {
// //                         fontSize: isMobile ? "0.875rem" : "1rem",
// //                       },
// //                       "& .MuiFormHelperText-root": {
// //                         fontSize: isMobile ? "0.75rem" : "0.875rem",
// //                       },
// //                     }}
// //                   />
// //                 </Grid>

// //                 {/* Submit Button */}
// //                 <Grid item xs={12}>
// //                   <Button
// //                     onClick={handleSubmitClick} // Not formik.handleSubmit
// //                     variant="contained"
// //                     color="primary"
// //                     fullWidth
// //                     disabled={loading}
// //                     size={isMobile ? "medium" : "large"}
// //                     sx={{
// //                       fontSize: isMobile ? "0.875rem" : "1rem",
// //                       padding: isMobile ? "10px 16px" : "12px 20px",
// //                       mt: isMobile ? 2 : 3,
// //                     }}
// //                   >
// //                     {loading ? (
// //                       <>
// //                         <CircularProgress
// //                           size={isMobile ? 20 : 24}
// //                           sx={{ mr: 1 }}
// //                         />
// //                         Adding...
// //                       </>
// //                     ) : (
// //                       "Add Teacher"
// //                     )}
// //                   </Button>
// //                 </Grid>
// //               </Grid>
// //             </form>
// //           </Paper>
// //         </CardContent>
// //       </Card>

// //       {/* Snackbar for Alerts */}
// //       <Snackbar
// //         open={alert.open}
// //         autoHideDuration={6000}
// //         onClose={handleCloseAlert}
// //         anchorOrigin={{
// //           vertical: isMobile ? "top" : "bottom",
// //           horizontal: "center",
// //         }}
// //       >
// //         <Alert
// //           onClose={handleCloseAlert}
// //           severity={alert.severity}
// //           sx={{
// //             width: isMobile ? "90vw" : "100%",
// //             maxWidth: isMobile ? "90vw" : "600px",
// //             fontSize: isMobile ? "0.875rem" : "1rem",
// //           }}
// //         >
// //           {alert.message}
// //         </Alert>
// //       </Snackbar>

// //       <Dialog
// //         open={openConfirmDialog}
// //         onClose={() => setOpenConfirmDialog(false)}
// //         maxWidth="sm"
// //         fullWidth
// //         PaperProps={{
// //           sx: {
// //             margin: isMobile ? 1 : 3,
// //             width: isMobile ? "calc(100% - 16px)" : "auto",
// //             maxHeight: isMobile ? "90vh" : "80vh",
// //           },
// //         }}
// //       >
// //         <DialogTitle
// //           sx={{
// //             fontSize: isMobile ? "1.1rem" : "1.25rem",
// //             padding: isMobile ? "12px 16px" : "16px 24px",
// //             color: "#3f51b5",
// //             fontWeight: "bold",
// //           }}
// //         >
// //           Confirm Teacher Registration
// //         </DialogTitle>
// //         <DialogContent
// //           sx={{
// //             padding: isMobile ? "8px 16px" : "16px 24px",
// //             overflowY: "auto",
// //           }}
// //         >
// //           <DialogContentText
// //             sx={{
// //               fontSize: isMobile ? "0.875rem" : "1rem",
// //               mb: 2,
// //             }}
// //           >
// //             Are you sure you want to add this teacher?
// //           </DialogContentText>
// //           <Box sx={{ mt: 2 }}>
// //             <Typography
// //               sx={{
// //                 fontSize: isMobile ? "0.875rem" : "1rem",
// //                 mb: 1,
// //                 wordBreak: "break-word",
// //               }}
// //             >
// //               <strong>Name:</strong> {formik.values.name}
// //             </Typography>
// //             <Typography
// //               sx={{
// //                 fontSize: isMobile ? "0.875rem" : "1rem",
// //                 mb: 1,
// //               }}
// //             >
// //               <strong>CNIC:</strong> {formik.values.cnic}
// //             </Typography>
// //             <Typography
// //               sx={{
// //                 fontSize: isMobile ? "0.875rem" : "1rem",
// //                 mb: 1,
// //                 wordBreak: "break-word",
// //               }}
// //             >
// //               <strong>School:</strong>{" "}
// //               {
// //                 schools.find((s) => s.SchoolID === formik.values.SchoolId)
// //                   ?.SchoolName
// //               }
// //             </Typography>
// //           </Box>
// //         </DialogContent>
// //         <DialogActions
// //           sx={{
// //             padding: isMobile ? "8px 16px 16px" : "8px 24px 24px",
// //             gap: isMobile ? 1 : 0,
// //             flexDirection: isMobile ? "column-reverse" : "row",
// //           }}
// //         >
// //           <Button
// //             onClick={() => setOpenConfirmDialog(false)}
// //             color="primary"
// //             size={isMobile ? "small" : "medium"}
// //             fullWidth={isMobile}
// //             sx={{ fontSize: isMobile ? "0.75rem" : "0.875rem" }}
// //           >
// //             Cancel
// //           </Button>
// //           <Button
// //             onClick={handleConfirmSubmit}
// //             color="primary"
// //             variant="contained"
// //             size={isMobile ? "small" : "medium"}
// //             fullWidth={isMobile}
// //             sx={{ fontSize: isMobile ? "0.75rem" : "0.875rem" }}
// //           >
// //             Confirm
// //           </Button>
// //         </DialogActions>
// //       </Dialog>
// //     </Box>
// //   );
// // };

// // export default TeacherAdd;




// "use client"
// import { useState, useEffect } from "react"
// import { useFormik } from "formik"
// import * as Yup from "yup"
// import {
//   Grid,
//   TextField,
//   Box,
//   Button,
//   Paper,
//   FormControl,
//   InputLabel,
//   MenuItem,
//   Select,
//   Typography,
//   Snackbar,
//   Alert,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogContentText,
//   DialogActions,
//   useTheme,
//   useMediaQuery,
//   Card,
//   CardContent,
//   Divider,
//   CircularProgress,
// } from "@mui/material"
// import InputMask from "react-input-mask"
// import supabase from "../../../supabase-client"
// import Visibility from "@mui/icons-material/Visibility"
// import VisibilityOff from "@mui/icons-material/VisibilityOff"

// const TeacherAdd = () => {
//   const theme = useTheme()
//   const isMobile = useMediaQuery(theme.breakpoints.down("sm"))
//   const isTablet = useMediaQuery(theme.breakpoints.down("md"))
//   const [schools, setSchools] = useState([])
//   const [alert, setAlert] = useState({
//     open: false,
//     message: "",
//     severity: "",
//   })
//   const [loading, setLoading] = useState(false)
//   const [showPassword, setShowPassword] = useState(false)
//   const togglePasswordVisibility = () => setShowPassword((prev) => !prev)
//   const [openConfirmDialog, setOpenConfirmDialog] = useState(false)

//   useEffect(() => {
//     fetchSchools()
//   }, [])

//   const fetchSchools = async () => {
//     try {
//       const { data, error } = await supabase
//         .from("School")
//         .select("SchoolID, SchoolName")
//         .order("SchoolID", { ascending: true })
//       if (error) throw error
//       setSchools(data)
//     } catch (error) {
//       console.error("Error fetching schools:", error)
//       showAlert("Failed to load schools!", "error")
//     }
//   }

//   const generateTeacherID = async (schoolId) => {
//     if (!schoolId) return
//     const formattedSchoolId = schoolId.replace(/-/g, "")
//     const prefix = `T-${formattedSchoolId}-`
//     try {
//       const { data, error } = await supabase
//         .from("Teacher")
//         .select("TeacherID")
//         .filter("TeacherID", "like", `${prefix}%`)
//       if (error) throw error
//       const filteredData = data.filter((entry) => entry.TeacherID.startsWith(prefix))
//       const existingIds = filteredData.map((entry) => Number.parseInt(entry.TeacherID.split("-").pop(), 10))
//       const nextNumber = (Math.max(...existingIds, 0) + 1).toString().padStart(2, "0")
//       const newId = `${prefix}${nextNumber}`
//       formik.setFieldValue("ID", newId)
//     } catch (err) {
//       console.error("Failed to generate Teacher ID:", err)
//       showAlert("Failed to generate Teacher ID", "error")
//     }
//   }

//   const showAlert = (message, severity) => {
//     setAlert({ open: true, message, severity })
//   }

//   const handleCloseAlert = () => setAlert({ ...alert, open: false })

//   // Fixed Validation Schema
//   const validationSchema = Yup.object().shape({
//     name: Yup.string()
//       .matches(/^[A-Za-z\s]+$/, "Only alphabets and spaces are allowed")
//       .required("Name is required"),

//     cnic: Yup.string()
//       .required("CNIC is required")
//       .matches(/^\d{5}-\d{7}-\d{1}$/, "CNIC must be in format 31102-1234567-9")
//       .test("unique-cnic", "This CNIC is already registered", async (value) => {
//         if (!value) return true
//         const { data, error } = await supabase.from("Teacher").select("CNIC").eq("CNIC", value)
//         if (error) return false
//         return data.length === 0
//       }),

//     email: Yup.string()
//       .email("Invalid email")
//       .required("Email is required")
//       .test("unique-email", "This Email is already registered", async function (value) {
//         if (!value) return true
//         const { data, error } = await supabase.from("Teacher").select("Email").eq("Email", value)
//         if (error) return this.createError({ message: "Could not validate Email" })
//         return data.length === 0
//       }),

//     password: Yup.string()
//       .min(8, "Password must be at least 8 characters")
//       .matches(/[a-z]/, "Must contain at least one lowercase letter")
//       .matches(/[A-Z]/, "Must contain at least one uppercase letter")
//       .matches(/\d/, "Must contain at least one digit")
//       .matches(/[@$!%*?&]/, "Must contain at least one special character")
//       .required("Password is required"),

//     phoneNumber: Yup.string()
//       .matches(/^\d{9,12}$/, "Phone number must be between 9 and 12 digits")
//       .required("Phone number is required")
//       .test("unique-phone", "This phone number is already in use", async function (value) {
//         if (!value) return true
//         const { data, error } = await supabase.from("Teacher").select("PhoneNumber").eq("PhoneNumber", value)
//         if (error) return this.createError({ message: "Could not validate phone number" })
//         return data.length === 0
//       }),

//     gender: Yup.string().required("Gender is required"),
//     dateOfBirth: Yup.string().required("Date of birth is required"),

//     hireDate: Yup.string()
//       .required("Hire date is required")
//       .test("hireDate-after-dob", "Hire date must be after date of birth", function (value) {
//         const { dateOfBirth } = this.parent
//         return new Date(value) > new Date(dateOfBirth)
//       }),

//     qualification: Yup.string()
//       .matches(/^[A-Za-z\s]+$/, "Qualification should contain only alphabets and spaces")
//       .required("Qualification is required"),

//     experienceyears: Yup.number()
//       .min(0, "Experience cannot be negative")
//       .required("Experience is required")
//       .test("experience-less-than-age", "Experience cannot be greater than age", function (value) {
//         const { dateOfBirth } = this.parent
//         const age = calculateAge(dateOfBirth)
//         return value <= age
//       }),

//     disability: Yup.string().required("Disability status is required"),

//     // Fixed when condition for disabilitydetails
//     disabilitydetails: Yup.string().when("disability", {
//       is: "Yes",
//       then: (schema) => schema.required("Disability details are required"),
//       otherwise: (schema) => schema.notRequired(),
//     }),

//     SchoolId: Yup.string().required("School is required"),

//     employeetype: Yup.string()
//       .required("Employee type is required")
//       .test("unique-principal", "This school already has a principal", async function (value) {
//         if (value !== "Principal") return true
//         const { SchoolId } = this.parent
//         if (!SchoolId) return true
//         const { data, error } = await supabase
//           .from("Teacher")
//           .select("*")
//           .eq("SchoolID", SchoolId)
//           .eq("EmployeeType", "Principal")
//           .neq("EmployementStatus", "Transferred")
//         if (error) return this.createError({ message: "Could not validate principal status" })
//         return data.length === 0
//       }),

//     employmentStatus: Yup.string().required("Employment status is required"),
//     employmentType: Yup.string().required("Employment type is required"),
//     address: Yup.string().required("Address is required"),

//     fathername: Yup.string()
//       .matches(/^[A-Za-z\s]+$/, "Only alphabets and spaces are allowed")
//       .required("Father Name is required"),

//     domicile: Yup.string().required("Domicile is required"),
//     bps: Yup.string().required("BPS is required"),

//     // Fixed when condition for teachersubject
//     teachersubject: Yup.string().when("employeetype", {
//       is: "Teacher",
//       then: (schema) => schema.required("Teacher subject is required"),
//       otherwise: (schema) => schema.notRequired(),
//     }),

//     // Fixed when condition for post
//     post: Yup.string().when("employeetype", {
//       is: "Teacher",
//       then: (schema) => schema.required("Post is required"),
//       otherwise: (schema) => schema.notRequired(),
//     }),
//   })

//   const calculateAge = (dob) => {
//     const birthDate = new Date(dob)
//     const today = new Date()
//     let age = today.getFullYear() - birthDate.getFullYear()
//     const m = today.getMonth() - birthDate.getMonth()
//     if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
//       age--
//     }
//     return age
//   }

//   const formik = useFormik({
//     initialValues: {
//       ID: "",
//       cnic: "",
//       name: "",
//       email: "",
//       password: "Ww@123#w",
//       phoneNumber: "",
//       gender: "",
//       dateOfBirth: "",
//       disability: "No",
//       disabilitydetails: "",
//       qualification: "",
//       experienceyears: 0,
//       hireDate: "",
//       SchoolId: "",
//       employeetype: "Teacher",
//       employmentStatus: "Working",
//       employmentType: "Regular",
//       address: "",
//       fathername: "",
//       domicile: "",
//       bps: "",
//       teachersubject: "",
//       post: "",
//     },
//     validationSchema,
//     onSubmit: async (values) => {
//       setLoading(true)
//       try {
//         if (!values.email || !values.password) {
//           showAlert("Email and Password are required.", "error")
//           return
//         }
//         // STEP 1: Store current admin session BEFORE auth operations
//         const {
//           data: { session: currentAdminSession },
//           error: sessionError,
//         } = await supabase.auth.getSession()
//         if (sessionError || !currentAdminSession) {
//           showAlert("Admin session not found. Please login again.", "error")
//           return
//         }
//         console.log("Admin session stored successfully")

//         // STEP 2: Create the auth user (this will change the current session)
//         const { data: authData, error: authError } = await supabase.auth.signUp({
//           email: values.email,
//           password: values.password,
//         })
//         if (authError) {
//           console.error("Auth Error:", authError.message)
//           showAlert("User Already exist aginst email. Try again!", "error")
//           return
//         }
//         if (!authData?.user) {
//           console.error("User creation incomplete, email confirmation likely required.")
//           showAlert("User created! Please confirm the email before proceeding.", "warning")
//           return
//         }
//         const user = authData.user
//         console.log("Auth user created successfully")

//         // STEP 3: IMMEDIATELY restore the admin session
//         const { error: restoreError } = await supabase.auth.setSession({
//           access_token: currentAdminSession.access_token,
//           refresh_token: currentAdminSession.refresh_token,
//         })
//         if (restoreError) {
//           console.error("Failed to restore admin session:", restoreError)
//           showAlert("Session restore failed. Please try again.", "error")
//           return
//         }
//         console.log("Admin session restored successfully")

//         // STEP 4: Now insert teacher data with restored admin session
//         const { error: teacherError } = await supabase.from("Teacher").insert([
//           {
//             TeacherID: values.ID,
//             CNIC: values.cnic,
//             Name: values.name,
//             Email: values.email,
//             Password: values.password,
//             PhoneNumber: values.phoneNumber,
//             Gender: values.gender,
//             DateOfBirth: values.dateOfBirth,
//             Disability: values.disability,
//             DisabilityDetails: values.disabilitydetails,
//             Qualification: values.qualification,
//             ExperienceYear: values.experienceyears,
//             HireDate: values.hireDate,
//             SchoolID: values.SchoolId,
//             EmployeeType: values.employeetype,
//             EmployementStatus: values.employmentStatus,
//             EmployementType: values.employmentType,
//             Address: values.address,
//             Role: "Teacher",
//             user_id: user.id,
//             FatherName: values.fathername,
//             Domicile: values.domicile,
//             BPS: values.bps,
//             TeacherSubject: values.teachersubject,
//             Post: values.post,
//           },
//         ])
//         if (teacherError) {
//           console.error("Error adding Teacher:", teacherError.message)
//           showAlert("Failed to add teacher. Try again!", "error")
//           // Optional: Clean up the auth user if teacher creation failed
//           // Note: This requires admin privileges
//           try {
//             await supabase.auth.admin?.deleteUser(user.id)
//             console.log("Cleaned up auth user due to teacher creation failure")
//           } catch (cleanupError) {
//             console.warn("Could not clean up auth user:", cleanupError)
//           }
//         } else {
//           showAlert("Teacher added successfully!", "success")
//           formik.resetForm({
//             values: {
//               ...formik.initialValues,
//               ID: "T-",
//             },
//           })
//         }
//       } catch (error) {
//         console.error("Error in form submission:", error)
//         showAlert("An unexpected error occurred", "error")
//         // Try to restore admin session in case of any error
//         try {
//           const {
//             data: { session: fallbackSession },
//           } = await supabase.auth.getSession()
//           if (!fallbackSession) {
//             console.warn("No session found after error - admin may need to re-login")
//             showAlert("Session lost. Please refresh and login again.", "warning")
//           }
//         } catch (sessionCheckError) {
//           console.error("Failed to check session after error:", sessionCheckError)
//         }
//       } finally {
//         setLoading(false) // Re-enable button when done (success or error)
//       }
//     },
//   })

//   useEffect(() => {
//     if (formik.values.employeetype === "Principal") {
//       formik.setFieldValue("bps", "Grade 18")
//     } else if (formik.values.employeetype === "Vice Principal") {
//       formik.setFieldValue("bps", "Grade 17")
//     } else if (formik.values.employeetype === "Teacher") {
//       switch (formik.values.post) {
//         case "Subject Specialist":
//         case "Acting Principal":
//           formik.setFieldValue("bps", "Grade 17")
//           break
//         case "S.S.T":
//         case "S.S.E":
//         case "S.S.T(I.T)":
//           formik.setFieldValue("bps", "Grade 16")
//           break
//         case "Arabic Teacher":
//         case "E.S.T":
//         case "E.S.E":
//         case "P.T.I":
//           formik.setFieldValue("bps", "Grade 14")
//           break
//         default:
//           formik.setFieldValue("bps", "")
//       }
//     }
//   }, [formik.values.employeetype, formik.values.post])

//   const handleSubmitClick = () => {
//     console.log("Validating form...")
//     formik.validateForm().then((errors) => {
//       console.log("Validating form...", errors)
//       if (Object.keys(errors).length === 0) {
//         setOpenConfirmDialog(true) // Open dialog if no errors
//       }
//     })
//   }

//   const handleConfirmSubmit = () => {
//     setOpenConfirmDialog(false)
//     formik.handleSubmit() // Proceed with submission
//   }

//   return (
//     <Box
//       display="flex"
//       justifyContent="center"
//       alignItems="flex-start"
//       bgcolor="#f5f5f5"
//       p={isMobile ? 1 : isTablet ? 2 : 4}
//       minHeight="100vh"
//     >
//       <Card
//         sx={{
//           width: "100%",
//           maxWidth: isMobile ? "100%" : 800,
//           padding: isMobile ? 1 : isTablet ? 2 : 3,
//           boxShadow: 6,
//           borderRadius: 2,
//           margin: isMobile ? 0 : "auto",
//         }}
//       >
//         <CardContent sx={{ padding: isMobile ? 1 : 2 }}>
//           <Typography
//             variant={isMobile ? "h5" : "h4"}
//             align="center"
//             gutterBottom
//             sx={{
//               fontWeight: "bold",
//               color: "#3f51b5",
//               mb: isMobile ? 2 : 3,
//               fontSize: isMobile ? "1.5rem" : "2.125rem",
//             }}
//           >
//             Add Teacher
//           </Typography>
//           <Paper
//             sx={{
//               padding: isMobile ? 2 : 3,
//               borderRadius: 2,
//               backgroundColor: "#fff",
//             }}
//             elevation={3}
//           >
//             <form onSubmit={formik.handleSubmit}>
//               <Grid container spacing={isMobile ? 1.5 : 2}>
//                 {/* Personal Information Section */}
//                 <Grid item xs={12}>
//                   <Typography
//                     variant={isMobile ? "subtitle1" : "h6"}
//                     gutterBottom
//                     sx={{
//                       fontSize: isMobile ? "1rem" : "1.25rem",
//                       fontWeight: "medium",
//                       color: "#3f51b5",
//                       mb: isMobile ? 1 : 2,
//                     }}
//                   >
//                     Personal Information
//                   </Typography>
//                   <Divider sx={{ mb: isMobile ? 1 : 2 }} />
//                 </Grid>
//                 <Grid item xs={12} sm={6}>
//                   <TextField
//                     label="Name"
//                     fullWidth
//                     name="name"
//                     value={formik.values.name}
//                     onChange={formik.handleChange}
//                     onBlur={formik.handleBlur}
//                     error={formik.touched.name && Boolean(formik.errors.name)}
//                     helperText={formik.touched.name && formik.errors.name}
//                     required
//                     size={isMobile ? "small" : "medium"}
//                     sx={{
//                       "& .MuiInputBase-root": {
//                         fontSize: isMobile ? "0.875rem" : "1rem",
//                       },
//                       "& .MuiInputLabel-root": {
//                         fontSize: isMobile ? "0.875rem" : "1rem",
//                       },
//                       "& .MuiFormHelperText-root": {
//                         fontSize: isMobile ? "0.75rem" : "0.875rem",
//                       },
//                     }}
//                   />
//                 </Grid>
//                 <Grid item xs={12} sm={6}>
//                   <TextField
//                     label="Father Name"
//                     fullWidth
//                     name="fathername"
//                     value={formik.values.fathername}
//                     onChange={formik.handleChange}
//                     onBlur={formik.handleBlur}
//                     error={formik.touched.fathername && Boolean(formik.errors.fathername)}
//                     helperText={formik.touched.fathername && formik.errors.fathername}
//                     required
//                     size={isMobile ? "small" : "medium"}
//                     sx={{
//                       "& .MuiInputBase-root": {
//                         fontSize: isMobile ? "0.875rem" : "1rem",
//                       },
//                       "& .MuiInputLabel-root": {
//                         fontSize: isMobile ? "0.875rem" : "1rem",
//                       },
//                       "& .MuiFormHelperText-root": {
//                         fontSize: isMobile ? "0.75rem" : "0.875rem",
//                       },
//                     }}
//                   />
//                 </Grid>
//                 <Grid item xs={12} sm={6}>
//                   <InputMask
//                     mask="99999-9999999-9" // Forces XXXXX-XXXXXXX-X format
//                     value={formik.values.cnic}
//                     onChange={(e) => {
//                       formik.setFieldValue("cnic", e.target.value) // Stores with dashes
//                     }}
//                     onBlur={formik.handleBlur}
//                   >
//                     {(inputProps) => (
//                       <TextField
//                         {...inputProps}
//                         label="CNIC"
//                         fullWidth
//                         name="cnic"
//                         error={formik.touched.cnic && Boolean(formik.errors.cnic)}
//                         helperText={formik.touched.cnic && formik.errors.cnic}
//                         required
//                         placeholder="31102-1234567-9"
//                         size={isMobile ? "small" : "medium"}
//                         sx={{
//                           "& .MuiInputBase-root": {
//                             fontSize: isMobile ? "0.875rem" : "1rem",
//                           },
//                           "& .MuiInputLabel-root": {
//                             fontSize: isMobile ? "0.875rem" : "1rem",
//                           },
//                           "& .MuiFormHelperText-root": {
//                             fontSize: isMobile ? "0.75rem" : "0.875rem",
//                           },
//                         }}
//                       />
//                     )}
//                   </InputMask>
//                 </Grid>
//                 <Grid item xs={12} sm={6}>
//                   <TextField
//                     label="Email"
//                     fullWidth
//                     name="email"
//                     value={formik.values.email}
//                     onChange={formik.handleChange}
//                     onBlur={formik.handleBlur}
//                     error={formik.touched.email && Boolean(formik.errors.email)}
//                     helperText={formik.touched.email && formik.errors.email}
//                     required
//                     size={isMobile ? "small" : "medium"}
//                     sx={{
//                       "& .MuiInputBase-root": {
//                         fontSize: isMobile ? "0.875rem" : "1rem",
//                       },
//                       "& .MuiInputLabel-root": {
//                         fontSize: isMobile ? "0.875rem" : "1rem",
//                       },
//                       "& .MuiFormHelperText-root": {
//                         fontSize: isMobile ? "0.75rem" : "0.875rem",
//                       },
//                     }}
//                   />
//                 </Grid>
//                 <Grid item xs={12} sm={6}>
//                   <TextField
//                     label="Password"
//                     type={showPassword ? "text" : "password"}
//                     fullWidth
//                     name="password"
//                     value={formik.values.password}
//                     onChange={formik.handleChange}
//                     onBlur={formik.handleBlur}
//                     error={formik.touched.password && Boolean(formik.errors.password)}
//                     helperText={formik.touched.password && formik.errors.password}
//                     required
//                     size={isMobile ? "small" : "medium"}
//                     InputProps={{
//                       endAdornment: (
//                         <Button onClick={togglePasswordVisibility} size="small" sx={{ minWidth: "auto", p: 0.5 }}>
//                           {showPassword ? <Visibility /> : <VisibilityOff />}
//                         </Button>
//                       ),
//                     }}
//                     sx={{
//                       "& .MuiInputBase-root": {
//                         fontSize: isMobile ? "0.875rem" : "1rem",
//                       },
//                       "& .MuiInputLabel-root": {
//                         fontSize: isMobile ? "0.875rem" : "1rem",
//                       },
//                       "& .MuiFormHelperText-root": {
//                         fontSize: isMobile ? "0.75rem" : "0.875rem",
//                       },
//                     }}
//                   />
//                 </Grid>
//                 <Grid item xs={12} sm={6}>
//                   <TextField
//                     label="Phone Number"
//                     fullWidth
//                     name="phoneNumber"
//                     value={formik.values.phoneNumber}
//                     onChange={formik.handleChange}
//                     onBlur={formik.handleBlur}
//                     error={formik.touched.phoneNumber && Boolean(formik.errors.phoneNumber)}
//                     helperText={formik.touched.phoneNumber && formik.errors.phoneNumber}
//                     required
//                     size={isMobile ? "small" : "medium"}
//                     sx={{
//                       "& .MuiInputBase-root": {
//                         fontSize: isMobile ? "0.875rem" : "1rem",
//                       },
//                       "& .MuiInputLabel-root": {
//                         fontSize: isMobile ? "0.875rem" : "1rem",
//                       },
//                       "& .MuiFormHelperText-root": {
//                         fontSize: isMobile ? "0.75rem" : "0.875rem",
//                       },
//                     }}
//                   />
//                 </Grid>
//                 <Grid item xs={12} sm={6}>
//                   <FormControl
//                     fullWidth
//                     required
//                     size={isMobile ? "small" : "medium"}
//                     sx={{
//                       "& .MuiInputBase-root": {
//                         fontSize: isMobile ? "0.875rem" : "1rem",
//                       },
//                       "& .MuiInputLabel-root": {
//                         fontSize: isMobile ? "0.875rem" : "1rem",
//                       },
//                     }}
//                   >
//                     <InputLabel>Gender</InputLabel>
//                     <Select
//                       label="Gender"
//                       name="gender"
//                       value={formik.values.gender}
//                       onChange={formik.handleChange}
//                       onBlur={formik.handleBlur}
//                       error={formik.touched.gender && Boolean(formik.errors.gender)}
//                     >
//                       <MenuItem value="Male">Male</MenuItem>
//                       <MenuItem value="Female">Female</MenuItem>
//                     </Select>
//                   </FormControl>
//                 </Grid>
//                 <Grid item xs={12} sm={6}>
//                   <TextField
//                     label="Date of Birth"
//                     type="date"
//                     fullWidth
//                     InputLabelProps={{ shrink: true }}
//                     name="dateOfBirth"
//                     value={formik.values.dateOfBirth}
//                     onChange={formik.handleChange}
//                     onBlur={formik.handleBlur}
//                     error={formik.touched.dateOfBirth && Boolean(formik.errors.dateOfBirth)}
//                     helperText={formik.touched.dateOfBirth && formik.errors.dateOfBirth}
//                     inputProps={{
//                       max: new Date().toISOString().split("T")[0], // Sets max date to today
//                     }}
//                     required
//                     size={isMobile ? "small" : "medium"}
//                     sx={{
//                       "& .MuiInputBase-root": {
//                         fontSize: isMobile ? "0.875rem" : "1rem",
//                       },
//                       "& .MuiInputLabel-root": {
//                         fontSize: isMobile ? "0.875rem" : "1rem",
//                       },
//                       "& .MuiFormHelperText-root": {
//                         fontSize: isMobile ? "0.75rem" : "0.875rem",
//                       },
//                     }}
//                   />
//                 </Grid>
//                 <Grid item xs={12} sm={6}>
//                   <FormControl
//                     fullWidth
//                     required
//                     size={isMobile ? "small" : "medium"}
//                     sx={{
//                       "& .MuiInputBase-root": {
//                         fontSize: isMobile ? "0.875rem" : "1rem",
//                       },
//                       "& .MuiInputLabel-root": {
//                         fontSize: isMobile ? "0.875rem" : "1rem",
//                       },
//                     }}
//                   >
//                     <InputLabel>Domicile</InputLabel>
//                     <Select
//                       label="Domicile"
//                       name="domicile"
//                       value={formik.values.domicile}
//                       onChange={formik.handleChange}
//                       onBlur={formik.handleBlur}
//                       error={formik.touched.domicile && Boolean(formik.errors.domicile)}
//                     >
//                       <MenuItem value="Attock">Attock</MenuItem>
//                       <MenuItem value="Bahawalnagar">Bahawalnagar</MenuItem>
//                       <MenuItem value="Bahawalpur">Bahawalpur</MenuItem>
//                       <MenuItem value="Bhakkar">Bhakkar</MenuItem>
//                       <MenuItem value="Chakwal">Chakwal</MenuItem>
//                       <MenuItem value="Chiniot">Chiniot</MenuItem>
//                       <MenuItem value="Dera Ghazi Khan">Dera Ghazi Khan</MenuItem>
//                       <MenuItem value="Faisalabad">Faisalabad</MenuItem>
//                       <MenuItem value="Gujranwala">Gujranwala</MenuItem>
//                       <MenuItem value="Gujrat">Gujrat</MenuItem>
//                       <MenuItem value="Hafizabad">Hafizabad</MenuItem>
//                       <MenuItem value="Jhang">Jhang</MenuItem>
//                       <MenuItem value="Jhelum">Jhelum</MenuItem>
//                       <MenuItem value="Kasur">Kasur</MenuItem>
//                       <MenuItem value="Khanewal">Khanewal</MenuItem>
//                       <MenuItem value="Khushab">Khushab</MenuItem>
//                       <MenuItem value="Lahore">Lahore</MenuItem>
//                       <MenuItem value="Layyah">Layyah</MenuItem>
//                       <MenuItem value="Lodhran">Lodhran</MenuItem>
//                       <MenuItem value="Mandi Bahauddin">Mandi Bahauddin</MenuItem>
//                       <MenuItem value="Mianwali">Mianwali</MenuItem>
//                       <MenuItem value="Multan">Multan</MenuItem>
//                       <MenuItem value="Muzaffargarh">Muzaffargarh</MenuItem>
//                       <MenuItem value="Narowal">Narowal</MenuItem>
//                       <MenuItem value="Nankana Sahib">Nankana Sahib</MenuItem>
//                       <MenuItem value="Okara">Okara</MenuItem>
//                       <MenuItem value="Pakpattan">Pakpattan</MenuItem>
//                       <MenuItem value="Rahim Yar Khan">Rahim Yar Khan</MenuItem>
//                       <MenuItem value="Rajanpur">Rajanpur</MenuItem>
//                       <MenuItem value="Rawalpindi">Rawalpindi</MenuItem>
//                       <MenuItem value="Sahiwal">Sahiwal</MenuItem>
//                       <MenuItem value="Sargodha">Sargodha</MenuItem>
//                       <MenuItem value="Sheikhupura">Sheikhupura</MenuItem>
//                       <MenuItem value="Sialkot">Sialkot</MenuItem>
//                       <MenuItem value="Toba Tek Singh">Toba Tek Singh</MenuItem>
//                       <MenuItem value="Vehari">Vehari</MenuItem>
//                     </Select>
//                   </FormControl>
//                 </Grid>
//                 <Grid item xs={12}>
//                   <TextField
//                     label="Address"
//                     fullWidth
//                     name="address"
//                     value={formik.values.address}
//                     onChange={formik.handleChange}
//                     onBlur={formik.handleBlur}
//                     error={formik.touched.address && Boolean(formik.errors.address)}
//                     helperText={formik.touched.address && formik.errors.address}
//                     required
//                     multiline
//                     rows={isMobile ? 2 : 3}
//                     size={isMobile ? "small" : "medium"}
//                     sx={{
//                       "& .MuiInputBase-root": {
//                         fontSize: isMobile ? "0.875rem" : "1rem",
//                       },
//                       "& .MuiInputLabel-root": {
//                         fontSize: isMobile ? "0.875rem" : "1rem",
//                       },
//                       "& .MuiFormHelperText-root": {
//                         fontSize: isMobile ? "0.75rem" : "0.875rem",
//                       },
//                     }}
//                   />
//                 </Grid>
//                 <Grid item xs={12} sm={6}>
//                   <FormControl
//                     fullWidth
//                     required
//                     size={isMobile ? "small" : "medium"}
//                     sx={{
//                       "& .MuiInputBase-root": {
//                         fontSize: isMobile ? "0.875rem" : "1rem",
//                       },
//                       "& .MuiInputLabel-root": {
//                         fontSize: isMobile ? "0.875rem" : "1rem",
//                       },
//                     }}
//                   >
//                     <InputLabel>Disability</InputLabel>
//                     <Select
//                       label="Disability"
//                       name="disability"
//                       value={formik.values.disability}
//                       onChange={formik.handleChange}
//                       onBlur={formik.handleBlur}
//                       error={formik.touched.disability && Boolean(formik.errors.disability)}
//                     >
//                       <MenuItem value="Yes">Yes</MenuItem>
//                       <MenuItem value="No">No</MenuItem>
//                     </Select>
//                   </FormControl>
//                 </Grid>
//                 {formik.values.disability === "Yes" && (
//                   <Grid item xs={12} sm={6}>
//                     <TextField
//                       label="Disability Details"
//                       fullWidth
//                       name="disabilitydetails"
//                       value={formik.values.disabilitydetails}
//                       onChange={formik.handleChange}
//                       onBlur={formik.handleBlur}
//                       error={formik.touched.disabilitydetails && Boolean(formik.errors.disabilitydetails)}
//                       helperText={formik.touched.disabilitydetails && formik.errors.disabilitydetails}
//                       required={formik.values.disability === "Yes"}
//                       size={isMobile ? "small" : "medium"}
//                       sx={{
//                         "& .MuiInputBase-root": {
//                           fontSize: isMobile ? "0.875rem" : "1rem",
//                         },
//                         "& .MuiInputLabel-root": {
//                           fontSize: isMobile ? "0.875rem" : "1rem",
//                         },
//                         "& .MuiFormHelperText-root": {
//                           fontSize: isMobile ? "0.75rem" : "0.875rem",
//                         },
//                       }}
//                     />
//                   </Grid>
//                 )}
//                 {/* Educational Details Section */}
//                 <Grid item xs={12}>
//                   <Typography
//                     variant={isMobile ? "subtitle1" : "h6"}
//                     gutterBottom
//                     sx={{
//                       fontSize: isMobile ? "1rem" : "1.25rem",
//                       fontWeight: "medium",
//                       color: "#3f51b5",
//                       mb: isMobile ? 1 : 2,
//                       mt: isMobile ? 2 : 3,
//                     }}
//                   >
//                     Educational Details
//                   </Typography>
//                   <Divider sx={{ mb: isMobile ? 1 : 2 }} />
//                 </Grid>
//                 <Grid item xs={12} sm={6}>
//                   <TextField
//                     label="Qualification"
//                     fullWidth
//                     name="qualification"
//                     value={formik.values.qualification}
//                     onChange={formik.handleChange}
//                     onBlur={formik.handleBlur}
//                     error={formik.touched.qualification && Boolean(formik.errors.qualification)}
//                     helperText={formik.touched.qualification && formik.errors.qualification}
//                     required
//                     size={isMobile ? "small" : "medium"}
//                     sx={{
//                       "& .MuiInputBase-root": {
//                         fontSize: isMobile ? "0.875rem" : "1rem",
//                       },
//                       "& .MuiInputLabel-root": {
//                         fontSize: isMobile ? "0.875rem" : "1rem",
//                       },
//                       "& .MuiFormHelperText-root": {
//                         fontSize: isMobile ? "0.75rem" : "0.875rem",
//                       },
//                     }}
//                   />
//                 </Grid>
//                 <Grid item xs={12} sm={6}>
//                   <TextField
//                     label="Experience (Years)"
//                     fullWidth
//                     name="experienceyears"
//                     type="number"
//                     value={formik.values.experienceyears}
//                     onChange={(e) => {
//                       const value = Number.parseInt(e.target.value, 10)
//                       formik.setFieldValue("experienceyears", value >= 0 ? value : 0)
//                     }}
//                     onBlur={formik.handleBlur}
//                     error={formik.touched.experienceyears && Boolean(formik.errors.experienceyears)}
//                     helperText={formik.touched.experienceyears && formik.errors.experienceyears}
//                     inputProps={{ min: 0 }}
//                     required
//                     size={isMobile ? "small" : "medium"}
//                     sx={{
//                       "& .MuiInputBase-root": {
//                         fontSize: isMobile ? "0.875rem" : "1rem",
//                       },
//                       "& .MuiInputLabel-root": {
//                         fontSize: isMobile ? "0.875rem" : "1rem",
//                       },
//                       "& .MuiFormHelperText-root": {
//                         fontSize: isMobile ? "0.75rem" : "0.875rem",
//                       },
//                     }}
//                   />
//                 </Grid>
//                 {/* School Information Section */}
//                 <Grid item xs={12}>
//                   <Typography
//                     variant={isMobile ? "subtitle1" : "h6"}
//                     gutterBottom
//                     sx={{
//                       fontSize: isMobile ? "1rem" : "1.25rem",
//                       fontWeight: "medium",
//                       color: "#3f51b5",
//                       mb: isMobile ? 1 : 2,
//                       mt: isMobile ? 2 : 3,
//                     }}
//                   >
//                     School Information
//                   </Typography>
//                   <Divider sx={{ mb: isMobile ? 1 : 2 }} />
//                 </Grid>
//                 <Grid item xs={12} sm={6}>
//                   <TextField
//                     label="Teacher ID"
//                     type="text"
//                     fullWidth
//                     InputLabelProps={{ shrink: true }}
//                     name="ID"
//                     value={formik.values.ID}
//                     disabled
//                     size={isMobile ? "small" : "medium"}
//                     sx={{
//                       "& .MuiInputBase-root": {
//                         fontSize: isMobile ? "0.875rem" : "1rem",
//                       },
//                       "& .MuiInputLabel-root": {
//                         fontSize: isMobile ? "0.875rem" : "1rem",
//                       },
//                     }}
//                   />
//                 </Grid>
//                 <Grid item xs={12} sm={6}>
//                   <FormControl
//                     fullWidth
//                     size={isMobile ? "small" : "medium"}
//                     sx={{
//                       "& .MuiInputBase-root": {
//                         fontSize: isMobile ? "0.875rem" : "1rem",
//                       },
//                       "& .MuiInputLabel-root": {
//                         fontSize: isMobile ? "0.875rem" : "1rem",
//                       },
//                     }}
//                   >
//                     <InputLabel>School ID</InputLabel>
//                     <Select
//                       label="School Id"
//                       name="SchoolId"
//                       value={formik.values.SchoolId}
//                       onChange={async (e) => {
//                         const value = e.target.value
//                         formik.setFieldValue("SchoolId", value)
//                         await generateTeacherID(value)
//                       }}
//                       onBlur={formik.handleBlur}
//                       error={formik.touched.SchoolId && Boolean(formik.errors.SchoolId)}
//                     >
//                       {schools.map((school) => (
//                         <MenuItem key={school.SchoolID} value={school.SchoolID}>
//                           {school.SchoolID} - {school.SchoolName}
//                         </MenuItem>
//                       ))}
//                     </Select>
//                   </FormControl>
//                 </Grid>
//                 <Grid item xs={12} sm={6}>
//                   <TextField
//                     label="Hire Date"
//                     type="date"
//                     fullWidth
//                     InputLabelProps={{ shrink: true }}
//                     name="hireDate"
//                     value={formik.values.hireDate}
//                     onChange={formik.handleChange}
//                     onBlur={formik.handleBlur}
//                     error={formik.touched.hireDate && Boolean(formik.errors.hireDate)}
//                     helperText={formik.touched.hireDate && formik.errors.hireDate}
//                     required
//                     size={isMobile ? "small" : "medium"}
//                     sx={{
//                       "& .MuiInputBase-root": {
//                         fontSize: isMobile ? "0.875rem" : "1rem",
//                       },
//                       "& .MuiInputLabel-root": {
//                         fontSize: isMobile ? "0.875rem" : "1rem",
//                       },
//                       "& .MuiFormHelperText-root": {
//                         fontSize: isMobile ? "0.75rem" : "0.875rem",
//                       },
//                     }}
//                   />
//                 </Grid>
//                 <Grid item xs={12} sm={6}>
//                   <FormControl
//                     fullWidth
//                     required
//                     size={isMobile ? "small" : "medium"}
//                     sx={{
//                       "& .MuiInputBase-root": {
//                         fontSize: isMobile ? "0.875rem" : "1rem",
//                       },
//                       "& .MuiInputLabel-root": {
//                         fontSize: isMobile ? "0.875rem" : "1rem",
//                       },
//                     }}
//                   >
//                     <InputLabel>Employee Type</InputLabel>
//                     <Select
//                       label="Employee Type"
//                       name="employeetype"
//                       value={formik.values.employeetype}
//                       onChange={formik.handleChange}
//                       onBlur={formik.handleBlur}
//                       error={formik.touched.employeetype && Boolean(formik.errors.employeetype)}
//                     >
//                       <MenuItem value="Principal">Principal</MenuItem>
//                       <MenuItem value="Vice Principal">Vice Principal</MenuItem>
//                       <MenuItem value="Teacher">Teacher</MenuItem>
//                     </Select>
//                     {formik.touched.employeetype && formik.errors.employeetype && (
//                       <Typography
//                         variant="caption"
//                         color="error"
//                         sx={{
//                           ml: 2,
//                           fontSize: isMobile ? "0.7rem" : "0.75rem",
//                         }}
//                       >
//                         {formik.errors.employeetype}
//                       </Typography>
//                     )}
//                   </FormControl>
//                 </Grid>
//                 <Grid item xs={12} sm={6}>
//                   <FormControl
//                     fullWidth
//                     required
//                     size={isMobile ? "small" : "medium"}
//                     sx={{
//                       "& .MuiInputBase-root": {
//                         fontSize: isMobile ? "0.875rem" : "1rem",
//                       },
//                       "& .MuiInputLabel-root": {
//                         fontSize: isMobile ? "0.875rem" : "1rem",
//                       },
//                     }}
//                   >
//                     <InputLabel>Employment Status</InputLabel>
//                     <Select
//                       label="Employment Status"
//                       name="employmentStatus"
//                       value={formik.values.employmentStatus}
//                       onChange={formik.handleChange}
//                       onBlur={formik.handleBlur}
//                       error={formik.touched.employmentStatus && Boolean(formik.errors.employmentStatus)}
//                     >
//                       <MenuItem value="Working">Working</MenuItem>
//                       <MenuItem value="Retired">Retired</MenuItem>
//                       <MenuItem value="Removed">Removed</MenuItem>
//                     </Select>
//                   </FormControl>
//                 </Grid>
//                 <Grid item xs={12} sm={6}>
//                   <FormControl
//                     fullWidth
//                     required
//                     size={isMobile ? "small" : "medium"}
//                     sx={{
//                       "& .MuiInputBase-root": {
//                         fontSize: isMobile ? "0.875rem" : "1rem",
//                       },
//                       "& .MuiInputLabel-root": {
//                         fontSize: isMobile ? "0.875rem" : "1rem",
//                       },
//                     }}
//                   >
//                     <InputLabel>Employment Type</InputLabel>
//                     <Select
//                       label="Employment Type"
//                       name="employmentType"
//                       value={formik.values.employmentType}
//                       onChange={formik.handleChange}
//                       onBlur={formik.handleBlur}
//                       error={formik.touched.employmentType && Boolean(formik.errors.employmentType)}
//                     >
//                       <MenuItem value="Regular">Regular</MenuItem>
//                       <MenuItem value="Contract">Contract</MenuItem>
//                       <MenuItem value="Deputation">Deputation</MenuItem>
//                     </Select>
//                   </FormControl>
//                 </Grid>
//                 {formik.values.employeetype === "Teacher" && (
//                   <Grid item xs={12} sm={6}>
//                     <FormControl
//                       fullWidth
//                       required
//                       size={isMobile ? "small" : "medium"}
//                       sx={{
//                         "& .MuiInputBase-root": {
//                           fontSize: isMobile ? "0.875rem" : "1rem",
//                         },
//                         "& .MuiInputLabel-root": {
//                           fontSize: isMobile ? "0.875rem" : "1rem",
//                         },
//                       }}
//                     >
//                       <InputLabel>Post</InputLabel>
//                       <Select
//                         label="Post"
//                         name="post"
//                         value={formik.values.post}
//                         onChange={formik.handleChange}
//                         onBlur={formik.handleBlur}
//                         error={formik.touched.post && Boolean(formik.errors.post)}
//                         required={formik.values.employeetype === "Teacher"}
//                       >
//                         <MenuItem value="Subject Specialist">Subject Specialist</MenuItem>
//                         <MenuItem value="S.S.T">S.S.T</MenuItem>
//                         <MenuItem value="S.S.E">S.S.E</MenuItem>
//                         <MenuItem value="Acting Principal">Acting Principal</MenuItem>
//                         <MenuItem value="S.S.T(I.T)">S.S.T(I.T)</MenuItem>
//                         <MenuItem value="Arabic Teacher">Arabic Teacher</MenuItem>
//                         <MenuItem value="E.S.T">E.S.T</MenuItem>
//                         <MenuItem value="E.S.E">E.S.E</MenuItem>
//                         <MenuItem value="P.T.I">P.T.I</MenuItem>
//                       </Select>
//                     </FormControl>
//                   </Grid>
//                 )}
//                 {formik.values.employeetype === "Teacher" && (
//                   <Grid item xs={12} sm={6}>
//                     <TextField
//                       label="Teacher Subject"
//                       fullWidth
//                       name="teachersubject"
//                       value={formik.values.teachersubject}
//                       onChange={formik.handleChange}
//                       onBlur={formik.handleBlur}
//                       error={formik.touched.teachersubject && Boolean(formik.errors.teachersubject)}
//                       helperText={formik.touched.teachersubject && formik.errors.teachersubject}
//                       required={formik.values.employeetype === "Teacher"}
//                       size={isMobile ? "small" : "medium"}
//                       sx={{
//                         "& .MuiInputBase-root": {
//                           fontSize: isMobile ? "0.875rem" : "1rem",
//                         },
//                         "& .MuiInputLabel-root": {
//                           fontSize: isMobile ? "0.875rem" : "1rem",
//                         },
//                         "& .MuiFormHelperText-root": {
//                           fontSize: isMobile ? "0.75rem" : "0.875rem",
//                         },
//                       }}
//                     />
//                   </Grid>
//                 )}
//                 <Grid item xs={12} sm={6}>
//                   <TextField
//                     label="BPS"
//                     fullWidth
//                     name="bps"
//                     value={formik.values.bps}
//                     onChange={formik.handleChange}
//                     onBlur={formik.handleBlur}
//                     error={formik.touched.bps && Boolean(formik.errors.bps)}
//                     helperText={formik.touched.bps && formik.errors.bps}
//                     required
//                     disabled // Make it disabled since it's auto-calculated
//                     size={isMobile ? "small" : "medium"}
//                     sx={{
//                       "& .MuiInputBase-root": {
//                         fontSize: isMobile ? "0.875rem" : "1rem",
//                       },
//                       "& .MuiInputLabel-root": {
//                         fontSize: isMobile ? "0.875rem" : "1rem",
//                       },
//                       "& .MuiFormHelperText-root": {
//                         fontSize: isMobile ? "0.75rem" : "0.875rem",
//                       },
//                     }}
//                   />
//                 </Grid>
//                 {/* Submit Button */}
//                 <Grid item xs={12}>
//                   <Button
//                     onClick={handleSubmitClick} // Not formik.handleSubmit
//                     variant="contained"
//                     color="primary"
//                     fullWidth
//                     disabled={loading}
//                     size={isMobile ? "medium" : "large"}
//                     sx={{
//                       fontSize: isMobile ? "0.875rem" : "1rem",
//                       padding: isMobile ? "10px 16px" : "12px 20px",
//                       mt: isMobile ? 2 : 3,
//                     }}
//                   >
//                     {loading ? (
//                       <>
//                         <CircularProgress size={isMobile ? 20 : 24} sx={{ mr: 1 }} />
//                         Adding...
//                       </>
//                     ) : (
//                       "Add Teacher"
//                     )}
//                   </Button>
//                 </Grid>
//               </Grid>
//             </form>
//           </Paper>
//         </CardContent>
//       </Card>
//       {/* Snackbar for Alerts */}
//       <Snackbar
//         open={alert.open}
//         autoHideDuration={6000}
//         onClose={handleCloseAlert}
//         anchorOrigin={{
//           vertical: isMobile ? "top" : "bottom",
//           horizontal: "center",
//         }}
//       >
//         <Alert
//           onClose={handleCloseAlert}
//           severity={alert.severity}
//           sx={{
//             width: isMobile ? "90vw" : "100%",
//             maxWidth: isMobile ? "90vw" : "600px",
//             fontSize: isMobile ? "0.875rem" : "1rem",
//           }}
//         >
//           {alert.message}
//         </Alert>
//       </Snackbar>
//       <Dialog
//         open={openConfirmDialog}
//         onClose={() => setOpenConfirmDialog(false)}
//         maxWidth="sm"
//         fullWidth
//         PaperProps={{
//           sx: {
//             margin: isMobile ? 1 : 3,
//             width: isMobile ? "calc(100% - 16px)" : "auto",
//             maxHeight: isMobile ? "90vh" : "80vh",
//           },
//         }}
//       >
//         <DialogTitle
//           sx={{
//             fontSize: isMobile ? "1.1rem" : "1.25rem",
//             padding: isMobile ? "12px 16px" : "16px 24px",
//             color: "#3f51b5",
//             fontWeight: "bold",
//           }}
//         >
//           Confirm Teacher Registration
//         </DialogTitle>
//         <DialogContent
//           sx={{
//             padding: isMobile ? "8px 16px" : "16px 24px",
//             overflowY: "auto",
//           }}
//         >
//           <DialogContentText
//             sx={{
//               fontSize: isMobile ? "0.875rem" : "1rem",
//               mb: 2,
//             }}
//           >
//             Are you sure you want to add this teacher?
//           </DialogContentText>
//           <Box sx={{ mt: 2 }}>
//             <Typography
//               sx={{
//                 fontSize: isMobile ? "0.875rem" : "1rem",
//                 mb: 1,
//                 wordBreak: "break-word",
//               }}
//             >
//               <strong>Name:</strong> {formik.values.name}
//             </Typography>
//             <Typography
//               sx={{
//                 fontSize: isMobile ? "0.875rem" : "1rem",
//                 mb: 1,
//               }}
//             >
//               <strong>CNIC:</strong> {formik.values.cnic}
//             </Typography>
//             <Typography
//               sx={{
//                 fontSize: isMobile ? "0.875rem" : "1rem",
//                 mb: 1,
//                 wordBreak: "break-word",
//               }}
//             >
//               <strong>School:</strong> {schools.find((s) => s.SchoolID === formik.values.SchoolId)?.SchoolName}
//             </Typography>
//           </Box>
//         </DialogContent>
//         <DialogActions
//           sx={{
//             padding: isMobile ? "8px 16px 16px" : "8px 24px 24px",
//             gap: isMobile ? 1 : 0,
//             flexDirection: isMobile ? "column-reverse" : "row",
//           }}
//         >
//           <Button
//             onClick={() => setOpenConfirmDialog(false)}
//             color="primary"
//             size={isMobile ? "small" : "medium"}
//             fullWidth={isMobile}
//             sx={{ fontSize: isMobile ? "0.75rem" : "0.875rem" }}
//           >
//             Cancel
//           </Button>
//           <Button
//             onClick={handleConfirmSubmit}
//             color="primary"
//             variant="contained"
//             size={isMobile ? "small" : "medium"}
//             fullWidth={isMobile}
//             sx={{ fontSize: isMobile ? "0.75rem" : "0.875rem" }}
//           >
//             Confirm
//           </Button>
//         </DialogActions>
//       </Dialog>
//     </Box>
//   )
// }

// export default TeacherAdd
"use client"
import { useState, useEffect } from "react"
import { useFormik } from "formik"
import * as Yup from "yup"
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
  CircularProgress,
} from "@mui/material"
import InputMask from "react-input-mask"
import supabase from "../../../supabase-client"
import Visibility from "@mui/icons-material/Visibility"
import VisibilityOff from "@mui/icons-material/VisibilityOff"

const TeacherAdd = () => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))
  const isTablet = useMediaQuery(theme.breakpoints.down("md"))
  const [schools, setSchools] = useState([])
  const [alert, setAlert] = useState({
    open: false,
    message: "",
    severity: "",
  })
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const togglePasswordVisibility = () => setShowPassword((prev) => !prev)
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false)

  useEffect(() => {
    fetchSchools()
  }, [])

  const fetchSchools = async () => {
    try {
      const { data, error } = await supabase
        .from("School")
        .select("SchoolID, SchoolName")
        .order("SchoolID", { ascending: true })
      if (error) throw error
      setSchools(data)
    } catch (error) {
      console.error("Error fetching schools:", error)
      showAlert("Failed to load schools!", "error")
    }
  }

  const generateTeacherID = async (schoolId) => {
    if (!schoolId) return
    const formattedSchoolId = schoolId.replace(/-/g, "")
    const prefix = `T-${formattedSchoolId}-`
    try {
      const { data, error } = await supabase
        .from("Teacher")
        .select("TeacherID")
        .filter("TeacherID", "like", `${prefix}%`)
      if (error) throw error
      const filteredData = data.filter((entry) => entry.TeacherID.startsWith(prefix))
      const existingIds = filteredData.map((entry) => Number.parseInt(entry.TeacherID.split("-").pop(), 10))
      const nextNumber = (Math.max(...existingIds, 0) + 1).toString().padStart(2, "0")
      const newId = `${prefix}${nextNumber}`
      formik.setFieldValue("ID", newId)
    } catch (err) {
      console.error("Failed to generate Teacher ID:", err)
      showAlert("Failed to generate Teacher ID", "error")
    }
  }

  const showAlert = (message, severity) => {
    setAlert({ open: true, message, severity })
  }

  const handleCloseAlert = () => setAlert({ ...alert, open: false })

  // Fixed Validation Schema
  const validationSchema = Yup.object().shape({
    name: Yup.string()
      .matches(/^[A-Za-z\s]+$/, "Only alphabets and spaces are allowed")
      .required("Name is required"),

    cnic: Yup.string()
      .required("CNIC is required")
      .matches(/^\d{5}-\d{7}-\d{1}$/, "CNIC must be in format 31102-1234567-9")
      .test("unique-cnic", "This CNIC is already registered", async (value) => {
        if (!value) return true
        const { data, error } = await supabase.from("Teacher").select("CNIC").eq("CNIC", value)
        if (error) return false
        return data.length === 0
      }),

    email: Yup.string()
      .email("Invalid email")
      .required("Email is required")
      .test("unique-email", "This Email is already registered", async function (value) {
        if (!value) return true
        const { data, error } = await supabase.from("Teacher").select("Email").eq("Email", value)
        if (error) return this.createError({ message: "Could not validate Email" })
        return data.length === 0
      }),

    password: Yup.string()
      .min(8, "Password must be at least 8 characters")
      .matches(/[a-z]/, "Must contain at least one lowercase letter")
      .matches(/[A-Z]/, "Must contain at least one uppercase letter")
      .matches(/\d/, "Must contain at least one digit")
      .matches(/[@$!%*?&]/, "Must contain at least one special character")
      .required("Password is required"),

    phoneNumber: Yup.string()
      .matches(/^\d{9,12}$/, "Phone number must be between 9 and 12 digits")
      .required("Phone number is required")
      .test("unique-phone", "This phone number is already in use", async function (value) {
        if (!value) return true
        const { data, error } = await supabase.from("Teacher").select("PhoneNumber").eq("PhoneNumber", value)
        if (error) return this.createError({ message: "Could not validate phone number" })
        return data.length === 0
      }),

    gender: Yup.string().required("Gender is required"),
    dateOfBirth: Yup.string().required("Date of birth is required"),

    hireDate: Yup.string()
      .required("Hire date is required")
      .test("hireDate-after-dob", "Hire date must be after date of birth", function (value) {
        const { dateOfBirth } = this.parent
        return new Date(value) > new Date(dateOfBirth)
      }),

    qualification: Yup.string()
      .matches(/^[A-Za-z\s]+$/, "Qualification should contain only alphabets and spaces")
      .required("Qualification is required"),

    experienceyears: Yup.number()
      .min(0, "Experience cannot be negative")
      .required("Experience is required")
      .test("experience-less-than-age", "Experience cannot be greater than age", function (value) {
        const { dateOfBirth } = this.parent
        const age = calculateAge(dateOfBirth)
        return value <= age
      }),

    disability: Yup.string().required("Disability status is required"),

    // Fixed when condition for disabilitydetails
    disabilitydetails: Yup.string().when("disability", {
      is: "Yes",
      then: (schema) => schema.required("Disability details are required"),
      otherwise: (schema) => schema.notRequired(),
    }),

    SchoolId: Yup.string().required("School is required"),

    employeetype: Yup.string()
      .required("Employee type is required")
      .test("unique-principal", "This school already has a principal", async function (value) {
        if (value !== "Principal") return true
        const { SchoolId } = this.parent
        if (!SchoolId) return true
        const { data, error } = await supabase
          .from("Teacher")
          .select("*")
          .eq("SchoolID", SchoolId)
          .eq("EmployeeType", "Principal")
          .neq("EmployementStatus", "Transferred")
        if (error) return this.createError({ message: "Could not validate principal status" })
        return data.length === 0
      }),

    employmentStatus: Yup.string().required("Employment status is required"),
    employmentType: Yup.string().required("Employment type is required"),
    address: Yup.string().required("Address is required"),

    fathername: Yup.string()
      .matches(/^[A-Za-z\s]+$/, "Only alphabets and spaces are allowed")
      .required("Father Name is required"),

    domicile: Yup.string().required("Domicile is required"),
    bps: Yup.string().required("BPS is required"),

    // Fixed when condition for teachersubject
    teachersubject: Yup.string().when("employeetype", {
      is: "Teacher",
      then: (schema) => schema.required("Teacher subject is required"),
      otherwise: (schema) => schema.notRequired(),
    }),

    // Fixed when condition for post
    post: Yup.string().when("employeetype", {
      is: "Teacher",
      then: (schema) => schema.required("Post is required"),
      otherwise: (schema) => schema.notRequired(),
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
      fathername: "",
      domicile: "",
      bps: "",
      teachersubject: "",
      post: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      setLoading(true)
      try {
        if (!values.email || !values.password) {
          showAlert("Email and Password are required.", "error")
          return
        }
        // STEP 1: Store current admin session BEFORE auth operations
        const {
          data: { session: currentAdminSession },
          error: sessionError,
        } = await supabase.auth.getSession()
        if (sessionError || !currentAdminSession) {
          showAlert("Admin session not found. Please login again.", "error")
          return
        }
        console.log("Admin session stored successfully")

        // STEP 2: Create the auth user (this will change the current session)
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email: values.email,
          password: values.password,
        })
        if (authError) {
          console.error("Auth Error:", authError.message)
          showAlert("User Already exist aginst email. Try again!", "error")
          return
        }
        if (!authData?.user) {
          console.error("User creation incomplete, email confirmation likely required.")
          showAlert("User created! Please confirm the email before proceeding.", "warning")
          return
        }
        const user = authData.user
        console.log("Auth user created successfully")

        // STEP 3: IMMEDIATELY restore the admin session
        const { error: restoreError } = await supabase.auth.setSession({
          access_token: currentAdminSession.access_token,
          refresh_token: currentAdminSession.refresh_token,
        })
        if (restoreError) {
          console.error("Failed to restore admin session:", restoreError)
          showAlert("Session restore failed. Please try again.", "error")
          return
        }
        console.log("Admin session restored successfully")

        // STEP 4: Now insert teacher data with restored admin session
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
            FatherName: values.fathername,
            Domicile: values.domicile,
            BPS: values.bps,
            TeacherSubject: values.teachersubject,
            Post: values.post,
          },
        ])
        if (teacherError) {
          console.error("Error adding Teacher:", teacherError.message)
          showAlert("Failed to add teacher. Try again!", "error")
          // Optional: Clean up the auth user if teacher creation failed
          // Note: This requires admin privileges
          try {
            await supabase.auth.admin?.deleteUser(user.id)
            console.log("Cleaned up auth user due to teacher creation failure")
          } catch (cleanupError) {
            console.warn("Could not clean up auth user:", cleanupError)
          }
        } else {
          showAlert("Teacher added successfully!", "success")
          formik.resetForm({
            values: {
              ...formik.initialValues,
              ID: "T-",
            },
          })
        }
      } catch (error) {
        console.error("Error in form submission:", error)
        showAlert("An unexpected error occurred", "error")
        // Try to restore admin session in case of any error
        try {
          const {
            data: { session: fallbackSession },
          } = await supabase.auth.getSession()
          if (!fallbackSession) {
            console.warn("No session found after error - admin may need to re-login")
            showAlert("Session lost. Please refresh and login again.", "warning")
          }
        } catch (sessionCheckError) {
          console.error("Failed to check session after error:", sessionCheckError)
        }
      } finally {
        setLoading(false) // Re-enable button when done (success or error)
      }
    },
  })

  useEffect(() => {
    if (formik.values.employeetype === "Principal") {
      formik.setFieldValue("bps", "Grade 18")
    } else if (formik.values.employeetype === "Vice Principal") {
      formik.setFieldValue("bps", "Grade 17")
    } else if (formik.values.employeetype === "Teacher") {
      switch (formik.values.post) {
        case "Subject Specialist":
        case "Acting Principal":
          formik.setFieldValue("bps", "Grade 17")
          break
        case "S.S.T":
        case "S.S.E":
        case "S.S.T(I.T)":
          formik.setFieldValue("bps", "Grade 16")
          break
        case "Arabic Teacher":
        case "E.S.T":
        case "E.S.E":
        case "P.T.I":
          formik.setFieldValue("bps", "Grade 14")
          break
        default:
          formik.setFieldValue("bps", "")
      }
    }
  }, [formik.values.employeetype, formik.values.post])

  const handleSubmitClick = () => {
    console.log("Validating form...")

    // First, mark all fields as touched so errors will be displayed
    const touchedFields = {}
    Object.keys(formik.values).forEach((key) => {
      touchedFields[key] = true
    })
    formik.setTouched(touchedFields)

    // Then validate the form
    formik.validateForm().then((errors) => {
      console.log("Validation errors:", errors)

      if (Object.keys(errors).length === 0) {
        // No errors, open confirmation dialog
        setOpenConfirmDialog(true)
      } else {
        // There are errors, show alert to user
        showAlert("Please fix the validation errors before submitting.", "error")

        // Scroll to first error field
        const firstErrorField = Object.keys(errors)[0]
        const errorElement = document.querySelector(`[name="${firstErrorField}"]`)
        if (errorElement) {
          errorElement.scrollIntoView({ behavior: "smooth", block: "center" })
          errorElement.focus()
        }
      }
    })
  }

  const handleConfirmSubmit = () => {
    setOpenConfirmDialog(false)
    formik.handleSubmit() // Proceed with submission
  }

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
            Add Teacher
          </Typography>
          <Paper
            sx={{
              padding: isMobile ? 2 : 3,
              borderRadius: 2,
              backgroundColor: "#fff",
            }}
            elevation={3}
          >
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
                    }}
                  >
                    Personal Information
                  </Typography>
                  <Divider sx={{ mb: isMobile ? 1 : 2 }} />
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
                    name="fathername"
                    value={formik.values.fathername}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.fathername && Boolean(formik.errors.fathername)}
                    helperText={formik.touched.fathername && formik.errors.fathername}
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
                  <InputMask
                    mask="99999-9999999-9" // Forces XXXXX-XXXXXXX-X format
                    value={formik.values.cnic}
                    onChange={(e) => {
                      formik.setFieldValue("cnic", e.target.value) // Stores with dashes
                    }}
                    onBlur={formik.handleBlur}
                  >
                    {(inputProps) => (
                      <TextField
                        {...inputProps}
                        label="CNIC"
                        fullWidth
                        name="cnic"
                        error={formik.touched.cnic && Boolean(formik.errors.cnic)}
                        helperText={formik.touched.cnic && formik.errors.cnic}
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
                    label="Email"
                    fullWidth
                    name="email"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.email && Boolean(formik.errors.email)}
                    helperText={formik.touched.email && formik.errors.email}
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
                    label="Password"
                    type={showPassword ? "text" : "password"}
                    fullWidth
                    name="password"
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.password && Boolean(formik.errors.password)}
                    helperText={formik.touched.password && formik.errors.password}
                    required
                    size={isMobile ? "small" : "medium"}
                    InputProps={{
                      endAdornment: (
                        <Button onClick={togglePasswordVisibility} size="small" sx={{ minWidth: "auto", p: 0.5 }}>
                          {showPassword ? <Visibility /> : <VisibilityOff />}
                        </Button>
                      ),
                    }}
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
                    name="phoneNumber"
                    value={formik.values.phoneNumber}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.phoneNumber && Boolean(formik.errors.phoneNumber)}
                    helperText={formik.touched.phoneNumber && formik.errors.phoneNumber}
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
                    error={formik.touched.dateOfBirth && Boolean(formik.errors.dateOfBirth)}
                    helperText={formik.touched.dateOfBirth && formik.errors.dateOfBirth}
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
                      name="domicile"
                      value={formik.values.domicile}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={formik.touched.domicile && Boolean(formik.errors.domicile)}
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
                      name="disability"
                      value={formik.values.disability}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={formik.touched.disability && Boolean(formik.errors.disability)}
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
                      error={formik.touched.disabilitydetails && Boolean(formik.errors.disabilitydetails)}
                      helperText={formik.touched.disabilitydetails && formik.errors.disabilitydetails}
                      required={formik.values.disability === "Yes"}
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
                    name="qualification"
                    value={formik.values.qualification}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.qualification && Boolean(formik.errors.qualification)}
                    helperText={formik.touched.qualification && formik.errors.qualification}
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
                    fullWidth
                    name="experienceyears"
                    type="number"
                    value={formik.values.experienceyears}
                    onChange={(e) => {
                      const value = Number.parseInt(e.target.value, 10)
                      formik.setFieldValue("experienceyears", value >= 0 ? value : 0)
                    }}
                    onBlur={formik.handleBlur}
                    error={formik.touched.experienceyears && Boolean(formik.errors.experienceyears)}
                    helperText={formik.touched.experienceyears && formik.errors.experienceyears}
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
                    label="Teacher ID"
                    type="text"
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                    name="ID"
                    value={formik.values.ID}
                    disabled
                    size={isMobile ? "small" : "medium"}
                    sx={{
                      "& .MuiInputBase-root": {
                        fontSize: isMobile ? "0.875rem" : "1rem",
                      },
                      "& .MuiInputLabel-root": {
                        fontSize: isMobile ? "0.875rem" : "1rem",
                      },
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl
                    fullWidth
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
                    <InputLabel>School ID</InputLabel>
                    <Select
                      label="School Id"
                      name="SchoolId"
                      value={formik.values.SchoolId}
                      onChange={async (e) => {
                        const value = e.target.value
                        formik.setFieldValue("SchoolId", value)
                        await generateTeacherID(value)
                      }}
                      onBlur={formik.handleBlur}
                      error={formik.touched.SchoolId && Boolean(formik.errors.SchoolId)}
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
                    error={formik.touched.hireDate && Boolean(formik.errors.hireDate)}
                    helperText={formik.touched.hireDate && formik.errors.hireDate}
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
                      name="employeetype"
                      value={formik.values.employeetype}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={formik.touched.employeetype && Boolean(formik.errors.employeetype)}
                    >
                      <MenuItem value="Principal">Principal</MenuItem>
                      <MenuItem value="Vice Principal">Vice Principal</MenuItem>
                      <MenuItem value="Teacher">Teacher</MenuItem>
                    </Select>
                    {formik.touched.employeetype && formik.errors.employeetype && (
                      <Typography
                        variant="caption"
                        color="error"
                        sx={{
                          ml: 2,
                          fontSize: isMobile ? "0.7rem" : "0.75rem",
                        }}
                      >
                        {formik.errors.employeetype}
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
                      name="employmentStatus"
                      value={formik.values.employmentStatus}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={formik.touched.employmentStatus && Boolean(formik.errors.employmentStatus)}
                    >
                      <MenuItem value="Working">Working</MenuItem>
                      <MenuItem value="Retired">Retired</MenuItem>
                      <MenuItem value="Removed">Removed</MenuItem>
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
                    <InputLabel>Employment Type</InputLabel>
                    <Select
                      label="Employment Type"
                      name="employmentType"
                      value={formik.values.employmentType}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={formik.touched.employmentType && Boolean(formik.errors.employmentType)}
                    >
                      <MenuItem value="Regular">Regular</MenuItem>
                      <MenuItem value="Contract">Contract</MenuItem>
                      <MenuItem value="Deputation">Deputation</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                {formik.values.employeetype === "Teacher" && (
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
                        name="post"
                        value={formik.values.post}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.post && Boolean(formik.errors.post)}
                        required={formik.values.employeetype === "Teacher"}
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
                {formik.values.employeetype === "Teacher" && (
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Teacher Subject"
                      fullWidth
                      name="teachersubject"
                      value={formik.values.teachersubject}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={formik.touched.teachersubject && Boolean(formik.errors.teachersubject)}
                      helperText={formik.touched.teachersubject && formik.errors.teachersubject}
                      required={formik.values.employeetype === "Teacher"}
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
                    name="bps"
                    value={formik.values.bps}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.bps && Boolean(formik.errors.bps)}
                    helperText={formik.touched.bps && formik.errors.bps}
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
                        Adding...
                      </>
                    ) : (
                      "Add Teacher"
                    )}
                  </Button>
                </Grid>
              </Grid>
            </form>
          </Paper>
        </CardContent>
      </Card>
      {/* Snackbar for Alerts */}
      <Snackbar
        open={alert.open}
        autoHideDuration={6000}
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
          Confirm Teacher Registration
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
            Are you sure you want to add this teacher?
          </DialogContentText>
          <Box sx={{ mt: 2 }}>
            <Typography
              sx={{
                fontSize: isMobile ? "0.875rem" : "1rem",
                mb: 1,
                wordBreak: "break-word",
              }}
            >
              <strong>Name:</strong> {formik.values.name}
            </Typography>
            <Typography
              sx={{
                fontSize: isMobile ? "0.875rem" : "1rem",
                mb: 1,
              }}
            >
              <strong>CNIC:</strong> {formik.values.cnic}
            </Typography>
            <Typography
              sx={{
                fontSize: isMobile ? "0.875rem" : "1rem",
                mb: 1,
                wordBreak: "break-word",
              }}
            >
              <strong>School:</strong> {schools.find((s) => s.SchoolID === formik.values.SchoolId)?.SchoolName}
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

export default TeacherAdd
