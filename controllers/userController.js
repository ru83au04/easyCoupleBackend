const users = require('../models/userModel');
const jwt = require('jsonwebtoken');
const httpRes = require('../utils/responseFormatter/httpResponse')

// NOTE: 建立新使用者
const register = async (req, res) => {
  try {
    const { username, password } = req.query;
    // TEST: 確認回傳的是物件還是陣列(應該要是物件)
    const result = await users.createUser(username, password);
    if (result.username === username) {
      res.status(200).send(httpRes.httpResponse(200, '註冊成功', result));
    } else {
      res.status(500).send(httpRes.httpResponse(500, '註冊失敗'));
    }
  } catch (err) {
    console.error('註冊失敗:', err);
    res.status(500).send(httpRes.httpResponse(500, '註冊失敗'));
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
// NOTE: 登入
const login = (req, res) => {
  try {
    const { username, password } = req.query;
    const user = users.loginUser(username, password);
    if (user) {
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
    } else {
      res.status(401).send(httpRes.httpResponse(401, '身分驗證失敗'));
    }
  } catch (err) {
    res.status(500).send(httpRes.httpResponse(500, '登入失敗'));
  }
};
// TODO: 待完善後應用，Token 驗證
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
// TODO: 待完善，查詢使用者資料
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


