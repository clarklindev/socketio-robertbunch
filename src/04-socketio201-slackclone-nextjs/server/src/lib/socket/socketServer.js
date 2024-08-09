import { Server } from "socket.io";

export async function startSocketServer(httpServer) {
  const io = new Server(httpServer); // Attach Socket.IO to the HTTP server

  //set up connection event handlers
  io.on("connection", (socket) => {
    console.log(socket.handshake);
    socket.emit("message", "Welcome to the server!");

    socket.on("clientConnect", async (data) => {
      console.log(socket.id, "has connected");

      try {
        // Fetch namespaces from the API
        const apiUrl = `${process.env.SERVER_URL}:${process.env.SERVER_PORT}/api/namespaces`;
        const response = await fetch(apiUrl);
        const namespaces = await response.json();

        socket.emit("nsList", namespaces || []); //send  namespaces to client
      } catch (error) {
        console.error("Error fetching namespaces:", error);
        socket.emit("nsList", []); // Send an empty list on error
      }
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
