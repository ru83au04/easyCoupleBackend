require('dotenv').config();
const express = require('express');
const api = require('./routes/api');
const path = require('path');
const lineRoutes = require('./routes/line'); // line的路由
// 測試用
const db = require('./config/postpreDatabase');

const app = express();

// TODO: 以下為 Line登入功能
// 提供登入連結
// const CLIENT_ID = process.env.LINE_CLIENT_ID;
// const REDIRECT_URI = 'https://easy-couple-life.onrender.com/auth/callback';

// app.get('/auth/login', (req, res) => {
//   const state = Math.random().toString(36).substring(2, 15);
//   const loginUrl = `https://access.line.me/oauth2/v2.1/authorize?response_type=code&client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&state=${state}&scope=profile%20openid`;
//   console.log("loginURL", loginUrl);
//   res.redirect(loginUrl);
// });

const DIST_DIR = path.join(__dirname, 'public/browser'); // 設定靜態資料位置
app.use(express.static(DIST_DIR)); // 前端取得靜態資料的位置

app.use(express.json()); // 中介層處理 json格式資料

app.use('/line', lineRoutes); // line功能路由

app.use('/api', api); // 前端發送 API路由

app.get('*', (req, res) => { // 處理所有路由，返回 Angular 應用的 index.html 文件
  res.sendFile(path.join(DIST_DIR, 'index.html'));
});

startServer();

async function startServer(){
  try{
    await db.initDatabase();

    // TODO: Render 測試用
    const PORT = process.env.PORT || 3000; // 默認為 3000，但 Render 會提供 PORT 環境變數
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  }catch (err){
    console.error('伺服器啟動失敗', err);
  }
}

// 授權回調處理
// const LINE_CLIENT_SECRET = process.env.LINE_CLIENT_SECRET;

// app.get('/auth/callback', async (req, res) => {
//   const { code, state } = req.query;

//   try {
//     // 向 LINE 交換 Access Token
//     const tokenResponse = await axios.post('https://api.line.me/oauth2/v2.1/token', null, {
//       params: {
//         grant_type: 'authorization_code',
//         code: code,
//         redirect_uri: REDIRECT_URI,
//         client_id: LINE_CLIENT_ID,
//         client_secret: LINE_CLIENT_SECRET,
//       },
//     });

//     const { id_token } = tokenResponse.data;

//     // 解碼並驗證 ID Token
//     const userInfo = jwt.decode(id_token, { complete: true }).payload;

//     // 儲存用戶信息到數據庫或會話
//     const userId = userInfo.sub;
//     const userName = userInfo.name;

//     // 跳轉到打卡頁面
//     res.redirect(`/checkin?userId=${userId}&name=${userName}`);
//   } catch (error) {
//     console.error('Login Error:', error);
//     res.status(500).send('登入失敗');
//   }
// });

// 打卡邏輯處理
// app.post('/webhook', middleware({ channelAccessToken: process.env.MESSAGING_ACCESS_TOKEN, channelSecret: process.env.MESSAGING_SECRET }), async (req, res) => {
//   try {
//     const events = req.body.events;
//     await Promise.all(events.map(handleEvent));
//     res.status(200).send('OK');
//   } catch (error) {
//     console.error('Webhook Error:', error);
//     res.status(500).end();
//   }
// });



// TODO: 查詢簽到記錄(如果已經搭配DB使用的話)
// app.get('/api/signin-records', async (req, res) => {
//   const records = await db.collection('signins').find({}).toArray();
//   res.json(records);
// });

// TODO: https伺服器設定
// const httpsOptions = {
//   key: fs.readFileSync(path.join(__dirname, 'ssl/server.key')),
//   cert: fs.readFileSync(path.join(__dirname,'ssl/server.crt'))
// }

// TODO: 正式伺服器
// const PORT = process.env.PORT || 3000;
// https.createServer(httpsOptions, app).listen(PORT, () => {
//   console.log('HTTPS Server running on port 3000');
// });



