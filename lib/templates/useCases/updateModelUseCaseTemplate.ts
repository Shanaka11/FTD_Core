export const UPDATE_MODEL_USECASE_TEMPLATE = `export const makeUpdate{MODEL}BaseUseCase = ({
  generateId,
  validateModel,
  repository,
}: TBaseUseCase<{TNAME}>) => {
  return (modelData: {TNAME}) => {
    const {MODELVAR} = check{MODEL}Changed({
      generateId,
      validateModel,
      repository,
      modelData,
    });
    repository.updateModel({MODELVAR});
  };
};`;
