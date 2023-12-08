export const CHECK_ORDER_CHANGED_TEMPLATE = `const check{MODEL}Changed = async ({
  validateModel,
  repository,
  modelData,
  executeQuery,
}: TBaseUseCaseCheckChanged<{TNAME}>) => {
  const create{MODEL} = make{MODEL}({
    validateModel,
  });
  const read{MODEL} = makeRead{MODEL}BaseUseCase({
    repository,
    executeQuery
  });
  const new{MODEL} = create{MODEL}(modelData);
  const old{MODEL} = await read{MODEL}({
    keys: { id: new{MODEL}.id },
  });

  if (new{MODEL}.updatedAt.toISOString() !== old{MODEL}[0].updatedAt.toISOString())
    throw new Error("{MODEL} is being modified by another user");
  return new{MODEL};
};`;
/*
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
  const old{MODEL} = JSON.parse(read{MODEL}({
    keys: { id: new{MODEL}.id },
  })[0],
  ) as {TNAME}
  
  if(new{MODEL}.updatedAt !== old{MODEL}.updatedAt) throw new Error("{MODEL} is being modified by another user")
  return new{MODEL};
};`;
*/
