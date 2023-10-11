import { TRawData } from "../../types/makeModelParams";
import { TValue } from "../../types/repositoryTypes";

export const getColumnsAndValuesFromModelData = (modelData: TRawData) => {
  const columns: string[] = [];
  const values: TValue[] = [];

  Object.entries(modelData).forEach(([key, value]) => {
    columns.push(key);
    if (value instanceof Date) {
      //convert to server timezone
      values.push(`'${value.toISOString().slice(0, 19).replace("T", " ")}'`);
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
