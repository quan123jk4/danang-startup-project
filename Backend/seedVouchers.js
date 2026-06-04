// seedVouchers.js
require("dotenv").config(); // Nếu ông dùng .env để lưu DB_URL
const mongoose = require("mongoose");
const Voucher = require("./src/Models/Voucher"); // Thay đường dẫn tới file Schema của ông

const dbURL = process.env.MONGODB_URI || "mongodb://localhost:27017/Danasoul";

const sampleVouchers = [
  // ẨM THỰC
  {
    title: "Giảm 50k đơn 200k",
    code: "ANNGON50",
    partnerName: "Hải Sản Năm Đảnh",
    pointsRequired: 100,
    discountValue: "50000",
    quantity: 50,
    expirationDate: new Date("2026-12-31"),
    category: "Ẩm thực",
  },
  {
    title: "Giảm 20% menu sáng",
    code: "MIQUANG20",
    partnerName: "Mì Quảng Bà Mua",
    pointsRequired: 80,
    discountValue: "20%",
    quantity: 30,
    expirationDate: new Date("2026-12-31"),
    category: "Ẩm thực",
  },
  {
    title: "Tặng 1 ly trà sâm",
    code: "TRASAM30",
    partnerName: "Chè Liên",
    pointsRequired: 50,
    discountValue: "1 ly trà sâm",
    quantity: 100,
    expirationDate: new Date("2026-12-31"),
    category: "Ẩm thực",
  },
  {
    title: "Giảm 100k đơn 500k",
    code: "BBQ100",
    partnerName: "Thùng Phi BBQ",
    pointsRequired: 200,
    discountValue: "100000",
    quantity: 20,
    expirationDate: new Date("2026-12-31"),
    category: "Ẩm thực",
  },

  // KHÁCH SẠN
  {
    title: "Giảm 20% đêm nghỉ",
    code: "RESORT20",
    partnerName: "Novotel Danang",
    pointsRequired: 1000,
    discountValue: "20%",
    quantity: 10,
    expirationDate: new Date("2026-12-31"),
    category: "Khách sạn",
  },
  {
    title: "Tặng buffet sáng",
    code: "BUFFETFREE",
    partnerName: "Mường Thanh Luxury",
    pointsRequired: 600,
    discountValue: "1 suất buffet",
    quantity: 15,
    expirationDate: new Date("2026-12-31"),
    category: "Khách sạn",
  },
  {
    title: "Giảm 300k phòng suite",
    code: "SUITE300",
    partnerName: "Hilton Da Nang",
    pointsRequired: 800,
    discountValue: "300000",
    quantity: 5,
    expirationDate: new Date("2026-12-31"),
    category: "Khách sạn",
  },
  {
    title: "Upgrade hạng phòng",
    code: "UPGRADEVIP",
    partnerName: "Furama Resort",
    pointsRequired: 1500,
    discountValue: "Nâng hạng phòng",
    quantity: 3,
    expirationDate: new Date("2026-12-31"),
    category: "Khách sạn",
  },

  // GIẢI TRÍ
  {
    title: "Vé cổng miễn phí",
    code: "BANA100",
    partnerName: "Bà Nà Hills",
    pointsRequired: 1200,
    discountValue: "1 vé cổng",
    quantity: 10,
    expirationDate: new Date("2026-12-31"),
    category: "Giải trí",
  },
  {
    title: "Giảm 50% vé cáp treo",
    code: "CAPTREO50",
    partnerName: "Núi Thần Tài",
    pointsRequired: 400,
    discountValue: "50%",
    quantity: 25,
    expirationDate: new Date("2026-12-31"),
    category: "Giải trí",
  },
  {
    title: "Tặng 50 xu Helio",
    code: "HELIO50",
    partnerName: "Helio Center",
    pointsRequired: 150,
    discountValue: "50 xu",
    quantity: 50,
    expirationDate: new Date("2026-12-31"),
    category: "Giải trí",
  },
  {
    title: "Giảm 30% vé Mikazuki",
    code: "MIKA30",
    partnerName: "Mikazuki Water Park",
    pointsRequired: 300,
    discountValue: "30%",
    quantity: 20,
    expirationDate: new Date("2026-12-31"),
    category: "Giải trí",
  },

  // DI CHUYỂN
  {
    title: "Voucher xăng 30k",
    code: "XANGXE30",
    partnerName: "Petrolimex",
    pointsRequired: 50,
    discountValue: "30000",
    quantity: 200,
    expirationDate: new Date("2026-12-31"),
    category: "Di chuyển",
  },
  {
    title: "Giảm 20k phí Grab",
    code: "GRAB20",
    partnerName: "Grab Đà Nẵng",
    pointsRequired: 70,
    discountValue: "20000",
    quantity: 100,
    expirationDate: new Date("2026-12-31"),
    category: "Di chuyển",
  },
  {
    title: "Tặng 1 chuyến Taxi",
    code: "TAXI0D",
    partnerName: "Mai Linh Taxi",
    pointsRequired: 250,
    discountValue: "1 chuyến taxi",
    quantity: 10,
    expirationDate: new Date("2026-12-31"),
    category: "Di chuyển",
  },
];

async function seedVouchers() {
  try {
    await mongoose.connect(dbURL);
    console.log("✅ Đã kết nối DB để nạp Voucher...");

    // Dọn sạch voucher cũ (nếu muốn làm mới hoàn toàn)
    await Voucher.deleteMany({});

    // Nạp voucher mới
    await Voucher.insertMany(sampleVouchers);

    console.log(
      `🎉 Thành công! Đã thêm ${sampleVouchers.length} voucher vào hệ thống.`,
    );
    process.exit(0);
  } catch (error) {
    console.error("❌ Lỗi khi nạp voucher:", error);
    process.exit(1);
  }
}

seedVouchers();
