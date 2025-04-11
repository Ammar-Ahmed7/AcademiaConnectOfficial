// import React, { useState } from "react";
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
//     NoticeID: "NT-122",
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

//     const payload = {
//       ...formData,
//       Dates: formData.Dates.map((date) =>
//         date ? new Date(date).toISOString() : null
//       ),
//     };

//     try {
//       const { data, error } = await supabase
//         .from("Notice") // Make sure your table is named 'notices'
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
//         NoticdID: "",
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

import supabase from "../../../supabase-client";

const AddNotice = () => {
  const [formData, setFormData] = useState({
    NoticeID: "",
    Title: "",
    Message: "",
    Dates: [null, null],
    Type: "Government",
    SubType: "Holiday",
    CreatedBy: "Admin",
    AudienceSchool: false,
    AudienceTeacher: false,
    AudienceStudent: false,
    Urgent: false,
    StartDate: "",
    EndDate: "",
  });

  const [alert, setAlert] = useState({
    open: false,
    message: "",
    severity: "",
  });

  const navigate = useNavigate();

  // Function to generate NoticeID
  const generateNoticeID = async () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    
    // Get the first letters of Type and SubType
    const typeInitial = formData.Type.charAt(0);
    const subTypeInitial = formData.SubType.charAt(0);
    
    try {
      // Fetch notices with similar pattern from today
      const { data, error } = await supabase
        .from("Notice")
        .select("NoticeID")
        .like("NoticeID", `N-${typeInitial}-${subTypeInitial}-${year}${month}${day}-%`);
      
      if (error) throw error;
      
      // Calculate the next serial number
      let nextSerial = 1;
      if (data && data.length > 0) {
        const latestNotice = data[data.length - 1].NoticeID;
        const latestSerial = parseInt(latestNotice.split('-')[4]) || 0;
        nextSerial = latestSerial + 1;
      }
      
      // Generate the new NoticeID
      const newNoticeID = `N-${typeInitial}-${subTypeInitial}-${year}${month}${day}-${nextSerial}`;
      
      setFormData(prev => ({
        ...prev,
        NoticeID: newNoticeID
      }));
      
    } catch (error) {
      console.error("Error fetching notice IDs:", error);
      // Fallback ID if there's an error
      const newNoticeID = `N-${typeInitial}-${subTypeInitial}-${year}${month}${day}-1`;
      setFormData(prev => ({
        ...prev,
        NoticeID: newNoticeID
      }));
    }
  };

  // Generate NoticeID when Type or SubType changes
  useEffect(() => {
    if (formData.Type && formData.SubType) {
      generateNoticeID();
    }
  }, [formData.Type, formData.SubType]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleDateRangeChange = (newValue) => {
    setFormData({
      ...formData,
      Dates: newValue,
      StartDate: newValue[0] ? new Date(newValue[0]).toISOString() : "",
      EndDate: newValue[1] ? new Date(newValue[1]).toISOString() : "",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.Title ||
      !formData.Message ||
      !formData.Dates[0] ||
      !formData.Dates[1]
    ) {
      setAlert({
        open: true,
        message:
          "Please fill all required fields and select a valid date range.",
        severity: "error",
      });
      return;
    }

    // Ensure NoticeID is generated before submission
    if (!formData.NoticeID) {
      await generateNoticeID();
    }

    const payload = {
      ...formData,
      Dates: formData.Dates.map((date) =>
        date ? new Date(date).toISOString() : null
      ),
    };

    try {
      const { data, error } = await supabase
        .from("Notice")
        .insert([
          {
            NoticeID: formData.NoticeID,
            Title: formData.Title,
            Message: formData.Message,
            Type: formData.Type,
            SubType: formData.SubType,
            CreatedBy: formData.CreatedBy,
            AudienceSchool: formData.AudienceSchool,
            AudienceTeacher: formData.AudienceTeacher,
            AudienceStudent: formData.AudienceStudent,
            Urgent: formData.Urgent,
            StartDate: formData.StartDate,
            EndDate: formData.EndDate,
            created_at: new Date().toISOString(),
          },
        ])
        .select();

      if (error) throw error;

      setAlert({
        open: true,
        message: "Notice posted successfully!",
        severity: "success",
      });
      
      // Reset form
      setFormData({
        NoticeID: "",
        Title: "",
        Message: "",
        Dates: [null, null],
        Type: "Government",
        SubType: "Holiday",
        CreatedBy: "Admin",
        AudienceSchool: false,
        AudienceTeacher: false,
        AudienceStudent: false,
        Urgent: false,
        StartDate: "",
        EndDate: "",
      });
      
      // Regenerate ID for the next notice
      generateNoticeID();
    } catch (error) {
      setAlert({
        open: true,
        message: error.message || "Failed to post notice. Try again!",
        severity: "error",
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

            <form onSubmit={handleSubmit}>
              <Box display="flex" gap={2} mb={2}>
                <FormControl fullWidth>
                  <InputLabel>Type</InputLabel>
                  <Select
                    value={formData.Type}
                    name="Type"
                    onChange={handleInputChange}
                  >
                    <MenuItem value="Government">Government</MenuItem>
                    <MenuItem value="School">School</MenuItem>
                  </Select>
                </FormControl>

                <FormControl fullWidth>
                  <InputLabel>Sub-Type</InputLabel>
                  <Select
                    value={formData.SubType}
                    name="SubType"
                    onChange={handleInputChange}
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
                value={formData.Title}
                name="Title"
                onChange={handleInputChange}
                margin="normal"
              />

              <TextField
                fullWidth
                label="Message *"
                variant="outlined"
                multiline
                rows={4}
                value={formData.Message}
                name="Message"
                onChange={handleInputChange}
                margin="normal"
              />

              <TextField
                fullWidth
                label="Created By"
                variant="outlined"
                value={formData.CreatedBy}
                name="CreatedBy"
                onChange={handleInputChange}
                margin="normal"
              />

              <Box mt={2} mb={2}>
                <FormLabel component="legend">Audience</FormLabel>
                <FormGroup row>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={formData.AudienceSchool}
                        onChange={handleInputChange}
                        name="AudienceSchool"
                      />
                    }
                    label="School"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={formData.AudienceTeacher}
                        onChange={handleInputChange}
                        name="AudienceTeacher"
                      />
                    }
                    label="Teacher"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={formData.AudienceStudent}
                        onChange={handleInputChange}
                        name="AudienceStudent"
                      />
                    }
                    label="Student"
                  />
                </FormGroup>
              </Box>

              <FormControlLabel
                control={
                  <Switch
                    checked={formData.Urgent}
                    onChange={handleInputChange}
                    name="Urgent"
                  />
                }
                label="Mark as Urgent"
                sx={{ mb: 2 }}
              />

              <DateRangePicker
                startText="Start Date"
                endText="End Date"
                value={formData.Dates}
                onChange={handleDateRangeChange}
                renderInput={(startProps, endProps) => (
                  <>
                    <TextField {...startProps} fullWidth margin="normal" />
                    <Box sx={{ mx: 2 }}> to </Box>
                    <TextField {...endProps} fullWidth margin="normal" />
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