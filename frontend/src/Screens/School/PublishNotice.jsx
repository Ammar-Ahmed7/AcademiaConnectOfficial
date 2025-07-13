// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { useFormik } from "formik";
// import * as Yup from "yup";
// import supabase from "../../../supabase-client";
// import {
//   Box,
//   Button,
//   TextField,
//   Typography,
//   Card,
//   CardContent,
//   FormControl,
//   InputLabel,
//   Select,
//   MenuItem,
//   Checkbox,
//   FormControlLabel,
//   Snackbar,
//   Alert,
//   Divider,
//   Grid,
//   InputAdornment,
//   IconButton,
// } from "@mui/material";
// import {
//   Send as SendIcon,
//   Event as EventIcon,
//   Close as CloseIcon,
//   ErrorOutline as ErrorIcon,
//   CheckCircleOutline as SuccessIcon,
// } from "@mui/icons-material";

// function PublishNotice({ onPublish }) {
//   const [alert, setAlert] = useState({
//     open: false,
//     message: "",
//     severity: "",
//   });
//   const [userEmail, setUserEmail] = useState("");
//   const [schoolId, setSchoolId] = useState(null);
//   const navigate = useNavigate();

//   // Validation Schema
//   const validationSchema = Yup.object().shape({
//     Title: Yup.string()
//       .required("Title is required")
//       .matches(/^[a-zA-Z\s]*$/, "Title can only contain letters and spaces"),
//     Message: Yup.string().required("Message is required"),
//     Type: Yup.string().required("Type is required"),
//     SubType: Yup.string().required("Sub-type is required"),
//     StartDate: Yup.date().required("Start date is required"),
//     EndDate: Yup.date()
//       .required("End date is required")
//       .min(Yup.ref("StartDate"), "End date must be after start date"),
//   });

//   // Get current user and school ID
//   useEffect(() => {
//     const fetchUserAndSchoolId = async () => {
//       const {
//         data: { user },
//         error: authError,
//       } = await supabase.auth.getUser();

//       if (authError) {
//         navigate("/login");
//         return;
//       }

//       if (user) {
//         setUserEmail(user.email);
//         const { data: schoolData, error: schoolError } = await supabase
//           .from("School")
//           .select("SchoolID")
//           .eq("Email", user.email)
//           .single();

//         if (schoolError) {
//           setAlert({
//             open: true,
//             message: "Failed to verify School privileges",
//             severity: "error",
//           });
//           return;
//         }

//         if (schoolData) {
//           setSchoolId(schoolData.SchoolID);
//         } else {
//           setAlert({
//             open: true,
//             message: "Only schools can create notices",
//             severity: "error",
//           });
//           navigate(-1);
//         }
//       }
//     };

//     fetchUserAndSchoolId();
//   }, [navigate]);

//   // Formik initialization
//   const formik = useFormik({
//     initialValues: {
//       NoticeID: "",
//       Title: "",
//       Message: "",
//       StartDate: null,
//       EndDate: null,
//       Type: "Government",
//       SubType: "Holiday",
//       CreatedBy: null,
//       AudienceTeacher: false,
//       AudienceStudent: false,
//       AudienceSchool: false,
//       Urgent: false,
//     },
//     validationSchema,
//     onSubmit: async (values) => {
//       try {
//         if (!values.NoticeID) {
//           await generateNoticeID(values.Type, values.SubType);
//         }

//         const payload = {
//           NoticeID: values.NoticeID,
//           Title: values.Title,
//           Message: values.Message,
//           Type: values.Type,
//           SubType: values.SubType,
//           CreatedBy: schoolId,
//           CreatedType: "School",
//           AudienceSchool: "False",
//           AudienceTeacher: values.AudienceTeacher,
//           AudienceStudent: values.AudienceStudent,

//           Urgent: values.Urgent,
//           StartDate: values.StartDate
//             ? new Date(values.StartDate).toISOString()
//             : null,
//           EndDate: values.EndDate
//             ? new Date(values.EndDate).toISOString()
//             : null,
//         };

//         const { data, error } = await supabase
//           .from("Notice")
//           .insert([payload])
//           .select();

//         if (error) throw error;

//         setAlert({
//           open: true,
//           message: "Notice posted successfully!",
//           severity: "success",
//         });

//         formik.resetForm({
//           values: {
//             ...formik.initialValues,
//             CreatedBy: schoolId,
//           },
//         });

