const express = require("express");
const Teacher = require("../Modal/Teacher");
const router = express.Router();

const app = express();

router.get("/all", async (req, res) => {
  try {
    const teachers = await Teacher.find().populate("schoolinformation.school");
    res.status(200).json(teachers);
  } catch (error) {
    console.error("Error fetching Teachers:", error);
    res.status(500).json({ message: "Failed to fetch Teachers" });
  }
});

router.post("/addteacher", async (req, res) => {
  try {
    console.log("Request Body:", JSON.stringify(req.body));
    console.log("Email:", req.body.personalinformation.email); // Log the email specifically

    // Destructure the request body to get teacher data
    const {
      personalinformation,
      educationaldetails,
      schoolinformation,
      address,
    } = req.body;

    if (!personalinformation.email || personalinformation.email.trim() === "") {
      console.log("Email is missing or empty");
      return res
        .status(400)
        .json({ error: "Email is required and cannot be empty." });
    }

    // Create a new teacher document
    const newTeacher = new Teacher({
      personalinformation,
      educationaldetails,
      schoolinformation,
      address,
    });

    // Save the teacher document to the database
    await newTeacher.save();

    // Respond with success
    res.status(201).json({
      message: "Teacher added successfully!",
      teacher: newTeacher,
    });
  } catch (error) {
    // Handle errors
    console.error("Error:", error);
    res.status(500).json({
      message: "Error adding teacher",
      error: error.message,
    });
  }
});

router.get("/allcnic", async (req, res) => {
  try {
    // Fetch only the `cnic` field from personalinformation for all teachers
    const cnicList = await Teacher.find(
      {},
      { "personalinformation.cnic": 1, _id: 0 }
    );

    // Extract and return the CNIC values
    const cnicArray = cnicList.map(
      (teacher) => teacher.personalinformation.cnic
    );

    res.status(200).json(cnicArray);
  } catch (error) {
    console.error("Error fetching CNICs:", error);
    res.status(500).json({ message: "Failed to fetch CNICs" });
  }
});

router.get("/:cnic", async (req, res) => {
  try {
    let { cnic } = req.params;
    cnic = cnic.trim(); // Remove any leading/trailing spaces

    const teacher = await Teacher.findOne({
      "personalinformation.cnic": cnic,
    }).populate("schoolinformation.school");

    if (!teacher) {
      console.error("No teacher found for CNIC:", cnic); // Debugging log
      return res
        .status(404)
        .json({ message: "Teacher with given CNIC not found" });
    }

    res.status(200).json(teacher);
  } catch (error) {
    console.error("Error fetching teacher details:", error); // Debugging log
    res.status(500).json({ message: "Failed to fetch teacher details" });
  }
});

router.put("/:cnic", async (req, res) => {
  try {
    const { cnic } = req.params; // Get CNIC from the URL parameters
    const updatedData = req.body; // Get the updated data from the request body

    // Find the teacher by CNIC
    const teacher = await Teacher.findOne({ "personalinformation.cnic": cnic });

    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }

    // Perform the update
    const result = await Teacher.updateOne(
      { "personalinformation.cnic": cnic },
      { $set: updatedData } // Use $set to update specific fields
    );

    // Check if any document was updated
    if (result.modifiedCount === 0) {
      return res.status(200).json({
        message: "Nothing to update. The data is identical.",
      });
    }

    // Find the updated teacher data to return
    const updatedTeacher = await Teacher.findOne({ "personalinformation.cnic": cnic });

    // Return the updated teacher data
    res.status(200).json({
      message: "Teacher updated successfully",
      teacher: updatedTeacher,
    });
  } catch (error) {
    console.error("Error updating teacher:", error);
    res.status(500).json({
      message: "Failed to update teacher",
      error: error.message,
    });
  }
});


module.exports = router;

// const Student = require("../Modal/Student");
// const Class =require("../Modal/CreateClass");
//  // Ensure the path to the Student model is correct

// // Middleware to parse JSON (if not already added globally)
// router.use(express.json());

// // Session configuration
// // app.use(
// //   session({
// //     secret: 'your-secret-key',
// //     resave: false,
// //     saveUninitialized: true,
// //   })
// // );

// // Add Teacher Route
// router.post("/add-teacher", async (req, res) => {
//   const {
//     firstName,
//     lastName,
//     email,
//     password,
//     disability,
//     gender,
//     dateOfBirth,
//     address,
//     subjectsTaught,
//     hireDate,
//     employeId,
//     phoneNumber,
//   } = req.body;

//   try {
//     // Validate required fields
//     if (!firstName || !email || !password) {
//       return res.status(400).json({ error: "First name, email, and password are required." });
//     }

//     // Check if email already exists
//     const existingTeacher = await Teacher.findOne({ email });
//     if (existingTeacher) {
//       return res.status(400).json({ error: "A teacher with this email already exists." });
//     }

//     // Create new teacher
//     const newTeacher = new Teacher({
//       firstName,
//       lastName,
//       email,
//       password, // TODO: Hash the password using bcrypt before saving
//       disability: disability || "No",
//       gender: gender || "Male",
//       dateOfBirth,
//       address,
//       subjectsTaught: subjectsTaught || [],
//       hireDate,
//       employeId,
//       phoneNumber,
//     });

