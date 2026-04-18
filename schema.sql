-- ==========================================================
-- SCHEMA DATABASE: smart-saga
-- Deskripsi: Skema lengkap untuk sistem Absensi IoT Smart Saga
-- ==========================================================

-- 1. Tabel Roles
CREATE TABLE IF NOT EXISTS `roles` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `roles` VARCHAR(50) NOT NULL
);

-- 2. Tabel Users
CREATE TABLE IF NOT EXISTS `users` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `username` VARCHAR(50) NOT NULL UNIQUE,
  `password` VARCHAR(255) NOT NULL,
  `roles_id` INT,
  FOREIGN KEY (`roles_id`) REFERENCES `roles`(`id`)
);

-- 3. Tabel Data Mapping (RFID to Student)
CREATE TABLE IF NOT EXISTS `data_mapping` (
  `card_uid` VARCHAR(50) PRIMARY KEY,
  `nama` VARCHAR(100) NOT NULL,
  `kelas` VARCHAR(50) NOT NULL
);

-- 4. Tabel Absensi Log
CREATE TABLE IF NOT EXISTS `absensi_log` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `card_uid` VARCHAR(50),
  `mac` VARCHAR(50),
  `tanggal` DATE,
  `jam_masuk` TIME,
  `status` VARCHAR(20),
  INDEX (`card_uid`),
  INDEX (`tanggal`)
);

-- 5. Tabel Perizinan
CREATE TABLE IF NOT EXISTS `perizinan` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT,
  `nama_siswa` VARCHAR(100),
  `kelas_siswa` VARCHAR(50),
  `alasan` TEXT,
  `bukti` VARCHAR(255),
  `status` ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`)
);

-- 6. Tabel Setting Jam
CREATE TABLE IF NOT EXISTS `setting_jam` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `jam_masuk` TIME NOT NULL,
  `jam_pulang` TIME NOT NULL
);

-- 7. Tabel Broker Config
CREATE TABLE IF NOT EXISTS `broker_config` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user` VARCHAR(50),
  `password` VARCHAR(50),
  `host` VARCHAR(100)
);

-- ==========================================================
-- SEED DATA (DATA AWAL)
-- ==========================================================

-- Masukkan Roles
INSERT INTO `roles` (`id`, `roles`) VALUES 
(1, 'admin'), 
(2, 'user'), 
(3, 'murid');

-- Masukkan Admin Default (username: admin, password: admin)
-- Catatan: Password admin ini adalah plain text untuk awal, 
-- backend Anda memiliki sistem hybrid yang mendukungnya.
INSERT INTO `users` (`username`, `password`, `roles_id`) VALUES 
('admin', 'admin', 1);

-- Masukkan Setting Jam Sekolah Default
INSERT INTO `setting_jam` (`jam_masuk`, `jam_pulang`) VALUES 
('07:00:00', '15:00:00');

-- Masukkan Broker Config Awal
INSERT INTO `broker_config` (`user`, `password`, `host`) VALUES 
('admin', 'admin', 'localhost');
