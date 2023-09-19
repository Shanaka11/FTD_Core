export type makeModelParams<T> = {
  generateId: () => string;
  validateModel: (model: T) => boolean;
};
