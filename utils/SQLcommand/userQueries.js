const userQueries = {
  insertUser: (useTable) => `
  INSERT INTO ${useTable}
  (username, password, level, real_name, emergency, address, start_date, regist_date, role_id, department_id, special_date, special_date_delay)
  VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
  RETURNING id, username, role_id, department_id;
  `,
  insertPhone: `
  INSERT INTO phones (phone, user_id, emergency)
  VALUES ($1, $2, $3);
  `,
  deleteUser: (useTable) => `
  DELETE FROM ${useTable}
  WHERE id = $1
  RETURNING 1;
  `,
  getUserForToken: (useTable) => `
  SELECT password, id, department_id, role_id, level FROM ${useTable}
  WHERE username = $1
  `,
  getUser: (useTable) => `
  SELECT * FROM ${useTable} WHERE id = $1
  `,
  getPhone: `
  SELECT phone, emergency FROM phones WHERE user_id = $1
  `,
  getEmergencyPhone: `
  SELECT phone FROM phones WHERE user_id = $1 AND emergency = true
  `,
  editUser: (useTable) => `
  UPDATE ${useTable}
  SET real_name = $1, emergency = $2, address = $3 WHERE id = $4
  RETURNING 1;
  `,
  editPhone: `
  UPDATE phones
  SET phone = $1
  WHERE user_id = $2 AND emergency = false RETURNING 1;
  `,
  editEmergencyPhone: `
  UPDATE phones
  SET phone = $1
  WHERE user_id = $2 AND emergency = true RETURNING 1;
  `,
  initUserTable: (tableType) => `
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
  )
  `,
  initPhoneTable: (tableType) => `
  CREATE TABLE IF NOT EXISTS phones (
    id SERIAL PRIMARY KEY,
    phone TEXT,
    user_id INTEGER,
    emergency BOOLEAN,
    FOREIGN KEY (user_id) REFERENCES ${tableType}(id)
  )`,
  initDepartmentTable: `
  CREATE TABLE IF NOT EXISTS department (
    department_id INTEGER PRIMARY KEY,
    department TEXT,
    members INTEGER,
    manager_num INTEGER
  )`,
  initInsertDepartment: `
  INSERT INTO department (department_id, department, members, manager_num)
  VALUES 
    (1, 'Back', 50, 2),
    (2, 'Front', 100, 4)
  ON CONFLICT DO NOTHING;
  `,
  initRoleTable: `
  CREATE TABLE IF NOT EXISTS roles (
    role_id INTEGER PRIMARY KEY,
    role TEXT,
    min_salary NUMERIC,
    max_salary NUMERIC,
    bonus NUMERIC
  )`,
  initInsertRole: `
  INSERT INTO roles (role, role_id, min_salary, max_salary, bonus)
  VALUES 
    ('mamager', 1, 50000, 100000, 10000),
    ('employee', 2, 30000, 50000, 5000)
  ON CONFLICT DO NOTHING;
  `,
  initSystemTable: `
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
  )`,
  initInsertSystem: `
  INSERT INTO system_level (level, level_name, attence, rest_apply, rest_confirm, rest_adjust, personal_info, department_info, componey_info, attence_adjust, personal_rank, department_rank, componey_rank, componey_rule_adjust, DB_adjust)
  VALUES 
    (1, 'admin', true, true, true, true, true, true, true, true, true, true, true, true, true),
    (10, 'employee', true, true, false, false, true, true, false, true, false, true, false, true, false)
  ON CONFLICT DO NOTHING;
  `,
};

module.exports = userQueries;
