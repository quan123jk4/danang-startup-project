const mongoose = require("mongoose");

const checkInSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    place: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Place",
      required: true,
    },
    userLocation: {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true },
    },
    caption: {
      type: String,
      default: "",
    },
    media: [
      {
        type: String,
      },
    ],
    pointsEarned: {
      type: Number,
      required: true,
      default: 0,
    },
    rating: { type: Number },
  },
  { timestamps: true },
);

module.exports = mongoose.model("CheckIn", checkInSchema);