//     // Save to database
//     await newTeacher.save();
//     res.status(201).json({ message: "Teacher added successfully", teacher: newTeacher });
//   } catch (error) {
//     console.error("Error adding teacher:", error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// });

// router.put('/update-class/:id', async (req, res) => {
//   try {
//     const { teacher } = req.body;
//     const updatedClass = await Class.findByIdAndUpdate(
//       req.params.id,
//       { teacher },
//       { new: true }
//     );
//     if (!updatedClass) {
//       return res.status(404).json({ message: 'Class not found' });
//     }
//     res.status(200).json(updatedClass);
//   } catch (error) {
//     res.status(500).json({ message: 'Server error', error: error.message });
//   }
// });

// // Get All Teachers Route
// router.get('/get-all-teachers', async (req, res) => {
//   try {
//     const teachers = await Teacher.find(); // Retrieve all teachers
//     res.status(200).json(teachers);
//   } catch (error) {
//     console.error("Error fetching teachers:", error);
//     res.status(500).json({ message: 'Failed to fetch teachers' });
//   }
// });

// // Sign-In Route
// router.post("/signin", async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     if (!email || !password) {
//       return res.status(400).json({ message: "Please enter all fields" });
//     }

//     const teacher = await Teacher.findOne({ email });
//     if (!teacher) {
//       return res.status(404).json({ message: "Email not found" });
//     }

//     if (password !== teacher.password) {
//       return res.status(401).json({ message: "Incorrect password" });
//     }
//       console.log("Zohaib",teacher.email)
//     // req.session.email = teacher.email; // Save teacher email in session
//     res.status(200).json({ user:{email:teacher.email} ,message: "User logged in successfully" });
//   } catch (error) {
//     console.error("Error during sign-in:", error);
//     res.status(500).json({ message: "Internal server error", error: error.message });
//   }
// });

// // Teacher Dashboard Route
// router.post('/teacher-dashboard', async (req, res) => {
//   try {

//     const {email}= req.body
//     const getperson= await Teacher.findOne({email:email});

//     if (!getperson) {
//       return res.status(401).json({ message: "user not found" });
//     }

//     res.status(200).json(getperson); // Send teacher data to the frontend
//   } catch (error) {
//     console.error("Error fetching teacher dashboard:", error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// });

// // Get All Students Route
// router.get('/get-all-students', async (req, res) => {
//   try {
//     const students = await Student.find(); // Retrieve all students
//     res.status(200).json(students);
//   } catch (error) {
//     console.error("Error fetching students:", error);
//     res.status(500).json({ message: 'Failed to fetch students' });
//   }
// });

// // Update Teacher Profile Route
// router.put("/update-profile", async (req, res) => {
//   try {
//     const { email, firstName, gender, password, disability } = req.body;

//     // Find the teacher by email and update their data
//     const updatedTeacher = await Teacher.findOneAndUpdate(
//       { email }, // Filter by email
//       { firstName, gender, password, disability }, // Update fields
//       { new: true } // Return the updated document
//     );

//     if (!updatedTeacher) {
//       return res.status(404).json({ message: "Teacher not found" });
//     }

//     res.status(200).json({ message: "Profile updated successfully", data: updatedTeacher });
//   } catch (error) {
//     res.status(500).json({ message: "Server error", error });
//   }
// });
// //delete
// router.delete('/delete-teacher/:id', async (req, res) => {
//   const { id } = req.params;

//   try {
//     await Teacher.findByIdAndDelete(id);
//     res.status(200).json({ message: 'Teacher deleted successfully' });
//   } catch (err) {
//     res.status(500).json({ error: 'Failed to delete teacher' });
//   }
// });

// // API Endpoint to Fetch Dashboard Data
// router.get('/dashboard-data', async (req, res) => {
//   try {

//       const totalStudents = await Student.countDocuments();
//       const totalClasses = await Class.countDocuments();
//       const totalTeachers = await Teacher.countDocuments();

//       res.status(200).json({
//           totalStudents,
//           totalClasses,
//           totalTeachers,
//       });
//   } catch (error) {
//       console.error('Error fetching dashboard data:', error);
//       res.status(500).json({ error: 'Internal Server Error' });
//   }
// });

// // Update an existing teacher
// router.put('/update-teacher/:id', async (req, res) => {
//   const { id } = req.params;
//   const { firstName, lastName, email, phoneNumber, gender, subjectsTaught } = req.body;
//   try {
//     const updatedTeacher = await Teacher.findByIdAndUpdate(id, {
//       firstName,
//       lastName,
//       email,
//       phoneNumber,
//       gender,
//       subjectsTaught,
//     }, { new: true });

//     if (!updatedTeacher) {
//       return res.status(404).json({ message: 'Teacher not found' });
//     }

//     res.status(200).json(updatedTeacher);
//   } catch (error) {
//     res.status(500).json({ message: 'Failed to update teacher' });
//   }
// });
// module.exports = router;
