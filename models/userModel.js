const db = require('../config/postpreDatabase');

// TODO: PostpreSQL用法
const getAllUsers = () => {
  return new Promise((resolve, reject) => {
    db.query('SELECT * FROM users', (err, result) => {
      if (err) reject(err);
      resolve(result.rows);  // PostgreSQL 回傳的結果放在 `rows` 屬性中
    });
  });
};

module.exports = { getAllUsers };
  

// TODO: mySQL用法
// const db = require('../config/db');

// const getAllUsers = () => {
//   return new Promise((resolve, reject) => {
//     db.query('SELECT * FROM users', (err, results) => {
//       if (err) reject(err);
//       resolve(results);
//     });
//   });
// };

// module.exports = { getAllUsers };
