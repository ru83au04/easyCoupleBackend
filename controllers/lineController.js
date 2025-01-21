// const axios = require('axios');
// TODO: 待調整或刪除
// // Webhook 主處理函數
// exports.handleWebhook = async (req, res) => {
//   try {
//     const events = req.body.events;
//     const results = await Promise.all(events.map(handleEvent)); // TODO: 與GPT確認理解
//     res.status(200).send('OK');
//   } catch (error) {
//     console.error('Webhook Error:', error);
//     res.status(500).end();
//   }
// };

// // 處理 LINE 傳來的事件
// async function handleEvent(event) {
//   if (event.type === 'message' && event.message.type === 'text') {
//     const userMessage = event.message.text;

//     // 確認是否為簽到訊息
//     if (userMessage === '簽到') {
//       return handleSignin(event);
//     }

//     // 處理其他訊息類型
//     const replyMessage = {
//       type: 'text',
//       text: `您說了：${userMessage}`,
//     };
//     return replyToUser(event.replyToken, replyMessage);
//   }

//   console.log('Unsupported event type:', event.type);
//   return Promise.resolve(null);
// }

// // 簽到邏輯
// async function handleSignin(event) {
//     const userId = event.source.userId; // 用戶 ID
//     const timestamp = new Date(); // 簽到時間
  
//     // 儲存簽到記錄（假設你有連接 MongoDB 或其他資料庫）
//     // const newRecord = { userId, timestamp };
//     // await db.collection('signins').insertOne(newRecord);
  
//     // 回應簽到成功訊息
//     const replyMessage = {
//       type: 'text',
//       text: `簽到成功！\n時間：${timestamp.toLocaleString()}`,
//     };
  
//     return replyToUser(event.replyToken, replyMessage);
//   }

// // 使用 Reply API 回應用戶
// async function replyToUser(replyToken, message) {
//   const url = 'https://api.line.me/v2/bot/message/reply';
//   const headers = {
//     'Content-Type': 'application/json',
//     Authorization: `Bearer ${process.env.CHANNEL_ACCESS_TOKEN}`,
//   };
//   const body = {
//     replyToken: replyToken,
//     messages: [message],
//   };

//   try {
//     const response = await axios.post(url, body, { headers });
//     console.log('Reply successful:', response.data);
//   } catch (error) {
//     console.error('Reply failed:', error.response?.data || error.message);
//   }
// }

