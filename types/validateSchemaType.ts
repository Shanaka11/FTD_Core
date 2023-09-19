import { tModel } from "./ftdSchema.js";

export const isTModel = (object: unknown): object is tModel => {
  return (
    (object as tModel).name !== undefined &&
    (object as tModel).attributes !== undefined
  );
};
