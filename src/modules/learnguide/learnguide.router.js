import * as learnguideController from "./controller/learnguide.js";
import { fileUpload } from "../../utils/multer.cloud_2.js";
import { Router } from "express";
import { filevalidation } from "../../utils/multer.cloud.js";
const router = Router();
router.post(
  "/addvideo",
  fileUpload(filevalidation.video).single("video"),
  learnguideController.addvideo
);

router.patch(
  "/updatvideo/:id",
  fileUpload(filevalidation.video).single("video"),
  learnguideController.updatavideo
);

router.get('/',learnguideController.allVideos)

router.delete("/deletevideo/:videoId", learnguideController.deleteVideo);

export default router;
