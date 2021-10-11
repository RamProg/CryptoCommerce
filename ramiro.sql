CREATE DATABASE prueba;
USE prueba;
CREATE TABLE items (
nombre varchar(64) not null,
categoria varchar(64) not null,
stock int unsigned,
id int AUTO_INCREMENT primary key not null);
INSERT INTO items (nombre, categoria, stock) VALUES ("Fideos", "Harina", 20);
INSERT INTO items (nombre, categoria, stock) VALUES ("Leche", "Lacteos", 30);
INSERT INTO items (nombre, categoria, stock) VALUES ("Crema", "Lacteos", 15);
SELECT * FROM items;
DELETE FROM items WHERE id = 1;
UPDATE items SET stock=45 WHERE id=2;
SELECT * FROM items;