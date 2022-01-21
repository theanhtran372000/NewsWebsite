-- Tạo database news_website
CREATE DATABASE news_website;

-- Chuyển hướng tới database vừa tạo
USE news_website;

-- Tạo các bảng cần thiết
CREATE TABLE admin (
	id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    password VARCHAR(50) NOT NULL,
    hoten VARCHAR(50) NOT NULL,
    avatar VARCHAR(100) NOT NULL,
    ngaybatdau DATETIME NOT NULL
);

CREATE TABLE user (
	id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    password VARCHAR(50) NOT NULL
);

CREATE TABLE chude (
	id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    tenchude VARCHAR(50) NOT NULL
);

CREATE TABLE baibao (
	id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    chudeid INT NOT NULL,
    adminid INT NOT NULL,
    tieude VARCHAR(1000) NOT NULL,
    noidung VARCHAR(5000) NOT NULL,
    anh VARCHAR(100) NOT NULL,
    nguongoc VARCHAR(50) NOT NULL,
    thoigian DATETIME NOT NULL,
    FOREIGN KEY (chudeid) REFERENCES chude(id),
    FOREIGN KEY (adminid) REFERENCES admin(id)
);

CREATE TABLE comment (
	id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    baibaoid INT NOT NULL,
    userid INT NOT NULL,
    noidung VARCHAR(1000) NOT NULL,
    rate INT NOT NULL,
    email VARCHAR(50) NOT NULL,
    thoigian DATETIME NOT NULL,
	FOREIGN KEY (baibaoid) REFERENCES baibao(id),
    FOREIGN KEY (userid) REFERENCES user(id)
);

-- Thay đổi tài khoản root -- Có thể thay đổi user và password tương ứng
ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY '123456';
FLUSH PRIVILEGES;