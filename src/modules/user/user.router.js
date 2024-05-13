import { fileUpload, filevalidation } from "../../utils/multer.cloud.js";
import * as userController from "./controller/user.js";
import { auth, roles } from "../../middleware/autntication.js";
import { Router } from "express";
const router = Router();
router.get("/", auth(Object.values(roles)), userController.profile);
router.post(
  "/update/:userid",
  auth(Object.values(roles)),
  fileUpload(filevalidation.image).single("image"),
  userController.updateuser
);
router.delete("/delete/:userId", userController.userDelete);
export default router;
