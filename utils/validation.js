const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");

// dotenv config
require("dotenv").config();

const PORT = process.env.PORT || 3000;


// Connect to MongoDB
mongoose
  .connect("mongodb://localhost:27017/mern-auth", { useNewUrlParser: true })
    .then(() => {
        console.log("✔✨✨Connected to MongoDB");

        const app = express(); // Create Express app

        app.use(bodyParser.json()); // JSON body parser


        app.use("/auth", authRoutes); // Use auth routes
        app.use("/user", userRoutes); // Use user routes

        
        app.listen(PORT, () => {
            console.log(`👌✨Server running at http://localhost:${PORT}`);
        });
  })
    .catch(err => console.log(err));
  

