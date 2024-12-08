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

// line 功能設計 // TODO: 想清楚要怎樣設計
app.post('/webhook', middleware(config), async (req, res) => {
  try {
    const events = req.body.events;
    for (const event of events) {
      if (event.type === 'message' && event.message.type === 'text') {
        const replyToken = event.replyToken;
        const userMessage = event.message.text;

        // 準備回應訊息
        const responseMessage = {
          type: 'text',
          text: `您說了：${userMessage}`,
        };

        // 回應用戶
        await replyToUser(replyToken, responseMessage);
      }
    }
    res.status(200).send('OK');
  } catch (error) {
    if (error instanceof SignatureValidationFailed) {
      res.status(401).send(error.signature);
    } else {
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
  }
});

// 回應用戶的函數
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
    await axios.post(url, body, { headers });
  } catch (error) {
    console.error(`回應訊息失敗: ${error.response.status} ${error.response.statusText}`);
  }
}

https.createServer(httpsOptions, app).listen(3000, () => {
  console.log('HTTPS Server running on port 3000');
});


