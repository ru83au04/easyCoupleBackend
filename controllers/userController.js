const users = require('../models/userModel');
const jwt = require('jsonwebtoken');
const httpRes = require('../utils/responseFormatter/httpResponse')

// NOTE: 建立新使用者
const register = async (req, res) => {
  try {
    const { username, password } = req.query;
    await users.createUser(username, password);
    res.status(200).send(httpRes.httpResponse(200, '註冊成功'));
  } catch (err) {
    console.error('註冊失敗:', err);
    res.status(500).send(httpRes.httpResponse(500, '註冊失敗'));
  }
};
// NOTE: 刪除使用者
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
// NOTE: 登入
const login = (req, res) => {
  try {
    const { username, password } = req.query;
    const user = users.loginUser(username, password);
    if (user) {
      const token = jwt.sign({ user_id: user.userId }, process.env.JWT_SECRET, { expiresIn: '1h' });
      console.log('登入成功');
      

      res.status(200).send(httpRes.httpResponse(200, '登入成功', token));
    } else {
      console.log('登入成功');
      res.status(401).send(httpRes.httpResponse(401, '登入失敗'));
    }
  } catch (err) {
    console.error('登入失敗:', err);
    res.status(500).send(httpRes.httpResponse(500, '登入失敗'));
  }
};
// NOTE: Token 驗證
const verifyToken = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) {
    return res.status(401).send(httpRes.httpResponse(401, 'token無效'));
  } else {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
      next();
    }catch(err) {
      console.error('驗證失敗:', err);
      res.status(401).send(httpRes.httpResponse(401, 'token無效'));
    }
  }
}
// NOTE: 查詢使用者資料
const checkData = async (req, res) => {
  const { id } = req.query;
  try {
    const result = await users.checkData(id);
    res.status(200).json(result || {});
  } catch (err) {
    console.error('查詢失敗:', err.message);
    throw new Error('查詢失敗');
  }
};

module.exports = {
  verifyToken,
  register,
  login,
  deleteUser,
  checkData,
};


