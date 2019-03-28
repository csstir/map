var mysql = require('mysql');
const conn = mysql.createConnection({
  host: 'us-cdbr-iron-east-03.cleardb.net',
  user: 'b75944316b4dc2',
  password: 'f58e2e15',
  database: 'heroku_0c51ce8b638f990'
});


conn.connect(function(err) {
    if (err) throw err;
});

module.exports = conn;