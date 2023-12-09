export const CREATE_MODEL_USECASE_TEMPLATE = `export const makeCreate{MODEL}BaseUseCase = ({
  generateId,
  validateModel,
  repository,
  executeQuery,
}: TBaseUseCase<{TNAME}>) => {
  return (modelData: Partial<{TNAME}>) => {
    if (repository.createModel === undefined) {
      throw new Error(
        "Repository method of createModel was not defined in {MODELVAR} usecase",
      );
    }

    if (generateId === undefined) {
      throw new Error("Please provide a generateId method");
    }

    const create{MODEL} = make{MODEL}({
      validateModel,
    });

    // Generate ID
    modelData.id = generateId();
    // Set CreatedAt
    const sysDate = Date.now();
    modelData.createdAt = sysDate;
    // Set UpdatedAt
    modelData.updatedAt = sysDate;
    // Run validation, check exist, column validation will be handled by zod
    // Check if a record with the same id exists
    // Check if the realtionships are valid, i.e primary keys match etc
    // Other validation, such as max, min, length, mandatory checks will be handled by zod
    const {MODELVAR} = create{MODEL}(modelData);

    validateRelationships_({MODELVAR}, executeQuery, "INSERT");

    return repository.createModel({
      model: "{MODELVAR}",
      modelData: {MODELVAR},
    });
  };
};`;
/*
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
*/
