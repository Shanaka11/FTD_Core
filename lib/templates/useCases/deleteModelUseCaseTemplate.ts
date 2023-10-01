export const DELETE_MODEL_USECASE_TEMPLATE = `export const makeDelete{MODEL}BaseUseCase = ({
  generateId,
  validateModel,
  repository,
}: TBaseUseCase<{TNAME}>) => {
  return (modelData: {TNAME}) => {
    if (repository.deleteModel === undefined) {
      throw new Error(
        "Repository method of deleteModel was not defined in {MODELVAR} usecase",
      );
    }

    const {MODELVAR} = check{MODEL}Changed({
      generateId,
      validateModel,
      repository,
      modelData,
    });

    repository.deleteModel({
      model: "{MODELVAR}",
      key: {MODELVAR}.id,
    });
  };
};`;
