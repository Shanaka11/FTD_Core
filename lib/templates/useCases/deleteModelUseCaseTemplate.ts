export const DELETE_MODEL_USECASE_TEMPLATE = `export const makeDelete{MODEL}BaseUseCase = ({
  validateModel,
  repository,
  executeQuery,
}: TBaseUseCase<{TNAME}>) => {
  return async (modelData: {TNAME}) => {
    if (repository.deleteModel === undefined) {
      throw new Error(
        "Repository method of deleteModel was not defined in {MODELVAR} usecase",
      );
    }

    const {MODELVAR} = await check{MODEL}Changed({
      validateModel,
      repository,
      modelData,
      executeQuery,
    });

    return repository.deleteModel({
      model: "{MODELVAR}",
      key: {MODELVAR}.id,
    });
  };
};`;
/*
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
*/
