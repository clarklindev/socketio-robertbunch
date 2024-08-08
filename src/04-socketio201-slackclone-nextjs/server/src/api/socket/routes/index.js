import express from "express";

const router = express.Router();

//api/socket/namespaces
router.get("/namespaces", (req, res) => {
  res.json({ status: "OK" });
});

//api/socket
router.get("/", (req, res) => {
  res.json({ status: "OK" });
});

export default router;
