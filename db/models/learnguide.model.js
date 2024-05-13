import mongoose from "mongoose";

const learnguideSchema = new mongoose.Schema({
  video: {
    secure_url: { type: String },
    public_id: { type: String },
  },
  // image: {
  //   secure_url: { type: String },
  //   public_id: { type: String },
  // },
}, { timestamps: true });

export const learnguideModel = mongoose.model("Learnguide", learnguideSchema);
