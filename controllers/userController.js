const users = require('../models/userModel');
const jwt = require('jsonwebtoken');
const httpRes = require('../utils/responseFormatter/httpResponse');
const ErrorCause = require('../utils/responseFormatter/errorCause');

// NOTE: 確認帳號名稱可以使用
const checkUser = async (req, res) => {
  try {
    const { username } = req.query;
    const result = await users.checkUser(username);
    if (!result) {
      res.status(200).send(httpRes.httpResponse(200, '帳號可以使用', result));
    } else {
      res.status(200).send(httpRes.httpResponse(200, '帳號已存在', result));
    }
  } catch (err) {
    if (err.cause === ErrorCause.BACKEND) {
      res.status(500).send(httpRes.httpResponse(500, '帳號註冊失敗'));
    } else {
      res.status(400).send(httpRes.httpResponse(400, err.message));
    }
  }
};
// NOTE: 建立新使用者，建立成功回傳給前端 id、帳號名稱、職務名稱
const register = async (req, res) => {
  try {
    const { username, password } = req.query;
    const result = await users.createUser(username, password);
    res.status(200).send(httpRes.httpResponse(200, '註冊成功', result));
  } catch (err) {
    console.error('註冊失敗:', err.message);
    if (err.cause === ErrorCause.FRONTEND) {
      res.status(400).send(httpRes.httpResponse(400, err.message));
    } else {
      res.status(500).send(httpRes.httpResponse(500, '註冊失敗'));
    }
  }
};
// TODO: 待完善，刪除使用者
const deleteUser = (req, res) => {
  try {
    const { id } = req.query;
    users.deleteUser(id);
    res.status(200).send(httpRes.httpResponse(200, '刪除成功'));
  } catch (err) {
    console.error('刪除失敗:', err);
    res.status(500).send(httpRes.httpResponse(500, '刪除失敗'));
  }
};
// NOTE: 登入成功回傳 token，token中附加內容為使用者id、權限等級、部門
const login = async (req, res) => {
  try {
    const { username, password } = req.query;
    // NOTE: 在資料庫操作中已經處理例外狀況，這裡只需回傳結果
    const user = await users.loginUser(username, password);
    const token = jwt.sign({
      id: user.id,
      level: user.level,
      department: user.department_id
    }, process.env.JWT_SECRET, { expiresIn: '1h' });      

    res.status(200).send(httpRes.httpResponse(200, '登入成功', token, {
      role: user.role_id,
      name: user.username,
      emergency: user.emergency,
      add: user.address,
      start_date: user.start_date,
      special_date: user.special_date,
      special_date_delay: user.special_date_delay,
      rank: user.rank,
      regist_date: user.regist_date
    }));
  } catch (err) {
    console.error('登入失敗:', err.message);
    if (err.cause === ErrorCause.FRONTEND) {
      res.status(400).send(httpRes.httpResponse(400, err.message));
    } else {
      res.status(500).send(httpRes.httpResponse(500, '登入失敗'));
    }
  }
};
// NOTE: Token 驗證
const verifyToken = (req, res, next) => {
  const bearerToken = req.headers['authorization'];
  const token = bearerToken.split(' ')[1];
  if (token === 'null') {
    let error = new Error();
    error.message = 'token無效';
    throw error;
  } else {
    try {
      const decoded = jwt.verify(token.trim(), process.env.JWT_SECRET);
      req.user = decoded;
      next();
    }catch(err) {
      console.error('驗證失敗:', err.message);
      res.status(400).send(httpRes.httpResponse(400, 'token無效'));
    }
  }
}
// NOTE: 查詢使用者資料
const getInfo = async (req, res) => {
  // NOTE: 經過 token驗證後，能夠取得使用的敏感資料，再透過該資料去查詢料庫
  const user = req.user;
  try {
    const result = await users.getInfo(user.id);
    if (!result) {
      throw new Error('查無資料');
    }
    res.status(200).json(result);
  } catch (err) {
    console.error('查詢失敗:', err.message);
    res.status(400).send(httpRes.httpResponse(400, '查詢失敗'));
  }
};

module.exports = {
  checkUser,
  verifyToken,
  register,
  login,
  deleteUser,
  getInfo,
};


