import { CreateModelParams } from "../lib/db/crudRepository/createModel";
import { DeleteModelParams } from "../lib/db/crudRepository/deleteModel";
import { ReadModelParams } from "../lib/db/crudRepository/readModel";
import { UpdateModelParams } from "../lib/db/crudRepository/updateModel";

export type TRepository = {
  readModel?: ({ model, key, columns, filter }: ReadModelParams) => string[];
  createModel?: ({ model, modelData }: CreateModelParams) => string[];
  updateModel?: ({ model, key, modelData }: UpdateModelParams) => string[];
  deleteModel?: ({ model, key }: DeleteModelParams) => string[];
};

export type TValue = string | number | Date | undefined;
