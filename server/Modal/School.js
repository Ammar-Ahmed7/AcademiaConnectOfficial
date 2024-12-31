const mongoose = require("mongoose");

const SchoolSchema = new mongoose.Schema(
  {
    number: {
      type:String,
      required: true,
      unique: true,
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
    name: {
      type: String,
      required: true,
      default: "Workers Welfare School",
    },
    schoolfor: {
      type: String,
      required: true,
      enum: ["Girls", "Boys"],
    },
    schoollevel: {
      type: String,
      required: true,
      enum: ["Primary", "Middle", "High"],
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
        default: "Pakistan", // Change this default as needed
      },
    },
    contact: {
      phoneNumber: {
        type: String,
        // required: true,
      },

      website: {
        type: String,
        default: null,
      },
    },
    principal: {
      name: {
        type: String,
      },
      email: {
        type: String,
        lowercase: true,
      },
      phoneNumber: {
        type: String,
      },
    },
    establishedYear: {
      type: Number,
      required: true,
    },
    // teachers: [
    //   {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: "Teacher",
    //   },
    // ],

    facilities: {
      library: {
        type: Boolean,
        default: false,
      },
      sports: {
        type: Boolean,
        default: false,
      },
      computerLab: {
        type: Boolean,
        default: false,
      },
      scienceLab: {
        type: Boolean,
        default: false,
      },
      auditorium: {
        type: Boolean,
        default: false,
      },
    },
    recognizedby: {
      board: {
        type: String, // Example: 'CBSE', 'IB', 'State Board'
        required: true,
      },
      accreditationId: {
        type: String,
        unique: true,
      },
    },
  
  },
  { timestamps: true }
);

// Model
const School = mongoose.model("School", SchoolSchema);

module.exports = School;
