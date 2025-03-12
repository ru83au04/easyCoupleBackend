const { Pool } = require('pg');  // 使用 PostgreSQL 的客戶端
const path = require('path');
const fs = require('fs');
require('dotenv').config();  // 載入 .env 檔案中的環境變數
const csv = require('csv-parser');
// 使用 API才需要
// const axios = require('axios');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
    idleTimeoutMillis: 60000, // 閒置連線超時 60 秒
    connectionTimeoutMillis: 60000, // 連線超時 60 秒
});

module.exports = {
  query: (text, params) => pool.query(text, params),
};
