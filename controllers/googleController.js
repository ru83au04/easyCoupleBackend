const axios = require('axios');

// 從環境變數中讀取 Google Maps API Key
const GOOGLE_MAPS_KEY = process.env.GOOGLE_MAP_KEY;

// 定義搜尋附近地點的 API
const findFood = async (req, res) => {
  const { lat, lon, radius } = req.query;

  const url = `https://places.googleapis.com/v1/places:searchNearby`;

  try {
    // 調用 Google Places API
    const response = await axios.post(url,{
        includedPrimaryTypes: ["restaurant", "cafe", "bar"],
        // maxResultCount: 30,            // 返回最大數量
        locationRestriction: {         // 限制範圍
            circle: {
            center: {
                latitude: parseFloat(lat),
                longitude: parseFloat(lon),
            },
            radius: parseFloat(radius),
            },
        },
        },
        {
        headers: {
            'Content-Type': 'application/json',
            'X-Goog-Api-Key': GOOGLE_MAPS_KEY,
            'X-Goog-FieldMask': 'places.displayName,places.location', // 限制返回的字段
        },
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