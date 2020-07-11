inquirer = require('inquirer');

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
        name: "add",
        message: "What would you like to view?",
        when: (response) => response.actions == "View Database",
        choices: [ 
            "View Employees", new inquirer.Separator(), 
            "View Departments", new inquirer.Separator(),
            "View Roles", new inquirer.Separator(), 
        ],
    },
    {
        type: "list",
        name: "view",
        message: "What would you like to add?",
        when: (response) => response.actions == "Add New Entry to Database",
        choices: [ 
            "New Employee", new inquirer.Separator(), 
            "New Department", new inquirer.Separator(),
            "New actions", new inquirer.Separator(), 
        ],
    },
]

const continuePrompt = [        
    {
    type: "list",
    name: "continue",
    message: "Continue using Database?",
    choices: [ 
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