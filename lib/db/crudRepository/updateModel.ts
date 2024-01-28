import { TRawData } from "../../../types/makeModelParams.js";
import { TExecuteQuery } from "../../../types/repositoryTypes.js";
import { generateUpdateQueryString } from "../generateQueryString.js";
import { getColumnsAndValuesFromModelData } from "../repoUtils.js";

export type UpdateModelParams = {
  model: string;
  key: string;
  modelData: TRawData;
};

// Update Model
export const makeUpdateModel =
  (executeQuery: TExecuteQuery) =>
  async ({ model, key, modelData }: UpdateModelParams) => {
    const where = `WHERE ID = ?`;
    const { columns, values } = getColumnsAndValuesFromModelData(modelData);
    const queryString = generateUpdateQueryString(model, columns, where);
    const paramList = values.map((value) => {
      if (value === undefined) return "NULL";
      if (value instanceof Date) return value.toISOString();
      return value;
    });
    // TODO: Use parameterized queries here
    await executeQuery(queryString, false, [key, ...paramList] as string[]);
    return true;
  };
