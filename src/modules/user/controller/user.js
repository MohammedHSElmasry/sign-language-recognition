import { userModel } from "../../../../db/models/user.model.js";
import { asyncHandler } from "../../../utils/errorhandling.js";
import cloudinary from "../../../utils/cloudinary.js";
export const profile = asyncHandler(async (req, res, next) => {
  const user = await userModel.findById({ _id: req.user._id });
  if (!user) {
    return next(new Error("in-valid login data"));
  }
  return res.json({ message: "done", user });
});

export const updateuser = asyncHandler(async (req, res, next) => {
  const { userid } = req.params;
  const user = await userModel.findById({ _id: userid });
  if (!user) {
    return next(new Error("Invalid user-id", { cause: 400 }));
  }

  if (req.body.fristname) {
    user.fristname = req.body.fristname;
  }

  if (req.body.lastname) {
    user.lastname = req.body.lastname;
  }

  if (req.body.phone) {
    user.phone = req.body.phone;
  }

  if (req.file) {
    const { secure_url, public_id } = await cloudinary.uploader.upload(
      req.file.path,
      { folder: `${process.env.APP_NAME}/user/profile` }
    );
    if (user.image && user.image.public_id) {
      await cloudinary.uploader.destroy(user.image.public_id);
    }
    user.image = { secure_url, public_id };
  }

  await user.save();
  return res.status(200).json({ message: "user updated successfully", user });
});
export const userDelete = asyncHandler(async (req, res, next) => {
  // تعديل اسم الوظيفة ليتناسب مع الأسلوب العامل المعتمد في JavaScript
  const { userId } = req.params;
  const user = await userModel.findByIdAndDelete(userId); // استخدام findByIdAndDelete بدلاً من findOneAndDelete
  if (!user) {
    return next(new Error("Invalid userId")); // تحسين رسالة الخطأ
  }
  return res.json({ message: "User deleted", user }); // تحسين رسالة النجاح
});
