import mysql from "mysql2/promise";

export const testSql = async () => {
  try {
    const connection = await mysql.createConnection({
      host: "localhost",
      user: "root",
      port: 3306,
      password: "1234",
      database: "dev",
    });
    const result = await connection.query(`SELECT * FROM CustomerOrder`);
    console.log(result[0]);
    return result;
  } catch (e) {
    if (e instanceof Error) {
      console.error(e.message);
    } else {
      throw e;
    }
  }
};