//         generateNoticeID(formik.values.Type, formik.values.SubType);

//         if (onPublish) {
//           onPublish(payload);
//         }
//       } catch (error) {
//         setAlert({
//           open: true,
//           message: error.message || "Failed to post notice. Try again!",
//           severity: "error",
//         });
//       }
//     },
//   });

//   useEffect(() => {
//     if (schoolId) {
//       formik.setFieldValue("CreatedBy", schoolId);
//     }
//   }, [schoolId]);

//   const generateNoticeID = async (type, subType) => {
//     const today = new Date();
//     const year = today.getFullYear();
//     const month = String(today.getMonth() + 1).padStart(2, "0");
//     const day = String(today.getDate()).padStart(2, "0");

//     const typeInitial = type.charAt(0);
//     const subTypeInitial = subType.charAt(0);

//     try {
//       const { data, error } = await supabase
//         .from("Notice")
//         .select("NoticeID")
//         .like(
//           "NoticeID",
//           `N-${typeInitial}-${subTypeInitial}-${year}${month}${day}-%`
//         );

//       if (error) throw error;

//       let nextSerial = 1;
//       if (data && data.length > 0) {
//         const latestNotice = data[data.length - 1].NoticeID;
//         const latestSerial = parseInt(latestNotice.split("-")[4]) || 0;
//         nextSerial = latestSerial + 1;
//       }

//       const newNoticeID = `N-${typeInitial}-${subTypeInitial}-${year}${month}${day}-${nextSerial}`;
//       formik.setFieldValue("NoticeID", newNoticeID);
//     } catch (error) {
//       console.error("Error fetching notice IDs:", error);
//       const newNoticeID = `N-${typeInitial}-${subTypeInitial}-${year}${month}${day}-1`;
//       formik.setFieldValue("NoticeID", newNoticeID);
//     }
//   };

//   useEffect(() => {
//     if (formik.values.Type && formik.values.SubType) {
//       generateNoticeID(formik.values.Type, formik.values.SubType);
//     }
//   }, [formik.values.Type, formik.values.SubType]);

//   const handleCloseAlert = () => setAlert({ ...alert, open: false });

//   return (
//     <Card sx={{ maxWidth: 800, margin: "auto", mt: 4, p: 3 }}>
//       <Typography
//         variant="h5"
//         component="h2"
//         gutterBottom
//         sx={{ fontWeight: "bold" }}
//       >
//         <SendIcon color="primary" sx={{ verticalAlign: "middle", mr: 1 }} />
//         Publish New Notice
//       </Typography>

//       <Divider sx={{ my: 2 }} />

//       <CardContent>
//         <form onSubmit={formik.handleSubmit}>
//           <Grid container spacing={3}>
//             {/* Type and SubType */}
//             <Grid item xs={12} sm={6}>
//               <FormControl fullWidth>
//                 <InputLabel>Type *</InputLabel>
//                 <Select
//                   name="Type"
//                   value={formik.values.Type}
//                   onChange={formik.handleChange}
//                   onBlur={formik.handleBlur}
//                   error={formik.touched.Type && Boolean(formik.errors.Type)}
//                   label="Type *"
//                 >
//                   <MenuItem value="Government">Government</MenuItem>
//                   <MenuItem value="School">School</MenuItem>
//                 </Select>
//                 {formik.touched.Type && formik.errors.Type && (
//                   <Typography variant="caption" color="error">
//                     {formik.errors.Type}
//                   </Typography>
//                 )}
//               </FormControl>
//             </Grid>

//             <Grid item xs={12} sm={6}>
//               <FormControl fullWidth>
//                 <InputLabel>Sub-Type *</InputLabel>
//                 <Select
//                   name="SubType"
//                   value={formik.values.SubType}
//                   onChange={formik.handleChange}
//                   onBlur={formik.handleBlur}
//                   error={
//                     formik.touched.SubType && Boolean(formik.errors.SubType)
//                   }
//                   label="Sub-Type *"
//                 >
//                   <MenuItem value="Holiday">Holiday</MenuItem>
//                   <MenuItem value="Event">Event</MenuItem>
//                 </Select>
//                 {formik.touched.SubType && formik.errors.SubType && (
//                   <Typography variant="caption" color="error">
//                     {formik.errors.SubType}
//                   </Typography>
//                 )}
//               </FormControl>
//             </Grid>

