import mysql from "mysql2/promise";

export const makeExecuteQuery =
  (connection: mysql.PoolConnection) =>
  async (query: string, parameters?: string[]) => {
    try {
      const result = await connection.execute(
        query,
        parameters ? parameters : [],
      );
      return result[0];
    } catch (e) {
      // await pool.releas
      if (e instanceof Error) {
        connection.release();
        throw new Error(e.message);
      } else {
        throw e;
      }
    }
  };
