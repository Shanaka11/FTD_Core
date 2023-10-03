import mysql from "mysql2/promise";

import { getConnection } from "./connecter.js";

export const makeExecuteQuery =
  (connection: mysql.PoolConnection) => async (query: string) => {
    try {
      const result = await connection.query(query);
      //   await connection.commit();
      console.log(result);
      return result;
    } catch (e) {
      // await pool.releas
      if (e instanceof Error) {
        throw new Error(`DB Connection Error: ${e.message}`);
      } else {
        throw e;
      }
    }
  };

export const executeQuery = async (query: string) => {
  try {
    const connection = await getConnection();
    const result = await connection.query(query);
    console.log(result);
    return result;
  } catch (e) {
    if (e instanceof Error) {
      throw new Error(`DB Connection Error: ${e.message}`);
    } else {
      throw e;
    }
  }
};
