import mysql from "mysql2/promise";

import { CreateModelParams } from "../lib/db/crudRepository/createModel";
import { DeleteModelParams } from "../lib/db/crudRepository/deleteModel";
import { ReadModelParams } from "../lib/db/crudRepository/readModel";
import { UpdateModelParams } from "../lib/db/crudRepository/updateModel";

export type TExecuteQueryResponse =
  | mysql.OkPacket
  | mysql.RowDataPacket[]
  | mysql.ResultSetHeader[]
  | mysql.RowDataPacket[][]
  | mysql.OkPacket[]
  | mysql.ProcedureCallPacket;

export type TRepository<T> = {
  readModel?: ({
    model,
    key,
    columns,
    filter,
  }: ReadModelParams) => Promise<T[]>; //Promise<TExecuteQueryResponse>;
  createModel?: ({ model, modelData }: CreateModelParams) => Promise<boolean>;
  updateModel?: ({
    model,
    key,
    modelData,
  }: UpdateModelParams) => Promise<boolean>;
  deleteModel?: ({ model, key }: DeleteModelParams) => Promise<boolean>;
};

export type TExecuteQuery = (
  query: string,
  isReadQuery: boolean,
  params?: string[],
) => Promise<TExecuteQueryResponse>;

export type TValue = string | number | Date | undefined;
