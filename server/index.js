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

// Configure environment variables
dotenv.config();

const app = express();
const database_url = process.env.DATABASE_URL;
const port = process.env.PORT || 5000;

// Middleware
app.use(
  cors({
    origin: process.env.CLIENT_URL || "https://synapses-chat-app.vercel.app",
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], 
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json());

// Health check route
app.get("/", (req, res) => {
  res.status(200).json({
    message: "Server is up and running!",
    timestamp: new Date().toISOString(),
  });
});

// Routes
app.use("/api/auth", auth_route);
app.use("/api/contact", contact_route);
app.use("/api/message", message_route);
app.use("/api/channel", channel_route);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: "Something went wrong!",
    error: process.env.NODE_ENV === "production" ? {} : err.stack,
  });
});

// Server and Database connection
const connectWithRetry = async () => {
  try {
    await mongoose.connect(database_url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Database connection successful!");

    // Start server after successful database connection
    const server = app.listen(port, () => {
      console.log(`Server is running at port: ${port}`);
    });

    // Setup socket after server starts
    setUpSocket(server);
  } catch (err) {
    console.error("Database connection error:", err);
    // Retry connection after 5 seconds
    setTimeout(connectWithRetry, 5000);
  }
};

// Initial connection attempt
connectWithRetry();

// Graceful shutdown
process.on("SIGINT", async () => {
  try {
    await mongoose.connection.close();
    console.log("MongoDB connection closed");
    process.exit(0);
  } catch (err) {
    console.error("Error during graceful shutdown", err);
    process.exit(1);
  }
});

export default app;
