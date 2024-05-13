import { userModel } from "../../../../db/models/user.model.js";
import { asyncHandler } from "../../../utils/errorhandling.js";

export const profile = asyncHandler(async (req, res, next) => {
  const user = await userModel.findById({ _id: req.user._id });
  if (!user) {
    return next(new Error("in-valid login data"));
  }
  return res.json({ message: "done", user });
});
