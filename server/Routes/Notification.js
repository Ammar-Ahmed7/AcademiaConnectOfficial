const express = require("express");
const router = express.Router();
const Notification = require("../Modal/Notification");
const { utcToZonedTime, zonedTimeToUtc } = require('date-fns-tz');

// POST: Add a new notification
router.post("/addNew", async (req, res) => {
  try {
    const {
      title,
      message,
      type,
      subType,
      Dates,
      createdBy,
      audience,
      isUrgent,
    } = req.body;

    // Validate required fields
    if (
      !title ||
      !message ||
      !type ||
      !subType ||
      !Dates ||
      !createdBy ||
      !audience
    ) {
      return res
        .status(400)
        .json({ error: "Please fill in all required fields." });
    }

    // Validate enum fields
    const allowedTypes = ["Government", "School"];
    const allowedSubTypes = ["Holiday", "Event"];
    const allowedAudiences = ["All", "Teachers", "Students", "Schools"];

    if (!allowedTypes.includes(type)) {
      return res.status(400).json({ error: "Invalid notification type." });
    }
    if (!allowedSubTypes.includes(subType)) {
      return res.status(400).json({ error: "Invalid notification subtype." });
    }
    if (!allowedAudiences.includes(audience)) {
      return res.status(400).json({ error: "Invalid audience type." });
    }

    // Create the new notification
    const newNotification = new Notification({
      title,
      message,
      type,
      subType,
      Dates,
      createdBy,
      audience,
      isUrgent,
    });

    // Save the notification to the database
    await newNotification.save();

    res.status(201).json({
      message: "Notification added successfully!",
      notification: newNotification,
    });
  } catch (error) {
    console.error("Error adding notification:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
router.get("/admin/all", async (req, res) => {
  try {
    const notifications = await Notification.find({ type: "Government" });
    res.status(200).json(notifications);
  } catch (error) {
    console.error("Error fetching notifications:", error);
    res.status(500).json({ message: "Failed to fetch notifications" });
  }
});
router.get("/admin/all/week", async (req, res) => {
    try {
      const notifications = await Notification.find({ type: "Government" });
  
      // Define Pakistan Standard Time (PST) timezone offset (+5 hours)
      const PAKISTAN_OFFSET = 5 * 60; // Pakistan Standard Time is UTC +5 hours
  
      // Get current date in UTC and convert to PST
      const currentDate = new Date();
      const currentDatePST = new Date(currentDate.getTime() + PAKISTAN_OFFSET * 60000);
  
      // Calculate the date 7 days from now in Pakistan time
      const sevenDaysFromNow = new Date(currentDatePST);
      sevenDaysFromNow.setDate(currentDatePST.getDate() + 7);
  
      // Filter notifications based on the new conditions
      const filteredNotifications = notifications.filter(notification => {
        const startDate = new Date(notification.Dates[0]);
        const endDate = new Date(notification.Dates[1]);
  
        // Convert to Pakistan Standard Time by adding the offset
        const startDatePST = new Date(startDate.getTime() + PAKISTAN_OFFSET * 60000);
        const endDatePST = new Date(endDate.getTime() + PAKISTAN_OFFSET * 60000);
  
        // Check if the end date is within the next 7 days or the start date is within the next 7 days
        return (
          (endDatePST >= currentDatePST && endDatePST <= sevenDaysFromNow) || // End date is within 7 days
          (startDatePST >= currentDatePST && startDatePST <= sevenDaysFromNow) // Start date is within the next 7 days
        );
      });
  
      res.status(200).json(filteredNotifications);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      res.status(500).json({ message: "Failed to fetch notifications" });
    }
  });
  

module.exports = router;
