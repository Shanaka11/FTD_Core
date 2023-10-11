export const MAKE_CREATE_MODEL_TEMPLATE = `// Generated Code, Do not modify
import { makeModelParams, TRawData } from "@five12days/core";

export type {TNAME} = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  {TYPE_ATTRIBUTES};
};
export const make{MODEL} = ({ validateModel }: makeModelParams<{TNAME}>) => {
  return (modelData: TRawData) => {
    const validatedModel = validateModel(modelData);
    return validatedModel;
  };
};
`;
/*
export const MAKE_CREATE_MODEL_TEMPLATE = `// Generated Code, Do not modify
import { makeModelParams } from "@five12days/core";

export type {TNAME} = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  {TYPE_ATTRIBUTES};
};

export const make{MODEL} = ({
  generateId,
  validateModel,
}: makeModelParams<{TNAME}>) => {
  return (modelData: {TNAME}) => {
    const model = {
      id: modelData.id === undefined ? generateId() : modelData.id,
      createdAt: modelData.createdAt,
      updatedAt: modelData.updatedAt,
      {MODEL_ATTRIBUTES},
    };
    validateModel(model);
    return model;
  };
};
`;
*/
