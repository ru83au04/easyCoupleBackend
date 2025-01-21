const db = require('../config/postpreDatabase');
const path = require('path');
const fs = require('fs');
const csv = require('csv-parser');
require('dotenv').config();  // 載入 .env 檔案中的環境變數


// NOTE: 確認DB中表格狀態，視情況從CSV將檔案存入或更新至DB
async function initDatabaseWithCsv() {
    // NOTE: 建立表格指令語法  
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
    // NOTE: 插入資料指令語法
    const insertQuery = `
    INSERT INTO trash_collection_points (
        area, route_id, route_order, village, point_name, time, longitude, latitude, word_day, recycle_day
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
    ON CONFLICT (area, route_id, route_order) DO NOTHING;
    `;

    const fileUrl = path.join(__dirname, '../public/assets/TrashRoutes.csv');

    try {
        await db.query(createTableQuery);
        const rows = [];
        // NOTE: 讀取CSV檔案並存入資料庫    
        fs.createReadStream(fileUrl)
        .pipe(csv())
        .on('data', (row) => {
            rows.push([
                row.AREA,
                row.ROUTEID,
                parseInt(row.ROUTEORDER, 10),
                row.VILLAGE,
                row.POINTNAME,
                row.TIME,
                parseFloat(row.LONGITUDE),
                parseFloat(row.LATITUDE),
                row.WORDDAY,
                row.RECYCLEDAY,
            ]);
        })
        .on('end', async () => {
            for (const row of rows) {
                await db.query(insertQuery, row);
            }
            console.log('資料匯入成功');
        });
    } catch (error) {
        console.error('匯入資料失敗:', error);
    }
}
// NOTE: 取得 AREA值
async function getAreaList() {
    const query = `SELECT DISTINCT area FROM trash_collection_points`;
    try {
        const result = await db.query(query);
        return result.rows; // 返回區域資料
    } catch (err) {
        console.error('取得不重複區域失敗:', err.message);
        throw new Error('資料庫查詢失敗'); // 拋出更有描述性的錯誤
    }
}
// NOTE: 使用 AREA值搜尋資料庫
async function searchByArea(area) {
    const query = `SELECT * FROM trash_collection_points WHERE area = $1`
    try {
        const result = await db.query(query, [area]);
        return result.rows; // NOTE: 一個 row為一個JSON物件，會回傳 row[]陣列
    } catch (err) {
        console.error('取得區域資料失敗:', err.message);
        throw new Error('資料庫查詢失敗'); // 拋出更有描述性的錯誤
    }
}
// NOTE: 使用 AREA、TIME值搜尋資料庫
async function searchByAreaAndTime(area, time) {
    let currentDate = new Date();
    let tempTime = new Date(currentDate.setHours(time.split(":")[0], time.split(":")[1], 0, 0));
    let temp1 = new Date(tempTime);
    let t1 = `${temp1.getHours()}:${temp1.getMinutes() - 15}`;
    let t2 = `${temp1.getHours()}:${temp1.getMinutes() + 15}`;
    const query = `SELECT * FROM trash_collection_points WHERE area = $1 AND CAST(time AS time) BETWEEN $2 AND $3`
    try {
        const result = await db.query(query, [area, t1, t2]);
        return result.rows; // NOTE: 一個 row為一個JSON物件，會回傳 row[]陣列
    } catch (err) {
        console.error('取得區域資料失敗:', err.message);
        throw new Error('資料庫查詢失敗'); // 拋出更有描述性的錯誤
    }
}

module.exports = {
    initDatabaseWithCsv,
    getAreaList,
    searchByArea,
    searchByAreaAndTime,
}
