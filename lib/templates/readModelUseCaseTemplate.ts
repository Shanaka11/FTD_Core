export const READ_MODEL_USECASE_TEMPLATE = `export const makeRead{MODEL}UseCase = ({ repository }: any) => {
  return (keys: TModelKey | {TNAME}Key) => {
    if (isIdPresent(keys)) {
      return repository.readModel(keys.id);
    }
    return repository.readModel(keys);
  };
};`;
