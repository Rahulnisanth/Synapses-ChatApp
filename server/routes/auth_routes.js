import { Router } from "express";
import { login, signup } from "../controllers/auth_controller.js";

const auth_route = Router();
auth_route.post("/signup", signup);
auth_route.post("/login", login);

export default auth_route;
