// // import React, { useState } from "react";
// // import {
// //   Box,
// //   Button,
// //   TextField,
// //   Typography,
// //   Card,
// //   CardContent,
// //   FormControl,
// //   InputLabel,
// //   MenuItem,
// //   Select,
// //   Switch,
// //   FormControlLabel,
// //   Snackbar,
// //   Alert,
// //   Checkbox,
// //   FormGroup,
// //   FormLabel,
// // } from "@mui/material";
// // import ArrowBackIcon from "@mui/icons-material/ArrowBack";
// // import AddIcon from "@mui/icons-material/Add";
// // import { DateRangePicker } from "@mui/x-date-pickers-pro/DateRangePicker";
// // import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
// // import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
// // import { useNavigate } from "react-router-dom";

// // import supabase from "../../../supabase-client";

// // const AddNotice = () => {
// //   const [formData, setFormData] = useState({
// //     NoticeID: "NT-122",
// //     Title: "",
// //     Message: "",
// //     Dates: [null, null],
// //     Type: "Government",
// //     SubType: "Holiday",
// //     CreatedBy: "Admin",
// //     AudienceSchool: false,
// //     AudienceTeacher: false,
// //     AudienceStudent: false,
// //     Urgent: false,
// //     StartDate: "",
// //     EndDate: "",
// //   });

// //   const [alert, setAlert] = useState({
// //     open: false,
// //     message: "",
// //     severity: "",
// //   });

// //   const navigate = useNavigate();

// //   const handleInputChange = (e) => {
// //     const { name, value, type, checked } = e.target;
// //     setFormData({
// //       ...formData,
// //       [name]: type === "checkbox" ? checked : value,
// //     });
// //   };

// //   const handleDateRangeChange = (newValue) => {
// //     setFormData({
// //       ...formData,
// //       Dates: newValue,
// //       StartDate: newValue[0] ? new Date(newValue[0]).toISOString() : "",
// //       EndDate: newValue[1] ? new Date(newValue[1]).toISOString() : "",
// //     });
// //   };

// //   const handleSubmit = async (e) => {
// //     e.preventDefault();

// //     if (
// //       !formData.Title ||
// //       !formData.Message ||
// //       !formData.Dates[0] ||
// //       !formData.Dates[1]
// //     ) {
// //       setAlert({
// //         open: true,
// //         message:
// //           "Please fill all required fields and select a valid date range.",
// //         severity: "error",
// //       });
// //       return;
// //     }

// //     const payload = {
// //       ...formData,
// //       Dates: formData.Dates.map((date) =>
// //         date ? new Date(date).toISOString() : null
// //       ),
// //     };

// //     try {
// //       const { data, error } = await supabase
// //         .from("Notice") // Make sure your table is named 'notices'
// //         .insert([
// //           {
// //             NoticeID: formData.NoticeID,
// //             Title: formData.Title,
// //             Message: formData.Message,
// //             Type: formData.Type,
// //             SubType: formData.SubType,
// //             CreatedBy: formData.CreatedBy,
// //             AudienceSchool: formData.AudienceSchool,
// //             AudienceTeacher: formData.AudienceTeacher,
// //             AudienceStudent: formData.AudienceStudent,
// //             Urgent: formData.Urgent,
// //             StartDate: formData.StartDate,
// //             EndDate: formData.EndDate,
// //             created_at: new Date().toISOString(),
// //           },
// //         ])
// //         .select();

// //       if (error) throw error;

// //       setAlert({
// //         open: true,
// //         message: "Notice posted successfully!",
// //         severity: "success",
// //       });
// //       // Reset form
// //       setFormData({
// //         NoticdID: "",
// //         Title: "",
// //         Message: "",
// //         Dates: [null, null],
// //         Type: "Government",
// //         SubType: "Holiday",
// //         CreatedBy: "Admin",
// //         AudienceSchool: false,
// //         AudienceTeacher: false,
// //         AudienceStudent: false,
// //         Urgent: false,
// //         StartDate: "",
// //         EndDate: "",
// //       });
// //     } catch (error) {
// //       setAlert({
// //         open: true,
// //         message: error.message || "Failed to post notice. Try again!",
// //         severity: "error",
// //       });
// //     }
// //   };

