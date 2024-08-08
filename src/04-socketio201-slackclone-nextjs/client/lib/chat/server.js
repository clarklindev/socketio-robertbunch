import { Server } from "socket.io";
import express from "express";
import { createServer } from "http";
import { parse } from "url";
import next from "next";

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();
const port = process.env.PORT || 3000;

export async function startServer() {
  try {
    await app.prepare();

    const server = express();
    const httpServer = createServer(server);
    const io = new Server(httpServer);

    // Attach the Socket.io instance to the server object
    // server.io = io;

    //save socket.io instance via context

    //set up connection event handlers
    io.on("connection", (socket) => {
      console.log(socket.handshake);
      socket.emit("message", "Welcome to the server!");

      socket.on("clientConnect", (data) => {
        console.log(socket.id, "has connected");
        socket.emit("nsList", namespaces); //send  namespaces to client
      });

      socket.on("newMessageToServer", (dataFromClient) => {
        console.log("Data:", dataFromClient);
        io.emit("newMessageToClients", { text: dataFromClient.text });
      });

      socket.on("disconnect", () => {
        console.log("user disconnected");
      });
    });

    server.all("*", (req, res) => {
      return handle(req, res);
    });

    httpServer.listen(port, (err) => {
      if (err) {
        throw err;
      }
      console.log(`Ready on http://localhost:${port}`);
    });
  } catch (error) {
    console.error("Error starting server:", error);
    process.exit(1); // Exit with failure code
  }
}
startServer();
