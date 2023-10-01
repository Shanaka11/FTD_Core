export const CREATE_MODEL_USECASE_TEMPLATE = `export const makeCreate{MODEL}BaseUseCase = ({
  generateId,
  validateModel,
  repository,
}: TBaseUseCase<{TNAME}>) => {
  return (modelData: {TNAME}) => {
    if (repository.createModel === undefined) {
      throw new Error(
        "Repository method of createModel was not defined in {MODELVAR} usecase",
      );
    }

    const create{MODEL} = make{MODEL}({
      generateId,
      validateModel,
    });

    const {MODELVAR} = create{MODEL}(modelData);

    return repository.createModel({
      model: "{MODELVAR}",
      modelData: {MODELVAR},
    });
  };  
};`;
