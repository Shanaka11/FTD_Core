import { TValue } from "./repositoryTypes";

export type makeModelParams<T> = {
  validateModel: (model: Record<string, TValue>) => T;
};
