import mysql from "mysql2/promise.js";

import { getConnection } from "./connecter.js";

export const executeTransaction = async (
  transaction: (con: mysql.PoolConnection) => Promise<void>,
) => {
  const connection = await getConnection();
  try {
    await connection.beginTransaction();
    await transaction(connection);
    await connection.commit();
  } catch (e) {
    await connection.rollback();
  }
};
