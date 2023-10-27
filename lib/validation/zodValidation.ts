import { AnyZodObject, ZodError } from "zod";

import { TRawData } from "../../types/makeModelParams";

export const validateModelZod = <T>(schema: AnyZodObject, model: TRawData) => {
  try {
    return schema.parse(model) as T;
  } catch (e: unknown) {
    if (e instanceof ZodError) {
      e.errors.forEach((error) => {
        throw new Error(error.message);
      });
    }
    throw new Error("Validation Error");
  }
};

export default validateModelZod;
