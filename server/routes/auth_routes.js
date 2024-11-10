import { Router } from "express";
import {
  login,
  signup,
  getUserInfo,
  updateUserInfo,
  addProfileImage,
  deleteProfileImage,
  logout,
} from "../controllers/auth_controller.js";
import { verifyToken } from "../middleware/auth_middleware.js";
import upload from "../multer.js";

const auth_route = Router();

auth_route.post("/signup", signup);
auth_route.post("/login", login);
auth_route.get("/user-info", verifyToken, getUserInfo);
auth_route.post("/update-profile", verifyToken, updateUserInfo);
auth_route.post(
  "/add-profile-image",
  verifyToken,
  upload.single("profile-image"),
  addProfileImage
);
auth_route.delete("/delete-profile-image", verifyToken, deleteProfileImage);
auth_route.post("/logout", logout);

export default auth_route;
