import { TExecuteQuery } from "../../../../types/repositoryTypes.js";
import { getConnection } from "./connecter.js";
import { makeExecuteQuery } from "./executeQuery.js";

// TODO: Add another genric to denote the return type of the transaction, the whole transaction, not the execute query function
export const executeTransaction = async <T, S>(
  data: T,
  transaction: (data: T, executeQuery: TExecuteQuery) => Promise<S>,
) => {
  const connection = await getConnection();
  try {
    await connection.beginTransaction();
    const executeQuery = makeExecuteQuery(connection);
    const retData = await transaction(data, executeQuery);
    // Figure our a way to transform the response according to the data entered
    await connection.commit();
    connection.release();
    return retData;
  } catch (e) {
    await connection.rollback();
    connection.release();
    throw e;
  }
};
