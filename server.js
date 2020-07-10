
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
    
    getEmployees().then(function(data) {
        console.log (data.length);
        for (i = 0; i < data.length; i++) {
            employeesArray.push(data[i].first_name + " " + data[i].last_name + "," + new inquirer.Separator())
        }
        init();
    }).catch((err) => setImmediate(() => { throw err; }));
});
// =========================================^



// GLOBAL VARIABLES ===
// ====================
const employeesArray = [];
const departmentsArray = [];
const rolesArray = [];
const managersArray = [];
// ====================^



// INQUIRER QUESTIONS ===============================================
// ==================================================================
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
            "New actions", new inquirer.Separator(), 
        ],
    },
    {
        type: "list",
        name: "update",
        message: "What would you like to update?",
        when: (response) => response.actions == "Update Employee Role",
        choices: employeesArray,
    },
]

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

const finished = [        
    {
    type: "confirm",
    name: "finished?"
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
    name: "employeeRole",
    message: "Employee Role ID:",
    },
    {
    type: "input",
    name: "employeeManager",
    message: "Employee Manager ID:",
    },
];

// ==================================================================^



// PROMPTS USER, SELECTS NEXT ACTION ==================================================
// ====================================================================================
beginPrompt = () => {
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
        if (response.view == "View Departments") { viewDepartments() };
        if (response.view == "View Employees") { viewEmployees() };
        if (response.view == "View Roles") { viewRoles(); }

        if (response.add == "New Department") { addDepartments() };
        if (response.add == "New Employee") { addEmployees() };
        if (response.add == "New Role") { addRoles(); }

        for (i = 0, i < employeesArray.length; i++){
            if (response.update == employeesArray[i]) { updateEmployee(); };
        }


    })
}
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
    });
}
getDepartments = () => {
    return new Promise(function(resolve, reject) {
        connection.query("SELECT * FROM department", (err, data) => {
            if (err) {
                return reject(err);
            }
            resolve(data);
        });
    });
}
getRoles = () => {
    return new Promise(function(resolve, reject) {
        connection.query("SELECT * FROM role", (err, data) => {
            if (err) {
                return reject(err);
            }
            resolve(data);
        });
    });
}
// =====================================================================^


// getDepartments().then(function(data) {
//     console.log (data.length);
//     for (i = 0; i < data.length; i++) {
//         departmentsArray.push(data[i].name)
//     }
//     console.log(departmentsArray)
// }).catch((err) => setImmediate(() => { throw err; }));

// getRoles().then(function(data) {
//     console.log (data.length);
//     for (i = 0; i < data.length; i++) {
//         rolesArray.push(data[i].title)
//     }
//     console.log(rolesArray)
// }).catch((err) => setImmediate(() => { throw err; }));



// DISPLAY TABLE FUNCTIONS =============================================
// ==================================================================
viewDepartments = () => {
    connection.query("SELECT * FROM department", (err, data) => {
        if (err) throw err;
        console.table(data);
        finishPrompts();
    });
}

viewEmployees = () => {
    connection.query("SELECT * FROM employee", (err, data) => {
        if (err) throw err;
        console.table(data);
    });
    finishPrompts();
}

viewRoles = () => {
    connection.query("SELECT * FROM role", (err, data) => {
        if (err) throw err;
        console.table(data);
    });
    finishPrompts();
}
// ==================================================================^



// ADD TO TABLE FUNCTIONS ===========================================
// ==================================================================
addDepartments = () => {
    inquirer
    .prompt(addDepartmentPrompt)
    .then((response) => {
        connection.query(`INSERT INTO department (name) values` +
        `("${response.departmentName}");`), 
            (err, data) => {if (err) throw err;}
        console.log("Department Added.")
    })
    finishPrompts();
}

addEmployees = () => {
    inquirer
    .prompt(addEmployeePrompt)
    .then((response) => {
        connection.query(`INSERT INTO employee (first_name, last_name, role_id, manager_id) values` +
        `("${response.employeeFirstName}", "${response.employeeLastName}", "${response.employeeRole}", "${response.employeeManager}");`), 
            (err, data) => {if (err) throw err;}
        console.log("Employee Added.")
    })
    finishPrompts();
}

addRoles = () => {
    inquirer
    .prompt(addEmployeePrompt)
    .then((response) => {
        connection.query(`INSERT INTO employee (first_name, last_name, role_id, manager_id) values` +
        `("${response.employeeFirstName}", "${response.employeeLastName}", "${response.employeeRole}", "${response.employeeManager}");`), 
            (err, data) => {if (err) throw err;}
        console.log("Employee Added.")
    })
    finishPrompts();
}
// ==================================================================^



// ADD TO TABLE FUNCTIONS ===========================================
// ==================================================================
addRoles = () => {
    inquirer
    .prompt(addEmployeePrompt)
    .then((response) => {
        connection.query(`INSERT INTO employee (first_name, last_name, role_id, manager_id) values` +
        `("${response.employeeFirstName}", "${response.employeeLastName}", "${response.employeeRole}", "${response.employeeManager}");`), 
            (err, data) => {if (err) throw err;}
        console.log("Employee Added.")
    })
    finishPrompts();
}


finishPrompts = () => {
    inquirer
    .prompt(finished)
    .then((response) => {
        if (response) {
            askContinue();
        }
    })
}
// ==================================================================^

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
    })
}


init = () => {
    beginPrompt()
}
