export const MAKE_CREATE_MODEL_TEMPLATE = `// Generated Code, Do not modify
import { makeModelParams, TRawData } from "@five12days/core/dist/public";
import { z } from "zod";

export const {MODELVAR}Schema = z.object({
  id: z.string({ required_error: "Id cannot be null" }).min(1, { message: 'Id cannot be empty'}),
  createdAt: z.string({ required_error: "CreatedAt cannot be null" }).max(30),
  updatedAt: z.string({ required_error: "UpdatedAt cannot be null" }).max(30),
  {ZOD_SCHEMA},
});

export type {TNAME} = z.infer<typeof {MODELVAR}Schema>;

export const make{MODEL} = ({ validateModel }: makeModelParams<{TNAME}>) => {
  return (modelData: TRawData) => {
    const validatedModel = validateModel(modelData);
    return validatedModel;
  };
};
`;
