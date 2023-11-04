var mysql = require('mysql');
var connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Manish@44',
  database:"School",
  port:3306
});

connection.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
});
