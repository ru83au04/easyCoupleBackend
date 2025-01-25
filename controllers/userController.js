const users = require('../models/userModel');

// NOTE: 建立新使用者
const register = async (req, res) => {
  try {
    const { username, password } = req.query;
    await users.createUser(username, password);
    res.status(200).json({ message: '註冊成功' });
  } catch (err) {
    console.error('註冊失敗:', err);
    res.status(500).json({ message: '註冊失敗' });
  }
};

const deleteUser = (req, res) => {
  try {
    const { id } = req.query;
    users.deleteUser(id);
    res.status(200).json({ message: '刪除成功' });
  } catch (err) {
    console.error('刪除失敗:', err);
    res.status(500).json({ message: '刪除失敗' });
  }
};

module.exports = {
  register,
  deleteUser,
};


