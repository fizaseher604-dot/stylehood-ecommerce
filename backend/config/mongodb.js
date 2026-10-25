import mongoose from "mongoose";

let connectionPromise = null;

const connectDB = async () => {
  // Already connected
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  // Reuse an ongoing connection attempt
  if (connectionPromise) {
    return connectionPromise;
  }

  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI is missing in environment variables");
  }

  connectionPromise = mongoose
    .connect(`${process.env.MONGODB_URI}/e-commerce`, {
      serverSelectionTimeoutMS: 15000,
      connectTimeoutMS: 15000,
    })
    .then(() => {
      console.log("MongoDB connected successfully");
      return mongoose.connection;
    })
    .catch((error) => {
      console.error("MongoDB connection failed:", error.message);
      throw error;
    })
    .finally(() => {
      connectionPromise = null;
    });

  return connectionPromise;
};

export default connectDB;