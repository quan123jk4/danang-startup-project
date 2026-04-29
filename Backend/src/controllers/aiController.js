const axios = require("axios");

exports.getAiSuggestion = async (req, res) => {
  try {
    const payload = req.body;

    // Gọi sang Server Python đang chạy ngầm ở cổng 8000
    const pythonResponse = await axios.post(
      "http://127.0.0.1:8000/api/python/generate-itinerary",
      payload,
    );

    // Trả kết quả AI về cho Frontend
    if (pythonResponse.data && pythonResponse.data.success) {
      return res.status(200).json({
        success: true,
        message: "AI đã tạo lịch trình thành công",
        data: pythonResponse.data.data,
      });
    } else {
      return res
        .status(400)
        .json({
          success: false,
          message: "AI Python không thể tạo lịch trình.",
        });
    }
  } catch (error) {
    console.error("Lỗi khi gọi AI Python:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server AI đang tắt hoặc quá tải!",
      error: error.message,
    });
  }
};
