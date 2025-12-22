import express from "express";
import dotenv from "dotenv";

import authRoutes from "./routes/auth.route";
import messageRoutes from "./routes/auth.message";

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 5001;

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
