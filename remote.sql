-- Sử dụng cho cài đặt MySQL từ xa
CREATE USER 'theanh'@'%' IDENTIFIED WITH mysql_native_password BY '123456';
GRANT ALL PRIVILEGES ON *.* TO 'theanh'@'%' WITH GRANT OPTION;
FLUSH PRIVILEGES;