// //   const handleGoBack = () => navigate(-1);
// //   const handleCloseAlert = () => setAlert({ ...alert, open: false });

// //   return (
// //     <LocalizationProvider dateAdapter={AdapterDateFns}>
// //       <Box
// //         display="flex"
// //         justifyContent="center"
// //         alignItems="center"
// //         bgcolor="#f5f5f5"
// //         p={4}
// //       >
// //         <Card
// //           sx={{
// //             maxWidth: 500,
// //             padding: 3,
// //             textAlign: "center",
// //             width: "100%",
// //           }}
// //         >
// //           <CardContent>
// //             <Typography variant="h5" fontWeight="bold" mb={2}>
// //               Add a Notice
// //             </Typography>

// //             <form onSubmit={handleSubmit}>
// //               <Box display="flex" gap={2} mb={2}>
// //                 <FormControl fullWidth>
// //                   <InputLabel>Type</InputLabel>
// //                   <Select
// //                     value={formData.Type}
// //                     name="Type"
// //                     onChange={handleInputChange}
// //                   >
// //                     <MenuItem value="Government">Government</MenuItem>
// //                     <MenuItem value="School">School</MenuItem>
// //                   </Select>
// //                 </FormControl>

// //                 <FormControl fullWidth>
// //                   <InputLabel>Sub-Type</InputLabel>
// //                   <Select
// //                     value={formData.SubType}
// //                     name="SubType"
// //                     onChange={handleInputChange}
// //                   >
// //                     <MenuItem value="Holiday">Holiday</MenuItem>
// //                     <MenuItem value="Event">Event</MenuItem>
// //                   </Select>
// //                 </FormControl>
// //               </Box>

// //               <TextField
// //                 fullWidth
// //                 label="Title *"
// //                 variant="outlined"
// //                 value={formData.Title}
// //                 name="Title"
// //                 onChange={handleInputChange}
// //                 margin="normal"
// //               />

// //               <TextField
// //                 fullWidth
// //                 label="Message *"
// //                 variant="outlined"
// //                 multiline
// //                 rows={4}
// //                 value={formData.Message}
// //                 name="Message"
// //                 onChange={handleInputChange}
// //                 margin="normal"
// //               />

// //               <TextField
// //                 fullWidth
// //                 label="Created By"
// //                 variant="outlined"
// //                 value={formData.CreatedBy}
// //                 name="CreatedBy"
// //                 onChange={handleInputChange}
// //                 margin="normal"
// //               />

// //               <Box mt={2} mb={2}>
// //                 <FormLabel component="legend">Audience</FormLabel>
// //                 <FormGroup row>
// //                   <FormControlLabel
// //                     control={
// //                       <Checkbox
// //                         checked={formData.AudienceSchool}
// //                         onChange={handleInputChange}
// //                         name="AudienceSchool"
// //                       />
// //                     }
// //                     label="School"
// //                   />
// //                   <FormControlLabel
// //                     control={
// //                       <Checkbox
// //                         checked={formData.AudienceTeacher}
// //                         onChange={handleInputChange}
// //                         name="AudienceTeacher"
// //                       />
// //                     }
// //                     label="Teacher"
// //                   />
// //                   <FormControlLabel
// //                     control={
// //                       <Checkbox
// //                         checked={formData.AudienceStudent}
// //                         onChange={handleInputChange}
// //                         name="AudienceStudent"
// //                       />
// //                     }
// //                     label="Student"
// //                   />
// //                 </FormGroup>
// //               </Box>

// //               <FormControlLabel
// //                 control={
// //                   <Switch
// //                     checked={formData.Urgent}
// //                     onChange={handleInputChange}
// //                     name="Urgent"
// //                   />
// //                 }
// //                 label="Mark as Urgent"
// //                 sx={{ mb: 2 }}
// //               />

// //               <DateRangePicker
// //                 startText="Start Date"
// //                 endText="End Date"
// //                 value={formData.Dates}
// //                 onChange={handleDateRangeChange}
// //                 renderInput={(startProps, endProps) => (
// //                   <>
// //                     <TextField {...startProps} fullWidth margin="normal" />
// //                     <Box sx={{ mx: 2 }}> to </Box>
// //                     <TextField {...endProps} fullWidth margin="normal" />
// //                   </>
// //                 )}
// //               />

