import { TRawData } from "../../types/makeModelParams.js";
import { TValue } from "../../types/repositoryTypes.js";
import { formatDateToSqlString } from "../codeGen/textUtils.js";

export const getColumnsAndValuesFromModelData = (modelData: TRawData) => {
  const columns: string[] = [];
  const values: TValue[] = [];

  Object.entries(modelData).forEach(([key, value]) => {
    columns.push(key);
    if (value instanceof Date) {
      //convert to server timezone
      values.push(`'${formatDateToSqlString(value)}'`);
    } else if (typeof value === "string") {
      values.push(`'${value}'`);
    } else {
      values.push(value);
    }
  });

  return {
    columns,
    values,
  };
};
