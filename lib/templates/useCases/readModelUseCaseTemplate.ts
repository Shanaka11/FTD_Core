export const READ_MODEL_USECASE_TEMPLATE = `export const makeRead{MODEL}BaseUseCase = (readModel: any) => {
  return (keys: TModelKey | {TNAME}Key) => {
    if (isIdPresent(keys)) {
      return readModel(keys.id);
    }
    return readModel(keys);
  };
};`;
