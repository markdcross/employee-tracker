USE employees_db;

INSERT INTO departments (name)
VALUES ("Sales"), ("Service"), ("Tech");

INSERT INTO roles (title, salary, dept_id)
VALUES 
("SDR", 35000, 1), 
("AE", 75000, 1), 
("Customer Service", 45000, 2),
("Junior Dev", 55000, 3), 
("CTO", 275000, 3), 
("Director of Sales", 150000, 1);

INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUES 
("Mark", "Cross", 6, 0),
("Branch", "Feagans", 2, 1),
("Erik", "Skantze", 5, 0),
("John", "Woo", 1, 2),
("Ryan", "Morton", 11, 6),
("Dylan", "Root", 4, 3),
("Dorian", "Rosen", 3, 0);
