import { Router } from "express";
import { verifyToken } from "../middleware/auth_middleware.js";
import {
  searchContacts,
  getDMList,
} from "../controllers/contacts_controller.js";

const contact_route = Router();

contact_route.post("/search-contacts", verifyToken, searchContacts);
contact_route.get("/get-DM-List", verifyToken, getDMList);

export default contact_route;
