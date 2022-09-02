CREATE DATABASE database_links;

USE database_links;

--USERS TABLE

CREATE TABLE users(
    id INT(11) NOT NULL,
    username VARCHAR(16) NOT NULL,
    password VARCHAR(60) NOT NULL,
    fullname VARCHAR(100) NOT NULL
);
-- alterar la tabla users
ALTER TABLE users
    ADD PRIMARY KEY (id);

ALTER TABLE users
    MODIFY id INT(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT = 2;

DESCRIBE users;

-- LINKS TABLES
--? user_id es para decirle que ese enlace le pertenece a un usuario específico
--? de esa manera vamos a ver solo los enlaces q le pertenecen al usuario loguear
--? current_timestamp genera automaticamente la fecha actual
--* user_id INT(11) está relacionado con la otra table
--* cada enlace que yo guarde va a estar relacionado con un id especifico de la tabla users
CREATE TABLE links (
    id INT(11) NOT NULL,
    title VARCHAR(150) NOT NULL,
    url VARCHAR(255) NOT NULL,
    description TEXT,
    user_id INT(11),
    created_at timestamp NOT NULL DEFAULT current_timestamp,
    CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(id)
);

-- esto es por si nos faltó agregar algo en la tabla
ALTER TABLE links
    ADD PRIMARY KEY(id)

ALTER TABLE links
    MODIFY id INT(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT = 2;

DESCRIBE links;