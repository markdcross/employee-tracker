//* -------------------------------
// *Dependencies
//* -------------------------------
const figlet = require('figlet');
const mysql = require('mysql');
const inquirer = require('inquirer');
const chalk = require('chalk');
const conTable = require('console.table');

var connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '',
    database: 'employees_db',
});

connection.connect(function (err) {
    if (err) throw err;
    welcome();
});

function welcome() {
    figlet.text(
        'Employee Tracker',
        {
            font: 'roman',
            horizontalLayout: 'default',
            verticalLayout: 'default',
            width: 150,
            whitespaceBreak: true,
        },
        function (err, data) {
            if (err) {
                console.log('Something went wrong...');
                console.dir(err);
                return;
            }
            console.log(chalk.cyan(data));
            console.log('-'.repeat(95));
            mainMenu();
        }
    );
}

function mainMenu() {
    inquirer
        .prompt({
            name: 'menu',
            type: 'list',
            message:
                'Welcome to the Employee Tracker. Please Choose from the list below:',
            choices: [
                'Add Department',
                'Add Role',
                'Add Employee',
                'View Department',
                'View Role',
                'View Employee',
                'Update Employee Role',
                'Exit',
            ],
        })
        .then(function (answer) {
            //TODO: Add the appropriate functions below
            //TODO: Remove breaks?
            switch (answer.menu) {
                case 'Add Department':
                    addDept();
                    break;

                case 'Add Role':
                    addRole();
                    break;

                case 'Add Employee':
                    addEmp();
                    break;

                case 'View Department':
                    viewDept();
                    break;

                case 'View Role':
                    viewRole();
                    break;

                case 'View Employee':
                    viewEmp();
                    break;

                case 'Update Employee Role':
                    updateRole();
                    break;

                case 'Exit':
                    connection.end();
                    break;
            }
        });
}

//TODO: FUNCTIONS!
