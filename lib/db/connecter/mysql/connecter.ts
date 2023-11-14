import mysql from "mysql2/promise";

let connection: mysql.Pool;

export const getConnection = () => {
  if (!connection) {
    console.log("Initialized Pool");
    // Check env vars
    if (process.env.DB_HOST === undefined) {
      throw new Error("DB Host undefined");
    }
    if (process.env.DB_USER === undefined) {
      throw new Error("DB User undefined");
    }
    if (process.env.DB_PORT === undefined) {
      throw new Error("DB Port undefined");
    }
    if (process.env.DB_PASSWORD === undefined) {
      throw new Error("DB Password undefined");
    }
    if (process.env.DB_NAME === undefined) {
      throw new Error("DB Name undefined");
    }
    connection = mysql.createPool({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      port: parseInt(process.env.DB_PORT),
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });
  }
  return connection.getConnection();
};
