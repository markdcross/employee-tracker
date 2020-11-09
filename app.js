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
            console.log(chalk.cyan('-'.repeat(95)));
            mainMenu();
        }
    );
}

//* -------------------------------
// * Main Menu
//* -------------------------------

function mainMenu() {
    inquirer
        .prompt({
            name: 'menu',
            type: 'list',
            message:
                'Welcome to the Employee Tracker. Please Choose from the list below:',
            choices: [
                'View All Employees',
                'View Employees by Department',
                'View Employees by Title',
                'View Employees by Manager',
                'Add Employee',
                // 'Remove Employee',
                // 'Add Department',
                // 'Add Role',
                // 'Update Employee Role',
                // 'View All Roles',
                'Exit',
            ],
        })
        .then(function (answer) {
            switch (answer.menu) {
                case 'View All Employees':
                    viewEmp();
                    break;

                case 'View Employees by Department':
                    viewDept();
                    break;

                case 'View Employees by Role':
                    viewRole();
                    break;

                case 'View Employees by Manager':
                    viewManager();
                    break;

                // case 'Add Employee':
                //     addEmp();
                //     break;

                // case 'Add Department':
                //     addDept();
                //     break;

                // case 'Add Role':
                //     addRole();
                //     break;

                // case 'Update Employee Role':
                //     updateRole();
                //     break;

                // case 'View All Roles':
                //     viewAllRoles();
                //     break;

                case 'Exit':
                    connection.end();
                    break;
            }
        });
}

//* -------------------------------
// * View functions
//* -------------------------------

function viewEmp() {
    console.log(chalk.cyan('-'.repeat(95)));

    console.log(chalk.cyan('Here are all of your employees:'));
    console.log(chalk.cyan('-'.repeat(95)));

    //TODO: Join all tables
    //TODO: Console.table joined table
    //TODO: Is query called anywhere or can it be removed?
    let query = connection.query(
        `SELECT 
        e.id AS 'ID',
        e.first_name AS 'First Name',
        e.last_name AS 'Last Name',
        departments.name AS 'Department',
		roles.title AS 'Title',
		roles.salary AS 'Salary',

		CONCAT(m.first_name, ' ', m.last_name) AS Manager
	FROM
		employees_db.employees AS e
			INNER JOIN
		roles ON (e.role_id = roles.id)
			INNER JOIN
		departments ON (roles.dept_id = departments.id)
			LEFT JOIN
		employees_db.employees m ON e.manager_id = m.id;`,
        function (err, res) {
            if (err) throw err;
            console.table(res);
            mainMenu();
        }
    );
}

function viewDept() {
    console.log(chalk.cyan('-'.repeat(95)));
    console.log(chalk.cyan('Your employees by department:'));
    console.log(chalk.cyan('-'.repeat(95)));

    let query = connection.query(
        `SELECT 
        e.id AS 'ID',
        e.first_name AS 'First Name',
        e.last_name AS 'Last Name',
        departments.name AS 'Department',
		roles.title AS 'Title',
		roles.salary AS 'Salary',

		CONCAT(m.first_name, ' ', m.last_name) AS Manager
	FROM
		employees_db.employees AS e
			INNER JOIN
		roles ON (e.role_id = roles.id)
			INNER JOIN
		departments ON (roles.dept_id = departments.id)
			LEFT JOIN
        employees_db.employees m ON e.manager_id = m.id
        ORDER BY departments.name;`,
        function (err, res) {
            if (err) throw err;
            console.table(res);
            mainMenu();
        }
    );
}

function viewRole() {
    console.log(chalk.cyan('-'.repeat(95)));
    console.log(chalk.cyan('Your employees by role:'));
    console.log(chalk.cyan('-'.repeat(95)));

    let query = connection.query(
        `SELECT 
        e.id AS 'ID',
        e.first_name AS 'First Name',
        e.last_name AS 'Last Name',
        departments.name AS 'Department',
		roles.title AS 'Title',
		roles.salary AS 'Salary',

		CONCAT(m.first_name, ' ', m.last_name) AS Manager
	FROM
		employees_db.employees AS e
			INNER JOIN
		roles ON (e.role_id = roles.id)
			INNER JOIN
		departments ON (roles.dept_id = departments.id)
			LEFT JOIN
        employees_db.employees m ON e.manager_id = m.id
        ORDER BY roles.title;`,
        function (err, res) {
            if (err) throw err;
            console.table(res);
            mainMenu();
        }
    );
}

// function viewManager() {

// }

//* -------------------------------
// * Add functions
//* -------------------------------
// function addEmp() {}

// function addDept() {}

// function addRole() {}

//* -------------------------------
// * Update functions
//* -------------------------------
// function updateRole() {}

//TODO: what can be functionized in a separate file?
