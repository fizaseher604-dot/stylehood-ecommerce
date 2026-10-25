import mongoose from "mongoose";

let isConnecting = false;

const connectDB = async () => {
  // Reuse existing connection
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  // Wait if connection is already in progress
  if (isConnecting) {
    await new Promise((resolve, reject) => {
      const checkConnection = () => {
        if (mongoose.connection.readyState === 1) {
          resolve();
        } else if (mongoose.connection.readyState === 0) {
          reject(new Error("MongoDB connection failed"));
        } else {
          setTimeout(checkConnection, 200);
        }
      };

      checkConnection();
    });

    return mongoose.connection;
  }

  isConnecting = true;

  try {
    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI is missing in environment variables");
    }

    await mongoose.connect(
      `${process.env.MONGODB_URI}/e-commerce`,
      {
        serverSelectionTimeoutMS: 10000,
        connectTimeoutMS: 10000,
        bufferCommands: false,
      }
    );

    console.log("MongoDB connected successfully");

    return mongoose.connection;
  } catch (error) {
    console.error("MongoDB connection error:", error.message);
    throw error;
  } finally {
    isConnecting = false;
  }
};

export default connectDB;