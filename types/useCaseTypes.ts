import { TRepository } from "./repositoryTypes";

export type TModelKey = {
  id: string;
};

export const isIdPresent = <T extends object>(
  obj: TModelKey | T,
): obj is TModelKey => {
  return "id" in obj;
};

export type TBaseUseCase<T> = {
  generateId: () => string;
  validateModel: (data: T) => boolean;
  repository: TRepository;
};

export type TMakeGetModelUseCase = {
  repository: TRepository;
};

export type TGetModelUseCase<T> = {
  keys?: TModelKey | T;
  filter?: string;
  columns?: string[];
};

export type TBaseUseCaseCheckChanged<T> = {
  modelData: T;
} & TBaseUseCase<T>;
