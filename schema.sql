DROP DATABASE IF EXISTS employeessDB;
CREATE database employeesDB;

USE employeesDB;

CREATE TABLE department (
  id INT NOT NULL,
  name VARCHAR(30) NULL,
  PRIMARY KEY (id)
);

CREATE TABLE role (
  id INT NOT NULL,
  title VARCHAR(30) NOT NULL,
  salary DECIMAL(10, 2) NOT NULL,
  department_id INT NOT NULL,
  PRIMARY KEY (id)
);

CREATE TABLE employee (
  id INT NOT NULL,
  first_name VARCHAR(30) NOT NULL,
  second_name VARCHAR(30) NOT NULL,
  role_id INT NOT NULL,
  manager_id INT NULL,
  PRIMARY KEY (id)
);