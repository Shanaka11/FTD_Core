export const CHECK_ORDER_CHANGED_TEMPLATE = `const check{MODEL}Changed = ({
  generateId,
  validateModel,
  repository,
  modelData,
}: any) => {
  const create{MODEL} = make{MODEL}({
    generateId,
    validateModel,
  });
  const read{MODEL} = makeRead{MODEL}UseCase({
    repository,
  });
  const new{MODEL} = create{MODEL}(modelData);
  const old{MODEL} = read{MODEL}({
    id: new{MODEL}.id,
  });
  return new{MODEL};
};`;
