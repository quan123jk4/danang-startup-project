// file: generateData.js
require("dotenv").config();
const mongoose = require("mongoose");
const slugify = require("slugify");

// IMPORT MODEL PLACE CỦA ÔNG
const { Place } = require("./src/models/Place");

// Dữ liệu chi tiết 75 địa điểm được gán chính xác Tag AI và Ảnh tương ứng
const detailedPlaces = [
  // ==========================================
  // 1. QUÁN CAFE (15 địa điểm)
  // ==========================================
  {
    name: "Trình Cà Phê",
    category: "cafe",
    tags: ["Thư giãn", "Check-in", "Văn hóa"],
    image:
      "https://images.unsplash.com/photo-1509042239860-f550ce710b93?q=80&w=400",
  },
  {
    name: "Reply 1988 Café",
    category: "cafe",
    tags: ["Lãng mạn", "Check-in", "Thư giãn"],
    image:
      "https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=400",
  },
  {
    name: "Nam House Café",
    category: "cafe",
    tags: ["Văn hóa", "Lịch sử", "Thư giãn"],
    image:
      "https://images.unsplash.com/photo-1511920170033-f8396924c348?q=80&w=400",
  },
  {
    name: "The Local Beans",
    category: "cafe",
    tags: ["Thư giãn", "Check-in"],
    image:
      "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=400",
  },
  {
    name: "Góc Nhà Tụi Mình",
    category: "cafe",
    tags: ["Thư giãn", "Lãng mạn", "Văn hóa"],
    image:
      "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?q=80&w=400",
  },
  {
    name: "Cộng Cà Phê (Bạch Đằng)",
    category: "cafe",
    tags: ["Văn hóa", "Check-in", "Lịch sử"],
    image:
      "https://images.unsplash.com/photo-1498804103079-a6351b050096?q=80&w=400",
  },
  {
    name: "Wonderlust Cafe & Bakery",
    category: "cafe",
    tags: ["Check-in", "Lãng mạn", "Sôi động"],
    image:
      "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?q=80&w=400",
  },
  {
    name: "Boulevard Gelato & Coffee",
    category: "cafe",
    tags: ["Lãng mạn", "Check-in"],
    image:
      "https://images.unsplash.com/photo-1517256064527-09c53b2d0c6b?q=80&w=400",
  },
  {
    name: "Nia Coffee (Sân vườn)",
    category: "cafe",
    tags: ["Thiên nhiên", "Thư giãn", "Gia đình"],
    image:
      "https://images.unsplash.com/photo-1541167760496-1628856ab772?q=80&w=400",
  },
  {
    name: "Đen Vâu Coffee",
    category: "cafe",
    tags: ["Thư giãn", "Check-in"],
    image:
      "https://images.unsplash.com/photo-1507133750040-4a8f57021571?q=80&w=400",
  },
  {
    name: "Hẻm Xéo Coffee",
    category: "cafe",
    tags: ["Check-in", "Thư giãn"],
    image:
      "https://images.unsplash.com/photo-1521017432531-fbd92d768814?q=80&w=400",
  },
  {
    name: "Tổ Cafe",
    category: "cafe",
    tags: ["Thư giãn", "Văn hóa"],
    image:
      "https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?q=80&w=400",
  },
  {
    name: "Highlands Coffee (VTV)",
    category: "cafe",
    tags: ["Sôi động", "Gia đình"],
    image:
      "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=400",
  },
  {
    name: "Danang Souvenirs & Cafe",
    category: "cafe",
    tags: ["Văn hóa", "Check-in", "Thư giãn"],
    image:
      "https://images.unsplash.com/photo-1506619216599-9d16d0903dfd?q=80&w=400",
  },
  {
    name: "Ikigai Cafe (Phong cách Nhật)",
    category: "cafe",
    tags: ["Check-in", "Thư giãn", "Kiến trúc"],
    image:
      "https://images.unsplash.com/photo-1525193612162-0b3400829414?q=80&w=400",
  },

  // ==========================================
  // 2. NHÀ HÀNG (15 địa điểm)
  // ==========================================
  {
    name: "Hải Sản Năm Đảnh",
    category: "restaurant",
    tags: ["Ẩm thực địa phương", "Hải sản", "Khám phá"],
    image:
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=400",
  },
  {
    name: "Mì Quảng Bà Mua",
    category: "restaurant",
    tags: ["Ẩm thực địa phương", "Gia đình", "Văn hóa"],
    image:
      "https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?q=80&w=400",
  },
  {
    name: "Bánh Xèo Bà Dưỡng",
    category: "restaurant",
    tags: ["Ẩm thực địa phương", "Khám phá", "Gia đình"],
    image:
      "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=400",
  },
  {
    name: "Hải Sản Bé Mặn",
    category: "restaurant",
    tags: ["Hải sản", "Biển", "Sôi động"],
    image:
      "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?q=80&w=400",
  },
  {
    name: "Pizza 4P's Hoàng Văn Thụ",
    category: "restaurant",
    tags: ["Sang trọng", "Lãng mạn", "Kiến trúc"],
    image:
      "https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=400",
  },
  {
    name: "Cơm Niêu Nhà Đỏ",
    category: "restaurant",
    tags: ["Ẩm thực địa phương", "Gia đình", "Văn hóa"],
    image:
      "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=400",
  },
  {
    name: "Bún Chả Cá Hờn",
    category: "restaurant",
    tags: ["Ẩm thực địa phương", "Bình dân"],
    image:
      "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?q=80&w=400",
  },
  {
    name: "Bê Thui Cầu Mống Mười",
    category: "restaurant",
    tags: ["Ẩm thực địa phương", "Ăn nhậu"],
    image:
      "https://images.unsplash.com/photo-1432139555190-58524dae6a55?q=80&w=400",
  },
  {
    name: "Thùng Phi BBQ (Nướng Thùng)",
    category: "restaurant",
    tags: ["Sôi động", "Bạn bè", "Bình dân"],
    image:
      "https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=400",
  },
  {
    name: "Bún Bò Huế Bà Thương",
    category: "restaurant",
    tags: ["Ẩm thực địa phương", "Bình dân"],
    image:
      "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?q=80&w=400",
  },
  {
    name: "Chè Liên Đà Nẵng",
    category: "restaurant",
    tags: ["Ẩm thực địa phương", "Check-in"],
    image:
      "https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?q=80&w=400",
  },
  {
    name: "Bánh Tráng Cuốn Thịt Heo Mậu",
    category: "restaurant",
    tags: ["Ẩm thực địa phương", "Gia đình"],
    image:
      "https://images.unsplash.com/photo-1606787366850-de6330128bfc?q=80&w=400",
  },
  {
    name: "Nhà hàng ẩm thực Trần",
    category: "restaurant",
    tags: ["Ẩm thực địa phương", "Sang trọng", "Gia đình"],
    image:
      "https://images.unsplash.com/photo-1552566626-52f8b828add9?q=80&w=400",
  },
  {
    name: "Hải Sản Biển Mặn",
    category: "restaurant",
    tags: ["Hải sản", "Biển", "Gia đình"],
    image:
      "https://images.unsplash.com/photo-1574484284002-952d9228b9c8?q=80&w=400",
  },
  {
    name: "Quán Nướng Nhóp Nhép",
    category: "restaurant",
    tags: ["Sôi động", "Giới trẻ", "Bình dân"],
    image:
      "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=400",
  },

  // ==========================================
  // 3. KHÁCH SẠN (15 địa điểm)
  // ==========================================
  {
    name: "Novotel Danang Premier",
    category: "hotel",
    tags: ["Sang trọng", "Check-in", "Gần trung tâm"],
    image:
      "https://images.unsplash.com/photo-1566073171639-4d9c3b80b7b3?q=80&w=400",
  },
  {
    name: "Mường Thanh Luxury Da Nang",
    category: "hotel",
    tags: ["View biển", "Tiện nghi", "Gia đình"],
    image:
      "https://images.unsplash.com/photo-1551882547-ff40c0d5bf8f?q=80&w=400",
  },
  {
    name: "Hilton Da Nang",
    category: "hotel",
    tags: ["Sang trọng", "Kiến trúc", "Gần trung tâm"],
    image:
      "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=400",
  },
  {
    name: "Vinpearl Resort & Spa",
    category: "hotel",
    tags: ["Nghỉ dưỡng", "Hồ bơi", "Sang trọng", "Biển"],
    image:
      "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?q=80&w=400",
  },
  {
    name: "Furama Resort Danang",
    category: "hotel",
    tags: ["Nghỉ dưỡng", "Biển", "Thiên nhiên", "Văn hóa"],
    image:
      "https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=400",
  },
  {
    name: "Naman Retreat",
    category: "hotel",
    tags: ["Nghỉ dưỡng", "Kiến trúc", "Thiên nhiên", "Lãng mạn"],
    image:
      "https://images.unsplash.com/photo-1571896349842-33c89424de2d?q=80&w=400",
  },
  {
    name: "Hyatt Regency Danang",
    category: "hotel",
    tags: ["Nghỉ dưỡng", "Biển", "Gia đình", "Tiện nghi"],
    image:
      "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?q=80&w=400",
  },
  {
    name: "Pullman Danang Beach Resort",
    category: "hotel",
    tags: ["Biển", "Hồ bơi", "Thư giãn"],
    image:
      "https://images.unsplash.com/photo-1455587734955-081b22074882?q=80&w=400",
  },
  {
    name: "InterContinental Sun Peninsula",
    category: "hotel",
    tags: ["Sang trọng", "Thiên nhiên", "Khám phá", "Kiến trúc"],
    image:
      "https://images.unsplash.com/photo-1549294413-26f195afcbce?q=80&w=400",
  },
  {
    name: "Danang Golden Bay",
    category: "hotel",
    tags: ["Hồ bơi", "Check-in", "View biển"],
    image:
      "https://images.unsplash.com/photo-1618773928121-c32242e63f39?q=80&w=400",
  },
  {
    name: "A La Carte Danang Beach",
    category: "hotel",
    tags: ["View biển", "Hồ bơi", "Giới trẻ"],
    image:
      "https://images.unsplash.com/photo-1590490360182-c33d57733427?q=80&w=400",
  },
  {
    name: "Sala Danang Beach Hotel",
    category: "hotel",
    tags: ["View biển", "Lãng mạn", "Tiện nghi"],
    image:
      "https://images.unsplash.com/photo-1566665797739-1674de7a421a?q=80&w=400",
  },
  {
    name: "Rosamia Da Nang Hotel",
    category: "hotel",
    tags: ["Biển", "Gia đình", "Tiện nghi"],
    image:
      "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?q=80&w=400",
  },
  {
    name: "Grand Mercure Danang",
    category: "hotel",
    tags: ["Thư giãn", "Gia đình", "Gần trung tâm"],
    image:
      "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?q=80&w=400",
  },
  {
    name: "Stella Maris Beach Danang",
    category: "hotel",
    tags: ["Biển", "Thư giãn", "Gần trung tâm"],
    image:
      "https://images.unsplash.com/photo-1445019980597-93fa8acb246c?q=80&w=400",
  },

  // ==========================================
  // 4. DI TÍCH & THẮNG CẢNH (15 địa điểm)
  // ==========================================
  {
    name: "Bà Nà Hills",
    category: "attraction",
    tags: ["Kiến trúc", "Check-in", "Thiên nhiên"],
    image:
      "https://images.unsplash.com/photo-1596422846543-75c6fc198f07?q=80&w=400",
  },
  {
    name: "Chùa Linh Ứng Sơn Trà",
    category: "attraction",
    tags: ["Tâm linh", "Thiên nhiên", "Văn hóa"],
    image:
      "https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=400",
  },
  {
    name: "Danh thắng Ngũ Hành Sơn",
    category: "attraction",
    tags: ["Khám phá", "Tâm linh", "Thiên nhiên", "Lịch sử"],
    image:
      "https://images.unsplash.com/photo-1605538032432-a9f0c8d9baac?q=80&w=400",
  },
  {
    name: "Bảo tàng Điêu khắc Chăm",
    category: "attraction",
    tags: ["Lịch sử", "Văn hóa", "Kiến trúc"],
    image:
      "https://images.unsplash.com/photo-1580537659466-0a9bfa746d3c?q=80&w=400",
  },
  {
    name: "Đèo Hải Vân",
    category: "attraction",
    tags: ["Khám phá", "Thiên nhiên", "Check-in"],
    image:
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=400",
  },
  {
    name: "Bán đảo Sơn Trà",
    category: "attraction",
    tags: ["Thiên nhiên", "Khám phá", "Thư giãn"],
    image:
      "https://images.unsplash.com/photo-1501854140801-50d01698950b?q=80&w=400",
  },
  {
    name: "Cầu Tình Yêu Đà Nẵng",
    category: "attraction",
    tags: ["Lãng mạn", "Check-in"],
    image:
      "https://images.unsplash.com/photo-1518199266791-5375a83190b7?q=80&w=400",
  },
  {
    name: "Bãi biển Mỹ Khê",
    category: "attraction",
    tags: ["Biển", "Thư giãn", "Check-in"],
    image:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=400",
  },
  {
    name: "Rạn Nam Ô",
    category: "attraction",
    tags: ["Khám phá", "Thiên nhiên", "Ẩm thực địa phương"],
    image:
      "https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?q=80&w=400",
  },
  {
    name: "Đỉnh Bàn Cờ",
    category: "attraction",
    tags: ["Khám phá", "Thiên nhiên", "Tâm linh"],
    image:
      "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?q=80&w=400",
  },
  {
    name: "Nhà Vọng Cảnh Sơn Trà",
    category: "attraction",
    tags: ["Thiên nhiên", "Thư giãn"],
    image:
      "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=400",
  },
  {
    name: "Hải đăng Tiên Sa",
    category: "attraction",
    tags: ["Check-in", "Khám phá"],
    image:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=400",
  },
  {
    name: "Bảo tàng Đà Nẵng",
    category: "attraction",
    tags: ["Lịch sử", "Văn hóa"],
    image:
      "https://images.unsplash.com/photo-1545987796-200677ee1011?q=80&w=400",
  },
  {
    name: "Làng đá Non Nước",
    category: "attraction",
    tags: ["Văn hóa", "Lịch sử"],
    image:
      "https://images.unsplash.com/photo-1605538032432-a9f0c8d9baac?q=80&w=400",
  },
  {
    name: "Suối Tiên Sơn Trà",
    category: "attraction",
    tags: ["Thiên nhiên", "Thư giãn", "Khám phá"],
    image:
      "https://images.unsplash.com/photo-1472214222541-d510753a8707?q=80&w=400",
  },

  // ==========================================
  // 5. KHU GIẢI TRÍ (15 địa điểm)
  // ==========================================
  {
    name: "Công viên Châu Á (Asia Park)",
    category: "entertainment",
    tags: ["Sôi động", "Gia đình", "Check-in"],
    image:
      "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=400",
  },
  {
    name: "Chợ Đêm Helio",
    category: "entertainment",
    tags: ["Chợ đêm", "Sôi động", "Ẩm thực địa phương"],
    image:
      "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=400",
  },
  {
    name: "Cầu Rồng Phun Lửa",
    category: "entertainment",
    tags: ["Check-in", "Sôi động", "Văn hóa"],
    image:
      "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?q=80&w=400",
  },
  {
    name: "Công viên Suối khoáng nóng Núi Thần Tài",
    category: "entertainment",
    tags: ["Thư giãn", "Gia đình", "Thiên nhiên"],
    image:
      "https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=400",
  },
  {
    name: "Phố đi bộ Bạch Đằng",
    category: "entertainment",
    tags: ["Sôi động", "Giới trẻ", "Chợ đêm"],
    image:
      "https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?q=80&w=400",
  },
  {
    name: "Chợ Cồn (Thiên đường ăn vặt)",
    category: "entertainment",
    tags: ["Ẩm thực địa phương", "Văn hóa", "Mua sắm"],
    image:
      "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=400",
  },
  {
    name: "Chợ Hàn (Mua sắm đặc sản)",
    category: "entertainment",
    tags: ["Mua sắm", "Văn hóa", "Ẩm thực địa phương"],
    image:
      "https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=400",
  },
  {
    name: "Công viên nước Mikazuki",
    category: "entertainment",
    tags: ["Gia đình", "Sôi động", "Kiến trúc"],
    image:
      "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?q=80&w=400",
  },
  {
    name: "Sky36 Bar (Novotel Roof)",
    category: "entertainment",
    tags: ["Sôi động", "Giới trẻ", "Check-in"],
    image:
      "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=400",
  },
  {
    name: "Vũ trường New Phương Đông",
    category: "entertainment",
    tags: ["Sôi động", "Giới trẻ"],
    image:
      "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=400",
  },
  {
    name: "Oq Lounge Pub Dnang",
    category: "entertainment",
    tags: ["Sôi động", "Giới trẻ"],
    image:
      "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=400",
  },
  {
    name: "Sân Golf BRG Da Nang",
    category: "entertainment",
    tags: ["Sang trọng", "Thư giãn"],
    image:
      "https://images.unsplash.com/photo-1587174486073-ae5e5cff23aa?q=80&w=400",
  },
  {
    name: "Helio Kids Center",
    category: "entertainment",
    tags: ["Gia đình", "Giải trí"],
    image:
      "https://images.unsplash.com/photo-1564982009-8af779f53549?q=80&w=400",
  },
  {
    name: "Câu lạc bộ Thuyền buồm Sông Hàn",
    category: "entertainment",
    tags: ["Khám phá", "Sôi động", "Check-in"],
    image:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=400",
  },
  {
    name: "Khu lướt sóng Surf School Mỹ Khê",
    category: "entertainment",
    tags: ["Biển", "Khám phá", "Giới trẻ"],
    image:
      "https://images.unsplash.com/photo-1502680390469-be75c86b636f?q=80&w=400",
  },
];

