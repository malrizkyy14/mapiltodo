CREATE DATABASE IF NOT EXISTS defaultdb;
USE defaultdb;

CREATE TABLE IF NOT EXISTS siswa (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nama VARCHAR(100) NOT NULL,
  kelas VARCHAR(50) NOT NULL,
  jurusan VARCHAR(50) NOT NULL
);

INSERT INTO siswa (nama, kelas, jurusan)
SELECT 'Budi Santoso', 'XI RPL 1', 'RPL'
WHERE NOT EXISTS (
  SELECT 1 FROM siswa
  WHERE nama = 'Budi Santoso' AND kelas = 'XI RPL 1' AND jurusan = 'RPL'
);

INSERT INTO siswa (nama, kelas, jurusan)
SELECT 'Siti Aminah', 'XI RPL 2', 'RPL'
WHERE NOT EXISTS (
  SELECT 1 FROM siswa
  WHERE nama = 'Siti Aminah' AND kelas = 'XI RPL 2' AND jurusan = 'RPL'
);
