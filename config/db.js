const mysql = require('mysql2/promise');
require('dotenv').config()


const pool = mysql.createPool({
  host: process.env.HOST,
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DATABASE
});

async function query(sql, data) {
  const conn = await pool.getConnection();
  try {
    const res = await conn.query(sql, data);
    return res;
  } finally {
    conn.release();
  }
}

(async () => {
    const [rows, fields] = await query('SELECT * FROM ?', ["table"]);
    console.log(rows);
})();
