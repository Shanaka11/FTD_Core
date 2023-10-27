import { AnyZodObject } from "zod";

import { TValue } from "./repositoryTypes";

export type makeModelParams<T> = {
  validateModel: (schema: AnyZodObject, model: TRawData) => T;
};

export type TRawData = Record<string, TValue>;
