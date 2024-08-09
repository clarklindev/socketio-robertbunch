import express from "express";
import { createNamespace } from "../controllers/createNamespace.js";
import { addRoomToNamespace } from "../controllers/addRoomToNamespace.js";

const router = express.Router();

//api/socket/namespaces
router.get("/namespaces", (req, res) => {
  res.json({ status: "OK" });
});

router.post("/namespaces", createNamespace);
router.post("/namespaces/add-room", addRoomToNamespace);

//api/socket
router.get("/", (req, res) => {
  res.json({ status: "OK" });
});

export default router;
