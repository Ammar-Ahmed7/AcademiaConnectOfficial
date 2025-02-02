// const express = require("express");
// const app = express();
// const mongoose = require("mongoose");
// const TeacherRoutes = require("./Routes/Teacher");
// const StudentRoutes = require("./Routes/Student");
// const SchoolRoutes = require("./Routes/School");
// const NotificationRoutes = require("./Routes/Notification");  
// const cors = require("cors");
// const PORT = 4000;
// const MONGO_URI = "mongodb://localhost:27017/";

// app.use(cors());
// app.use(express.json());

// app.use("/teacher", TeacherRoutes);
// app.use("/student", StudentRoutes);
// app.use("/school", SchoolRoutes);
// app.use("/notification", NotificationRoutes);


// mongoose
//   .connect(MONGO_URI)
//   .then(() => {
//     console.log("Connected to MongoDB");

//     const server = app.listen(PORT, () => {
//       console.log(`Server is running on port ${PORT}`);
//     });

//     // Handle termination signals
//     process.on("SIGINT", () => {
//       server.close(() => {
//         console.log("Process terminated");
//         process.exit(0);
//       });
//     });

//     process.on("SIGTERM", () => {
//       server.close(() => {
//         console.log("Process terminated");
//         process.exit(0);
//       });
//     });
//   })
//   .catch((err) => {
//     console.log("Error connecting to MongoDB", err);
//   });




// Load environment variables
require("dotenv").config();

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");

// Import routes
const TeacherRoutes = require("./Routes/Teacher");
const StudentRoutes = require("./Routes/Student");
const SchoolRoutes = require("./Routes/School");
const NotificationRoutes = require("./Routes/Notification");

const PORT = process.env.PORT || 4000;
const MONGO_URI = process.env.MONGO_URI;

app.use(cors());
app.use(express.json());

app.use("/teacher", TeacherRoutes);
app.use("/student", StudentRoutes);
app.use("/school", SchoolRoutes);
app.use("/notification", NotificationRoutes);

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB Atlas");

    const server = app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });

    process.on("SIGINT", () => {
      server.close(() => {
        console.log("Process terminated (SIGINT)");
        process.exit(0);
      });
    });

    process.on("SIGTERM", () => {
      server.close(() => {
        console.log("Process terminated (SIGTERM)");
        process.exit(0);
      });
    });
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB Atlas:", err);
  });
