import { generateCreateQueryString } from "../generateQueryString.js";

type CreateModelParams = {
  model: string;
  columns: string[];
  values: string[];
};

// Create Model
export const makeCreateModel =
  (executeQuery: (query: string) => string[]) =>
  ({ model, columns, values }: CreateModelParams) => {
    const queryString = generateCreateQueryString(model, columns, values);
    // Connect to the db
    // Execute the query
    return executeQuery(queryString);
    // Close the connection db
  };
