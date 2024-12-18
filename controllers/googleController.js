const express = require('express');
const router = express.Router();
const axios = require('axios');
require('dotenv').config(); // 讀取環境變數

// 從環境變數中讀取 Google Maps API Key
const GOOGLE_MAPS_KEY = process.env.GOOGLE_MAPS_KEY;

// 定義搜尋附近地點的 API
router.get('/food', async (req, res) => {
  const { lat, lng, radius, type } = req.query;

  try {
    // 調用 Google Places API
    const response = await axios.get('https://maps.googleapis.com/maps/api/place/nearbysearch/json', {
      params: {
        location: `${lat},${lng}`, // 經緯度
        radius: radius || 1000,    // 搜尋範圍 (公尺)
        type: type || 'restaurant', // 地點類型，預設為餐廳
        key: GOOGLE_MAPS_KEY,
      },
    });

    // 返回結果給前端
    res.json(response.data);
  } catch (error) {
    console.error('Google Places API Error:', error.message);
    res.status(500).json({ error: 'Failed to fetch nearby places' });
  }
});