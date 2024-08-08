import "dotenv/config";
import express from "express";
import http from "http";
import cors from "cors";
import cookieParser from "cookie-parser";

import { startSocketServer } from "./lib/socket/socketServer.js";
import { initDatabase } from "./lib/db/initDatabase.js";
import socketRoutes from "./api/socket/routes/index.js";

async function init() {
  try {
    const result = await initDatabase(
      process.env.MONGODB_URI,
      process.env.MONGODB_DB
    );

    const app = express(); //create express app
    const port = process.env.PORT || 3000;

    const corsOptions = {
      origin: `${process.env.FRONTEND_URL}:${process.env.FRONTEND_PORT}`, // Replace with your frontend URL
    };
    app.use(cors(corsOptions)); //cors order important: needs to come before express.json()

    //middleware
    app.use(cookieParser()); //Cookie parsing middleware
    app.use(express.json()); //parse json application/json
    app.use("/api/socket", socketRoutes);

    //handle all misc routes
    app.use((req, res) => {
      res.status(404).json({ status: "ERROR", message: "Page Not Found" });
    });

    app.use((err, req, res, next) => {
      console.error(err.stack);
      res.status(500).send("Something broke!");
    });

    const httpServer = http.createServer(app); // Create an HTTP server and pass the Express app to it
    httpServer.listen(port, (err) => {
      if (err) {
        throw err;
      }
      console.log(`Ready on http://localhost:${port}`);
    });

    //graceful shutdown mechanism to close connections and cleanup resources when the server is terminated
    process.on("SIGTERM", () => {
      httpServer.close(() => {
        console.log("Process terminated");
      });
    });

    //start socket server
    await startSocketServer(httpServer);
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1); // Exit with failure code
  }
}
init();
