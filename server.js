require('dotenv').config();
const express = require('express');
const api = require('./routes/api');
const path = require('path');
const fs = require('fs');
const https = require('https');
const cors = require('cors');
const user = require('./models/userModel');
const trashCar = require('./models/trashcarModel');

const app = express();

if (process.env.NODE_ENV === 'dev') {
  app.use(cors({
    origin: 'http://localhost:4200',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  }));
}

const DIST_DIR = path.join(__dirname, 'public/front_end/browser'); // 設定靜態資料位置
app.use(express.static(DIST_DIR)); // 前端取得靜態資料的位置
app.use(express.json()); // 中介層處理 json格式資料
app.use('/api', api); // 前端發送 API路由
app.get('*', (req, res) => { // 處理所有路由，返回 Angular 應用的 index.html 文件
  res.sendFile(path.join(DIST_DIR, 'index.html'));
});

if (process.env.NODE_ENV === 'dev') {
  startDevServer();
} else {
  startServer();
}

// NOTE: 部屬Render上的啟動 
async function startServer(){
  try{
    // TODO: Render 測試用
    const PORT = process.env.PORT || 3000; // 默認為 3000，但 Render 會提供 PORT 環境變數
    app.listen(PORT, async () => {
      try {
        await trashCar.initDatabaseWithCsv();
        await user.initTable("dev_users");
      } catch (err) {
        console.error('資料庫初始化失敗', err);
      }
      console.log(`開發伺服器已經在 ${PORT} port運行`);
    });
  }catch (err){
    console.error('伺服器啟動失敗', err);
  }
}

// HACK: 開發本地測試
async function startDevServer() {
  const httpsOptions = {
    key: fs.readFileSync(path.join(__dirname, 'ssl/server.key')),
    cert: fs.readFileSync(path.join(__dirname,'ssl/server.crt'))
  }

  const PORT = process.env.PORT || 3000;
  https.createServer(httpsOptions, app).listen(PORT, async () => {
    try {
      await trashCar.initDatabaseWithCsv();
      await user.initTable("dev_users");
    } catch (err) {
      console.error('資料庫初始化失敗', err);
    }
    console.log(`開發伺服器已經在 ${PORT} port運行`);
  });
}

