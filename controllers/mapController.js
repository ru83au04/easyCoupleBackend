const axios = require('axios');
const db = require("../config/postpreDatabase");
const carModel = require("../models/trashcarModel");

// 從環境變數中讀取 Google Maps API Key
const GOOGLE_MAPS_KEY = process.env.GOOGLE_MAP_KEY;

// 使用 Google搜尋地點 API搜尋指定區域附近的餐廳
const findFood = async (req, res) => {

    const { lat, lon, radius } = req.query;

    const url = `https://places.googleapis.com/v1/places:searchNearby`;
    
    try {
        // NOTE: 調用 Google Places API
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
  } catch (err) {
        console.error('Google Places API Error:', err.message);
        res.status(500).json({ error: 'Failed to fetch places data' });
    }
};
// 從 DB中取得垃圾清運地點中的行政區欄位，回傳給前端作為選項列表
const getAreaList = async (req, res) => {
    try{
        let areas = await carModel.getAreaList();
        res.status(200).json(areas || {});
    }catch(err){
        console.error('DB Error:', err.message);
        res.status(500).json({ error: 'Failed to use the DataBase' });
    }
}
// 從 DB中搜尋指定 area中的所有清運地點資訊並回傳給前端建立 mark標註在地圖上
const searchByArea = async (req, res) => {
    const { area } = req.query;
    console.log("req.query", req.query) //NOTE: query會拿到一個JSON物件
    try{
        let result = await carModel.searchByArea(area);
        console.log("db result", result); //NOTE: 取得的是物件陣列
        res.status(200).json(result || []);
    }catch(err){
        console.error('DB Error:', err.message);
        res.status(500).json({ error: 'Failed to use the DataBase' });
    }
}
// 從 DB中搜尋指定 area、time中所有清運地點資訊，並回傳給前端建立 mark標註在地圖上
const searchByAreaAndTime = async (req, res) => {
    const { area, time } = req.query;
    try{
        let result = await carModel.searchByAreaAndTime(area, time);
    res.status(200).json(result || []);
    }catch(err){
        console.error('DB Error:', err.message);
        res.status(500).json({ error: 'Failed to use the DataBase' });
    }
}

module.exports = {
    findFood,
    getAreaList,
    searchByArea,
    searchByAreaAndTime,
}