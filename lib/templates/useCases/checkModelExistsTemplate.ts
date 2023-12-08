export const CHECK_MODEL_EXISTS_TEMPLATE = `export const check{MODEL}Exist_ = async (
  {MODELVAR}: T{MODEL}Key,
  executeQuery: TExecuteQuery,
  triggerException:
    | "TRIGGER_WHEN_EXIST"
    | "TRIGGER_WHEN_NOT_EXIST"
    | "DO_NO_TRIGGER" = "DO_NO_TRIGGER",
) => {
  const existing{MODEL} = await read{MODEL}UseCase_(
    { keys: { {FILTERSTRING} } }, // Generate from keys
    executeQuery,
  );

  if (existing{MODEL}.length > 0) {
    if (triggerException === "TRIGGER_WHEN_EXIST")
      throw new Error("{MODEL} already exists");
    return true;
  }
  if (triggerException === "TRIGGER_WHEN_NOT_EXIST")
    throw new Error("{MODEL} does not exist");
  return false;
};`;