// //               <Box mt={3} display="flex" justifyContent="space-between">
// //                 <Button
// //                   variant="outlined"
// //                   startIcon={<ArrowBackIcon />}
// //                   onClick={handleGoBack}
// //                 >
// //                   Back
// //                 </Button>
// //                 <Button
// //                   variant="contained"
// //                   color="primary"
// //                   startIcon={<AddIcon />}
// //                   type="submit"
// //                 >
// //                   Post Notice
// //                 </Button>
// //               </Box>
// //             </form>
// //           </CardContent>
// //         </Card>

// //         <Snackbar
// //           open={alert.open}
// //           autoHideDuration={6000}
// //           onClose={handleCloseAlert}
// //         >
// //           <Alert onClose={handleCloseAlert} severity={alert.severity}>
// //             {alert.message}
// //           </Alert>
// //         </Snackbar>
// //       </Box>
// //     </LocalizationProvider>
// //   );
// // };

// // export default AddNotice;

// import React, { useState, useEffect } from "react";
// import {
//   Box,
//   Button,
//   TextField,
//   Typography,
//   Card,
//   CardContent,
//   FormControl,
//   InputLabel,
//   MenuItem,
//   Select,
//   Switch,
//   FormControlLabel,
//   Snackbar,
//   Alert,
//   Checkbox,
//   FormGroup,
//   FormLabel,
// } from "@mui/material";
// import ArrowBackIcon from "@mui/icons-material/ArrowBack";
// import AddIcon from "@mui/icons-material/Add";
// import { DateRangePicker } from "@mui/x-date-pickers-pro/DateRangePicker";
// import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
// import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
// import { useNavigate } from "react-router-dom";

// import supabase from "../../../supabase-client";

// const AddNotice = () => {
//   const [formData, setFormData] = useState({
//     NoticeID: "",
//     Title: "",
//     Message: "",
//     Dates: [null, null],
//     Type: "Government",
//     SubType: "Holiday",
//     CreatedBy: "Admin",
//     AudienceSchool: false,
//     AudienceTeacher: false,
//     AudienceStudent: false,
//     Urgent: false,
//     StartDate: "",
//     EndDate: "",
//   });

//   const [alert, setAlert] = useState({
//     open: false,
//     message: "",
//     severity: "",
//   });

//   const navigate = useNavigate();

//   // Function to generate NoticeID
//   const generateNoticeID = async () => {
//     const today = new Date();
//     const year = today.getFullYear();
//     const month = String(today.getMonth() + 1).padStart(2, '0');
//     const day = String(today.getDate()).padStart(2, '0');

//     // Get the first letters of Type and SubType
//     const typeInitial = formData.Type.charAt(0);
//     const subTypeInitial = formData.SubType.charAt(0);

//     try {
//       // Fetch notices with similar pattern from today
//       const { data, error } = await supabase
//         .from("Notice")
//         .select("NoticeID")
//         .like("NoticeID", `N-${typeInitial}-${subTypeInitial}-${year}${month}${day}-%`);

//       if (error) throw error;

//       // Calculate the next serial number
//       let nextSerial = 1;
//       if (data && data.length > 0) {
//         const latestNotice = data[data.length - 1].NoticeID;
//         const latestSerial = parseInt(latestNotice.split('-')[4]) || 0;
//         nextSerial = latestSerial + 1;
//       }

//       // Generate the new NoticeID
//       const newNoticeID = `N-${typeInitial}-${subTypeInitial}-${year}${month}${day}-${nextSerial}`;

//       setFormData(prev => ({
//         ...prev,
//         NoticeID: newNoticeID
//       }));

//     } catch (error) {
//       console.error("Error fetching notice IDs:", error);
//       // Fallback ID if there's an error
//       const newNoticeID = `N-${typeInitial}-${subTypeInitial}-${year}${month}${day}-1`;
//       setFormData(prev => ({
//         ...prev,
//         NoticeID: newNoticeID
//       }));
//     }
//   };

//   // Generate NoticeID when Type or SubType changes
//   useEffect(() => {
//     if (formData.Type && formData.SubType) {
//       generateNoticeID();
//     }
//   }, [formData.Type, formData.SubType]);

//   const handleInputChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setFormData({
//       ...formData,
//       [name]: type === "checkbox" ? checked : value,
//     });
//   };

