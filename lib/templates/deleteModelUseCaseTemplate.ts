export const DELETE_MODEL_USECASE_TEMPLATE = `const makeDelete{MODEL}UseCase = ({
  generateId,
  validateModel,
  repository,
  }: any) => {
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
