const fs = require('fs');
const https = require('https');
const express = require('express');
const path = require('path');
const { middleware, SignatureValidationFailed } = require('@line/bot-sdk');
const axios = require('axios');
require('dotenv').config();
const app = express();

const config = {
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN, // 使用環境變數來安全地管理敏感信息
  channelSecret: process.env.CHANNEL_SECRET
};

// 設置靜態文件夾
const DIST_DIR = path.join(__dirname, 'public/browser');
app.use(express.static(DIST_DIR));

const httpsOptions = {
  key: fs.readFileSync(path.join(__dirname, 'ssl/server.key')),
  cert: fs.readFileSync(path.join(__dirname,'ssl/server.crt'))
}

// 處理所有路由，返回 Angular 應用的 index.html 文件
app.get('*', (req, res) => {
  res.sendFile(path.join(DIST_DIR, 'index.html'));
});

// TODO: 正式伺服器
// const PORT = process.env.PORT || 3000;
// https.createServer(httpsOptions, app).listen(PORT, () => {
//   console.log('HTTPS Server running on port 3000');
// });

// TODO: Render 測試用
const PORT = process.env.PORT || 3000; // 默認為 3000，但 Render 會提供 PORT 環境變數
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


// TODO: 以下為 Line登入功能
// 提供登入連結
const CLIENT_ID = process.env.LINE_CLIENT_ID;
const REDIRECT_URI = 'https://easy-couple-life.onrender.com/auth/callback';

app.get('/auth/login', (req, res) => {
  const state = generateRandomState(); // 用於防止 CSRF 攻擊
  const loginUrl = `https://access.line.me/oauth2/v2.1/authorize?response_type=code&client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&state=${state}&scope=profile%20openid`;

  res.redirect(loginUrl);
});

// 授權回調處理
const CLIENT_SECRET = process.env.LINE_CLIENT_SECRET;

app.get('/auth/callback', async (req, res) => {
  const { code, state } = req.query;

  try {
    // 向 LINE 交換 Access Token
    const tokenResponse = await axios.post('https://api.line.me/oauth2/v2.1/token', null, {
      params: {
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: REDIRECT_URI,
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
      },
    });

    const { id_token } = tokenResponse.data;

    // 解碼並驗證 ID Token
    const userInfo = jwt.decode(id_token, { complete: true }).payload;

    // 儲存用戶信息到數據庫或會話
    const userId = userInfo.sub;
    const userName = userInfo.name;

    // 跳轉到打卡頁面
    res.redirect(`/checkin?userId=${userId}&name=${userName}`);
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).send('登入失敗');
  }
});

// 打卡邏輯處理
app.post('/webhook', middleware({ channelAccessToken: process.env.MESSAGING_ACCESS_TOKEN, channelSecret: process.env.MESSAGING_SECRET }), async (req, res) => {
  try {
    const events = req.body.events;
    await Promise.all(events.map(handleEvent));
    res.status(200).send('OK');
  } catch (error) {
    console.error('Webhook Error:', error);
    res.status(500).end();
  }
});

async function handleSignin(event) {
  const userId = event.source.userId;
  const timestamp = new Date();

  // 記錄簽到
  // await db.collection('signins').insertOne({ userId, timestamp });

  // 回應用戶
  return replyToUser(event.replyToken, { type: 'text', text: `簽到成功！時間：${timestamp.toLocaleString()}` });
}




// TODO: 以下為 Line功能設計
// line 中間層
app.post('/webhook', middleware(config), async (req, res) => {
  try {
    // 處理所有事件
    const events = req.body.events;
    const results = await Promise.all(events.map(handleEvent));
    res.status(200).send('OK');
  } catch (error) {
    console.error('Webhook Error:', error);
    res.status(500).end();
  }
});

// 處理 LINE 傳來的事件
async function handleEvent(event) {
  if (event.type === 'message' && event.message.type === 'text') {
    const userMessage = event.message.text;

    // 確認是否為簽到訊息
    if (userMessage === '簽到') {
      return handleSignin(event);
    }

    // 處理其他訊息類型
    const replyMessage = {
      type: 'text',
      text: `您說了：${userMessage}`,
    };
    return replyToUser(event.replyToken, replyMessage);
  }

  console.log('Unsupported event type:', event.type);
  return Promise.resolve(null);
}

// 使用 Reply API 回應用戶
async function replyToUser(replyToken, message) {
  const url = 'https://api.line.me/v2/bot/message/reply';
  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${process.env.CHANNEL_ACCESS_TOKEN}`,
  };
  const body = {
    replyToken: replyToken,
    messages: [message],
  };

  try {
    const response = await axios.post(url, body, { headers });
    console.log('Reply successful:', response.data);
  } catch (error) {
    console.error('Reply failed:', error.response?.data || error.message);
  }
}

// 簽到的邏輯
async function handleSignin(event) {
  const userId = event.source.userId; // 用戶 ID
  const timestamp = new Date(); // 簽到時間

  // 儲存簽到記錄（假設你有連接 MongoDB 或其他資料庫）
  // const newRecord = { userId, timestamp };
  // await db.collection('signins').insertOne(newRecord);

  // 回應簽到成功訊息
  const replyMessage = {
    type: 'text',
    text: `簽到成功！\n時間：${timestamp.toLocaleString()}`,
  };

  return replyToUser(event.replyToken, replyMessage);
}

// 查詢簽到記錄(如果已經搭配DB使用的話)
// app.get('/api/signin-records', async (req, res) => {
//   const records = await db.collection('signins').find({}).toArray();
//   res.json(records);
// });



