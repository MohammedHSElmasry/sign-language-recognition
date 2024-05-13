import multer from "multer";
export function fileUpload() {
  const storage = multer.diskStorage({});
  const upload = multer({ storage });
  return upload;
}
