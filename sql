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


CREATE TABLE pending_emails (
  id INT AUTO_INCREMENT PRIMARY KEY,
  to_email VARCHAR(255) NOT NULL,
  subject VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  html_message TEXT,
  send_at DATETIME NOT NULL,
  sent TINYINT(1) DEFAULT 0
);