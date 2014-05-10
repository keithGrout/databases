CREATE DATABASE chat;

USE chat;

CREATE TABLE messages (
 /* Describe your table here.*/
 id int(10),
 date datetime,
 text blob,
 user int(10),
 primary key (id)
);

CREATE TABLE users (
 /* Describe your table here.*/
 id int(10),
 name varchar(100),
 messages blob,
 primary key (id)
);

CREATE TABLE rooms (
 /* Describe your table here.*/
 id int(10),
 messages blob,
 name varchar(100),
 primary key (id)
);

ALTER TABLE users MODIFY id int(10) auto_increment;
ALTER TABLE rooms MODIFY id int(10) auto_increment;
ALTER TABLE messages MODIFY id int(10) auto_increment;


/* You can also create more tables, if you need them... */

/*  Execute this file from the command line by typing:
 *    mysql < schema.sql
 *  to create the database and the tables.*/
