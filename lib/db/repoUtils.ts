import { TValue } from "../../types/repositoryTypes";

export const getColumnsAndValuesFromModelData = (
  modelData: Record<string, TValue>,
) => {
  const columns: string[] = [];
  const values: TValue[] = [];

  Object.entries(modelData).forEach(([key, value]) => {
    columns.push(key);
    values.push(value);
  });

  return {
    columns,
    values,
  };
};
