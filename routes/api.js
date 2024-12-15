const express = require('express');
const router = express.Router();
const weatherController = require('../controllers/weatherController');
const googleController = require('../controllers/googleController');

router.get('/weather/local', weatherController.getWeather);
router.get('/google/map', googleController.initMap);

module.exports = router;