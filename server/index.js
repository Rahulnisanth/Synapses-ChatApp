import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import auth_route from "./routes/auth_routes.js";

dotenv.config();
const app = express();
const port = process.env.PORT || 3001;
const database_url = process.env.database_url;

app.use(
  cors({
    origin: process.env.ORIGIN || "http://localhost:5173",
    methods: ["POST", "PUT", "GET", "PATCH", "DELETE"],
    credentials: true,
  })
);

// Handle preflight requests
app.options("*", cors());

app.use(cookieParser());
app.use(express.json());

// overall authentications router...
app.use("/api/auth", auth_route);

const server = app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}/`);
});

mongoose
  .connect(database_url)
  .then(() => console.log("Database connection successful!"))
  .catch((err) => console.log("Database connection error: ", err));
