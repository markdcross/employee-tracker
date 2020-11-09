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
                'View Employees by Role',
                'View Employees by Manager',
                // 'Add Employee',
                // 'Remove Employee',
                // 'Add Department',
                // 'Update Employee Role',
                // 'Update Employee Manager',
                'View All Roles',
                // 'Add Role',
                // 'Remove Role
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

                // case 'Remove Employee':
                //     removeEmp();
                //     break;

                // case 'Add Department':
                //     addDept();
                //     break;

                // case 'Update Employee Role':
                //     updateRole();
                //     break;

                // case 'Update Employee Manager':
                //     updateManager();
                //     break;

                case 'View All Roles':
                    viewAllRoles();
                    break;

                // case 'Add Role':
                //     addRole();
                //     break;

                // case 'Remove Role':
                //     removeRoles();
                //     break;

                case 'Exit':
                    connection.end();
                    break;
            }
        });
}

//TODO: What can be functionized in a separate file?
//TODO: Update to arrow functions?
//* -------------------------------
// * View functions
//* -------------------------------

function viewEmp() {
    console.log(chalk.cyan('-'.repeat(95)));

    console.log(chalk.cyan('Here are all of your employees:'));
    console.log(chalk.cyan('-'.repeat(95)));

    connection.query(
        `SELECT 
        e.id AS 'Employee ID',
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

    connection.query(
        `SELECT 
        e.id AS 'Employee ID',
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

    connection.query(
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

function viewManager() {
    console.log(chalk.cyan('-'.repeat(95)));
    console.log(chalk.cyan('Your employees by manager:'));
    console.log(chalk.cyan('-'.repeat(95)));

    connection.query(
        `SELECT 
        e.id AS 'Employee ID',
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
        ORDER BY e.manager_id;`,
        function (err, res) {
            if (err) throw err;
            console.table(res);
            mainMenu();
        }
    );
}

function viewAllRoles() {
    console.log(chalk.cyan('-'.repeat(95)));
    console.log(chalk.cyan('Your currently available roles:'));
    console.log(chalk.cyan('-'.repeat(95)));
    connection.query(
        `SELECT 
        departments.name AS 'Department',
        r.title AS 'Title'
    FROM 
        employees_db.roles AS r 
            INNER JOIN 
        departments ON (r.dept_id = departments.id)
        ORDER BY departments.name;`,
        function (err, res) {
            if (err) throw err;
            console.table(res);
            mainMenu();
        }
    );
}

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

// function updateManager() {}

//* -------------------------------
// * Remove functions
//* -------------------------------
// function removeEmp() {}

// function removeRoles() {}
