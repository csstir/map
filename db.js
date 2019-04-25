var mysql = require('mysql');
require('dotenv').config()
port = process.env.PORT || 1234;
var conn

if(port === 1234){


conn = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,

});
}
else{
  // heroku credentials
conn = mysql.createConnection({
  host: process.env.DB_HEROKU_HOST,
  user: process.env.DB_HEROKU_USER,
  password: process.env.DB_HEROKU_PASS,
  database: process.env.DB_HEROKU_NAME
});

}



conn.connect(function(err) {
    if (err) throw err;
});

module.exports = conn;