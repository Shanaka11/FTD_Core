export const UPDATE_MODEL_USECASE_TEMPLATE = `export const makeUpdate{MODEL}BaseUseCase = ({
  validateModel,
  repository,
}: TBaseUseCase<{TNAME}>) => {
  return async (modelData: {TNAME}) => {
    if (repository.updateModel === undefined) {
      throw new Error(
        "Repository method of updateModel was not defined in {MODELVAR} usecase",
      );
    }

    if (repository.readModel === undefined) {
      throw new Error(
        "Repository method of readModel was not defined in {MODELVAR} usecase",
      );
    }

    const {MODELVAR} = await check{MODEL}Changed({
      validateModel,
      repository,
      modelData,
    });

    // Set UpdatedAt
    const sysDate = new Date();
    modelData.updatedAt = sysDate;

    return repository.updateModel({
      model: "{MODELVAR}",
      key: {MODELVAR}.id,
      modelData: {MODELVAR},
    });
  };
};`;
/*
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
*/
