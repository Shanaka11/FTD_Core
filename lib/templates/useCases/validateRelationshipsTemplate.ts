export const VALIDATE_RELATIONSHIPS_TEMPLATE = `
const validateRelationships_ = async (
  {MODELVAR}: {TNAME},
  executeQuery: TExecuteQuery,
  action: 'INSERT' | 'MODIFY'
) => {
  // Check if a model exist for the same keys
  await check{MODEL}Exist_(
    { {FILTERSTRING} }, // Generate from keys
    executeQuery,
    action === "INSERT" ? "TRIGGER_WHEN_EXIST" : "TRIGGER_WHEN_NOT_EXIST",
  );

  // Check relationships
  {VALIDATION}
};`;
