// DEPENDENCIES ======================
// ===================================
const mysql = require("mysql");
const inquirer = require("inquirer");
// ===================================^


// MYSQL ===================================
// =========================================
const connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "EkUF,wC,3^~9&WXfXJ*.4X~i",
  database: "employeesDB"
});

connection.connect(function(err) {
  if (err) throw err;
  console.log("connecting...")
});
// =========================================^



// GLOBAL VARIABLES ===
// ====================
const allDepartments = [];
const allEmployees = [];
const allRoles = [];
let name;
// ====================^

function getLastRecord(name)
{
    return new Promise(function(resolve, reject) {
        // The Promise constructor should catch any errors thrown on
        // this tick. Alternately, try/catch and reject(err) on catch.

        connection.query("SELECT * FROM employee", (err, data) => {
            // Call reject on error states,
            // call resolve with results
            if (err) {
                return reject(err);
            }
            resolve(data);
        });
    });
}


getLastRecord().then(function(data) {
    console.log(data)
    // now you have your rows, you can see if there are <20 of them
}).catch((err) => setImmediate(() => { throw err; })); // Throw async to escape the promise chain

console.log("hi!")

// async function waitForInfo () {
//     await getInfo();
//     console.log('waited!')
//     console.log(name[1].first_name)
// }

// async function getInfo(name, callback) {
//     connection.query("SELECT * FROM employee", (err, data) => {
//     if (err) throw err;
//     // console.log(data[1].first_name, data[1].last_name);
//     // for (i = 0; i < data.length; i++) {
//     // console.log(data[i].first_name, data[i].last_name);
//         let name = data;
//     });
// }


