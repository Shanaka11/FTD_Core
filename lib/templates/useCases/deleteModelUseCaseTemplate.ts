export const DELETE_MODEL_USECASE_TEMPLATE = `export const makeDelete{MODEL}UseCase = ({
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
    repository.deleteModel({MODELVAR});
  };
};`;
