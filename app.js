//* -------------------------------
// *Dependencies
//* -------------------------------
const figlet = require('figlet');
const mysql = require('mysql');
const inquirer = require('inquirer');
const chalk = require('chalk');
const conTable = require('console.table');
const util = require('util');

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

const query = util.promisify(connection.query).bind(connection);

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
                'Add Employee',
                // 'Remove Employee',
                'Add Department',
                // 'Update Employee Role',
                // 'Update Employee Manager',
                'View All Roles',
                'Add Role',
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

                case 'Add Employee':
                    addEmp();
                    break;

                // case 'Remove Employee':
                //     removeEmp();
                //     break;

                case 'Add Department':
                    addDept();
                    break;

                // case 'Update Employee Role':
                //     updateRole();
                //     break;

                // case 'Update Employee Manager':
                //     updateManager();
                //     break;

                case 'View All Roles':
                    viewAllRoles();
                    break;

                case 'Add Role':
                    addRole();
                    break;

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
function addEmp() {
    inquirer
        .prompt([
            {
                name: 'newEmpFirst',
                type: 'input',
                message: 'Please enter the first name of the employee',
                validate: function (value) {
                    if (!value) {
                        console.log(chalk.cyan('Please enter a name.'));
                        return false;
                    }
                    return true;
                },
            },
            {
                name: 'newEmpLast',
                type: 'input',
                message: 'Please enter the last name of the employee',
                validate: function (value) {
                    if (!value) {
                        console.log(chalk.cyan('Please enter a name.'));
                        return false;
                    }
                    return true;
                },
            },
            {
                name: 'newEmpRole',
                type: 'list',
                message: 'What is this employees title?',
                choices: listTitles(),
            },
            {
                name: 'newEmpMgr',
                type: 'list',
                message: 'Who is this employees manager?',
                choices: () => listManagers(),
            },
        ])
        .then(function (response) {
            const mgrArr = response.newEmpMgr.split(' ');
            const mgrfirst = mgrArr[0];
            const mgrlast = mgrArr[1];
            const newEmpFirst = response.newEmpFirst;
            const newEmpLast = response.newEmpLast;
            const newEmpRole = response.newEmpRole;

            connection.query(
                `SELECT id FROM roles WHERE title = '${newEmpRole}'`,
                function (err, title) {
                    if (err) throw err;
                    connection.query(
                        `SELECT id FROM employees WHERE first_name = '${mgrfirst}' AND last_name = '${mgrlast}'`,
                        function (err, manager) {
                            if (err) throw err;
                            connection.query(
                                'INSERT INTO employees set ?',
                                {
                                    first_name: newEmpFirst,
                                    last_name: newEmpLast,
                                    role_id: title[0].id,
                                    manager_id: manager[0].id,
                                },
                                function (err, res) {
                                    if (err) throw err;
                                    console.log(
                                        chalk.cyan(
                                            'Employee successfully added'
                                        )
                                    );
                                    mainMenu();
                                }
                            );
                        }
                    );
                }
            );
        });
}

function addDept() {
    inquirer
        .prompt({
            name: 'newDept',
            type: 'input',
            message: 'Please enter the name of the new department',
            validate: function (value) {
                if (!value) {
                    console.log(
                        chalk.cyan('Please enter a name for the department.')
                    );
                    return false;
                }
                return true;
            },
        })
        .then(function (response) {
            const newDept = response.newDept;
            connection.query(
                'INSERT INTO departments SET ?',
                {
                    name: newDept,
                },
                function (err, res) {
                    if (err) throw err;
                    console.log(chalk.cyan('Department added successfully'));
                    mainMenu();
                }
            );
        });
}

function addRole() {
    inquirer
        .prompt([
            {
                name: 'newRole',
                type: 'input',
                message: 'Please enter the title of the new role',
                validate: function (value) {
                    if (!value) {
                        console.log(
                            chalk.cyan('Please enter a name for the role.')
                        );
                        return false;
                    }
                    return true;
                },
            },
            {
                name: 'newRoleDept',
                type: 'list',
                message: 'To which department does this role report?',
                choices: listDepts(),
            },
            {
                name: 'newRoleSalary',
                type: 'input',
                message: 'Please provide a starting salary for this position.',
                validate: function (value) {
                    if (!value || !value.match(/^\d+/)) {
                        console.log(
                            chalk.cyan(
                                'Please enter a valid salary for the role.'
                            )
                        );
                        return false;
                    }
                    return true;
                },
            },
        ])
        .then(async function (response) {
            const newRole = response.newRole;
            const newRoleDept = response.newRoleDept;

            const roleID = await query(
                `SELECT id FROM departments WHERE name = '${newRoleDept}'`
            );

            await query('INSERT INTO roles SET ?', {
                title: newRole,
                dept_id: roleID[0].id,
            });

            console.log(chalk.cyan('Role added successfully'));
            mainMenu();

            // connection.query(
            //     `SELECT id FROM departments WHERE name = '${newRoleDept}'`,
            //     function (err, res) {
            //         if (err) throw err;
            //         connection.query(
            //             'INSERT INTO roles SET ?',
            //             {
            //                 title: newRole,
            //                 dept_id: res[0].id,
            //             },
            //             function (err, res) {
            //                 if (err) throw err;
            //                 console.log(chalk.cyan('Role added successfully'));
            //                 mainMenu();
            //             }
            //         );
            //     }
            // );
        });
}

//* -------------------------------
// * Update functions
//* -------------------------------
// function updateRole() {

// }

// function updateManager() {}

//* -------------------------------
// * Remove functions
//* -------------------------------
// function removeEmp() {}

// function removeRoles() {}

//* -------------------------------
// * Helper functions
//* -------------------------------
const listManagers = async () => {
    let managers;
    managers = await query('SELECT * FROM employees');
    const empName = managers.map((employee) => {
        return `${employee.first_name} ${employee.last_name}`;
    });
    return empName;
};

function listDepts() {
    let deptArr = [];
    connection.query('SELECT * FROM departments', function (err, results) {
        if (err) throw err;
        for (var i = 0; i < results.length; i++) {
            deptArr.push(results[i].name);
        }
    });
    return deptArr;
}

function listTitles() {
    let titleArr = [];
    connection.query('SELECT * FROM roles', function (err, results) {
        if (err) throw err;
        for (var i = 0; i < results.length; i++) {
            titleArr.push(results[i].title);
        }
    });
    return titleArr;
}
