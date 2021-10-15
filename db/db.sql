CREATE DATABASE proyectoWeb;

USE proyectoWeb;

-- @block
CREATE TABLE users(
    id INT(11) PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(20) NOT NULL,
    password VARCHAR(60) NOT NULL,
    fullname VARCHAR(100) NOT NULL,
    type VARCHAR(10) DEFAULT 'user'
);

-- @BLOCK
CREATE TABLE task(
    id INT(11) PRIMARY KEY AUTO_INCREMENT,
    task VARCHAR(150) NOT NULL,
    beforeHour TIMESTAMP NOT NULL,
    description TEXT,
    userId INT(11),
    setHour TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    priority VARCHAR(60) NOT NULL,
    FOREIGN KEY (userId) REFERENCES users(id)
);

-- @BLOCK
CREATE TABLE banned(
     id INT(11) PRIMARY KEY AUTO_INCREMENT,
     userId INT(11),
     FOREIGN KEY (userId) REFERENCES users(id)
);
