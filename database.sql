CREATE DATABASE IF NOT EXISTS defaultdb;
USE defaultdb;

CREATE TABLE IF NOT EXISTS siswa (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nama VARCHAR(100) NOT NULL,
  kelas VARCHAR(50) NOT NULL,
  jurusan VARCHAR(50) NOT NULL
);

INSERT INTO siswa (nama, kelas, jurusan) VALUES
('Budi Santoso', 'XI RPL 1', 'RPL'),
('Siti Aminah', 'XI RPL 2', 'RPL');
