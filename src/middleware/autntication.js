import jwt from "jsonwebtoken";
import { userModel } from "../../db/models/user.model.js";
import { asyncHandler } from "../utils/errorhandling.js";

export const roles = {
  admin: "admin",
  user: "user",
};
export const auth = (accessRoles = []) => {
  return asyncHandler(async (req, res, next) => {
    const { authorization } = req.headers;
    if (!authorization || !authorization.startsWith("Bearer ")) {
      return next(new Error("Token is required", { cause: "400" }));
    }

    const token = authorization.split("Bearer ")[1];

    if (!token) {
      return next(new Error("Token is required", { cause: "400" }));
    }

    const decoded = jwt.verify(token, "hamohamo");

    if (!decoded?.id) {
      return next(new Error("invalid token payload  ", { cause: "400" }));
    }

    const user = await userModel.findById(decoded.id);
    if (!user) {
      return next(new Error("not register account  ", { cause: "401" }));
    }
    if (!accessRoles.includes(user.role)) {
      return next(new Error("not authorized user  ", { cause: "403" }));
    }
    req.user = user;
    return next();
  });
};
