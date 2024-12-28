const express = require('express');
const router = express.Router();
const weatherController = require('../controllers/weatherController');
const googleController = require('../controllers/googleController');

router.get('/weather/local', weatherController.getWeather);
router.get('/google/food', googleController.findFood);
// router.get('/google/carRouteid', googleController.findCarRouteid);
router.get('/google/areaList', googleController.getAreaList);
router.get('/google/searchByArea', googleController.searchByArea);
router.get('/google/searchByAreaAndTime', googleController.searchByAreaAndTime);

module.exports = router;