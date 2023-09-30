import { generateUpdateQueryString } from "../generateQueryString.js";

type UpdateModelParams = {
  model: string;
  columns: string[];
  values: string[];
};

// Update Model
export const makeUpdateModel =
  (executeQuery: (query: string) => string[]) =>
  ({ model, columns, values }: UpdateModelParams) => {
    const queryString = generateUpdateQueryString(model, columns, values);
    // Connect to the db
    // Execute the query
    executeQuery(queryString);
    // Close the connection db
  };
