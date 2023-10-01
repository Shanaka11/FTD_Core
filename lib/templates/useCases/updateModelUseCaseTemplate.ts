export const UPDATE_MODEL_USECASE_TEMPLATE = `export const makeUpdate{MODEL}BaseUseCase = ({
  generateId,
  validateModel,
  repository,
}: TBaseUseCase<{TNAME}>) => {
  return (modelData: {TNAME}) => {
    if (repository.updateModel === undefined) {
      throw new Error(
        "Repository method of updateModel was not defined in {MODELVAR} usecase",
      );
    }

    const {MODELVAR} = check{MODEL}Changed({
      generateId,
      validateModel,
      repository,
      modelData,
    });

    repository.updateModel({
      model: "{MODELVAR}",
      key: {MODELVAR}.id,
      modelData: {MODELVAR},
    });
  };
};`;
