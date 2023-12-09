import { TValue } from "../../types/repositoryTypes";

export const checkIfFieldUpdated = (
  field: string,
  sourceValue: TValue,
  targetValue: TValue,
) => {
  if (sourceValue != targetValue)
    throw new Error(`${field} cannot be updated.`);
};
