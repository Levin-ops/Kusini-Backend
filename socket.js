let io;

const initSocket = (server) => {
  const { Server } = require("socket.io");
  io = new Server(server, {
    cors: {
      origin: "*",
    },
  });

  io.on("connection", (socket) => {
    console.log("Client connected:", socket.id);

    socket.on("disconnect", () => {
      console.log("Client disconnected:", socket.id);
    });
  });
};

const emitNewOrder = () => {
  if (io) {
    io.emit("new-order", { message: "New Order Placed!" });
  } else {
    console.error("Socket.io not initialized");
  }
};

module.exports = {
  initSocket,
  emitNewOrder,
};
