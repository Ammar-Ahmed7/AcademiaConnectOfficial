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
//   FormControlLabel,
// } from "@mui/material";
// import supabase from "../../../supabase-client";

// const EditSchool = () => {
//   const [schools, setSchools] = useState([]);
//   const [schoolId, setSchoolId] = useState("");
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
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     fetchSchools();
//   }, []);

//   useEffect(() => {
//     if (schoolId) {
//       fetchSchoolDetails();
//     }
//   }, [schoolId]);

//   const fetchSchools = async () => {
//     try {
//       const { data, error } = await supabase
//         .from("School")
//         .select("*")
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

//   const fetchSchoolDetails = async () => {
//     try {
//       setLoading(true);
//       const { data, error } = await supabase
//         .from("School")
//         .select("*")
//         .eq("SchoolID", schoolId)
//         .single();

//       if (error) throw error;

//       setFormData({
//         ID: data.SchoolID,
//         email: data.Email || "",
//         password: "", // Do not prefill passwords
//         name: data.SchoolName || "",
//         schoolfor: data.SchoolFor || "",
//         schoollevel: data.SchoolLevel || "",
//         address: data.Address || "",
//         phoneNumber: data.PhoneNumber || "",
//         establishedYear: data.EstablishedYear || "",
//         library: data.Library || false,
//         sports: data.SportsGround || false,
//         computerLab: data.ComputerLab || false,
//         scienceLab: data.ScienceLab || false,
//         auditorium: data.Auditorium || false,
//         recognizedbyboard: data.Recognizedbyboard || "",
//         boardattestationId: data.BoardattestationId || "",
//       });
//     } catch (error) {
//       console.error("Error fetching school details:", error);
//       setAlert({
//         open: true,
//         message: "Failed to load school details!",
//         severity: "error",
//       });
//     }
//     setLoading(false);
//   };

//   const handleInputChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: type === "checkbox" ? checked : value,
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault(); // Prevent form submission default behavior

//     const boardattestationId = formData.boardattestationId
//       ? String(formData.boardattestationId).trim()
//       : ""; // Ensure it's a string and trim safely

//     if (!boardattestationId) {
//       console.error("Board Attestation ID is empty or invalid");
//       return;
//     }

//     // Proceed with the rest of your logic
//     console.log("Trimmed boardattestationId:", boardattestationId);

//     setLoading(true);
//     const { data, error } = await supabase
//       .from("School")
//       .update({
//         Email: formData.email,
//         Password: formData.password, // Store securely (hash on backend)
//         SchoolName: formData.name,
//         SchoolFor: formData.schoolfor,
//         SchoolLevel: formData.schoollevel,
//         Address: formData.address,
//         PhoneNumber: formData.phoneNumber,
//         EstablishedYear: formData.establishedYear
//           ? parseInt(formData.establishedYear)
//           : null,
//         Library: formData.library,
//         SportsGround: formData.sports,
//         ComputerLab: formData.computerLab,
//         ScienceLab: formData.scienceLab,
//         Recognizedbyboard: formData.recognizedbyboard,
//         BoardattestationId: formData.boardattestationId
//           ? parseInt(formData.boardattestationId)
//           : null,
//       })
//       .eq("SchoolID", formData.ID);

//     if (error) {
//       setLoading(false);
//       console.error("Error updating school:", error.message);
//       setAlert({
//         open: true,
//         message: "Failed to update school. Try again!",
//         severity: "error",
//       });
//     } else {
//       setLoading(false);
//       setAlert({
//         open: true,
//         message: "School updated successfully!",
//         severity: "success",
//       });
//     }
//   };

//   const handleCloseAlert = () => setAlert({ ...alert, open: false });

//   return (
//     <Paper sx={{ padding: 3, maxWidth: 800, margin: "20px auto" }}>
//       <Typography variant="h4" gutterBottom>
//         Edit School
//       </Typography>

