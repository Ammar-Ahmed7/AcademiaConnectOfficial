const mongoose = require("mongoose");

const StudentSchema = new mongoose.Schema(
  {
    personaldetails: {
      name: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        unique: true,
        lowercase: true,
        match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, // Basic email validation
      },
      rollNumber: {
        type: String,
        required: true,
        unique: true,
      },
      gender: {
        type: String,
        required: true,
        enum: ["Male", "Female"],
      },
      dateOfBirth: {
        type: Date,
        required: true,
      },
      phoneNumber: {
        type: String, // Changed to String for flexibility
        required: true,
        match: /^\+?[0-9]{10,15}$/, // Validates international phone format
      },
      disability: {
        type: String,
        enum: ["yes", "no"],
        default: "no", // Default should align with the enum options
        required: true,
      },
    },
    schoolinformation: {
      school: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "School", // Reference to the School model
        required: true,
      },
      grade: {
        type: String,
        required: true, // Example: "Grade 10", "Class 8"
      },
      section: {
        type: String,
        required: true, // Example: "A", "B"
      },
      enrollmentDate: {
        type: Date,
        default: Date.now, // Date when the student enrolled
      },
      isActive: {
        type: Boolean,
        default: true, // Indicates whether the student is currently active
      },
    },

    address: {
      street: {
        type: String,
        required: true,
      },
      city: {
        type: String,
        required: true,
      },
      district: {
        type: String,
        required: true,
      },
      province: {
        type: String,
        required: true,
        default: "Punjab",
      },
      country: {
        type: String,
        required: true,
        default: "Pakistan",
      },
    },
    parentDetails: {
      fatherName: {
        type: String,
        required: true,
      },
      motherName: {
        type: String,
        required: true,
      },
      contactNumber: {
        type: String,
        required: true,
        match: /^\+?[0-9]{10,15}$/, // Validates international phone format
      },
      parentsemail: {
        type: String,
        lowercase: true,
        match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, // Basic email validation
      },
    },
  },
  { timestamps: true }
);

// Model
const Student = mongoose.model("Student", StudentSchema);

module.exports = Student;
