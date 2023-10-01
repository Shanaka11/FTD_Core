export const CHECK_ORDER_CHANGED_TEMPLATE = `const check{MODEL}Changed = ({
  generateId,
  validateModel,
  repository,
  modelData,
}: TBaseUseCaseCheckChanged<{TNAME}>) => {
  const create{MODEL} = make{MODEL}({
    generateId,
    validateModel,
  });
  const read{MODEL} = makeRead{MODEL}BaseUseCase({
    repository,
  });
  const new{MODEL} = create{MODEL}(modelData);
  const old{MODEL} = read{MODEL}({
    keys: { id: new{MODEL}.id },
  });
  return new{MODEL};
};`;
