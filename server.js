// server.js
const express = require('express');
const path = require('path');

const app = express();

// 設置靜態文件夾
const DIST_DIR = path.join(__dirname, 'dist/angular_capacitor_2/browser');
app.use(express.static(DIST_DIR));

// 處理所有路由，返回 Angular 應用的 index.html 文件
app.get('*', (req, res) => {
  res.sendFile(path.join(DIST_DIR, 'index.html'));
});

// 監聽特定端口
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