//       <FormControl fullWidth sx={{ mb: 3 }}>
//         <InputLabel>Select School</InputLabel>
//         <Select
//           value={schoolId}
//           onChange={(e) => setSchoolId(e.target.value)}
//           label="Select School"
//         >
//           {schools.map((school) => (
//             <MenuItem key={school.SchoolID} value={school.SchoolID}>
//               {school.SchoolID}-{school.SchoolName}
//             </MenuItem>
//           ))}
//         </Select>
//       </FormControl>

//       {loading ? (
//         <CircularProgress />
//       ) : (
//         schoolId && (
//           <form onSubmit={handleSubmit}>
//             <Grid container spacing={2}>
//               <Grid item xs={12} sm={6}>
//                 <TextField
//                   label="School Name"
//                   name="name"
//                   value={formData.name}
//                   onChange={handleInputChange}
//                   fullWidth
//                   required
//                 />
//               </Grid>

//               <Grid item xs={12} sm={6}>
//                 <TextField
//                   label="Email"
//                   name="email"
//                   type="email"
//                   value={formData.email}
//                   onChange={handleInputChange}
//                   fullWidth
//                   required
//                 />
//               </Grid>

//               {/* <Grid item xs={12} sm={6}>
//                 <TextField
//                   label="Password"
//                   name="password"
//                   type="password"
//                   value={formData.password}
//                   onChange={handleInputChange}
//                   fullWidth
//                 />
//               </Grid> */}

//               <Grid item xs={12} sm={6}>
//                 <FormControl fullWidth>
//                   <InputLabel>School For</InputLabel>
//                   <Select
//                     name="schoolFor"
//                     value={formData.schoolfor}
//                     onChange={handleInputChange}
//                     label="School For"
//                   >
//                     <MenuItem value="Girls">Girls</MenuItem>
//                     <MenuItem value="Boys">Boys</MenuItem>
//                   </Select>
//                 </FormControl>
//               </Grid>

//               <Grid item xs={12} sm={6}>
//                 <FormControl fullWidth>
//                   <InputLabel>School Level</InputLabel>
//                   <Select
//                     name="schoolLevel"
//                     value={formData.schoollevel}
//                     onChange={handleInputChange}
//                     label="School Level"
//                   >
//                     <MenuItem value="Primary">Primary</MenuItem>
//                     <MenuItem value="Middle">Middle</MenuItem>
//                     <MenuItem value="High">High</MenuItem>
//                   </Select>
//                 </FormControl>
//               </Grid>

//               <Grid item xs={12} sm={6}>
//                 <TextField
//                   label="Phone Number"
//                   name="phoneNumber"
//                   value={formData.phoneNumber}
//                   onChange={handleInputChange}
//                   fullWidth
//                   required
//                 />
//               </Grid>

//               <Grid item xs={12} sm={6}>
//                 <TextField
//                   label="Established Year"
//                   name="establishedYear"
//                   type="number"
//                   value={formData.establishedYear}
//                   onChange={handleInputChange}
//                   fullWidth
//                   required
//                 />
//               </Grid>

//               <Grid item xs={12}>
//                 <TextField
//                   label="Address"
//                   name="address"
//                   value={formData.address}
//                   onChange={handleInputChange}
//                   fullWidth
//                   required
//                 />
//               </Grid>

//               <Grid item xs={12} sm={6}>
//                 <TextField
//                   label="Recognized by Board"
//                   name="recognizedbyboard"
//                   value={formData.recognizedbyboard}
//                   onChange={handleInputChange}
//                   fullWidth
//                 />
//               </Grid>
//               <Grid item xs={12} sm={6}>
//                 <TextField
//                   label="Attestation Id "
//                   name="boardattestationId"
//                   value={formData.boardattestationId}
//                   onChange={handleInputChange}
//                   fullWidth
//                 />
//               </Grid>

//               <Grid item xs={12}>
//                 <Typography variant="h6" gutterBottom>
//                   Facilities
//                 </Typography>
//                 <Grid container spacing={1}>
//                   {[
//                     "library",
//                     "sports",
//                     "computerLab",
//                     "scienceLab",
//                     "auditorium",
//                   ].map((facility) => (
//                     <Grid item key={facility}>
//                       <FormControlLabel
//                         control={
//                           <Checkbox
//                             checked={formData[facility]}
//                             onChange={handleInputChange}
//                             name={facility}
//                           />
//                         }
//                         label={facility
//                           .replace(/([A-Z])/g, " $1")
//                           .toUpperCase()}
//                       />
//                     </Grid>
//                   ))}
//                 </Grid>
//               </Grid>

