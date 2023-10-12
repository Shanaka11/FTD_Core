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
    const where = `WHERE ID = '${key}'`;
    const { columns, values } = getColumnsAndValuesFromModelData(modelData);
    const queryString = generateUpdateQueryString(
      model,
      columns,
      values,
      where,
    );
    await executeQuery(queryString);
    return true;
  };
