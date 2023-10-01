import { TValue } from "../../../types/repositoryTypes.js";
import { generateCreateQueryString } from "../generateQueryString.js";
import { getColumnsAndValuesFromModelData } from "../repoUtils.js";

export type CreateModelParams = {
  model: string;
  modelData: Record<string, TValue>;
};

// Create Model
export const makeCreateModel =
  (executeQuery: (query: string) => string[]) =>
  // The params should be changed in this repo method, model should be provided, after that the new object should be passed, columns and values should be derived from them
  ({ model, modelData }: CreateModelParams) => {
    const { columns, values } = getColumnsAndValuesFromModelData(modelData);
    const queryString = generateCreateQueryString(model, columns, values);
    // Connect to the db
    // Execute the query
    return executeQuery(queryString);
    // Close the connection db
  };
