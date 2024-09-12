const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const eventRoutes = require("./routes/eventRoutes");
const messageRoutes = require("./routes/messageRoutes");
const communityRoutes = require("./routes/communityRoutes");
const postRoutes = require("./routes/postRoutes");
const sendEmail = require("./routes/emailSender");
const withdrawalRoutes = require("./routes/withdrawalRoutes");
// import flutterwave plan
const flutterwaveRoutes = require("./routes/flutterwaveRoutes");
const splinxWalletRoutes = require("./routes/splinxWalletRoutes");

// app admin management
const adminRoutes = require("./routes/adminRoutes");



// dotenv config
require("dotenv").config();

const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI;

// Connect to MongoDB
mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log("✔✨✨Connected to MongoDB");

    const app = express(); // Create Express app

    app.use(bodyParser.json()); // JSON body parser middleware
    app.use(cors()); // Enable CORS middleware
    // restrict requests
    // app.use(cors({
    //     origin: "https://example.com"
    // }));

    app.use("/auth", authRoutes); // Use auth routes
    app.use("/user", userRoutes); // Use user routes
    app.use("/event", eventRoutes); // Use event routes
    app.use("/message", messageRoutes); // use message routes
    app.use("/community", communityRoutes); // use community routes
    app.use("/post", postRoutes); // use post routes
    app.use("/email", sendEmail); // use email routes
    app.use("/withdrawal", withdrawalRoutes); // use withdrawal routes
    // use flutterwave routes
    app.use("/flw-api", flutterwaveRoutes);
    app.use("/wallet", splinxWalletRoutes);

    // app admin management
    app.use("/admin", adminRoutes);

    app.listen(PORT, () => {
      console.log(`👌✨Server running at http://localhost:${PORT}`);
    });

    // export app
    module.exports = app;
  })
  .catch((err) => console.log(err));
