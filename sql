CREATE DATABASE attendance_db;
USE attendance_db;

CREATE TABLE students (
  id INT AUTO_INCREMENT PRIMARY KEY,
  id_number VARCHAR(50) UNIQUE,
  name VARCHAR(100),
  email VARCHAR(100) UNIQUE
);

CREATE TABLE attendance (
  id INT AUTO_INCREMENT PRIMARY KEY,
  student_id INT,
  date DATE,
  time_in DATETIME,
  time_out DATETIME,
  FOREIGN KEY (student_id) REFERENCES students(id)
);
