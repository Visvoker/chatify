import mongoose from "mongoose";

export const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI;

  if (!mongoUri) {
    throw new Error("❌ MONGO_URI is not defined in environment variables");
  }
  try {
    const connect = await mongoose.connect(mongoUri);
    console.log("✅ MONGODB CONNECTED:", connect.connection.host);
  } catch (error) {
    console.error("❌ Error connecting to MONGODB:", error);
    process.exit(1);
  }
};
