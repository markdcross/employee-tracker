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

const welcome = () => {
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
};

//* -------------------------------
// * Main Menu
//* -------------------------------

const mainMenu = () => {
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
                'Update Employee Role',
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

                case 'Update Employee Role':
                    updateRole();
                    break;

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
};

//TODO: What can be organized in a separate file?

//* -------------------------------
// * View functions
//* -------------------------------

const viewEmp = async () => {
    const empTable = await query(
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
		employees_db.employees m ON e.manager_id = m.id;`
    );
    console.table(empTable);
    mainMenu();
};

const viewDept = async () => {
    const empDeptTable = await query(
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
        ORDER BY departments.name;`
    );
    console.table(empDeptTable);
    mainMenu();
};

const viewRole = async () => {
    const empRoleTable = await query(
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
        ORDER BY roles.title;`
    );
    console.table(empRoleTable);
    mainMenu();
};

const viewManager = async () => {
    const mgrTable = await query(
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
        ORDER BY e.manager_id;`
    );
    console.table(mgrTable);
    mainMenu();
};

const viewAllRoles = async () => {
    const roleTable = await query(
        `SELECT 
        departments.name AS 'Department',
        r.title AS 'Title'
    FROM 
        employees_db.roles AS r 
            INNER JOIN 
        departments ON (r.dept_id = departments.id)
        ORDER BY departments.name;`
    );
    console.table(roleTable);
    mainMenu();
};

//* -------------------------------
// * Add functions
//* -------------------------------
const addEmp = () => {
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
                choices: () => listTitles(),
            },
            {
                name: 'newEmpMgr',
                type: 'list',
                message: 'Who is this employees manager?',
                choices: () => listEmps(),
            },
        ])
        .then(async function (response) {
            const mgrArr = response.newEmpMgr.split(' ');
            const mgrfirst = mgrArr[0];
            const mgrlast = mgrArr[1];
            const newEmpFirst = response.newEmpFirst;
            const newEmpLast = response.newEmpLast;
            const newEmpRole = response.newEmpRole;

            const empRole = await query(`SELECT id FROM roles WHERE ?`, {
                title: newEmpRole,
            });

            const empMgrID = await query(
                'SELECT id FROM employees WHERE ? AND ?',
                [{ first_name: mgrfirst }, { last_name: mgrlast }]
            );

            await query('INSERT INTO employees set ?', {
                first_name: newEmpFirst,
                last_name: newEmpLast,
                role_id: empRole[0].id,
                manager_id: empMgrID[0].id,
            });

            console.log(chalk.cyan('Employee successfully added'));
            mainMenu();
        });
};

const addDept = () => {
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
        .then(async function (response) {
            const newDept = response.newDept;

            await query('INSERT INTO departments SET ?', {
                name: newDept,
            });

            console.log(chalk.cyan('Department added successfully'));
            mainMenu();
        });
};

const addRole = () => {
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
                choices: () => listDepts(),
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

            const roleID = await query('SELECT id FROM departments WHERE ?', {
                name: newRoleDept,
            });

            await query('INSERT INTO roles SET ?', {
                title: newRole,
                dept_id: roleID[0].id,
            });

            console.log(chalk.cyan('Role added successfully'));
            mainMenu();
        });
};

//* -------------------------------
// * Update functions
//* -------------------------------
const updateRole = () => {
    inquirer
        .prompt([
            {
                name: 'employee',
                type: 'list',
                message: 'Whose role would you like to update?',
                choices: () => listEmps(),
            },
            {
                name: 'role',
                type: 'list',
                message: 'What is this employees new title?',
                choices: () => listTitles(),
            },
        ])
        .then(async function (response) {
            const empArr = response.employee.split(' ');
            const empfirst = empArr[0];
            const emplast = empArr[1];
            const newRole = response.role;

            const updatedRole = await query('SELECT id FROM roles WHERE ?', {
                title: newRole,
            });

            const empID = await query(
                'SELECT id FROM employees WHERE ? AND ?',
                [{ first_name: empfirst }, { last_name: emplast }]
            );

            await query('UPDATE employees SET ? WHERE ?', [
                {
                    role_id: updatedRole[0].id,
                },
                {
                    id: empID[0].id,
                },
            ]);

            console.log(chalk.cyan('Role updated successfully'));
            mainMenu();
        });
};

// function updateManager() {}

//* -------------------------------
// * Remove functions
//* -------------------------------
// function removeEmp() {}

// function removeRoles() {}

//* -------------------------------
// * Helper functions
//* -------------------------------
const listEmps = async () => {
    let employees;
    employees = await query('SELECT * FROM employees');
    const empName = employees.map((employee) => {
        return `${employee.first_name} ${employee.last_name}`;
    });
    return empName;
};

const listDepts = async () => {
    let deptArr;
    deptArr = await query('SELECT * FROM departments');
    const deptList = deptArr.map((department) => {
        return `${department.name}`;
    });
    return deptList;
};

const listTitles = async () => {
    let titleArr;
    titleArr = await query('SELECT * FROM roles');
    const titleList = titleArr.map((position) => {
        return `${position.title}`;
    });
    return titleList;
};
