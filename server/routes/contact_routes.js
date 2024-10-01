import { Router } from "express";
import { verifyToken } from "../middleware/auth_middleware.js";
import { searchContacts } from "../controllers/contacts_controller.js";

const contact_route = Router();

contact_route.get("search-contacts", verifyToken, searchContacts);

export default contact_route;
