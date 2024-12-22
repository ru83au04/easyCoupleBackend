const { Pool } = require('pg');  // 使用 PostgreSQL 的客戶端
require('dotenv').config();  // 載入 .env 檔案中的環境變數
const axios = require('axios');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

async function initDatabase() {
  try {
    // 1. 檢查並建立表格
    await createTable();

    // 2. 從 API 獲取資料
    const records = await fetchRecordsFromAPI();

    // 3. 插入資料到資料庫
    await insertRecords(records);

    console.log('資料庫初始化完成');
  } catch (error) {
    console.error('初始化資料庫失敗:', error);
  }
}

async function createTable(){
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
    console.log('表格已確認存在或成功建立');
  } catch (error) {
    console.error('建立表格失敗:', error);
    throw error; // 將錯誤拋出以便上層捕獲
  }
}

async function fetchRecordsFromAPI() {
  const url = 'https://data.tainan.gov.tw/api/3/action/datastore_search_sql?sql=SELECT * FROM "ae3a8531-2ee2-48fb-bb97-05e34d39a7ab"';
  try {
    const res = await axios.get(url);
    console.log('從 API 獲取資料成功');
    return res.data.result.records;
  } catch (error) {
    console.error('從 API 獲取資料失敗:', error);
    throw error; // 將錯誤拋出以便上層捕獲
  }
}

async function insertRecords(records) {
  const query = `
    INSERT INTO trash_collection_points (area, route_id, route_order, village, point_name, time, longitude, latitude, word_day, recycle_day)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
    ON CONFLICT (area, route_id, route_order) DO NOTHING;
  `;

  try {
    for (const record of records) {
      const values = [
        record.AREA,
        record.ROUTEID,
        parseInt(record.ROUTEORDER, 10),
        record.VILLAGE,
        record.POINTNAME,
        record.TIME,
        parseFloat(record.LONGITUDE),
        parseFloat(record.LATITUDE),
        record.WORDDAY,
        record.RECYCLEDAY,
      ];

      await pool.query(query, values);
    }
    console.log('資料插入完成');
  } catch (error) {
    console.error('插入資料失敗:', error);
    throw error; // 將錯誤拋出以便上層捕獲
  }
}

async function getData(param){
  let paramQuery = `SELECT * FROM trash_collection_points WHERE area = ($1)`;
  let result = await pool.query(paramQuery, [param]);
  console.log("result", result.rows);
  return result.rows;
}

module.exports = { pool, initDatabase, getData}
