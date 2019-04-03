var mysql = require('mysql');
const conn = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'test1'
});


conn.connect(function(err) {
    if (err) throw err;
});

module.exports = conn;