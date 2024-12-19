const axios = require('axios');

// 從環境變數中讀取 Google Maps API Key
const GOOGLE_MAPS_KEY = process.env.GOOGLE_MAP_KEY;

// 定義搜尋附近地點的 API
const findFood = async (req, res) => {
  const { lat, lng, radius, type } = req.query;
  const url = `https://places.googleapis.com/v1/places:searchNearby?=${GOOGLE_MAPS_KEY}`;

  try {
    // 調用 Google Places API
    const response = await axios.post(url, {
      params: {
        location: `${lat},${lng}`, // 經緯度
        radius: radius || 1000,    // 搜尋範圍 (公尺)
        type: type || 'restaurant', // 地點類型，預設為餐廳
        key: GOOGLE_MAPS_KEY,
      },
    });

    console.log("response", response.data.results);

    return response.data.results;
  } catch (error) {

        console.error('Google Places API Error:', error.message);
        throw error;
    }
};

module.exports = {
    findFood,
}