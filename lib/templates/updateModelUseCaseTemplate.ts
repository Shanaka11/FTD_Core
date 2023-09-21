export const UPDATE_MODEL_USECASE_TEMPLATE = `const makeUpdate{MODEL}UseCase = ({
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
    repository.updateModel({MODELVAR});
  };
};`;
