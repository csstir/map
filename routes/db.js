var mysql = require('mysql');
// const conn = mysql.createConnection({
//   host: 'localhost',
//   user: 'root',
//   password: 'root',
//   database: 'test1'
// });

//heroku credentials
const conn = mysql.createConnection({
  host: 'us-cdbr-iron-east-03.cleardb.net',
  user: 'ba3356f747f2ab',
  password: '3e276e89',
  database: 'heroku_fd006092667f923'
});

conn.connect(function(err) {
    if (err) throw err;
});

module.exports = conn;