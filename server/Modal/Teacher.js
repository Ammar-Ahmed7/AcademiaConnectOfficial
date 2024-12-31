const mongoose = require("mongoose");

const TeacherSchema = new mongoose.Schema(
  {
    personalinformation: {
      cnic: {
        type: String,
        required: true,
        unique: true,
      },
      name: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
      },
      password: {
        type: String,
        required: true,
        default: "ww@123",
      },
      phoneNumber: {
        type: String,
        required: true,
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
      disability: {
        type: String,
        enum: ["Yes", "No"],
        required: true, // Now required
        default: "No",
      },
    },
    educationaldetails: {
      qualification: {
        type: String,
        required: true, // Example: "M.Sc Mathematics", "B.Ed"
      },
      experience: {
        years: {
          type: Number,
          // Not required anymore
        },
        details: {
          type: String, // Additional details about previous jobs, roles, etc.
          // Not required anymore
        },
      },
      subjects: [
        {
          type: String, // Example: "Mathematics", "Physics", etc.
          // Not required anymore
        },
      ],
    },
    schoolinformation: {
      employeId: {
        type: String,
        required: true, // Now required
        unique: true,
      },
      school: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "School", // Reference to the School model
        required: true,
      },
      hireDate: {
        type: Date,
        default: Date.now, // Date when the teacher was hired
      },
      employeetype: {
        type: String,
        enum: ["Principal", "Head-Teacher", "Teacher"],
        required: true,
      },
      employmentStatus: {
        type: String,
        enum: ["Working", "Retired", "Removed"],
        required: true,
      },
      employmentType: {
        type: String,
        enum: ["Permanent", "Contract", "Part-Time"],
        required: true,
      },
    },
    address: {
      street: {
        type: String,
        // Not required anymore
      },
      city: {
        type: String,
        // Not required anymore
      },
      district: {
        type: String,
        // Not required anymore
      },
      province: {
        type: String,
        default: "Punjab",
        // Not required anymore
      },
      country: {
        type: String,
        default: "Pakistan",
        // Not required anymore
      },
    },
    

    
  },
  { timestamps: true } // Automatically manage createdAt and updatedAt fields
);

// Model
const Teacher = mongoose.model("Teacher", TeacherSchema);

module.exports = Teacher;
