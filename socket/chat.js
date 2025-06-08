const users = {}; // userId -> Set of socket IDs

module.exports = (io) => {
  io.on("connection", (socket) => {
    console.log(`User connected: ${socket.id}`);

    socket.on("join", (userId) => {
      socket.userId = userId;
      if (!users[userId]) users[userId] = new Set();
      users[userId].add(socket.id);
      socket.join(userId); // allow room emits using userId
      io.emit("online-users", Object.keys(users));
    });

    socket.on("send-message", ({ from, to, message }) => {
      io.to(to).emit("receive-message", { from, message });
    });

    socket.on("typing", ({ to, from }) => {
      io.to(to).emit("typing", { from });
    });

    socket.on("read-message", ({ from, to }) => {
      io.to(from).emit("message-read", { to });
    });

    socket.on("disconnect", () => {
      const { userId } = socket;
      if (userId && users[userId]) {
        users[userId].delete(socket.id);
        if (users[userId].size === 0) {
          delete users[userId];
        }
      }
      io.emit("online-users", Object.keys(users));
      console.log(`User disconnected: ${socket.id}`);
    });
  });
};
