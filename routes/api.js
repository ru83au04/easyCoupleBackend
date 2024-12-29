const express = require('express');
const router = express.Router();
const weatherController = require('../controllers/weatherController');
const mapController = require('../controllers/mapController');

router.get('/weather/local', weatherController.getWeather);

router.get('/google/food', mapController.findFood);
router.get('/google/areaList', mapController.getAreaList);
router.get('/google/searchByArea', mapController.searchByArea);
router.get('/google/searchByAreaAndTime', mapController.searchByAreaAndTime);

module.exports = router;