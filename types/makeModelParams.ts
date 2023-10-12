import { TValue } from "./repositoryTypes";

export type makeModelParams<T> = {
  validateModel: (model: TRawData) => T;
};

export type TRawData = Record<string, TValue>;
