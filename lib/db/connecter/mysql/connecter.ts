import mysql from "mysql2/promise";

let connection: mysql.Pool;

export const getConnection = () => {
  if (!connection) {
    console.log("Initialized Pool");
    connection = mysql.createPool({
      host: "localhost",
      user: "root",
      port: 3306,
      password: "1234",
      database: "dev",
    });
  }
  return connection.getConnection();
};
