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

const allowedOrigins = [
  "https://synapses-chat-app.vercel.app",
  "http://localhost:3000", // Add during development
];

const database_url = process.env.DATABASE_URL;
const port = process.env.PORT || 5000;

// CORS setup
app.use(
  cors({
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
    exposedHeaders: ["Set-Cookie"],
  })
);

// Preflight request handling
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", allowedOrigins[0]);
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.header("Access-Control-Allow-Credentials", "true");
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH");
    return res.status(200).json({});
  }
  next();
});

// Middleware
app.use(cookieParser());
app.use(express.json());

// Routes
app.use("/api/auth", auth_route);
app.use("/api/contact", contact_route);
app.use("/api/message", message_route);
app.use("/api/channel", channel_route);

// Server and Database
const server = app.listen(port, () => {
  console.log(`Server is running at the port: ${port}`);
});

setUpSocket(server);

mongoose
  .connect(database_url, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Database connection successful!"))
  .catch((err) => console.error("Database connection error:", err));
