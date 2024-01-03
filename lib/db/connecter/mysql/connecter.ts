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
      timezone: "+00:00", // UTC
    });

    // connection.on("connection", async (connection) => {
    //   await connection.query('SET time_zone="+00:00";', (err: unknown) => {
    //     if (!!err && err instanceof Error) {
    //       throw new Error(err.message);
    //     }
    //     return new Error(
    //       "There was an error when setting the db connection timezone.",
    //     );
    //   });
    // });
  }
  return connection.getConnection();
};

// Can execute multiple statements, Do not use in client
export const getAdminConnection = () => {
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
  const connection = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    port: parseInt(process.env.DB_PORT),
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    multipleStatements: true,
    timezone: "utc",
  });

  connection.on("connection", async (connection) => {
    await connection.query('SET time_zone="+00:00";', (err: unknown) => {
      if (!!err && err instanceof Error) {
        throw new Error(err.message);
      }
      return new Error(
        "There was an error when setting the db connection timezone.",
      );
    });
  });

  return connection.getConnection();
};
