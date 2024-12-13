// config/database.js
const { Client } = require('pg');  // 使用 PostgreSQL 的客戶端
require('dotenv').config();  // 載入 .env 檔案中的環境變數

// 創建 PostgreSQL 資料庫連接
// const db = new Client({
//   host: process.env.DATABASE_HOST,  // 資料庫主機
//   user: process.env.DATABASE_USER,  // 資料庫用戶名
//   password: process.env.DATABASE_PASSWORD,  // 資料庫密碼
//   database: process.env.DATABASE_NAME,  // 資料庫名稱
//   port: process.env.DATABASE_PORT || 5432,  // PostgreSQL 默認端口是 5432
// });
const db = new Client({
    connectionString: process.env.DATABASE_URL,
})

// 連接資料庫
db.connect((err) => {
  if (err) {
    console.error('無法連接到資料庫:', err.stack);
    return;
  }
  console.log('已成功連接到 PostgreSQL 資料庫');
});

module.exports = db;
