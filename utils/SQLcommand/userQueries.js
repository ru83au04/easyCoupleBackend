const userQueries = {
  insertUser: `
    INSERT INTO ${useTable}
    (username, password, level, real_name, emergency, address, start_date, regist_date, role_id, department_id, special_date, special_date_delay)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
    RETURNING id, username, role_id, department_id;
  `,
  insertPhone:`
  INSERT INTO phones (phone, user_id, emergency)
  VALUES ($1, $2, $3);
  `,
  deleteUser:`
    DELETE FROM ${useTable}
    WHERE id = $1
    RETURNING 1;
    `,
  getUserForToken:`
    SELECT password, id, department_id, role_id, level FROM ${useTable}
    WHERE username = $1
    `,
  getUser: `SELECT * FROM ${useTable} WHERE id = $1`,
  getPhone: `SELECT phone, emergency FROM phones WHERE user_id = $1`,
  getEmergencyPhone: `SELECT phone FROM phones WHERE user_id = $1 AND emergency = true`,
  editUser:`
  UPDATE ${useTable}
  SET real_name = $1, emergency = $2, address = $3 WHERE id = $4
  RETURNING 1;
  `,
  editPhone:`
  UPDATE phones
  SET phone = $1
  WHERE user_id = $2 AND emergency = false RETURNING 1;
  `,
  editEmergencyPhone:`
    UPDATE phones
    SET phone = $1
    WHERE user_id = $2 AND emergency = true RETURNING 1;`,
  
}

module.exports = userQueries;