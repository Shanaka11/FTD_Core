import { generateUpdateQueryString } from "../generateQueryString.js";

type UpdateModelParams = {
  model: string;
  key: string;
  columns: string[];
  values: string[];
};

// Update Model
export const makeUpdateModel =
  (executeQuery: (query: string) => string[]) =>
  ({ model, key, columns, values }: UpdateModelParams) => {
    const where = `WHERE ID = ${key}`;
    const queryString = generateUpdateQueryString(
      model,
      columns,
      values,
      where,
    );
    // Connect to the db
    // Execute the query
    return executeQuery(queryString);
    // Close the connection db
  };
