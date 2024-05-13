import * as learnguideController from "./controller/learnguide.js";
import { Router } from "express";
import {fileUpload, filevalidation } from "../../utils/multer.cloud.js";
import { endpoint } from "./controller/learnguide.endpoint.js";
import { auth, roles } from "../../middleware/autntication.js";
const router = Router();
router.post(
  "/addvideo",
  auth(endpoint.add),
  fileUpload(filevalidation.video).single("video"),
  learnguideController.addvideo
);

router.patch(
  "/updatvideo/:id",
  auth(endpoint.update),
  fileUpload(filevalidation.video).single("video"),
  learnguideController.updatavideo
);

router.get("/", learnguideController.allVideos);

router.delete(
  "/deletevideo/:videoId",
  auth(endpoint.delete),
  learnguideController.deleteVideo
);

export default router;
