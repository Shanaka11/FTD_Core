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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  repository: TRepository;
};

export type TBaseUseCaseCheckChanged<T> = {
  modelData: T;
} & TBaseUseCase<T>;

type TRepository = {
  readModel?: (query: string) => string[];
  createModel?: (query: string) => string[];
  updateModel?: (query: string) => string[];
  deleteModel?: (query: string) => string[];
};
