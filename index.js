// Import necessary modules
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");

// Swagger
const swaggerUi = require('swagger-ui-express');
const swaggerFile = require('./utils/swagger-output.json');

// Routes
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const eventRoutes = require("./routes/eventRoutes");
const messageRoutes = require("./routes/messageRoutes");
const communityRoutes = require("./routes/communityRoutes");
const postRoutes = require("./routes/postRoutes");
const sendEmail = require("./routes/emailSender");
const withdrawalRoutes = require("./routes/withdrawalRoutes");
const flutterwaveRoutes = require("./routes/flutterwaveRoutes");
const splinxWalletRoutes = require("./routes/splinxWalletRoutes");
const adminRoutes = require("./routes/adminRoutes");
const advertRoutes = require("./routes/advertRoutes");
const promoCodeRoutes = require("./routes/promoCodeRoutes");
const pushNotificationRoutes = require("./routes/notificationRoutes");

// dotenv config
require("dotenv").config();

const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI;

// Initialize Express app
const app = express();

// Set up server with Socket.IO
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

// MongoDB connection
mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log("✔✨✨Connected to MongoDB");

    // Middleware
    app.use(bodyParser.json()); // Parse incoming JSON requests
    app.use(cors()); // Enable CORS

    // Swagger documentation
    app.use('/doc', swaggerUi.serve, swaggerUi.setup(swaggerFile));

    // Routes
    app.use("/auth", authRoutes);
    app.use("/user", userRoutes);
    app.use("/event", eventRoutes);
    app.use("/message", messageRoutes);
    app.use("/community", communityRoutes);
    app.use("/post", postRoutes);
    app.use("/email", sendEmail);
    app.use("/withdrawal", withdrawalRoutes);
    app.use("/flw-api", flutterwaveRoutes);
    app.use("/wallet", splinxWalletRoutes);
    app.use("/admin", adminRoutes);
    app.use("/advert", advertRoutes);
    app.use("/promo", promoCodeRoutes);
    app.use("/notification", pushNotificationRoutes);

    // Socket.IO connection
    io.on('connection', (socket) => {
      console.log('User connected');

      socket.on('join', (userId) => {
        socket.join(userId);  // User joins their own room
        console.log(`User ${userId} joined their room`);
      });

      socket.on('send-notification', (data) => {
        io.to(data.userId).emit('receive-notification', {
          title: data.title,
          message: data.message,
          type: data.type
        });
      });

      socket.on('disconnect', () => {
        console.log('User disconnected');
      });
    });

    // Start the server using the http server with Socket.IO
    server.listen(PORT, () => {
      console.log(`👌✨Server running at http://localhost:${PORT}`);
    });
  })
  .catch((err) => console.log("MongoDB connection error:", err));

// Export the app for testing or external usage
module.exports = app;
