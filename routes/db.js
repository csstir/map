var mysql = require('mysql');
const conn = mysql.createConnection({
  host: 'us-cdbr-iron-east-03.cleardb.net',
  user: 'b5c7a17152b9dc',
  password: 'ae054300',
  database: 'heroku_6fce93063dc3f54'
});

conn.connect(function(err) {
    if (err) throw err;
});

module.exports = conn;