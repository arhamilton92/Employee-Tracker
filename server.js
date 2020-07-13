
// DEPENDENCIES ======================
// ===================================
const mysql = require("mysql");
const inquirer = require("inquirer");
// ===================================^


// GLOBAL VARIABLES =========
// ==========================
const employeesArrayInquirer = [];
const departmentsArrayInquirer = [];
const employeesArray = [];
const departmentsArray = [];
const rolesArray = [];
const rolesArrayInquirer = [];
const managersArray = [];
let employeeNumber;
let roleNumber;
let departmentNumber;
// ==========================^


// MYSQL =========================================================================================================
// ===============================================================================================================
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
// ===============================================================================================================^


// INQUIRER QUESTIONS =======================================================
// ==========================================================================
const questions = [
    {
        type: "list",
        name: "actions",
        message: "-",
        choices: [ 
            "Browse Database", new inquirer.Separator(), 
            "Add New Entry to Database", new inquirer.Separator(),
            "Update Employee Role", new inquirer.Separator(), 
        ],
    },
    {
        type: "list",
        name: "view",
        message: "What would you like to view?",
        when: (response) => response.actions == "Browse Database",
        choices: [ 
            "View Employees", new inquirer.Separator(), 
            "View Departments", new inquirer.Separator(),
            "View Roles", new inquirer.Separator(), 
        ],
    },
    {
        type: "list",
        name: "add",
        message: "What would you like to add?",
        when: (response) => response.actions == "Add New Entry to Database",
        choices: [ 
            "New Employee", new inquirer.Separator(), 
            "New Department", new inquirer.Separator(),
            "New Role", new inquirer.Separator(), 
        ],
    },
    {
        type: "list",
        name: "update",
        message: "Select Employee:",
        when: (response) => response.actions == "Update Employee Role",
        choices: employeesArrayInquirer,
    },
    {
        type: "list",
        name: "newRole",
        message: "Change role to:",
        when: (response) => response.actions == "Update Employee Role",
        choices: rolesArrayInquirer,
    },
    {
        type: "confirm",
        name: "confirmRole",
        message: "Change Role?",
        when: (response) => response.actions == "Update Employee Role",
    },
]


const finished = [        
    {
    type: "confirm",
    name: "finished?"
    },
];


const continuePrompt = [        
    {
    type: "list",
    name: "continue",
    message: "Continue using Database?",
    choices: [ 
        new inquirer.Separator(),
        new inquirer.Separator(),
        "Yes", new inquirer.Separator(), 
        "No", 
    ],
    },
];


const addEmployeePrompt = [        
    {
    type: "input",
    name: "employeeFirstName",
    message: "Employee First Name:",
    },
    {
    type: "input",
    name: "employeeLastName",
    message: "Employee Last Name:",
    },
    {
    type: "input",
    name: "employeeRole",
    message: "Employee Role ID:",
    },
    {
    type: "input",
    name: "employeeManager",
    message: "Employee Manager ID:",
    },
];

const addDepartmentPrompt = [        
    {
    type: "input",
    name: "departmentName",
    message: "Department Name:",
    },
];

const addRolePrompt = [        
    {
    type: "input",
    name: "roleTitle",
    message: "Role Title:",
    },
    {
    type: "input",
    name: "salary",
    message: "Role Salary:",
    },
    {
    type: "list",
    name: "department",
    message: "Department:",
    choices: rolesArray,
    },
];
// ==========================================================================^


// PROMPTS USER, SELECTS NEXT ACTION ==================================================
// ====================================================================================
init = () => {
    getEmployees().then(function(data) {
        for (i = 0; i < data.length; i++) {
            employeesArrayInquirer.push(data[i].first_name + " " + data[i].last_name + "," + new inquirer.Separator());
            employeesArray.push(data[i].id)
        }
        getRoles().then(function(data) {
            for (i = 0; i < data.length; i++) {
                rolesArrayInquirer.push(data[i].title + "," + new inquirer.Separator())
                rolesArray.push(data[i].title)
            }
            startApp();
        }).catch((err) => setImmediate(() => { throw err; }));
    }).catch((err) => setImmediate(() => { throw err; }));
}

startApp = () => {
    console.log();
    console.log("--------------------------------------------------")
    console.log("Hello! Welcome to the MyCompany Employee Database.")
    console.log("--------------------------------------------------")
    console.log("-----------------------------------------");
    console.log("Please select from the following actions:")
    console.log("-----------------------------------------")
    inquirer
    //.prompt uses the questions array to ask the user questions
    .prompt(questions)
    .then((response) => {
        console.log('stuff')
        if (response.view == "View Departments") { viewDepartments() };
        if (response.view == "View Employees") { viewEmployees() };
        if (response.view == "View Roles") { viewRoles(); }
        // ------------------------------------------------------------
        if (response.add == "New Department") { addDepartments() };
        if (response.add == "New Employee") { addEmployees() };
        if (response.add == "New Role") { addRoles(); }
        
        // ------------------------------------------------------------
        if (response.confirmRole == true) {
            for (i = 0; i < employeesArray.length; i++) {
                if (response.update == employeesArrayInquirer[i]) { 
                    employeeNumber = i;
                    employeeNumber++;
                }
                if (response.newRole == rolesArrayInquirer[i]) { 
                    roleNumber = i;
                    roleNumber++;
                }
            }
            updateEmployee();
        }
    })}
