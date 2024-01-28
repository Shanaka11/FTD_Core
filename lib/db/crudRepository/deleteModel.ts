import { TExecuteQuery } from "../../../types/repositoryTypes.js";
import { generateDeleteQueryString } from "../generateQueryString.js";

export type DeleteModelParams = {
  model: string;
  key: string;
};

// Delete Model
export const makeDeleteModel =
  (executeQuery: TExecuteQuery) =>
  async ({ model, key }: DeleteModelParams) => {
    const where = `WHERE ID = ?`;
    const queryString = generateDeleteQueryString(model, where);
    await executeQuery(queryString, false, [key]);
    return true;
  };
