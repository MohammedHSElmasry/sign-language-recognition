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
