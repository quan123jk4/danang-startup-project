const axios = require("axios");
const slugify = require("slugify");
const { Place } = require("../Models/Place");
const { pipeline } = require("@xenova/transformers");

// Chỉ cần dùng đúng Key Gemini của Google!
let featureExtractor = null;

// --------------------------------------------------------
// 1. CÀO OPENSTREETMAP (Mã nguồn mở, MIỄN PHÍ 100%)
// --------------------------------------------------------
async function fetchPlacesFromSource() {
  const url = "https://overpass-api.de/api/interpreter";

  // Tìm 15 quán trong bán kính 5000m (5km) từ trung tâm Đà Nẵng (16.0544, 108.2022)
  const overpassQuery = `
    [out:json][timeout:25];
    (
      node["amenity"~"cafe|restaurant"](around:5000,16.0544,108.2022);
      node["tourism"~"hotel|museum|attraction|viewpoint"](around:5000,16.0544,108.2022);
      node["leisure"~"park|water_park"](around:5000,16.0544,108.2022);
    );
    out center 70; 
`;

  try {
    const response = await axios.post(
      url,
      `data=${encodeURIComponent(overpassQuery)}`,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Accept: "application/json",
          "User-Agent": "Danasoul-Bot/1.0",
        },
      },
    );

    // Trích xuất data
    return response.data.elements
      .filter((el) => el.tags && el.tags.name)
      .map((el) => {
        // Phân loại danh mục tự động dựa trên tag của OpenStreetMap
        let mapCategory = "other";
        if (el.tags.amenity === "cafe") mapCategory = "cafe";
        else if (el.tags.amenity === "restaurant") mapCategory = "restaurant";
        else if (el.tags.tourism === "hotel") mapCategory = "hotel";
        else if (
          el.tags.tourism === "museum" ||
          el.tags.tourism === "attraction" ||
          el.tags.tourism === "viewpoint"
        )
          mapCategory = "attraction";
        else if (el.tags.leisure === "park" || el.tags.leisure === "water_park")
          mapCategory = "entertainment";

        return {
          sourceId: el.id.toString(),
          name: el.tags.name,
          category: mapCategory,
          address: el.tags["addr:street"]
            ? `${el.tags["addr:street"]}, Đà Nẵng`
            : "Đà Nẵng",
          lat: el.lat,
          lng: el.lon,
        };
      });
  } catch (error) {
    console.error("Lỗi cào dữ liệu OpenStreetMap:", error.message);
    return [];
  }
}

// --------------------------------------------------------
// 2. GỌI GEMINI AI TẠO VECTOR (Giữ nguyên, phần này ông setup chuẩn rồi)
// --------------------------------------------------------
async function generateEmbedding(text) {
  try {
    // Nếu model chưa tải, tiến hành tải về ổ cứng (Khoảng 80MB, chỉ tải đúng 1 lần đầu)
    if (!featureExtractor) {
      console.log("⏳ Đang khởi động AI Local (all-MiniLM-L6-v2)...");
      featureExtractor = await pipeline(
        "feature-extraction",
        "Xenova/all-MiniLM-L6-v2",
      );
    }

    // Đưa text vào model để sinh ra Vector
    const output = await featureExtractor(text, {
      pooling: "mean",
      normalize: true,
    });

    // Chuyển đổi định dạng Float32Array của AI thành mảng JavaScript thông thường
    return Array.from(output.data);
  } catch (error) {
    console.error("❌ Lỗi AI Local:", error);
    throw error;
  }
}

// --------------------------------------------------------
// 3. HÀM CHÍNH: XỬ LÝ VÀ ĐỒNG BỘ VÀO DATABASE
// --------------------------------------------------------
async function syncPlacesData() {
  console.log("🚀 Bắt đầu chạy Bot cào dữ liệu (OpenStreetMap + Gemini)...");

  const scrapedPlaces = await fetchPlacesFromSource();
  if (scrapedPlaces.length === 0) {
    console.log("❌ Không lấy được dữ liệu. Kiểm tra lại mạng.");
    return;
  }

  let newCount = 0;
  let updateCount = 0;

  for (const data of scrapedPlaces) {
    const existingPlace = await Place.findOne({
      "syncMeta.sourceId": data.sourceId,
    });

    if (existingPlace) {
      existingPlace.syncMeta.lastSyncedAt = new Date();
      await existingPlace.save();
      updateCount++;
      console.log(`🔄 Cập nhật thành công: ${data.name}`);
    } else {
      const baseSlug = slugify(data.name, {
        lower: true,
        strict: true,
        locale: "vi",
      });
      const finalSlug = `${baseSlug}-${Date.now().toString().slice(-4)}`;

      // Gọi AI tạo Vector ngay lúc Insert
      const textForAI = `Tên: ${data.name}. Địa chỉ: ${data.address}. Danh mục: ${data.category}`;
      const embeddingVector = await generateEmbedding(textForAI);

      const newPlace = new Place({
        name: data.name,
        slug: finalSlug,
        category: data.category,
        location: {
          type: "Point",
          coordinates: [data.lng, data.lat], // MongoDB GeoJSON: [Kinh độ, Vĩ độ]
          address: data.address,
        },
        images: [], // OpenStreetMap ít ảnh, tạm rỗng
        metrics: { priceLevel: Math.floor(Math.random() * 3) + 1 }, // Tạo giá ngẫu nhiên 1-3 cho AI phân tích
        syncMeta: {
          source: "crawler",
          sourceId: data.sourceId,
          status: "success",
          lastSyncedAt: new Date(),
        },
        embedding: embeddingVector,
      });

      await newPlace.save();
      newCount++;
      console.log(`✅ Thêm mới thành công: ${data.name} (+ Gắn Vector AI)`);
    }
  }

  console.log(
    `🎉 Chạy Bot hoàn tất! Thêm mới: ${newCount} | Cập nhật: ${updateCount}`,
  );
}

module.exports = { syncPlacesData };
