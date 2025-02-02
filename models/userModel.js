const db = require('../config/postpreDatabase');
const errorCause = require('../utils/responseFormatter/errorCause');
const bcrypt = require('bcrypt');
/* NOTE:
  主要功能：
    1. 初始化所有使用者相關表格
    2. 新增使用者
    3. 使用者登入、登出
    4. 使用者資料查詢
    5. 使用者資料更新
    6. 使用者資料刪除
  使用者表格欄位：
    id: 使用者編號
    real_name: 使用者真實姓名
    level: 使用者權限等級
    role_id: 使用者職務
    department_id: 使用者部門
    username: 使用者名稱
    password: 使用者密碼
    emergency: 緊急聯絡方式
    address: 住址
    start_date: 到職日
    special_date: 特休天數
    special_date_delay: 遞延特休天數
    rank: 工作評等
    regist_date: 註冊日期
  錯誤處理：
    暴露給外部使用的方法中，拋出的錯誤必須附加 cause 類型，用以標註前後端錯誤
*/

useTable = "";

// NOTE: 確認資料庫有表格，有則取用，沒有則建立，server啟動運行時調用該方法
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
    errRes(errorCause.BACKEND, '資料庫初始化失敗' + err.message);
  }
}
// NOTE: 確認使用者是否存在
async function checkUser(username) {
  const checkUserQuery = `SELECT 1 FROM ${useTable} WHERE username = $1`;
  try {
    const check = await db.query(checkUserQuery, [username]);
    return check.rows.length > 0;
  } catch (err) {
    errRes(errorCause.BACKEND, '查詢使用者失敗' + err.message);
  }
}
// NOTE: 新增使用者資料，若建立成功回傳，id、 名稱、權限等級
async function createUser(username, password, userData) {
  const createUserQuery = `
  INSERT INTO ${useTable}
  (username, password, level, real_name, emergency, address, start_date, regist_date, role_id, department_id)
  VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
  RETURNING id, username, role_id, department_id;
  `;
  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hash(password, 10);
  } catch (err) {
    if (err.cause) {
      throw err;
    }
    errRes(errorCause.BACKEND, '密碼加密失敗' + err.message);
  }

  try {
    const insert = await db.query(createUserQuery,
      [
        username,
        hashedPassword,
        10,
        userData.name,
        userData.emergency,
        userData.add,
        userData.date,
        new Date(),
        userData.role_id,
        userData.department_id
      ]);
    return insert.rows[0];    
  } catch (err) {
    errRes(errorCause.BACKEND, '新增使用者失敗' + err.message);
  }
}
// NOTE: 刪除使用者資料
async function deleteUser(id) {
  const deleteUserQuery = `
  DELETE FROM ${useTable}
  WHERE id = $1
  RETURNING 1;
  `;
  
  try {
    const result = await db.query(deleteUserQuery, [id]);
    return result.rows.length > 0;
  }catch(err) {
    errRes(errorCause.BACKEND, '刪除使用者失敗' + err.message);
  }
}
// NOTE: 使用者登入
async function loginUser(username, password) {
  const getUserQuery = `
  SELECT password, id, department_id, role_id, level FROM ${useTable}
  WHERE username = $1
  `;
  try {
    if (!await checkUser(username)) {
      errRes(errorCause.FRONTEND, '使用者不存在');
    }
    const result = await db.query(getUserQuery, [username]);
    const user = result.rows[0];
    let compare = await bcrypt.compare(password, user.password);
    if (!compare) {
      errRes(errorCause.FRONTEND, '密碼錯誤');
    } else {
      return user;
    }
  } catch (err) {
    if (err.cause) {
      throw err;
    }
    errRes(errorCause.BACKEND, '登入失敗' + err.message);
  }
}
// NOTE: 查詢使用者資料
async function getInfo(id) {
  const query = `SELECT * FROM ${useTable} WHERE id = $1`;
  try {
    const result = await db.query(query, [id]);
    if (result.rows.length === 0) {
      errRes(errorCause.FRONTEND, '查無使用者資料');
    }
    return result.rows[0];
  } catch (err) {
    if (err.cause) {
      throw err;
    }
    errRes(errorCause.BACKEND, '查詢使用者資料失敗' + err.message);
  }
}
// NOTE: 輔助方法，初始化使用者表格
async function initUserTable(tableType) {
  const initTableQuery = `
        CREATE TABLE IF NOT EXISTS ${tableType} (
          id SERIAL PRIMARY KEY,
          real_name TEXT,
          level NUMERIC,
          FOREIGN KEY (level) REFERENCES system_level(level),
          role_id INTEGER NOT NULL,
          FOREIGN KEY (role_id) REFERENCES roles (role_id),
          department_id INTEGER NOT NULL,
          FOREIGN KEY (department_id) REFERENCES department (department_id),
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
    throw new Error('使用者表格：' + err.message);
  }
}
// NOTE: 輔助方法，初始化部門表格，並建立基礎內容
async function initDepartmentTable() {
  const initDepartmentQuery = `
        CREATE TABLE IF NOT EXISTS department (
          department_id INTEGER PRIMARY KEY,
          department TEXT,
          members NUMERIC,
          boss_num NUMERIC
        )`;
  const insertSystemLevelsQuery = `
  INSERT INTO department (department_id, department, members, boss_num)
  VALUES 
    (1, 'Back', 50, 2),
    (2, 'Front', 100, 4)
  ON CONFLICT DO NOTHING;
  `;
  try {
    await db.query(initDepartmentQuery);
    await db.query(insertSystemLevelsQuery);
  } catch (err) {
    throw new Error('部門表格：' + err.message);
  }
} 
// NOTE: 輔助方法，初始化員工角色表格
async function initRoleTable() {
  const initRoleQuery = `
  CREATE TABLE IF NOT EXISTS roles (
    role_id INTEGER PRIMARY KEY,
    role TEXT,
    min_salary NUMERIC,
    max_salary NUMERIC,
    bonus NUMERIC
  )`;
  const insertSystemUserQuery = `
  INSERT INTO roles (role, role_id, min_salary, max_salary, bonus)
  VALUES 
    ('boss', 1, 50000, 100000, 10000),
    ('employee_two', 2, 30000, 50000, 5000)
  ON CONFLICT DO NOTHING;
  `;
  try {
    await db.query(initRoleQuery);
    await db.query(insertSystemUserQuery);
  } catch (err) {
    throw new Error('職務表格：' + err.message);
  }
}
// NOTE: 輔助方法，初始化權限表格
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
    (10, 'employee', true, true, false, false, true, true, false, true, false, true, false, true, false)
  ON CONFLICT DO NOTHING;
  `;
  try {
    await db.query(initSystemLevelQuery);
    await db.query(insertSystemLevelsQuery);
  } catch (err) {
    throw new Error('權限表格：' + err.message);
  }
}
// NOTE: 輔助方法，Error要拋給外部處理需要使用此方法，type為標註 Error的前後端類型
function errRes(type, message) {
  let error = new Error(message);
  error.cause = type;
  throw error;
}

// TODO: 更新使用者資料

// TODO: 看看有沒有辦法整理資料庫語法統一管理

module.exports = { 
  initTable,
  createUser,
  loginUser,
  getInfo,
  checkUser,
  deleteUser,
  // updateUser,
 };
