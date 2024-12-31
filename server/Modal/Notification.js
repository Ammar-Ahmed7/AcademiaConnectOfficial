const mongoose = require("mongoose");

const NotificationSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
      enum: ["Government", "School"],
    },
    subType: {
      type: String,
      required: true,
      enum: ["Holiday", "Event"],
    },
    Dates: [
      {
        type: Date,
      },
    ],
   
    createdBy: {
      type: String,
      required: true, // The admin's name or ID who created the notification
    },
    audience: {
      type: String,
      required: true,
      enum: ["All", "Teachers", "Students", "Schools"], // Who the notification is for
      default: "All",
    },
    isUrgent: {
      type: Boolean,
      default: false, // Flag for urgent notifications
    },
  },
  { timestamps: true } // Automatically add createdAt and updatedAt fields
);

// Model
const Notification = mongoose.model("Notification", NotificationSchema);

module.exports = Notification;
