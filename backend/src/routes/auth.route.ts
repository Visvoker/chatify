import express from "express";

import { signup } from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/signup", signup);

router.get("/login", (_req, res) => {
  res.send("API login");
});

router.get("/logout", (_req, res) => {
  res.send("API logout");
});

export default router;
