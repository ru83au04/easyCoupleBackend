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

async function initDatabase(){
  const createTableQuery = `
  CREATE TABLE IF NOT EXISTS trash_collection_points (
      id SERIAL PRIMARY KEY,
      area TEXT NOT NULL,
      route_id TEXT NOT NULL,
      route_order INT NOT NULL,
      village TEXT NOT NULL,
      point_name TEXT NOT NULL,
      time TEXT NOT NULL,
      longitude NUMERIC NOT NULL,
      latitude NUMERIC NOT NULL,
      word_day TEXT NOT NULL,
      recycle_day TEXT NOT NULL,
      CONSTRAINT unique_point UNIQUE (area, route_id, route_order)
  );
`;
  try {
    await pool.query(createTableQuery);
    console.log("表格已確認存在或成功建立");
  } catch (error) {
    console.error("建立表格失敗:", error);
  }

  let records;
  let url = 'https://data.tainan.gov.tw/api/3/action/datastore_search_sql?sql=SELECT * FROM "ae3a8531-2ee2-48fb-bb97-05e34d39a7ab"';
  try{
    const res = await axios.get(url);
    records = res.data.result.records;
  }catch(err){
    console.log("error", err);
  }

  for(const record of records){
    const query = `
        INSERT INTO trash_collection_points (area, route_id, route_order, village, point_name, time, longitude, latitude, word_day, recycle_day)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        ON CONFLICT (area, route_id, route_order) DO NOTHING;
      `;
      const values = [
        record.AREA,
        record.ROUTEID,
        parseFloat(record.ROUTEORDER),
        record.VILLAGE,
        record.POINTNAME,
        record.TIME,
        parseFloat(record.LONGITUDE),
        parseFloat(record.LATITUDE),
        record.WORDDAY,
        record.RECYCLEDAY,
      ];
      await db.query(query, values);
  }
}

module.exports = {
  db,
  getTainanData,
}
