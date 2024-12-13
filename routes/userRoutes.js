// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// 定義路由
router.get('/users', userController.getUsers);

module.exports = router;