//               <Grid item xs={12}>
//                 <Button
//                   type="submit"
//                   variant="contained"
//                   color="primary"
//                   fullWidth
//                 >
//                   Update School
//                 </Button>
//               </Grid>
//             </Grid>
//           </form>
//         )
//       )}

//       <Snackbar
//         open={alert.open}
//         autoHideDuration={6000}
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
  Box,
} from "@mui/material";
import supabase from "../../../supabase-client";
import { useFormik } from "formik";
import * as Yup from "yup";

// Validation Schema
const schoolSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Email is required"),
  name: Yup.string().required("School name is required"),
  schoollevel: Yup.string().required("School level is required"),
  address: Yup.string().required("Address is required"),
  phoneNumber: Yup.string()
    .matches(/^[0-9]{9,12}$/, "Phone number must be 9-12 digits")
    .required("Phone number is required"),
  establishedYear: Yup.number()
    .min(1947, "Year must be 1947 or later")
    .max(new Date().getFullYear(), `Year cannot be after ${new Date().getFullYear()}`)
    .required("Established year is required"),
  recognizedbyboard: Yup.string(),
  boardattestationId: Yup.string(),
});

const EditSchool = () => {
  const [schools, setSchools] = useState([]);
  const [schoolId, setSchoolId] = useState("");
  const [initialValues, setInitialValues] = useState({
    ID: "",
    email: "",
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
    severity: "success",
  });
  const [loading, setLoading] = useState({
    schools: false,
    details: false,
    submit: false,
  });

  const formik = useFormik({
    initialValues,
    validationSchema: schoolSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      await handleSubmit(values);
    },
  });

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
      setLoading((prev) => ({ ...prev, schools: true }));
      const { data, error } = await supabase
        .from("School")
        .select("*")
        .order("SchoolID", { ascending: true });

      if (error) throw error;
      setSchools(data);
    } catch (error) {
      console.error("Error fetching schools:", error);
      showAlert("Failed to load schools!", "error");
    } finally {
      setLoading((prev) => ({ ...prev, schools: false }));
    }
  };

  const fetchSchoolDetails = async () => {
    try {
      setLoading((prev) => ({ ...prev, details: true }));
      const { data, error } = await supabase
        .from("School")
        .select("*")
        .eq("SchoolID", schoolId)
        .single();

      if (error) throw error;

      setInitialValues({
        ID: data.SchoolID,
        email: data.Email || "",
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
      showAlert("Failed to load school details!", "error");
    } finally {
      setLoading((prev) => ({ ...prev, details: false }));
    }
  };

  const handleSubmit = async (values) => {
    try {
      setLoading((prev) => ({ ...prev, submit: true }));
      
      const updateData = {
        Email: values.email,
        SchoolName: values.name,
        SchoolFor: values.schoolfor, // Will remain unchanged from initial value
        SchoolLevel: values.schoollevel,
        Address: values.address,
        PhoneNumber: values.phoneNumber,
        EstablishedYear: values.establishedYear ? parseInt(values.establishedYear) : null,
        Library: values.library,
        SportsGround: values.sports,
        ComputerLab: values.computerLab,
        ScienceLab: values.scienceLab,
        Auditorium: values.auditorium,
        Recognizedbyboard: values.recognizedbyboard,
        BoardattestationId: values.boardattestationId || null,
      };

      const { error } = await supabase
        .from("School")
        .update(updateData)
        .eq("SchoolID", values.ID);

      if (error) throw error;

      showAlert("School updated successfully!", "success");
    } catch (error) {
      console.error("Error updating school:", error);
      showAlert(error.message || "Failed to update school. Try again!", "error");
    } finally {
      setLoading((prev) => ({ ...prev, submit: false }));
    }
  };

  const showAlert = (message, severity) => {
    setAlert({ open: true, message, severity });
  };

  const handleCloseAlert = () => setAlert({ ...alert, open: false });

  const handleCheckboxChange = (event) => {
    formik.setFieldValue(event.target.name, event.target.checked);
  };

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
          disabled={loading.schools}
        >
          {loading.schools && (
            <MenuItem disabled>
              <CircularProgress size={24} />
            </MenuItem>
          )}
          {schools.map((school) => (
            <MenuItem key={school.SchoolID} value={school.SchoolID}>
              {school.SchoolID} - {school.SchoolName}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {loading.details ? (
        <Box display="flex" justifyContent="center" my={4}>
          <CircularProgress />
        </Box>
      ) : (
        schoolId && (
          <form onSubmit={formik.handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="School Name"
                  name="name"
                  value={formik.values.name}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.name && Boolean(formik.errors.name)}
                  helperText={formik.touched.name && formik.errors.name}
                  fullWidth
                  required
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  label="Email"
                  name="email"
                  type="email"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.email && Boolean(formik.errors.email)}
                  helperText={formik.touched.email && formik.errors.email}
                  fullWidth
                  required
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  label="School For"
                  name="schoolfor"
                  value={formik.values.schoolfor}
                  InputProps={{
                    readOnly: true,
                  }}
                  fullWidth
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>School Level *</InputLabel>
                  <Select
                    name="schoollevel"
                    value={formik.values.schoollevel}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.schoollevel && Boolean(formik.errors.schoollevel)}
                    label="School Level *"
                  >
                    <MenuItem value="Primary">Primary</MenuItem>
                    <MenuItem value="Middle">Middle</MenuItem>
                    <MenuItem value="High">High</MenuItem>
                    <MenuItem value="Secondary">Secondary</MenuItem>
                    <MenuItem value="Higher Secondary">Higher Secondary</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  label="Phone Number *"
                  name="phoneNumber"
                  value={formik.values.phoneNumber}
                  onChange={(e) => {
                    // Only allow numeric input
                    const re = /^[0-9\b]+$/;
                    if (e.target.value === '' || re.test(e.target.value)) {
                      formik.handleChange(e);
                    }
                  }}
                  onBlur={formik.handleBlur}
                  error={formik.touched.phoneNumber && Boolean(formik.errors.phoneNumber)}
                  helperText={formik.touched.phoneNumber && formik.errors.phoneNumber}
                  fullWidth
                  inputProps={{
                    maxLength: 12,
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  label="Established Year *"
                  name="establishedYear"
                  type="number"
                  value={formik.values.establishedYear}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.establishedYear && Boolean(formik.errors.establishedYear)}
                  helperText={formik.touched.establishedYear && formik.errors.establishedYear}
                  fullWidth
                  inputProps={{
                    min: 1947,
                    max: new Date().getFullYear(),
                  }}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  label="Address *"
                  name="address"
                  value={formik.values.address}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.address && Boolean(formik.errors.address)}
                  helperText={formik.touched.address && formik.errors.address}
                  fullWidth
                  multiline
                  rows={3}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  label="Recognized by Board"
                  name="recognizedbyboard"
                  value={formik.values.recognizedbyboard}
                  onChange={formik.handleChange}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Attestation ID"
                  name="boardattestationId"
                  value={formik.values.boardattestationId}
                  onChange={formik.handleChange}
                  fullWidth
                />
              </Grid>

              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  Facilities
                </Typography>
                <Grid container spacing={1}>
                  {[
                    { name: "library", label: "Library" },
                    { name: "sports", label: "Sports Ground" },
                    { name: "computerLab", label: "Computer Lab" },
                    { name: "scienceLab", label: "Science Lab" },
                    { name: "auditorium", label: "Auditorium" },
                  ].map((facility) => (
                    <Grid item key={facility.name}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={formik.values[facility.name]}
                            onChange={handleCheckboxChange}
                            name={facility.name}
                          />
                        }
                        label={facility.label}
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
                  disabled={loading.submit}
                  startIcon={loading.submit ? <CircularProgress size={20} /> : null}
                >
                  {loading.submit ? "Updating..." : "Update School"}
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
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
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