async function seedDatabase() {
  try {
    console.log("⏳ Đang kết nối MongoDB...");
    await mongoose.connect(process.env.DATABASE_URL);
    console.log("✅ Kết nối Database thành công!");

    console.log("🧹 Đang dọn dẹp dữ liệu cũ trong bảng places...");
    await Place.deleteMany({});

    const placesToInsert = [];

    console.log("🧩 Đang chuẩn bị cấu trúc dữ liệu chuẩn hóa...");
    detailedPlaces.forEach((item, index) => {
      const address =
        [
          "Bạch Đằng",
          "Trần Phú",
          "Lê Duẩn",
          "Nguyễn Văn Linh",
          "Võ Nguyên Giáp",
          "Phạm Văn Đồng",
        ][index % 6] + ", Hải Châu, Đà Nẵng";

      // Random Giá giả lập
      const minPrice = (Math.floor(Math.random() * 8) + 2) * 10000;
      const maxPrice = minPrice + (Math.floor(Math.random() * 30) + 5) * 10000;

      const baseSlug = slugify(item.name, {
        lower: true,
        strict: true,
        locale: "vi",
      });
      const finalSlug = `${baseSlug}-${Date.now().toString().slice(-4)}-${index}`;

      // Tạo Vector giả lập 384 chiều (mô phỏng AI Local)
      const mockVector = Array.from(
        { length: 384 },
        () => Math.random() * 2 - 1,
      );

      // Gán tọa độ phân tán nhẹ quanh trung tâm Đà Nẵng
      const randomLat = (16.04 + index * 0.0008).toFixed(5);
      const randomLng = (108.21 + index * 0.0005).toFixed(5);

      placesToInsert.push({
        name: item.name,
        slug: finalSlug,
        category: item.category,
        location: {
          type: "Point",
          coordinates: [parseFloat(randomLng), parseFloat(randomLat)],
          address: address,
        },
        images: [{ url: item.image, isMain: true }],
        tags: item.tags, // Sử dụng cụm tag xịn được định nghĩa riêng
        description: `Chào mừng bạn đến với ${item.name}. Đây là một ${item.category === "cafe" ? "quán cà phê" : item.category} vô cùng nổi tiếng tại Đà Nẵng, sở hữu các đặc trưng: ${item.tags.join(", ")}.`,
        metrics: {
          price: minPrice,
          priceLevel: Math.floor(Math.random() * 3) + 1,
        },
        syncMeta: {
          source: "manual",
          status: "success",
          lastSyncedAt: new Date(),
        },
        embedding: mockVector,
      });
    });

    console.log(
      `🚀 Đang bơm ${placesToInsert.length} địa điểm mang bộ mã định danh AI đặc thù vào Database...`,
    );
    await Place.insertMany(placesToInsert);

    console.log(
      `🎉 HOÀN THÀNH RỰC RỠ! Toàn bộ 5 danh mục x 15 địa điểm đã được cấu trúc lại hoàn hảo.`,
    );
    process.exit(0);
  } catch (error) {
    console.error("❌ Thất bại khi nạp dữ liệu:", error);
    process.exit(1);
  }
}

seedDatabase();
