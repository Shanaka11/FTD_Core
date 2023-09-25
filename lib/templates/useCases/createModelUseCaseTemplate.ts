export const CREATE_MODEL_USECASE_TEMPLATE = `export const makeCreate{MODEL}UseCase = ({
  generateId,
  validateModel,
  repository,
}: TBaseUseCase<{TNAME}>) => {
  return (modelData: {TNAME}) => {
    const create{MODEL} = make{MODEL}({
      generateId,
      validateModel,
    });

    const {MODELVAR} = create{MODEL}(modelData);
    return repository.create({MODELVAR});
  };
};`;
