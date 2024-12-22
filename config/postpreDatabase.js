const { Client } = require('pg');  // 使用 PostgreSQL 的客戶端
require('dotenv').config();  // 載入 .env 檔案中的環境變數
const axios = require('axios');

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

const getTainanData = async (req, res) => {
  let url = 'https://data.tainan.gov.tw/api/3/action/datastore_search_sql?sql=SELECT * FROM "ae3a8531-2ee2-48fb-bb97-05e34d39a7ab"';
  try{
    const response = await axios.get(url);
    const data = response.result.records;
    data.map((data) => {
      console.log("data", data.AREA);
    })
  }catch(err){
    console.log("error", err);
  }
}

module.exports = {
  db,
  getTainanData,
}
