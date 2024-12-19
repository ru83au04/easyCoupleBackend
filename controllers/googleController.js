const axios = require('axios');

// 從環境變數中讀取 Google Maps API Key
const GOOGLE_MAPS_KEY = process.env.GOOGLE_MAP_KEY;

// 定義搜尋附近地點的 API
const findFood = async (req, res) => {
  const { lat, lon, radius, type } = req.query;
  console.log("req.query", req);
  console.log("req.query inner", lat, lon, radius, type);
  const url = `https://places.googleapis.com/v1/places:searchNearby?=${GOOGLE_MAPS_KEY}`;

  try {
    // 調用 Google Places API
    const response = await axios.post(url, {
        location: {
            lat: parseFloat(lat), // 緯度
            lng: parseFloat(lon), // 經度
          },
          radius: parseInt(radius) || 1000, // 搜尋半徑 (公尺)
          types: [type || 'restaurant'], // 地點類型，預設為餐廳
        });

        res.status(200).json(response.data.places || []);
  } catch (error) {
        console.error('Google Places API Error:', error.message);
        res.status(500).json({ error: 'Failed to fetch places data' });
    }
};

module.exports = {
    findFood,
}