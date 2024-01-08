import { TRawData } from "./makeModelParams";
import { TExecuteQuery, TRepository } from "./repositoryTypes";

export type TModelKey = {
  id: string;
};

export const isIdPresent = <T extends object>(
  obj: TModelKey | T,
): obj is TModelKey => {
  return "id" in obj;
};

export type TBaseUseCase<T> = {
  generateId?: () => string;
  validateModel: (data: TRawData) => T;
  repository: TRepository<T>;
  executeQuery: TExecuteQuery;
};

export type TMakeGetModelUseCase<T> = {
  repository: TRepository<T>;
  executeQuery: TExecuteQuery;
};

export type TGetModelUseCase<T> = {
  keys?: TModelKey | T;
  filter?: string;
  columns?: string[];
  orderBy?: string;
  page?: number;
  pageSize?: number;
};

export type TBaseUseCaseCheckChanged<T> = {
  modelData: T;
} & TBaseUseCase<T>;
