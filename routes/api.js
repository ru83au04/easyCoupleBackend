const express = require('express');
const router = express.Router();
const weatherController = require('../controllers/weatherController');
const mapController = require('../controllers/mapController');
const userController = require('../controllers/userController');

router.get('/weather/local', weatherController.getWeather);

router.get('/google/food', mapController.findFood);
router.get('/google/areaList', mapController.getAreaList);
router.get('/google/searchByArea', mapController.searchByArea);
router.get('/google/searchByAreaAndTime', mapController.searchByAreaAndTime);

router.get('/user/register', userController.register);
router.get('/user/login', userController.login);
router.get('/user/delete', userController.deleteUser);
router.get('/user/check', userController.verifyToken, userController.checkData);

module.exports = router;