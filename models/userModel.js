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

useTable = '';

/**
 * 確認資料庫有表格，有則取用，沒有則建立，server啟動運行時調用該方法
 * @param {*} tableType 
 */
async function initTable(tableType = ''){
  try {
    await initSystemLevelTable();
    await initRoleTable();
    await initDepartmentTable();
    switch (tableType) {
      case 'prod_users':
        await initUserTable(tableType);
        await initPhoneTable(tableType);
        break;
      case 'dev_users':
        await initUserTable(tableType);
        await initPhoneTable(tableType);
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
/**
 * 確認使用者是否存在
 * @param {*} username 
 * @returns 
 */
async function checkUser(username) {
  const checkUserQuery = `SELECT 1 FROM ${useTable} WHERE username = $1`;
  try {
    const check = await db.query(checkUserQuery, [username]);
    return check.rows.length > 0;
  } catch (err) {
    errRes(errorCause.BACKEND, '查詢使用者失敗' + err.message);
  }
}
/**
 * 新增使用者資料，若建立成功回傳，id、 名稱、權限等級
 * @param {*} username 
 * @param {*} password 
 * @param {*} userData 
 * @returns 
 */
async function createUser(username, password, userData) {
  const createUserQuery = `
  INSERT INTO ${useTable}
  (username, password, level, real_name, emergency, address, start_date, regist_date, role_id, department_id, special_date, special_date_delay)
  VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
  RETURNING id, username, role_id, department_id;
  `;
  const createPhoneQuery = `
  INSERT INTO phones (phone, user_id, emergency)
  VALUES ($1, $2, $3);
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
            userData.address,
            userData.date,
            new Date(),
            userData.role_id,
            userData.department_id,
            userData.spacialDate,
            userData.delaySpacilaData
          ]);
      if(insert.rows[0].id){
        await db.query(createPhoneQuery, [userData.phone, insert.rows[0].id, false]);
        await db.query(createPhoneQuery, [userData.emergency_phone, insert.rows[0].id, true]);
      }
    return insert.rows[0];
  } catch (err) {
    errRes(errorCause.BACKEND, '新增使用者失敗' + err.message);
  }
}
/**
 * 刪除使用者資料
 * @param {*} id 
 * @returns 
 */
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
/**
 * 使用者登入
 * @param {*} username 
 * @param {*} password 
 * @returns 
 */
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
/**
 * 查詢使用者資料
 * @param {*} id 
 * @returns 
 */
async function getInfo(id) {
  const query = `SELECT * FROM ${useTable} WHERE id = $1`;
  const phoneQuery = `SELECT phone, emergency FROM phones WHERE user_id = $1`;
  const emergencyPhoneQuery = `SELECT phone FROM phones WHERE user_id = $1 AND emergency = true`;
  try {
    const basicInfo = await db.query(query, [id]);
    const phone = await db.query(phoneQuery, [id]);
    const emergencyPhone = await db.query(emergencyPhoneQuery, [id]);
    if (basicInfo.rows.length === 0) {
      errRes(errorCause.FRONTEND, '查無使用者資料');
    }
    return {...basicInfo.rows[0], phone: phone.rows[0].phone, emergency_phone: emergencyPhone.rows[0].phone};
  } catch (err) {
    if (err.cause) {
      throw err;
    }
    errRes(errorCause.BACKEND, '查詢使用者資料失敗' + err.message);
  }
}
async function editUser(id, userData) {
  const editUserQuery = `
  UPDATE ${useTable}
  SET real_name = $1, emergency = $2, address = $3 WHERE id = $4
  RETURNING 1;
  `;
  const editPhoneQuery = `
  UPDATE phones
  SET phone = $1
  WHERE user_id = $2 AND emergency = false RETURNING 1;
  `;
  const editEmergencyPhoneQuery = `
  UPDATE phones
  SET phone = $1
  WHERE user_id = $2 AND emergency = true RETURNING 1;`
  try {
    const result = await db.query(editUserQuery,
      [
        userData.real_name,
        userData.emergency,
        userData.address,
        id
      ]);
    if (result.rows.length === 0) {
      errRes(errorCause.FRONTEND, '使用者資料更新失敗');
    }
    const phone = await db.query(editPhoneQuery, [userData.phone, id]);
    const emergencyPhone = await db.query(editEmergencyPhoneQuery, [userData.emergency_phone, id]);
    return result.rows[0] && phone.rows[0] && emergencyPhone.rows[0];
  } catch (err) {
    if (err.cause) {
      throw err;
    }
    errRes(errorCause.BACKEND, '使用者資料更新失敗' + err.message);
  }
}
/**
 * 輔助方法，初始化使用者表格
 * @param {*} tableType 
 */
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
/**
 * 輔助方法，初始化電話表格
 * @param {*} tableType 
 */
async function initPhoneTable(tableType) {
  const initPhoneQuery = `
  CREATE TABLE IF NOT EXISTS phones (
    id SERIAL PRIMARY KEY,
    phone TEXT,
    user_id INTEGER,
    emergency BOOLEAN,
    FOREIGN KEY (user_id) REFERENCES ${tableType}(id)
  )`;
  
  try {
    await db.query(initPhoneQuery);
  } catch (err) {
    throw new Error('電話表格：' + err.message);
  }
}
/**
 * 輔助方法，初始化部門表格，並建立基礎內容
 */
async function initDepartmentTable() {
  const initDepartmentQuery = `
        CREATE TABLE IF NOT EXISTS department (
          department_id INTEGER PRIMARY KEY,
          department TEXT,
          members INTEGER,
          manager_num INTEGER
        )`;
  const insertSystemLevelsQuery = `
  INSERT INTO department (department_id, department, members, manager_num)
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
/**
 * 輔助方法，初始化員工角色表格
 */
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
    ('mamager', 1, 50000, 100000, 10000),
    ('employee', 2, 30000, 50000, 5000)
  ON CONFLICT DO NOTHING;
  `;
  try {
    await db.query(initRoleQuery);
    await db.query(insertSystemUserQuery);
  } catch (err) {
    throw new Error('職務表格：' + err.message);
  }
}
/**
 * 輔助方法，初始化權限表格
 */
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
/**
 * 輔助方法，Error要拋給外部處理需要使用此方法，type為標註 Error的前後端類型
 * @param {*} type 
 * @param {*} message 
 */
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
  editUser,
 };
