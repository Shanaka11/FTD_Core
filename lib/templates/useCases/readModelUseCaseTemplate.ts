export const READ_MODEL_USECASE_TEMPLATE = `export const makeRead{MODEL}BaseUseCase = ({
  repository,
  executeQuery,
}: TMakeGetModelUseCase<{TNAME}>) => {
  return ({ keys, columns, filter, orderBy, page, pageSize }: TGetModelUseCase<{TNAME}Key>) => {
    if (repository.readModel === undefined)
      throw new Error(
        "Repository method of getModel was not defined in {MODELVAR} usecase",
      );

    return repository.readModel({
      model: "{MODELVAR}",
      key: keys === undefined ? undefined : isIdPresent(keys) ? keys.id : keys,
      columns: columns,
      filter: filter,
      orderBy: orderBy,
      page: page,
      pageSize: pageSize
    });
  };
};`;
/*
export const READ_MODEL_USECASE_TEMPLATE = `export const makeRead{MODEL}BaseUseCase = ({ repository }: TMakeGetModelUseCase) => {
  return ({ keys, columns, filter }: TGetModelUseCase<{TNAME}Key>) => {
    if (repository.readModel === undefined)
      throw new Error(
        "Repository method of getModel was not defined in {MODELVAR} usecase",
      );

    return repository.readModel({
      model: "{MODELVAR}",
      key: keys === undefined ? undefined : isIdPresent(keys) ? keys.id : keys,
      columns: columns,
      filter: filter,
    });
  };  
};`;
*/
