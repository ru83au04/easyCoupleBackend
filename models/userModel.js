const db = require('../config/postpreDatabase');
const bcrypt = require('bcrypt');

// NOTE: 確認資料庫有表格，有則取用，沒有則建立
async function initUserTable() {
  const initTableQuery = `
    CREATE TABLE IF NOT EXISTS test_users (
      id SERIAL PRIMARY KEY,
      username TEXT NOT NULL,
      password TEXT NOT NULL,
      level NUMERIC NOT NULL
    )`
  try {
    await db.query(initTableQuery);
  } catch (err) {
    console.error('初始化使用者資料庫失敗:', err.message);
    throw new Error('資料庫初始化失敗');
  }
}
// NOTE: 新增使用者資料
async function createUser(username, password) {
  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hash(password, 10);
  } catch (err) {
    console.error('密碼加密失敗:', err.message);
    throw new Error('密碼加密失敗');
  }

  const createUserQuery = `
  INSERT INTO test_users (username, password, level)
  VALUES ($1, $2, $3)
  RETURNING *;
  `
  try {
    const result = await db.query(createUserQuery, [username, hashedPassword, 10]);
    return result.rows[0];
  }catch(err) {
    console.error('新增使用者失敗:', err.message);
    throw new Error('新增使用者失敗');
  }
}
// NOTE: 刪除使用者資料
async function deleteUser(id) {
  const deleteUserQuery = `
  DELETE FROM test_users
  WHERE id = $1;
  RETURNING *;
  `;

  try {
    const result = await db.query(deleteUserQuery, [id]);
    return result.rows[0];
  }catch(err) {
    console.error('刪除使用者失敗:', err.message);
    throw new Error('刪除使用者失敗');
  }
}
// TODO: 取得使用者資料
// TODO: 更新使用者資料

// TODO: 看看有沒有辦法整理資料庫語法統一管理

module.exports = { 
  initUserTable,
  createUser,
  // getUser,
  // updateUser,
 };