//             {/* Notice Title */}
//             <Grid item xs={12}>
//               <TextField
//                 fullWidth
//                 label="Notice Title *"
//                 variant="outlined"
//                 name="Title"
//                 value={formik.values.Title}
//                 onChange={formik.handleChange}
//                 onBlur={formik.handleBlur}
//                 error={formik.touched.Title && Boolean(formik.errors.Title)}
//                 helperText={formik.touched.Title && formik.errors.Title}
//               />
//             </Grid>

//             {/* Date Range */}
//             <Grid item xs={12} sm={6}>
//               <TextField
//                 fullWidth
//                 label="Start Date *"
//                 type="date"
//                 name="StartDate"
//                 InputLabelProps={{ shrink: true }}
//                 InputProps={{
//                   startAdornment: (
//                     <InputAdornment position="start">
//                       <EventIcon color="action" />
//                     </InputAdornment>
//                   ),
//                 }}
//                 value={
//                   formik.values.StartDate
//                     ? new Date(formik.values.StartDate)
//                         .toISOString()
//                         .split("T")[0]
//                     : ""
//                 }
//                 onChange={(e) =>
//                   formik.setFieldValue("StartDate", e.target.value)
//                 }
//                 onBlur={formik.handleBlur("StartDate")}
//                 error={
//                   formik.touched.StartDate && Boolean(formik.errors.StartDate)
//                 }
//                 helperText={formik.touched.StartDate && formik.errors.StartDate}
//               />
//             </Grid>

//             <Grid item xs={12} sm={6}>
//               <TextField
//                 fullWidth
//                 label="End Date *"
//                 type="date"
//                 name="EndDate"
//                 InputLabelProps={{ shrink: true }}
//                 InputProps={{
//                   startAdornment: (
//                     <InputAdornment position="start">
//                       <EventIcon color="action" />
//                     </InputAdornment>
//                   ),
//                 }}
//                 value={
//                   formik.values.EndDate
//                     ? new Date(formik.values.EndDate)
//                         .toISOString()
//                         .split("T")[0]
//                     : ""
//                 }
//                 onChange={(e) =>
//                   formik.setFieldValue("EndDate", e.target.value)
//                 }
//                 onBlur={formik.handleBlur("EndDate")}
//                 error={formik.touched.EndDate && Boolean(formik.errors.EndDate)}
//                 helperText={formik.touched.EndDate && formik.errors.EndDate}
//               />
//             </Grid>

//             {/* Content */}
//             <Grid item xs={12}>
//               <TextField
//                 fullWidth
//                 label="Notice Content *"
//                 variant="outlined"
//                 multiline
//                 rows={4}
//                 name="Message"
//                 value={formik.values.Message}
//                 onChange={formik.handleChange}
//                 onBlur={formik.handleBlur}
//                 error={formik.touched.Message && Boolean(formik.errors.Message)}
//                 helperText={formik.touched.Message && formik.errors.Message}
//               />
//             </Grid>

//             {/* Audience */}
//             <Grid item xs={12}>
//               <Typography variant="subtitle1" gutterBottom>
//                 Audience *
//               </Typography>
//               <Box sx={{ display: "flex", gap: 2 }}>
//                 <FormControlLabel
//                   control={
//                     <Checkbox
//                       checked={formik.values.AudienceTeacher}
//                       onChange={formik.handleChange}
//                       name="AudienceTeacher"
//                       color="primary"
//                     />
//                   }
//                   label="Teachers"
//                 />
//                 <FormControlLabel
//                   control={
//                     <Checkbox
//                       checked={formik.values.AudienceStudent}
//                       onChange={formik.handleChange}
//                       name="AudienceStudent"
//                       color="primary"
//                     />
//                   }
//                   label="Students"
//                 />
//               </Box>
//             </Grid>

//             {/* Urgency */}
//             <Grid item xs={12}>
//               <FormControlLabel
//                 control={
//                   <Checkbox
//                     checked={formik.values.Urgent}
//                     onChange={formik.handleChange}
//                     name="Urgent"
//                     color="primary"
//                   />
//                 }
//                 label="Mark as Urgent Notice"
//               />
//             </Grid>

//             {/* Submit Button */}
//             <Grid item xs={12}>
//               <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
//                 <Button
//                   type="submit"
//                   variant="contained"
//                   color="primary"
//                   size="large"
//                   startIcon={<SendIcon />}
//                   disabled={!formik.isValid || formik.isSubmitting}
//                 >
//                   Publish Notice
//                 </Button>
//               </Box>
//             </Grid>
//           </Grid>
//         </form>
//       </CardContent>

