import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import auth_route from "./routes/auth_routes.js";
import contact_route from "./routes/contact_routes.js";
import { setUpSocket } from "./socket.js";
import message_route from "./routes/message_routes.js";
import channel_route from "./routes/channel_routes.js";

dotenv.config();
const app = express();
const port = process.env.PORT || 3001;
const database_url = process.env.DATABASE_URL;

app.use(
  cors({
    origin: process.env.ORIGIN || "http://localhost:5173",
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
  console.log(`Server is running at http://localhost:${port}/`);
});

setUpSocket(server);

mongoose
  .connect(database_url)
  .then(() => console.log("Database connection successful!"))
  .catch((err) => console.error("Database connection error:", err));
