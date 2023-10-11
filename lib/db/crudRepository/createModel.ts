import { TRawData } from "../../../types/makeModelParams.js";
import { TExecuteQuery } from "../../../types/repositoryTypes.js";
import { generateCreateQueryString } from "../generateQueryString.js";
import { getColumnsAndValuesFromModelData } from "../repoUtils.js";

export type CreateModelParams = {
  model: string;
  modelData: TRawData;
};

// Create Model
export const makeCreateModel =
  (executeQuery: TExecuteQuery) =>
  async ({ model, modelData }: CreateModelParams) => {
    // The params should be changed in this repo method, model should be provided, after that the new object should be passed, columns and values should be derived from them
    const { columns, values } = getColumnsAndValuesFromModelData(modelData);
    const queryString = generateCreateQueryString(model, columns, values);
    // Connect to the db
    // Execute the query
    console.log(queryString);
    const queryResponse = await executeQuery(queryString);
    console.log(queryResponse);
    return true;
    // Close the connection db
  };
