import multer from "multer";

export const filevalidation = {
  image: ["image/jpeg", "image/png", "image/jfif"],
  file: ["application/pdf"],
  video: ["video/mp4", "video/mpeg", "video/quicktime", "video/x-msvideo", "video/x-ms-wmv", "video/x-flv", "video/webm"],
};

export function fileUpload(customValidation = []) {
  const storage = multer.diskStorage({});

  function fileFilter(req, file, cb) {
    if (customValidation.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file format"), false);
    }
  }
  

  const upload = multer({ fileFilter, storage });
  return upload;
}
