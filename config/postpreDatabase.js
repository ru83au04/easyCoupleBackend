const { Client } = require('pg');  // 使用 PostgreSQL 的客戶端
require('dotenv').config();  // 載入 .env 檔案中的環境變數

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
