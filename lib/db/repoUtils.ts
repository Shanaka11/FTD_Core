import { TRawData } from "../../types/makeModelParams.js";
import { TValue } from "../../types/repositoryTypes.js";
import { formatDateToSqlString } from "../codeGen/textUtils.js";

export const getColumnsAndValuesFromModelData = (
  modelData: TRawData,
  forUpdate: boolean = false,
) => {
  const columns: string[] = [];
  const values: TValue[] = [];

  Object.entries(modelData).forEach(([key, value]) => {
    if (forUpdate && (key === "ID" || key === "CREATED_AT")) return;
    columns.push(key);
    if (value instanceof Date) {
      values.push(formatDateToSqlString(value));
    } else {
      values.push(value);
    }
  });

  return {
    columns,
    values,
  };
};
