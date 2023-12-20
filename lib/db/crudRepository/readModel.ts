import camelcaseKeys from "camelcase-keys";
import type { RowDataPacket } from "mysql2";

import { TRawData } from "../../../types/makeModelParams.js";
import { TExecuteQuery } from "../../../types/repositoryTypes.js";
import { generateKeyWhere, generateWhereClause } from "../filterMethods.js";
import { generateSelectQueryString } from "../generateQueryString.js";

export type ReadModelParams = {
  model: string;
  key?: string | TRawData;
  columns?: string[];
  filter?: string;
};

// Handle pagination as well
// Handle permissions
// Filter would look like this "filter=(Objstate eq 'Parked') and ((startswith(OrderNo,'13')) or (startswith(OrderNo,'14')) or (OrderNo eq '12'))" figure out a way to decode this and create a where statement

// Read Models
export const makeReadModel =
  <T>(executeQuery: TExecuteQuery) =>
  async ({ model, key, columns, filter }: ReadModelParams) => {
    // Create Query String
    // Check if the key is a string or object, if its a string  then its the ID, else it is the Keys
    // If either keys or the id is there then ignore rest of the filters
    let where = "";
    let params: string[] = [];
    if (key != undefined) {
      if (typeof key === "string") {
        where = `WHERE ID = ?`;
        params.push(key);
      } else {
        const keyWhere = generateKeyWhere(key);
        where = `WHERE ${keyWhere.filterString}`;
        params = keyWhere.parameterArray;
      }
    } else if (filter !== undefined) {
      // construct the where clause from the filter string
      // Return the string with ? and the parameter array
      const whereClause = generateWhereClause(filter);
      where = whereClause.filterString;
      params = whereClause.parameterArray;
    }
    const queryString = generateSelectQueryString(model, columns, where);
    return camelcaseKeys(
      (await executeQuery(queryString, params)) as RowDataPacket[],
    ) as T[];
  };
