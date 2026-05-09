const axios = require("axios");

exports.getAiSuggestion = async (req, res) => {
  try {
    const payload = req.body;

    const startDateStr = payload.dates?.start || new Date().toISOString();
    const endDateStr =
      payload.dates?.end ||
      new Date(Date.now() + (payload.days || 3) * 86400000).toISOString();

    // LẤY TRỰC TIẾP SỐ TIỀN TỪ FRONTEND (Không cần if/else nữa)
    const exactBudget = payload.budget || 5000000;

    const pythonPayload = {
      days: payload.days || 1,
      budget: exactBudget, // Truyền thẳng con số sang cho Python
      interests: payload.interests || [],
      destination: "Đà Nẵng",
      start_date: startDateStr,
      end_date: endDateStr,
      travel_style: payload.companions === "Gia đình" ? "family" : "comfort",
      user_id: "guest",
      min_rating: 3.0,
      travel_pace: "moderate",
    };

    console.log("🚀 Đang gửi request chuẩn sang AI Python:", pythonPayload);

    const pythonResponse = await axios.post(
      "http://127.0.0.1:8000/api/python/generate-itinerary",
      pythonPayload,
      { timeout: 15000 },
    );

    if (pythonResponse.data && pythonResponse.data.success) {
      const rawDays = pythonResponse.data.data; // Mảng lồng nhau từ Python
      const flatItinerary = []; // Mảng phẳng cho React

      // Vòng lặp bóc tách dữ liệu lồng nhau
      rawDays.forEach((day) => {
        if (day.items && Array.isArray(day.items)) {
          day.items.forEach((place) => {
            flatItinerary.push({
              id: place.place_id || Math.random().toString(), // Khớp với key={item.id}
              dayNumber: day.dayNumber, // Khớp với item.dayNumber
              dayLabel: day.dayLabel, // Khớp với item.dayLabel
              time: place.time, // Khớp với item.time
              title: place.title, // Khớp với item.title
              description: place.description, // Khớp với item.description
              image:
                place.image ||
                "https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?q=80&w=500",
              tags: place.tags || [], // Khớp với item.tags.map()
            });
          });
        }
      });

      return res.status(200).json({
        success: true,
        message: "AI đã thiết kế lịch trình thành công",
        data: flatItinerary, // Trả về mảng phẳng đã được bóc vỏ
      });
    } else {
      return res.status(400).json({
        success: false,
        message:
          pythonResponse.data.message || "AI Python từ chối tạo lịch trình.",
      });
    }
  } catch (error) {
    console.error("❌ Lỗi khi gọi AI Python:", error.message);

    if (error.response && error.response.status === 422) {
      console.error(
        "Lỗi 422 chi tiết từ Python:",
        JSON.stringify(error.response.data.detail, null, 2),
      );
    }

    let errorMsg = "Server AI đang bận hoặc gặp lỗi tính toán.";
    if (error.code === "ECONNREFUSED") {
      errorMsg = "Server AI (Python) đang tắt. Vui lòng bật lại Uvicorn.";
    }

    return res.status(500).json({
      success: false,
      message: errorMsg,
      error: error.message,
    });
  }
};
