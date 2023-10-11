import mysql from "mysql2/promise";

export const makeExecuteQuery =
  (connection: mysql.PoolConnection) => async (query: string) => {
    try {
      const result = await connection.query(query);
      return result[0];
    } catch (e) {
      // await pool.releas
      if (e instanceof Error) {
        throw new Error(`DB Connection Error: ${e.message}`);
      } else {
        throw e;
      }
    }
  };
