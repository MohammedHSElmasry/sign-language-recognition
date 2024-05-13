import { fileUpload, filevalidation } from "../../utils/multer.cloud.js";
import * as authcontroller from "./controller/auth.js";
import { Router } from "express";
const router = Router();
router.post("/signup", authcontroller.signup);
router.post("/login",authcontroller.Login)
router.post(
  "/update/:userid",
  fileUpload(filevalidation.image).single("image"),
  authcontroller.updateuser
);
router.patch("/sendcode", authcontroller.sendCode);
router.patch("/forgetpassword", authcontroller.forgetpassword);
router.delete("/delete/:userId", authcontroller.userDelete);
export default router;