//       {/* Alert Snackbar */}
//       <Snackbar
//         open={alert.open}
//         autoHideDuration={6000}
//         onClose={handleCloseAlert}
//         anchorOrigin={{ vertical: "top", horizontal: "center" }}
//       >
//         <Alert
//           onClose={handleCloseAlert}
//           severity={alert.severity}
//           icon={alert.severity === "error" ? <ErrorIcon /> : <SuccessIcon />}
//           sx={{ width: "100%" }}
//         >
//           {alert.message}
//         </Alert>
//       </Snackbar>
//     </Card>
//   );
// }

// export default PublishNotice;

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import supabase from "../../../supabase-client";
import {
  Box,
  Button,
  TextField,
  Typography,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  FormControlLabel,
  Snackbar,
  Alert,
  Divider,
  Grid,
  InputAdornment,
  IconButton,
} from "@mui/material";
import {
  Send as SendIcon,
  Event as EventIcon,
  Close as CloseIcon,
  ErrorOutline as ErrorIcon,
  CheckCircleOutline as SuccessIcon,
} from "@mui/icons-material";

function PublishNotice({ onPublish }) {
  const [alert, setAlert] = useState({
    open: false,
    message: "",
    severity: "",
  });
  const [userEmail, setUserEmail] = useState("");
  const [schoolId, setSchoolId] = useState(null);
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
    AudienceTeacher: Yup.boolean().test(
      "audience-required",
      "At least one audience must be selected",
      function (value) {
        return value || this.parent.AudienceStudent;
      }
    ),
  });

  // Get current user and school ID
  useEffect(() => {
    const fetchUserAndSchoolId = async () => {
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
        const { data: schoolData, error: schoolError } = await supabase
          .from("School")
          .select("SchoolID")
          .eq("Email", user.email)
          .single();

        if (schoolError) {
          setAlert({
            open: true,
            message: "Failed to verify School privileges",
            severity: "error",
          });
          return;
        }

        if (schoolData) {
          setSchoolId(schoolData.SchoolID);
        } else {
          setAlert({
            open: true,
            message: "Only schools can create notices",
            severity: "error",
          });
          navigate(-1);
        }
      }
    };

    fetchUserAndSchoolId();
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
      CreatedBy: null,
      AudienceTeacher: false,
      AudienceStudent: false,
      AudienceSchool: false,
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
          CreatedBy: schoolId,
          CreatedType: "School",
          AudienceSchool: false,
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
            CreatedBy: schoolId,
          },
        });

        generateNoticeID(formik.values.Type, formik.values.SubType);

        if (onPublish) {
          onPublish(payload);
        }
      } catch (error) {
        setAlert({
          open: true,
          message: error.message || "Failed to post notice. Try again!",
          severity: "error",
        });
      }
    },
  });

  useEffect(() => {
    if (schoolId) {
      formik.setFieldValue("CreatedBy", schoolId);
    }
  }, [schoolId]);

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

  const handleTeacherAudienceChange = (event) => {
    const isChecked = event.target.checked;
    formik.setFieldValue("AudienceTeacher", isChecked);

    // If teacher is unchecked, also uncheck student
    if (!isChecked) {
      formik.setFieldValue("AudienceStudent", false);
    }
  };

  const handleStudentAudienceChange = (event) => {
    // Only allow changing if teacher is checked
    if (formik.values.AudienceTeacher) {
      formik.setFieldValue("AudienceStudent", event.target.checked);
    }
  };

  const handleCloseAlert = () => setAlert({ ...alert, open: false });

  return (
    <Card sx={{ maxWidth: "100vw", margin: "auto", mt: 4, p: 3 }}>
      <Typography
        variant="h5"
        component="h2"
        gutterBottom
        sx={{ fontWeight: "bold" }}
      >
        <SendIcon color="primary" sx={{ verticalAlign: "middle", mr: 1 }} />
        Publish New Notice
      </Typography>

      <Divider sx={{ my: 2 }} />

      <CardContent>
        <form onSubmit={formik.handleSubmit}>
          <Grid container spacing={3}>
            {/* Type and SubType */}
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Type *</InputLabel>
                <Select
                  name="Type"
                  value={formik.values.Type}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.Type && Boolean(formik.errors.Type)}
                  label="Type *"
                >
                  <MenuItem value="Government">Government</MenuItem>
                  <MenuItem value="School">School</MenuItem>
                </Select>
                {formik.touched.Type && formik.errors.Type && (
                  <Typography variant="caption" color="error">
                    {formik.errors.Type}
                  </Typography>
                )}
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Sub-Type *</InputLabel>
                <Select
                  name="SubType"
                  value={formik.values.SubType}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.SubType && Boolean(formik.errors.SubType)
                  }
                  label="Sub-Type *"
                >
                  <MenuItem value="Holiday">Holiday</MenuItem>
                  <MenuItem value="Event">Event</MenuItem>
                </Select>
                {formik.touched.SubType && formik.errors.SubType && (
                  <Typography variant="caption" color="error">
                    {formik.errors.SubType}
                  </Typography>
                )}
              </FormControl>
            </Grid>

            {/* Notice Title */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Notice Title *"
                variant="outlined"
                name="Title"
                value={formik.values.Title}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.Title && Boolean(formik.errors.Title)}
                helperText={formik.touched.Title && formik.errors.Title}
              />
            </Grid>

            {/* Date Range */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Start Date *"
                type="date"
                name="StartDate"
                InputLabelProps={{ shrink: true }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EventIcon color="action" />
                    </InputAdornment>
                  ),
                }}
                value={
                  formik.values.StartDate
                    ? new Date(formik.values.StartDate)
                        .toISOString()
                        .split("T")[0]
                    : ""
                }
                onChange={(e) =>
                  formik.setFieldValue("StartDate", e.target.value)
                }
                onBlur={formik.handleBlur("StartDate")}
                error={
                  formik.touched.StartDate && Boolean(formik.errors.StartDate)
                }
                helperText={formik.touched.StartDate && formik.errors.StartDate}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="End Date *"
                type="date"
                name="EndDate"
                InputLabelProps={{ shrink: true }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EventIcon color="action" />
                    </InputAdornment>
                  ),
                }}
                value={
                  formik.values.EndDate
                    ? new Date(formik.values.EndDate)
                        .toISOString()
                        .split("T")[0]
                    : ""
                }
                onChange={(e) =>
                  formik.setFieldValue("EndDate", e.target.value)
                }
                onBlur={formik.handleBlur("EndDate")}
                error={formik.touched.EndDate && Boolean(formik.errors.EndDate)}
                helperText={formik.touched.EndDate && formik.errors.EndDate}
              />
            </Grid>

            {/* Content */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Notice Content *"
                variant="outlined"
                multiline
                rows={4}
                name="Message"
                value={formik.values.Message}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.Message && Boolean(formik.errors.Message)}
                helperText={formik.touched.Message && formik.errors.Message}
              />
            </Grid>

            {/* Audience */}
            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom>
                Audience *
              </Typography>
              <Box sx={{ display: "flex", gap: 2 }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formik.values.AudienceTeacher}
                      onChange={handleTeacherAudienceChange}
                      name="AudienceTeacher"
                      color="primary"
                    />
                  }
                  label="Teachers"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formik.values.AudienceStudent}
                      onChange={handleStudentAudienceChange}
                      name="AudienceStudent"
                      color="primary"
                      disabled={!formik.values.AudienceTeacher}
                    />
                  }
                  label="Students"
                />
              </Box>
              {formik.touched.AudienceTeacher &&
                formik.errors.AudienceTeacher && (
                  <Typography variant="caption" color="error">
                    {formik.errors.AudienceTeacher}
                  </Typography>
                )}
            </Grid>

            {/* Urgency */}
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formik.values.Urgent}
                    onChange={formik.handleChange}
                    name="Urgent"
                    color="primary"
                  />
                }
                label="Mark as Urgent Notice"
              />
            </Grid>

            {/* Submit Button */}
            <Grid item xs={12}>
              <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  size="large"
                  startIcon={<SendIcon />}
                  disabled={!formik.isValid || formik.isSubmitting}
                >
                  Publish Notice
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </CardContent>

      {/* Alert Snackbar */}
      <Snackbar
        open={alert.open}
        autoHideDuration={6000}
        onClose={handleCloseAlert}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseAlert}
          severity={alert.severity}
          icon={alert.severity === "error" ? <ErrorIcon /> : <SuccessIcon />}
          sx={{ width: "100%" }}
        >
          {alert.message}
        </Alert>
      </Snackbar>
    </Card>
  );
}

export default PublishNotice;
