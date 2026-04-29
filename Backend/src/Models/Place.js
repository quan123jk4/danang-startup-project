const mongoose = require("mongoose");

// 1. PLACE SCHEMA (Bảng cha)
const placeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    address: { type: String },
    phone: { type: String },
    minPrice: { type: Number },
    maxPrice: { type: Number },
    rating: {
      type: Number,
      min: [1, "Tối thiểu 1 sao"],
      max: [5, "Tối đa 5 sao"],
      default: 5,
    },
    numReview: { type: Number, default: 0 },
    description: { type: String },
    location: {
      type: { type: String, enum: ["Point"], default: "Point" },
      coordinates: { type: [Number], required: true }, // [Lng, Lat]
    },
    tags: [{ type: String }], // Lưu từ khóa AI
    images: [{ type: String }], // LƯU LINK ẢNH (Dạng mảng để dễ mở rộng sau này)
  },
  {
    discriminatorKey: "category",
    collection: "places",
    timestamps: true,
  },
);

placeSchema.index({ location: "2dsphere" });
const Place = mongoose.model("Place", placeSchema);

// 2. DISCRIMINATORS (Các bảng con)
const Hotel = Place.discriminator(
  "hotel",
  new mongoose.Schema({
    amenities: [{ type: String }],
  }),
);

const Restaurant = Place.discriminator(
  "restaurant",
  new mongoose.Schema({
    cuisineType: { type: String },
    serviceType: { type: String },
  }),
);

const Attraction = Place.discriminator(
  "attraction",
  new mongoose.Schema({
    ticketPrice: { type: Number },
    tourDuration: { type: String },
    activities: [{ type: String }],
    historicalInfo: { type: String },
    rules: { type: String },
  }),
);

const Entertainment = Place.discriminator(
  "entertainment",
  new mongoose.Schema({
    activityType: { type: String },
    eventSchedule: { type: String },
  }),
);

// 3. MENU SCHEMA (Liên kết với Restaurant)
const menuSchema = new mongoose.Schema(
  {
    restaurant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Place", // Tham chiếu đến ID trong collection places
      required: true,
    },
    itemName: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String },
  },
  { timestamps: true },
);

const Menu = mongoose.model("Menu", menuSchema);

module.exports = { Place, Hotel, Restaurant, Attraction, Entertainment, Menu };
