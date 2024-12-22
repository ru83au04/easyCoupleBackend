const axios = require('axios');
const pool = require('../config/postpreDatabase');

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
        locationRestriction: {
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

const findCarRouteid = async (req, res) => {
    const { position } = req.query
    let result = pool.getData(position);
    res.status(200).json(result || {});
}

module.exports = {
    findFood,
    findCarRouteid,
}