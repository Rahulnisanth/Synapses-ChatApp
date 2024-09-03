import { Router } from "express";
import { signup } from "../controllers/auth_controller.js";

const auth_route = Router();
auth_route.post("/signup", signup);

export default auth_route;
