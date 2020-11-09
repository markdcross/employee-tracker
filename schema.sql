DROP DATABASE IF EXISTS employees_db;

CREATE database employees_db;

USE employees_db;

-- create the departments table
CREATE TABLE departments (
    id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(30),
    PRIMARY KEY (id)
);

-- create the roles table
CREATE TABLE roles (
    id INT NOT NULL AUTO_INCREMENT,
    title VARCHAR(30),
    salary DECIMAL (10, 2) NOT NULL DEFAULT 0,
    dept_id INT NOT NULL REFERENCES departments(id),
    PRIMARY KEY (id)
);

-- create the employees table
CREATE TABLE employees (
    id INT NOT NULL AUTO_INCREMENT,
    first_name VARCHAR(30),
    last_name VARCHAR(30),
    role_id INT NOT NULL REFERENCES roles(id),
    manager_id INT NULL DEFAULT 0,
    PRIMARY KEY (id)
);
+