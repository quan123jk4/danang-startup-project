const mongoose = require("mongoose");
const { escapeRegex, removeVietnameseTones } = require("../utils/searchHelper");

const placeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Tên địa điểm là bắt buộc"],
      unique: true,
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Mô tả không được để trống"],
    },
    address: {
      type: String,
      required: [true, "Địa chỉ là bắt buộc"],
    },
    images: [{ type: String }],
    category: {
      type: String,
      required: true,
      enum: [
        "Restaurant",
        "Hotel",
        "Attraction",
        "Beach",
        "Mountain",
        "Culture",
      ],
    },

    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number],
        required: true,
      },
    },

    hasSpecialEvent: {
      type: Boolean,
      default: false,
    },

    price: { type: Number, default: 0 },
    priceRange: {
      type: String,
      enum: ["Free", "Low", "Medium", "High"],
      default: "Medium",
    },
    historyInfo: {
      type: String,
    },
    highlights: [{ type: String }],
    openingHours: { type: String },

    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    numReviews: {
      type: Number,
      default: 0,
    },
    averageTimeSpent: {
      type: Number,
      default: 60,
      help: "Thời gian khách thường ở lại đây (ví dụ: 120 cho Bà Nà, 30 cho Cầu Rồng)",
    },
    tags: [
      {
        type: String,
        help: "Ví dụ: ['yên tĩnh', 'sống ảo', 'lịch sử', 'gia đình']",
      },
    ],
    suitableWeather: [
      {
        type: String,
        enum: ["Sunny", "Rainy", "All"],
        default: "All",
      },
    ],
    popularityScore: {
      type: Number,
      default: 0,
    },
    searchString: {
      type: String,
      select: false,
    },
  },
  {
    timestamps: true,
  },
);
placeSchema.index({ location: "2dsphere" });
placeSchema.pre("save", async function () {
  const combinedText = `${this.name} ${this.description}`;
  this.searchString = removeVietnameseTones(combinedText);
});
module.exports = mongoose.model("Place", placeSchema);
