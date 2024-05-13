import { Schema, model } from "mongoose";

const userschema = new Schema(
  {
    fristname: {
      type: String,
      required: true,
    },
    lastname: {
      type: String,
      required: true,
    },
    phone: String,
    email: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    image: {
      secure_url: { type: String },
      public_id: { type: String },
    },
    forgetCode: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

export const userModel = model("user", userschema);
