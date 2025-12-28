import express from "express";

import {
  signup,
  login,
  logout,
  updateProfile,
} from "../controllers/auth.controller.js";
import { arcjetProtection } from "../middleware/arcjet.middleware.js";

const router = express.Router();

router.use(arcjetProtection);

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);

router.put("update-profile", updateProfile);

router.get("/check", (req, res) => res.status(200).json(req.user));

export default router;
