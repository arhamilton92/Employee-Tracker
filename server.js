ar mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "EkUF,wC,3^~9&WXfXJ*.4X~i",
  database: "employeeDB"
});

connection.connect(function(err) {
  if (err) throw err;

});