//   const handleDateRangeChange = (newValue) => {
//     setFormData({
//       ...formData,
//       Dates: newValue,
//       StartDate: newValue[0] ? new Date(newValue[0]).toISOString() : "",
//       EndDate: newValue[1] ? new Date(newValue[1]).toISOString() : "",
//     });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (
//       !formData.Title ||
//       !formData.Message ||
//       !formData.Dates[0] ||
//       !formData.Dates[1]
//     ) {
//       setAlert({
//         open: true,
//         message:
//           "Please fill all required fields and select a valid date range.",
//         severity: "error",
//       });
//       return;
//     }

//     // Ensure NoticeID is generated before submission
//     if (!formData.NoticeID) {
//       await generateNoticeID();
//     }

//     const payload = {
//       ...formData,
//       Dates: formData.Dates.map((date) =>
//         date ? new Date(date).toISOString() : null
//       ),
//     };

//     try {
//       const { data, error } = await supabase
//         .from("Notice")
//         .insert([
//           {
//             NoticeID: formData.NoticeID,
//             Title: formData.Title,
//             Message: formData.Message,
//             Type: formData.Type,
//             SubType: formData.SubType,
//             CreatedBy: formData.CreatedBy,
//             AudienceSchool: formData.AudienceSchool,
//             AudienceTeacher: formData.AudienceTeacher,
//             AudienceStudent: formData.AudienceStudent,
//             Urgent: formData.Urgent,
//             StartDate: formData.StartDate,
//             EndDate: formData.EndDate,
//             created_at: new Date().toISOString(),
//           },
//         ])
//         .select();

//       if (error) throw error;

//       setAlert({
//         open: true,
//         message: "Notice posted successfully!",
//         severity: "success",
//       });

//       // Reset form
//       setFormData({
//         NoticeID: "",
//         Title: "",
//         Message: "",
//         Dates: [null, null],
//         Type: "Government",
//         SubType: "Holiday",
//         CreatedBy: "Admin",
//         AudienceSchool: false,
//         AudienceTeacher: false,
//         AudienceStudent: false,
//         Urgent: false,
//         StartDate: "",
//         EndDate: "",
//       });

//       // Regenerate ID for the next notice
//       generateNoticeID();
//     } catch (error) {
//       setAlert({
//         open: true,
//         message: error.message || "Failed to post notice. Try again!",
//         severity: "error",
//       });
//     }
//   };

//   const handleGoBack = () => navigate(-1);
//   const handleCloseAlert = () => setAlert({ ...alert, open: false });

//   return (
//     <LocalizationProvider dateAdapter={AdapterDateFns}>
//       <Box
//         display="flex"
//         justifyContent="center"
//         alignItems="center"
//         bgcolor="#f5f5f5"
//         p={4}
//       >
//         <Card
//           sx={{
//             maxWidth: 500,
//             padding: 3,
//             textAlign: "center",
//             width: "100%",
//           }}
//         >
//           <CardContent>
//             <Typography variant="h5" fontWeight="bold" mb={2}>
//               Add a Notice
//             </Typography>

//             <form onSubmit={handleSubmit}>
//               <Box display="flex" gap={2} mb={2}>
//                 <FormControl fullWidth>
//                   <InputLabel>Type</InputLabel>
//                   <Select
//                     value={formData.Type}
//                     name="Type"
//                     onChange={handleInputChange}
//                   >
//                     <MenuItem value="Government">Government</MenuItem>
//                     <MenuItem value="School">School</MenuItem>
//                   </Select>
//                 </FormControl>

//                 <FormControl fullWidth>
//                   <InputLabel>Sub-Type</InputLabel>
//                   <Select
//                     value={formData.SubType}
//                     name="SubType"
//                     onChange={handleInputChange}
//                   >
//                     <MenuItem value="Holiday">Holiday</MenuItem>
//                     <MenuItem value="Event">Event</MenuItem>
//                   </Select>
//                 </FormControl>
//               </Box>

//               <TextField
//                 fullWidth
//                 label="Title *"
//                 variant="outlined"
//                 value={formData.Title}
//                 name="Title"
//                 onChange={handleInputChange}
//                 margin="normal"
//               />

