import { userModel } from "../../../../db/models/user.model.js";
import { asyncHandler } from "../../../utils/errorhandling.js";
import bcrypt, { hash } from "bcrypt";
import jwt from "jsonwebtoken";
import { nanoid, customAlphabet } from "nanoid";
import sendemail from "../../../utils/email.js";
import cloudinary from "../../../utils/cloudinary.js";
export const signup = asyncHandler(async (req, res, next) => {
  const { fristname, lastname, phone, email, password } = req.body;

  const usercheck = await userModel.findOne({ email });
  if (usercheck) {
    return next(new Error("email exist", { cause: 201 }));
  }
  const hashpassword = bcrypt.hashSync(password, +process.env.SALT_ROUNT);
  const user = await userModel.create({
    fristname,
    lastname,
    phone,
    email,
    password: hashpassword,
  });
  const token = jwt.sign(
    {
      id: user._id,
      email: user.email,
    },
    "HAMADA",
    { expiresIn: 60 * 60 }
  );

  const newConfirmemailToken = jwt.sign(
    {
      id: user._id,
      email: user.email,
    },
    "HAMADA",
    { expiresIn: 60 * 60 * 24 * 30 }
  );

  const html = `<a href="http://localhost:5000/auth/confirm/${token}"> confirm Email </a>
    <br>
    <br>  
    <a href="http://localhost:5000/auth/newconfirmemail/${newConfirmemailToken}"> req new confirm email  </a>`;
  await sendemail({
    to: email,
    subject: "confirmemail",
    text: "confrm email",
    html,
  });

  return res.json({ message: "done", user });
});

export const Login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  // console.log({ email, password });

  const user = await userModel.findOne({ email });
  if (!user) {
    return next(new Error("email not exist"));
  }
  const math = bcrypt.compareSync(password, user.password);
  if (!math) {
    return next(new Error("in-valid login data"));
  }

  const token = jwt.sign(
    {
      id: user._id,
      username: user.username,
    },
    "hamohamo"
  );
  return res.status(201).json({ message: "done", user, token });
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
export const sendCode = asyncHandler(async (req, res, next) => {
  const { email } = req.body;
  const nanoid = customAlphabet("123456789", 4);
  const user = await userModel.findOneAndUpdate(
    { email },
    { forgetCode: nanoid() },
    {
      new: true,
    }
  );
  if (!user) {
    return next(new Error("not register account"));
  }

  const html = `<h1> code ${user.forgetCode}</h1>`;
  await sendemail({
    to: email,
    subject: `forget password `,
    text: ` forget password`,
    html,
  });

  return res.json({ message: "done" });
});

export const forgetpassword = asyncHandler(async (req, res, next) => {
  const { email, forgetCode, password } = req.body;
  const user = await userModel.findOne({ email });
  if (!user) {
    return next(new Error("not register account"));
  }

  if (user.forgetCode != forgetCode || !forgetCode) {
    return next(new Error("invalid reset code "));
  }
  const hashpassword = bcrypt.hashSync(password, +process.env.SALT_ROUNT);
  user.password = hashpassword;
  user.forgetCode = null;
  await user.save();

  return res.json({ message: "done" });
});

export const userprofile = asyncHandler(async (req, res, next) => {
  const { userId } = req.params;
  const user = userModel.findById({ _id: userId });
  if (!user) {
    return next(new Error("in-valid userId"));
  }
  return res.json({ message: "done", user });
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
