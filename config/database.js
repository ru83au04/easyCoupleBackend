const mysql = require('pg');
require('dotenv').config();  // 載入 .env 檔案中的環境變數

// 創建資料庫連接
const db = mysql.createConnection({
  host: process.env.DATABASE_HOST,  // 資料庫主機
  user: process.env.DATABASE_USER,  // 資料庫用戶名
  password: process.env.DATABASE_PASSWORD,  // 資料庫密碼
  database: process.env.DATABASE_NAME,  // 資料庫名稱
  port: process.env.DATABASE_PORT,  // 資料庫端口，默認是 3306
});

// 連接資料庫
db.connect((err) => {
  if (err) {
    console.error('無法連接到資料庫:', err.stack);
    return;
  }
  console.log('已成功連接到資料庫');
});

module.exports = db;
