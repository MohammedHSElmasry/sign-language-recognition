import * as userController from "./controller/user.js";
import { auth } from "../../middleware/autntication.js";
import { Router } from "express";
const router = Router();
router.get("/", auth, userController.profile);
export default router;
