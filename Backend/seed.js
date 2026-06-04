const mongoose = require("mongoose");
const { Place } = require("./src/Models/Place");
require("dotenv").config();

const dummyPlaces = [
  {
    name: "Bà Nà Hills",
    slug: "ba-na-hills",
    category: "attraction",
    description: "Khu du lịch nổi tiếng nhất Đà Nẵng",
    details: { ticketPrice: 900000, activities: ["Cáp treo", "Cầu Vàng"] },
    location: { type: "Point", coordinates: [107.993, 15.993] },
    source: "manual",
  },
  {
    name: "Nhà hàng Ẩm thực Đà Thành",
    slug: "nha-hang-am-thuc-da-thanh",
    category: "restaurant",
    description: "Nơi thưởng thức đặc sản địa phương",
    details: { cuisineType: "Việt Nam", serviceType: "Ăn gia đình" },
    location: { type: "Point", coordinates: [108.21, 16.05] },
    source: "manual",
  },
  {
    name: "Khách sạn Novotel",
    slug: "khach-san-novotel",
    category: "hotel",
    description: "Khách sạn view sông Hàn",
    details: { amenities: ["Wifi", "Hồ bơi", "Gym"] },
    location: { type: "Point", coordinates: [108.22, 16.07] },
    source: "manual",
  },
];

async function seed() {
  await mongoose.connect(process.env.DATABASE_URL);
  console.log("🚀 Đang seed dữ liệu mẫu...");

  await Place.deleteMany({}); // Xóa sạch để chắc chắn sạch
  await Place.insertMany(dummyPlaces);

  console.log("✅ Seed thành công! Database giờ đã có 3 địa điểm mẫu.");
  process.exit();
}

seed();
