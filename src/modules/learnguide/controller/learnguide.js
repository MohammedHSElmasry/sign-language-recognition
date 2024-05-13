import { learnguideModel } from "../../../../db/models/learnguide.model.js";

import cloudinary from "../../../utils/cloudinary.js";
import { asyncHandler } from "../../../utils/errorhandling.js";
export const addvideo = asyncHandler(async (req, res, next) => {
  if (req.file) {
    const { secure_url, public_id } = await cloudinary.uploader.upload(
      req.file.path,
      {
        folder: `${process.env.APP_NAME}/learnguide/video`,
        resource_type: "video",
      }
    );
    learnguideModel.video = { secure_url, public_id };
    await learnguideModel.create({
      video: { secure_url, public_id },
    });
  }
  res.status(200).json({
    message: "Video uploaded successfully",
    video: learnguideModel.video,
  });
});
export const updatavideo = asyncHandler(async (req, res, next) => {
  if (!req.file) {
    return next(new Error("No file uploaded"));
  }

  const learnguide = await learnguideModel.findById(req.params.id);
  if (!learnguide) {
    return next(new Error("Invalid video ID"));
  }
  const { secure_url, public_id } = await cloudinary.uploader.upload(
    req.file.path,
    {
      folder: `${process.env.APP_NAME}/learnguide/video`,
      resource_type: "video",
    }
  );
  if (learnguide.video) {
    await cloudinary.uploader.destroy(learnguide.video.public_id);
  }
  learnguide.video = { secure_url, public_id };
  await learnguide.save();
  res.status(200).json({
    message: "Video updated successfully",
    video: learnguide.video,
  });
});

export const allVideos = asyncHandler(async (req, res, next) => {
  const Videos = await learnguideModel.find();
  return res.json({ message: "done", Videos });
});

export const deleteVideo = asyncHandler(async (req, res, next) => {
  const { videoId } = req.params;
  if (!videoId) {
    return next(new Error("Video ID is required"));
  }

  const video = await learnguideModel.findById(videoId);
  if (!video) {
    return next(new Error("Video not found"));
  }

  const publicId = video.video.public_id;
  await cloudinary.uploader.destroy(publicId);

  await learnguideModel.findByIdAndDelete(videoId);

  res.status(200).json({
    message: "Video deleted successfully",
  });
});
