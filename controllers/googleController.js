const axios = require('axios');

// 從環境變數中讀取 Google Maps API Key
const GOOGLE_MAPS_KEY = process.env.GOOGLE_MAP_KEY;

// 定義搜尋附近地點的 API
const findFood = async (req, res) => {
  const { lat, lng, radius, type } = req.query;

  try {
    // 調用 Google Places API
    const response = await axios.get('https://places.googleapis.com/v1/places:searchNearby', {
      params: {
        location: `${lat},${lng}`, // 經緯度
        radius: radius || 1000,    // 搜尋範圍 (公尺)
        type: type || 'restaurant', // 地點類型，預設為餐廳
        key: GOOGLE_MAPS_KEY,
      },
    });

    console.log("response", response);

    // 返回結果給前端
    res.json(response.data);
  } catch (error) {
    console.error('Google Places API Error:', error.message);
    res.status(500).json({ error: 'Failed to fetch nearby places' });
  }
};

module.exports = {
    findFood,
}