//               <TextField
//                 fullWidth
//                 label="Message *"
//                 variant="outlined"
//                 multiline
//                 rows={4}
//                 value={formData.Message}
//                 name="Message"
//                 onChange={handleInputChange}
//                 margin="normal"
//               />

//               <TextField
//                 fullWidth
//                 label="Created By"
//                 variant="outlined"
//                 value={formData.CreatedBy}
//                 name="CreatedBy"
//                 onChange={handleInputChange}
//                 margin="normal"
//               />

//               <Box mt={2} mb={2}>
//                 <FormLabel component="legend">Audience</FormLabel>
//                 <FormGroup row>
//                   <FormControlLabel
//                     control={
//                       <Checkbox
//                         checked={formData.AudienceSchool}
//                         onChange={handleInputChange}
//                         name="AudienceSchool"
//                       />
//                     }
//                     label="School"
//                   />
//                   <FormControlLabel
//                     control={
//                       <Checkbox
//                         checked={formData.AudienceTeacher}
//                         onChange={handleInputChange}
//                         name="AudienceTeacher"
//                       />
//                     }
//                     label="Teacher"
//                   />
//                   <FormControlLabel
//                     control={
//                       <Checkbox
//                         checked={formData.AudienceStudent}
//                         onChange={handleInputChange}
//                         name="AudienceStudent"
//                       />
//                     }
//                     label="Student"
//                   />
//                 </FormGroup>
//               </Box>

//               <FormControlLabel
//                 control={
//                   <Switch
//                     checked={formData.Urgent}
//                     onChange={handleInputChange}
//                     name="Urgent"
//                   />
//                 }
//                 label="Mark as Urgent"
//                 sx={{ mb: 2 }}
//               />

//               <DateRangePicker
//                 startText="Start Date"
//                 endText="End Date"
//                 value={formData.Dates}
//                 onChange={handleDateRangeChange}
//                 renderInput={(startProps, endProps) => (
//                   <>
//                     <TextField {...startProps} fullWidth margin="normal" />
//                     <Box sx={{ mx: 2 }}> to </Box>
//                     <TextField {...endProps} fullWidth margin="normal" />
//                   </>
//                 )}
//               />

//               <Box mt={3} display="flex" justifyContent="space-between">
//                 <Button
//                   variant="outlined"
//                   startIcon={<ArrowBackIcon />}
//                   onClick={handleGoBack}
//                 >
//                   Back
//                 </Button>
//                 <Button
//                   variant="contained"
//                   color="primary"
//                   startIcon={<AddIcon />}
//                   type="submit"
//                 >
//                   Post Notice
//                 </Button>
//               </Box>
//             </form>
//           </CardContent>
//         </Card>

//         <Snackbar
//           open={alert.open}
//           autoHideDuration={6000}
//           onClose={handleCloseAlert}
//         >
//           <Alert onClose={handleCloseAlert} severity={alert.severity}>
//             {alert.message}
//           </Alert>
//         </Snackbar>
//       </Box>
//     </LocalizationProvider>
//   );
// };

// export default AddNotice;

import React, { useState, useEffect } from "react";
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
  Checkbox,
  FormGroup,
  FormLabel,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AddIcon from "@mui/icons-material/Add";
import { DateRangePicker } from "@mui/x-date-pickers-pro/DateRangePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import supabase from "../../../supabase-client";