// ====================================================================================^


// PROMISES THAT PULL INFO FROM DATABASE ===============================
// =====================================================================
getEmployees = () => {
    return new Promise(function(resolve, reject) {
        connection.query("SELECT * FROM employee", (err, data) => {
            if (err) {
                return reject(err);
            }
            resolve(data);
        });
    })}
getDepartments = () => {
    return new Promise(function(resolve, reject) {
        connection.query("SELECT * FROM department", (err, data) => {
            if (err) {
                return reject(err);
            }
            resolve(data);
        });
    })}
getRoles = () => {
    return new Promise(function(resolve, reject) {
        connection.query("SELECT * FROM role", (err, data) => {
            if (err) {
                return reject(err);
            }
            resolve(data);
        });
    })}
// =====================================================================^


// DISPLAY TABLE FUNCTIONS ==========================================
// ==================================================================
viewDepartments = () => {
    connection.query("SELECT * FROM department", (err, data) => {
        if (err) throw err;
        console.table(data);
        finishPrompts();
    })}
viewEmployees = () => {
    connection.query("SELECT * FROM employee", (err, data) => {
        if (err) throw err;
        console.table(data);
        finishPrompts()
    })}
viewRoles = () => {
    connection.query("SELECT * FROM role", (err, data) => {
        if (err) throw err;
        console.table(data);
        finishPrompts();
    })}
// ==================================================================^


// ADD TO TABLE FUNCTIONS =================================================================================================================
// ========================================================================================================================================
addDepartments = () => {
    inquirer
    .prompt(addDepartmentPrompt)
    .then((response) => {
        connection.query(`INSERT INTO department (name) values` +
        `("${response.departmentName}");`), 
            (err, data) => {if (err) throw err;}
        console.log("Department Added.")
        finishPrompts()
    })}
addEmployees = () => {
    inquirer
    .prompt(addEmployeePrompt)
    .then((response) => {
        connection.query(`INSERT INTO employee (first_name, last_name, role_id, manager_id) values` +
        `("${response.employeeFirstName}", "${response.employeeLastName}", "${response.employeeRole}", "${response.employeeManager}");`), 
            (err, data) => {if (err) throw err;}
        console.log("Employee Added.")
        finishPrompts()
    })}
addRoles = () => {
    inquirer
    .prompt(addRolePrompt)
    .then((response) => {
        for (i = 0; i < rolesArray.length; i++) {
            if (response.department == rolesArray[i]) { 
                departmentNumber = i;
                departmentNumber++;
            }
        }
        connection.query(`INSERT INTO role (title, salary, department_id) values` +
        `(("${response.roleTitle}", "${response.salary}", "${departmentNumber}");`), 
            (err, data) => {if (err) throw err;}
        console.log("Role Added.")
        finishPrompts()
    })}
// ========================================================================================================================================^


// UPDATE EMPLOYEE ROLE ===================================================================================================================
// ========================================================================================================================================
updateEmployee = () => {
    console.log("inside update employee")
    connection.query(`UPDATE employee SET role_id = ${roleNumber} WHERE id = ${employeeNumber}`), 
        (err, data) => {if (err) throw err;}
    console.log("Employee Added.")
    finishPrompts()
    }
// ========================================================================================================================================^


// COMPLETES INQUIRER =========
// ============================
finishPrompts = () => {
    inquirer
    .prompt(finished)
    .then((response) => {
        if (response) {
            askContinue();
        }
    })}
// ============================^


// PROMPTS USER TO RESTART ==================================================
// ==========================================================================
askContinue = () => {
    inquirer
    .prompt(continuePrompt)
    .then((response) => {
        if (response.continue == "Yes") {
            init();
        }else {
            console.log("------------------------------------------------")
            console.log("Thank you for using MyCompany Employee Database!")
            console.log("------------------------------------------------")
        }
    })}
// =========================================================================^


// PROMISE CALLS // UNUSED =================================
// =========================================================
// getDepartments().then(function(data) {
//     console.log (data.length);
//     for (i = 0; i < data.length; i++) {
//         departmentsArray.push(data[i].name)
//     }
//     console.log(departmentsArray)
// }).catch((err) => setImmediate(() => { throw err; }));
// =========================================================^


init();