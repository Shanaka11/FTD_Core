import { generateDeleteQueryString } from "../generateQueryString.js";

export type DeleteModelParams = {
  model: string;
  key: string;
};

// Delete Model
export const makeDeleteModel =
  (executeQuery: (query: string) => string[]) =>
  ({ model, key }: DeleteModelParams) => {
    const where = `WHERE ID = ${key}`;
    const queryString = generateDeleteQueryString(model, where);
    // Connect to the db
    // Execute the query
    return executeQuery(queryString);
    // Close the connection db
  };
