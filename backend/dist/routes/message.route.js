import express from "express";
const router = express.Router();
router.get("/send", (_req, res) => {
    res.send("API messages send");
});
export default router;
