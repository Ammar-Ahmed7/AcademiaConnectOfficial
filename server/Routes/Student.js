const express = require('express');
const router = express.Router();
const Student = require('../Modal/Student'); // Adjust the path as needed

// POST /add-student
router.use(express.json());

router.post("/add-student", async (req, res) => {
  try {
    const {
      personaldetails,
      schoolinformation,
      address,
      parentDetails
    } = req.body;

    // Validate required fields from the request body
    if (!personaldetails || !schoolinformation || !address || !parentDetails) {
      return res.status(400).json({ message: "All sections are required." });
    }

    const {
      name,
      email,
      rollNumber,
      gender,
      dateOfBirth,
      phoneNumber,
      disability
    } = personaldetails;

    if (!name || !email || !rollNumber || !gender || !dateOfBirth || !phoneNumber || !disability) {
      return res.status(400).json({ message: "Please enter all required personal details." });
    }

    const { school, grade, section, enrollmentDate } = schoolinformation;
    if (!school || !grade || !section) {
      return res.status(400).json({ message: "Please enter all required school information." });
    }

    const { street, city, district, province, country } = address;
    if (!street || !city || !district || !province || !country) {
      return res.status(400).json({ message: "Please enter all required address fields." });
    }

    const { fatherName, motherName, contactNumber, parentsemail } = parentDetails;
    if (!fatherName || !motherName || !contactNumber) {
      return res.status(400).json({ message: "Please enter all required parent details." });
    }

    // Check for duplicate email or rollNumber
    const existingEmail = await Student.findOne({ "personaldetails.email": email });
    if (existingEmail) {
      return res.status(400).json({ message: "A student with this email already exists." });
    }

    const existingRollNumber = await Student.findOne({ "personaldetails.rollNumber": rollNumber });
    if (existingRollNumber) {
      return res.status(400).json({ message: "A student with this roll number already exists." });
    }

    // Create a new student instance
    const newStudent = new Student({
      personaldetails: {
        name,
        email,
        rollNumber,
        gender,
        dateOfBirth,
        phoneNumber,
        disability,
      },
      schoolinformation: {
        school,
        grade,
        section,
        enrollmentDate,
        isActive: true,
      },
      address: {
        street,
        city,
        district,
        province,
        country,
      },
      parentDetails: {
        fatherName,
        motherName,
        contactNumber,
        parentsemail,
      },
    });

    // Save the new student
    await newStudent.save();

    return res.status(200).json({ message: "Student saved successfully." });
  } catch (error) {
    console.error("Internal Server Error:", error);
    return res.status(500).json({ message: "Internal Server Error." });
  }
});

router.get('/get-all-students', async (req, res) => {
  try {
    const students = await Student.find(); // Retrieve all teachers
    res.status(200).json(students);
  } catch (error) {
    console.error("Error fetching Students:", error);
    res.status(500).json({ message: 'Failed to fetch students' });
  }
});
















//.get   allstudents   try  const all studnets = Students.findMany({})  res 

//Delete a student
router.delete('/delete-student/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const deletedStudent = await Student.findOneAndDelete({ studentId: id });
    if (!deletedStudent) {
      return res.status(404).json({ error: 'Student not found' });
    }
    res.status(200).json({ message: 'Student deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete student' });
  }
});
//update
router.put('/update-student/:id', async (req, res) => {
  try {
    const studentId = req.params.id; // This is the custom student ID (like "fa202")
    const { firstName, lastName, email, classYear, gender } = req.body;

    // Validate input data
    if (!firstName || !lastName || !email || !classYear || !gender) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Find and update the student by the custom studentId (not _id)
    const updatedStudent = await Student.findOneAndUpdate(
      { studentId: studentId }, // Search by the custom studentId field
      { firstName, lastName, email, classYear, gender },
      { new: true, runValidators: true } // Apply update and return updated student
    );

    if (!updatedStudent) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Send back the updated student data
    res.status(200).json(updatedStudent);
  } catch (error) {
    console.error('Error updating student:', error);
    res.status(500).json({ message: 'Server error while updating student' });
  }
});





module.exports = router;
