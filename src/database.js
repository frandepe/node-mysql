const mysql = require("mysql");
// pool no soporta async await ni promesas, por eso usamos promisify
const { promisify } = require("util");

const { database } = require("./keys");

// createPool es una especie de hilos que se ejecutan y cada uno hace una tarea a la vez
// con esto le damos la configuración a nuestra base de datos
const pool = mysql.createPool(database);

pool.getConnection((err, connection) => {
  if (err) {
    if (err.code === "PROTOCOL_CONNECTION_LOST") {
      console.error("DATABASE CONNECTION WAS CLOSED");
    }
    if (err.code === "ER_CON_COUNT_ERROR") {
      console.error("DATABASE HAS TO MANY CONNECTIONS");
    }
    if (err.code === "ECONNREFUSED") {
      console.error("DATABASE CONNECTION WAS REFUSED");
    }
  }

  if (connection) connection.release();
  console.log("DB is Connected");
  return;
});

// Promisify pool querys
pool.query = promisify(pool.query);

module.exports = pool;
