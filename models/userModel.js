const db = require('../config/postpreDatabase');
const errorCause = require('../utils/responseFormatter/errorCause');
const bcrypt = require('bcrypt');
const queries = require('../utils/SQLcommand/userQueries');
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
  try {
    hashedPassword = await bcrypt.hash(password, 10);
  } catch (err) {
    if (err.cause) {
      throw err;
    }
    errRes(errorCause.BACKEND, '密碼加密失敗' + err.message);
  }

  try {
        const insert = await db.query(queries.insertUser(userTable),
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
        await db.query(queries.insertPhone, [userData.phone, insert.rows[0].id, false]);
        await db.query(queries.insertPhone, [userData.emergency_phone, insert.rows[0].id, true]);
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
try {
    const result = await db.query(queries.deleteUser(useTable), [id]);
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
  try {
    if (!await checkUser(username)) {
      errRes(errorCause.FRONTEND, '使用者不存在');
    }
    const result = await db.query(queries.getUserForToken(useTable), [username]);
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
  try {
    const basicInfo = await db.query(queries.getUser(useTable), [id]);
    const phone = await db.query(queries.getPhone, [id]);
    const emergencyPhone = await db.query(queries.getEmergencyPhone, [id]);
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
  try {
    const result = await db.query(queries.editUser(useTable),
      [
        userData.real_name,
        userData.emergency,
        userData.address,
        id
      ]);
    if (result.rows.length === 0) {
      errRes(errorCause.FRONTEND, '使用者資料更新失敗');
    }
    const phone = await db.query(queries.editPhone, [userData.phone, id]);
    const emergencyPhone = await db.query(queries.editEmergencyPhone, [userData.emergency_phone, id]);
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
  try {
    await db.query(queries.initUserTable(tableType));
  } catch (err) {
    throw new Error('使用者表格：' + err.message);
  }
}
/**
 * 輔助方法，初始化電話表格
 * @param {*} tableType 
 */
async function initPhoneTable(tableType) {  
  try {
    await db.query(queries.initPhoneTable(tableType));
  } catch (err) {
    throw new Error('電話表格：' + err.message);
  }
}
/**
 * 輔助方法，初始化部門表格，並建立基礎內容
 */
async function initDepartmentTable() {
  try {
    await db.query(queries.initDepartmentTable);
    await db.query(queries.initInsertDepartment);
  } catch (err) {
    throw new Error('部門表格：' + err.message);
  }
} 
/**
 * 輔助方法，初始化員工角色表格
 */
async function initRoleTable() {
  try {
    await db.query(queries.initRoleTable);
    await db.query(queries.initInsertRole);
  } catch (err) {
    throw new Error('職務表格：' + err.message);
  }
}
/**
 * 輔助方法，初始化權限表格
 */
async function initSystemLevelTable() {
  try {
    await db.query(queries.initSystemTable);
    await db.query(queries.initInsertSystem);
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

module.exports = { 
  initTable,
  createUser,
  loginUser,
  getInfo,
  checkUser,
  deleteUser,
  editUser,
 };
