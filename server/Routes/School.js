const express = require("express");
const router = express.Router();
const School = require("../Modal/School"); // Adjust the path as needed
const Teacher = require("../Modal/Teacher");

router.get("/all", async (req, res) => {
  try {
    const schools = await School.find(); 
    res.status(200).json(schools);
  } catch (error) {
    console.error("Error fetching Schools:", error);
    res.status(500).json({ message: "Failed to fetch Schools" });
  }
});

router.post("/addschool", async (req, res) => {
  try {
    const {
      number,
      email,
      password,
      name,
      schoolfor,
      schoollevel,
      address,
      contact,
      principal,
      establishedYear,
      facilities,
      recognizedby,
    } = req.body;

    console.log("Received request data:", JSON.stringify(req.body));

    // Validation for required fields (optional but good practice)
    if (
      !number ||
      !email ||
      !password ||
      !name ||
      !schoolfor ||
      !schoollevel ||
      !address ||
      !contact ||
      !principal ||
      !establishedYear ||
      !recognizedby
    ) {
      return res.status(400).json({ message: "All fields are required." });
    }

    // Create a new School instance
    const newSchool = new School({
      number,
      email,
      password,
      name,
      schoolfor,
      schoollevel,
      address,
      contact,
      principal,
      establishedYear,
      facilities,
      recognizedby,
    });

    // Save the school to the database
    await newSchool.save();

    res
      .status(201)
      .json({ message: "School added successfully", school: newSchool });
  } catch (error) {
    if (error.name === "ValidationError") {
      // Handle Mongoose validation errors
      const errors = Object.keys(error.errors).map(
        (field) => `${field}: ${error.errors[field].message}`
      );
      return res.status(400).json({
        message: "Validation Error",
        errors,
      });
    }

    console.error("Error adding school:", error);
    res.status(500).json({
      message: "Failed to add school. Please try again later.",
      error: error.message,
    });
  }
});

router.get("/allfullname", async (req, res) => {
  try {
    const schools = await School.find(); // Retrieve all schools

    // Transform the data into the desired format
    const formattedSchools = schools.map((school) => {
      return {
        _id: school._id, // Include the _id
        fullName: `${school.number} - ${school.name} for ${school.schoolfor} ${school.address.city} ${school.address.district}`,
      };
    });

    res.status(200).json(formattedSchools); // Send the formatted data with _id
  } catch (error) {
    console.error("Error fetching Schools:", error);
    res.status(500).json({ message: "Failed to fetch Schools" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const school = await School.findById(id);

    if (!school) {
      return res.status(404).json({ message: "School not found" });
    }

    res.status(200).json(school);
  } catch (error) {
    console.error("Error fetching school details:", error);
    res.status(500).json({ message: "Failed to fetch school details" });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;

    const updatedSchool = await School.findByIdAndUpdate(id, updatedData, {
      new: true,
      runValidators: true, // Ensures schema validation
    });

    if (!updatedSchool) {
      return res.status(404).json({ message: "School not found" });
    }

    res.status(200).json({
      message: "School updated successfully",
      school: updatedSchool,
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      const errors = Object.keys(error.errors).map(
        (field) => `${field}: ${error.errors[field].message}`
      );
      return res.status(400).json({ message: "Validation Error", errors });
    }

    console.error("Error updating school:", error);
    res
      .status(500)
      .json({ message: "Failed to update school", error: error.message });
  }
});


module.exports = router;