const AddNotice = () => {
  const [alert, setAlert] = useState({
    open: false,
    message: "",
    severity: "",
  });
  const [userEmail, setUserEmail] = useState("");
  const [adminId, setAdminId] = useState(null);
  const navigate = useNavigate();

  // Validation Schema
  const validationSchema = Yup.object().shape({
    Title: Yup.string()
      .required("Title is required")
      .matches(/^[a-zA-Z\s]*$/, "Title can only contain letters and spaces"),
    Message: Yup.string().required("Message is required"),
    Type: Yup.string().required("Type is required"),
    SubType: Yup.string().required("Sub-type is required"),
    StartDate: Yup.date().required("Start date is required"),
    EndDate: Yup.date()
      .required("End date is required")
      .min(Yup.ref("StartDate"), "End date must be after start date"),
  });

  // Get current user and admin ID on component mount
  useEffect(() => {
    const fetchUserAndAdminId = async () => {
      // Get authenticated user
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError) {
        navigate("/login");
        return;
      }

      if (user) {
        setUserEmail(user.email);

        // Fetch admin ID from Admin table using the email
        const { data: adminData, error: adminError } = await supabase
          .from("Admin")
          .select("AdminID")
          .eq("Email", user.email)
          .single();

        if (adminError) {
          console.error("Error fetching admin ID:", adminError);
          setAlert({
            open: true,
            message: "Failed to verify admin privileges",
            severity: "error",
          });
          return;
        }

        if (adminData) {
          setAdminId(adminData.AdminID);
        } else {
          setAlert({
            open: true,
            message: "Only admins can create notices",
            severity: "error",
          });
          navigate(-1); // Go back if not an admin
        }
      }
    };

    fetchUserAndAdminId();
  }, [navigate]);

  // Formik initialization
  const formik = useFormik({
    initialValues: {
      NoticeID: "",
      Title: "",
      Message: "",
      StartDate: null,
      EndDate: null,
      Type: "Government",
      SubType: "Holiday",
      CreatedBy: null, // Will be set to AdminID
      AudienceSchool: false,
      AudienceTeacher: false,
      AudienceStudent: false,
      Urgent: false,
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        if (!values.NoticeID) {
          await generateNoticeID(values.Type, values.SubType);
        }

        const payload = {
          NoticeID: values.NoticeID,
          Title: values.Title,
          Message: values.Message,
          Type: values.Type,
          SubType: values.SubType,
          CreatedBy: adminId, // Use the fetched AdminID
          CreatedType: "Admin",
          AudienceSchool: values.AudienceSchool,
          AudienceTeacher: values.AudienceTeacher,
          AudienceStudent: values.AudienceStudent,
          Urgent: values.Urgent,
          StartDate: values.StartDate
            ? new Date(values.StartDate).toISOString()
            : null,
          EndDate: values.EndDate
            ? new Date(values.EndDate).toISOString()
            : null,
        };

        const { data, error } = await supabase
          .from("Notice")
          .insert([payload])
          .select();

        if (error) throw error;

        setAlert({
          open: true,
          message: "Notice posted successfully!",
          severity: "success",
        });

        formik.resetForm({
          values: {
            ...formik.initialValues,
            CreatedBy: adminId,
          },
        });

        generateNoticeID(formik.values.Type, formik.values.SubType);
      } catch (error) {
        setAlert({
          open: true,
          message: error.message || "Failed to post notice. Try again!",
          severity: "error",
        });
      }
    },
  });

  // Update form values when adminId changes
  useEffect(() => {
    if (adminId) {
      formik.setFieldValue("CreatedBy", adminId);
    }
  }, [adminId]);

  const generateNoticeID = async (type, subType) => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");

    const typeInitial = type.charAt(0);
    const subTypeInitial = subType.charAt(0);

    try {
      const { data, error } = await supabase
        .from("Notice")
        .select("NoticeID")
        .like(
          "NoticeID",
          `N-${typeInitial}-${subTypeInitial}-${year}${month}${day}-%`
        );

      if (error) throw error;

      let nextSerial = 1;
      if (data && data.length > 0) {
        const latestNotice = data[data.length - 1].NoticeID;
        const latestSerial = parseInt(latestNotice.split("-")[4]) || 0;
        nextSerial = latestSerial + 1;
      }

      const newNoticeID = `N-${typeInitial}-${subTypeInitial}-${year}${month}${day}-${nextSerial}`;
      formik.setFieldValue("NoticeID", newNoticeID);
    } catch (error) {
      console.error("Error fetching notice IDs:", error);
      const newNoticeID = `N-${typeInitial}-${subTypeInitial}-${year}${month}${day}-1`;
      formik.setFieldValue("NoticeID", newNoticeID);
    }
  };

  useEffect(() => {
    if (formik.values.Type && formik.values.SubType) {
      generateNoticeID(formik.values.Type, formik.values.SubType);
    }
  }, [formik.values.Type, formik.values.SubType]);

  const handleDateRangeChange = (newValue) => {
    formik.setFieldValue("StartDate", newValue[0]);
    formik.setFieldValue("EndDate", newValue[1]);
  };

  const handleAudienceChange = (name) => (event) => {
    const checked = event.target.checked;

    if (name === "AudienceStudent") {
      formik.setValues({
        ...formik.values,
        AudienceStudent: checked,
        AudienceTeacher: checked,
        AudienceSchool: checked,
      });
    } else if (name === "AudienceTeacher") {
      formik.setValues({
        ...formik.values,
        AudienceTeacher: checked,
        AudienceSchool: checked,
        AudienceStudent: false,
      });
    } else if (name === "AudienceSchool") {
      formik.setValues({
        ...formik.values,
        AudienceSchool: checked,
        AudienceTeacher: checked ? formik.values.AudienceTeacher : false,
        AudienceStudent: false,
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

            <Typography variant="body2" sx={{ mb: 2, fontStyle: "italic" }}>
              Notice will be created by Admin ID: {adminId || "Loading..."}
            </Typography>

            <form onSubmit={formik.handleSubmit}>
              <Box display="flex" gap={2} mb={2}>
                <FormControl fullWidth>
                  <InputLabel>Type</InputLabel>
                  <Select
                    value={formik.values.Type}
                    name="Type"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.Type && Boolean(formik.errors.Type)}
                  >
                    <MenuItem value="Government">Government</MenuItem>
                    <MenuItem value="School">School</MenuItem>
                  </Select>
                </FormControl>

                <FormControl fullWidth>
                  <InputLabel>Sub-Type</InputLabel>
                  <Select
                    value={formik.values.SubType}
                    name="SubType"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={
                      formik.touched.SubType && Boolean(formik.errors.SubType)
                    }
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
                value={formik.values.Title}
                name="Title"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.Title && Boolean(formik.errors.Title)}
                helperText={formik.touched.Title && formik.errors.Title}
                margin="normal"
              />

              <TextField
                fullWidth
                label="Message *"
                variant="outlined"
                multiline
                rows={4}
                value={formik.values.Message}
                name="Message"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.Message && Boolean(formik.errors.Message)}
                helperText={formik.touched.Message && formik.errors.Message}
                margin="normal"
              />

              <Box mt={2} mb={2}>
                <FormLabel component="legend">Audience</FormLabel>
                <FormGroup row>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={formik.values.AudienceSchool}
                        onChange={handleAudienceChange("AudienceSchool")}
                        name="AudienceSchool"
                      />
                    }
                    label="School"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={formik.values.AudienceTeacher}
                        onChange={handleAudienceChange("AudienceTeacher")}
                        name="AudienceTeacher"
                        disabled={!formik.values.AudienceSchool}
                      />
                    }
                    label="Teacher"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={formik.values.AudienceStudent}
                        onChange={handleAudienceChange("AudienceStudent")}
                        name="AudienceStudent"
                        disabled={!formik.values.AudienceTeacher}
                      />
                    }
                    label="Student"
                  />
                </FormGroup>
              </Box>

              <FormControlLabel
                control={
                  <Switch
                    checked={formik.values.Urgent}
                    onChange={formik.handleChange}
                    name="Urgent"
                  />
                }
                label="Mark as Urgent"
                sx={{ mb: 2 }}
              />

              <DateRangePicker
                startText="Start Date *"
                endText="End Date *"
                value={[formik.values.StartDate, formik.values.EndDate]}
                onChange={handleDateRangeChange}
                renderInput={(startProps, endProps) => (
                  <>
                    <TextField
                      {...startProps}
                      fullWidth
                      margin="normal"
                      error={
                        formik.touched.StartDate &&
                        Boolean(formik.errors.StartDate)
                      }
                      helperText={
                        formik.touched.StartDate && formik.errors.StartDate
                      }
                    />
                    <Box sx={{ mx: 2 }}> to </Box>
                    <TextField
                      {...endProps}
                      fullWidth
                      margin="normal"
                      error={
                        formik.touched.EndDate && Boolean(formik.errors.EndDate)
                      }
                      helperText={
                        formik.touched.EndDate && formik.errors.EndDate
                      }
                    />
                  </>
                )}
              />

              <Box mt={3} display="flex" justifyContent="space-between">
                <Button
                  variant="outlined"
                  startIcon={<ArrowBackIcon />}
                  onClick={handleGoBack}
                >
                  Back
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<AddIcon />}
                  type="submit"
                  disabled={!formik.isValid || formik.isSubmitting}
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
