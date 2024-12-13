const db = require("../config/postpreDatabase");

// TODO: PostpreSQL用法
const getUsers = (req, res) => {
  db.query('SELECT * FROM users', (err, result) => {
    if (err) {
      return res.status(500).send({ message: '查詢失敗', error: err });
    }
    res.json(result.rows);  // PostgreSQL 回傳的結果放在 `rows` 屬性中
  });
};

module.exports = { getUsers };

// TODO: mySQL用法
// const db = require("../config/database");

// const getUsers = (req, res) => {
//   db.query('SELECT * FROM users', (err, results) => {
//     if (err) {
//       return res.status(500).send({ message: '查詢失敗', error: err });
//     }
//     res.json(results);
//   });
// };

// module.exports = { getUsers };

// controllers/userController.js


