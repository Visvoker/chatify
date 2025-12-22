import express from "express";

const router = express.Router();

router.get("/signup", (_req, res) => {
  res.send("API signup");
});

router.get("/login", (_req, res) => {
  res.send("API login");
});

router.get("/logout", (_req, res) => {
  res.send("API logout");
});

export default router;
