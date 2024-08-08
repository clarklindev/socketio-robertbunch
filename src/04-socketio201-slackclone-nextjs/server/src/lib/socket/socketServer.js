import { Server } from "socket.io";

export async function startSocketServer(httpServer) {
  const io = new Server(httpServer); // Attach Socket.IO to the HTTP server

  //set up connection event handlers
  io.on("connection", (socket) => {
    console.log(socket.handshake);
    socket.emit("message", "Welcome to the server!");

    socket.on("clientConnect", (data) => {
      console.log(socket.id, "has connected");
      socket.emit("nsList", namespaces || []); //send  namespaces to client
    });

    socket.on("newMessageToServer", (dataFromClient) => {
      console.log("Data:", dataFromClient);
      io.emit("newMessageToClients", { text: dataFromClient.text });
    });

    socket.on("disconnect", () => {
      console.log("user disconnected:", socket.id);
    });
  });
}
