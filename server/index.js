import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import { v2 as cloudinary } from "cloudinary";
import auth_route from "./routes/auth_routes.js";
import contact_route from "./routes/contact_routes.js";
import { setUpSocket } from "./socket.js";
import message_route from "./routes/message_routes.js";
import channel_route from "./routes/channel_routes.js";

dotenv.config();
// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || "",
  api_key: process.env.CLOUDINARY_API_KEY || "",
  api_secret: process.env.CLOUDINARY_API_SECRET || "",
});

// Helper function to upload to cloudinary
const uploadToCloudinary = async (file, folder) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: folder },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );

    uploadStream.end(file.buffer);
  });
};

// Helper function to delete from cloudinary
const deleteFromCloudinary = async (publicId) => {
  return cloudinary.uploader.destroy(publicId);
};

const app = express();
const port = process.env.PORT || 3001;
const database_url = process.env.DATABASE_URL;

app.use(
  cors({
    origin: process.env.ORIGIN,
    methods: ["POST", "PUT", "GET", "PATCH", "DELETE"],
    credentials: true,
  })
);

// Handle preflight requests
app.options("*", cors());
app.use("/uploads/profiles", express.static("uploads/profiles"));
app.use("/uploads/files", express.static("uploads/files"));

app.use(cookieParser());
app.use(express.json());

// Auth routes
app.use("/api/auth", auth_route);
// Contact routes
app.use("/api/contact", contact_route);
// Message routes
app.use("/api/message", message_route);
// Channel routes
app.use("/api/channel", channel_route);

const server = app.listen(port, () => {
  console.log(`Server is running at the port: ${port} `);
});

setUpSocket(server);

mongoose
  .connect(database_url)
  .then(() => console.log("Database connection successful!"))
  .catch((err) => console.error("Database connection error:", err));
