export const MAKE_CREATE_MODEL_TEMPLATE = `// Generated Code, Do not modify
import { makeModelParams } from "@five12days/core";

export type {TNAME} = {
  id?: string;
  createdAt?: string;
  updatedAt?: string;
  {TYPE_ATTRIBUTES};
};

export const make{MODEL} = ({
  generateId,
  validateModel,
}: makeModelParams<{TNAME}>) => {
  return (modelData: {TNAME}) => {
    const model = {
      id: generateId(),
      createdAt: modelData.createdAt,
      updatedAt: modelData.updatedAt,
      {MODEL_ATTRIBUTES},
    };
    validateModel(model);
    return model;
  };
};
`;
