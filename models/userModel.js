const db = require('../config/postpreDatabase');
const bcrypt = require('bcrypt');

useTable = "";

// NOTE: 確認資料庫有表格，有則取用，沒有則建立
async function initTable(tableType = ''){
  try {
    await initSystemLevelTable();
    await initRoleTable();
    await initDepartmentTable();
    switch (tableType) {
      case 'prod_users':
        await initUserTable(tableType);
        break;
      case 'dev_users':
        await initUserTable(tableType);
        useTable = tableType;
        break;
      default:
        await initUserTable(tableType);
        break;
    }
  } catch (err) {
    throw new Error('資料庫初始化失敗：' + err.message);
  }
}
// NOTE: 新增使用者資料，若建立成功回傳，id、 名稱、權限等級
async function createUser(username, password) {
  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hash(password, 10);
  } catch (err) {
    throw new Error('密碼加密失敗：' + err.message);
  }

  const createUserQuery = `
  INSERT INTO ${useTable} (username, password, role_id)
  VALUES ($1, $2, $3)
  RETURNING id, username, role_id;
  `
  try {
    const result = await db.query(createUserQuery, [username, hashedPassword, 10]);
    return result.rows[0];
  }catch(err) {
    throw new Error('新增使用者失敗：' + err.message);
  }
}
// TODO: 待完善，刪除使用者資料
async function deleteUser(id) {
  const deleteUserQuery = `
  DELETE FROM ${useTable}
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
// NOTE: 使用者登入
async function loginUser(username, password) {
  const getUserQuery = `
  SELECT * FROM ${useTable}
  WHERE username = $1
  `;

  try {
    const result = await db.query(getUserQuery, [username]);
    const user = result.rows[0];
    if (user && bcrypt.compare(password, user.password)) {
      return user;
    } else {
      return null;
    }
  }catch(err) {
    throw new Error('登入失敗：' + err.message);
  }
}
// TODO: 待完善，查詢使用者資料
async function checkData(id) {
  const query = `SELECT * FROM ${useTable} WHERE id = $1`;
  try {
    const result = await db.query(query, [id]);
    return result.rows[0];
  } catch (err) {
    console.error('查詢失敗:', err.message);
    throw new Error('查詢失敗');
  }
}
// NOTE: 初始化會員表格
async function initUserTable(tableType) {
  const initTableQuery = `
        CREATE TABLE IF NOT EXISTS ${tableType} (
          id SERIAL PRIMARY KEY,
          level NUMERIC,
          FOREIGN KEY (level) REFERENCES system_level(level),
          role_id INTEGER NOT NULL,
          FOREIGN KEY (role_id) REFERENCES roles (id),
          department_id INTEGER,
          FOREIGN KEY (department_id) REFERENCES department (id),
          username TEXT NOT NULL,
          password TEXT NOT NULL,
          emergency TEXT,
          address TEXT,
          start_date DATE,
          special_date NUMERIC,
          special_date_delay NUMERIC,
          rank TEXT,
          regist_date DATE
        )`;
  try {
    await db.query(initTableQuery);
  } catch (err) {
    throw new Error('初始化會員表格：' + err.message);
  }
}
// NOTE: 初始化部門表格，並建立基礎內容
async function initDepartmentTable() {
  const initDepartmentQuery = `
        CREATE TABLE IF NOT EXISTS department (
          id SERIAL PRIMARY KEY,
          department TEXT,
          members NUMERIC,
          boss_num NUMERIC
        )`;
  const insertSystemLevelsQuery = `
  INSERT INTO department (department, members, boss_num)
  VALUES 
    ('Back', 50, 2),
    ('Front', 100, 4)
  ON CONFLICT DO NOTHING;
  `;
  try {
    await db.query(initDepartmentQuery);
    await db.query(insertSystemLevelsQuery);
  } catch (err) {
    throw new Error('初始化部門表格：' + err.message);
  }
} 
// NOTE: 初始化員工角色表格
async function initRoleTable() {
  const initRoleQuery = `
  CREATE TABLE IF NOT EXISTS roles (
    id SERIAL PRIMARY KEY,
    role TEXT,
    role_level NUMERIC,
    min_salary NUMERIC,
    max_salary NUMERIC,
    bonus NUMERIC
  )`;
  const insertSystemUserQuery = `
  INSERT INTO roles (role, role_level, min_salary, max_salary, bonus)
  VALUES 
    ('boss', 1, 50000, 100000, 10000),
    ('employee_two', 2, 30000, 50000, 5000)
  ON CONFLICT DO NOTHING;
  `;
  try {
    await db.query(initRoleQuery);
    await db.query(insertSystemUserQuery);
  } catch (err) {
    throw new Error('初始化角色表格：' + err.message);
  }
}
// NOTE: 初始化權限表格
async function initSystemLevelTable() {
  const initSystemLevelQuery = `
  CREATE TABLE IF NOT EXISTS system_level (
    level NUMERIC PRIMARY KEY,
    level_name TEXT,
    attence BOOLEAN,
    rest_apply BOOLEAN,
    rest_confirm BOOLEAN,
    rest_adjust BOOLEAN,
    personal_info BOOLEAN,
    department_info BOOLEAN,
    componey_info BOOLEAN,
    attence_adjust BOOLEAN,
    personal_rank BOOLEAN,
    department_rank BOOLEAN,
    componey_rank BOOLEAN,
    componey_rule_adjust BOOLEAN,
    DB_adjust BOOLEAN
  )`;
  const insertSystemLevelsQuery = `
  INSERT INTO system_level (level, level_name, attence, rest_apply, rest_confirm, rest_adjust, personal_info, department_info, componey_info, attence_adjust, personal_rank, department_rank, componey_rank, componey_rule_adjust, DB_adjust)
  VALUES 
    (1, 'admin', true, true, true, true, true, true, true, true, true, true, true, true, true),
    (2, 'employee', true, true, false, false, true, true, false, true, false, true, false, true, false)
  ON CONFLICT DO NOTHING;
  `;
  try {
    await db.query(initSystemLevelQuery);
    await db.query(insertSystemLevelsQuery);
  } catch (err) {
    throw new Error('初始化權限表格：' + err.message);
  }
}

// TODO: 更新使用者資料

// TODO: 看看有沒有辦法整理資料庫語法統一管理

module.exports = { 
  initTable,
  createUser,
  loginUser,
  checkData,
  // updateUser,
 };
