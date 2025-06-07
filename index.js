// Import necessary modules
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const mongoose = require("mongoose");
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
const emailNotificationRoutes = require("./routes/emailNotificationRoutes");
const leadsRoutes = require("./routes/leadsRoutes");
const subscriptionPlanRoutes = require("./routes/subscriptionPlanRoutes");

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
    origin: process.env.CLIENT_URL || '*',
    methods: ['GET', 'POST']
  }
});

// MongoDB connection
mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log("✔✨✨Connected to MongoDB");

    // Middleware
    app.use(express.json()); // Parse incoming JSON requests

    const corsOptions = {
      origin: '*', // allow all origins (you can restrict if needed)
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'], // allow only specific HTTP methods
    };
    app.use(cors(corsOptions));
 // Enable CORS

    // Swagger documentation
    app.use('/doc', swaggerUi.serve, swaggerUi.setup(swaggerFile));

    // test endpoint
    app.get("/", (req, res) => {
      res.send("API server is running🥰");
    });

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
    app.use("/email-notification", emailNotificationRoutes);
    app.use("/leads", leadsRoutes);
    app.use("/subscription-plan", subscriptionPlanRoutes);

   // Store online users
    let onlineUsers = new Map();

    io.on("connection", (socket) => {
      console.log("New client connected:", socket.id);

      // Handle joining chat
      socket.on("join", (userId) => {
        onlineUsers.set(userId, socket.id);
        io.emit("online-users", Array.from(onlineUsers.keys()));
      });

      // Handle typing
      socket.on("typing", ({ senderId, recipientId }) => {
        const recipientSocketId = onlineUsers.get(recipientId);
        if (recipientSocketId) {
          io.to(recipientSocketId).emit("typing", senderId);
        }
      });

      // Handle stop typing
      socket.on("stop-typing", ({ senderId, recipientId }) => {
        const recipientSocketId = onlineUsers.get(recipientId);
        if (recipientSocketId) {
          io.to(recipientSocketId).emit("stop-typing", senderId);
        }
      });

      // Handle sending message
      socket.on("send-message", (messageData) => {
        const recipientSocketId = onlineUsers.get(messageData.recipientId);
        if (recipientSocketId) {
          io.to(recipientSocketId).emit("receive-message", messageData);
        }
      });

      // Handle read receipts
      socket.on("read-message", ({ messageId, recipientId }) => {
        const recipientSocketId = onlineUsers.get(recipientId);
        if (recipientSocketId) {
          io.to(recipientSocketId).emit("message-read", messageId);
        }
      });

      socket.on("disconnect", () => {
        console.log("Client disconnected:", socket.id);
        for (let [userId, id] of onlineUsers.entries()) {
          if (id === socket.id) {
            onlineUsers.delete(userId);
            break;
          }
        }
        io.emit("online-users", Array.from(onlineUsers.keys()));
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
