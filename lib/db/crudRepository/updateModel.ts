import { TValue } from "../../../types/repositoryTypes.js";
import { generateUpdateQueryString } from "../generateQueryString.js";
import { getColumnsAndValuesFromModelData } from "../repoUtils.js";

type UpdateModelParams = {
  model: string;
  key: string;
  modelData: Record<string, TValue>;
};

// Update Model
export const makeUpdateModel =
  (executeQuery: (query: string) => string[]) =>
  ({ model, key, modelData }: UpdateModelParams) => {
    const where = `WHERE ID = ${key}`;
    const { columns, values } = getColumnsAndValuesFromModelData(modelData);
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
