export const CREATE_MODEL_USECASE_TEMPLATE = `const makeCreate{MODEL}UseCase = ({
  generateId,
  validateModel,
  repository,
}: any) => {
  return (modelData: {TNAME}) => {
    const create{MODEL} = make{MODEL}({
      generateId,
      validateModel,
    });

    const {MODELVAR} = createOrder(modelData);
    return repository.create({MODELVAR});
  };
};`;
