export const MAKE_CREATE_MODEL_TEMPLATE = `// Generated Code, Do not modify
import { makeModelParams, TRawData } from "@five12days/core";
import { z } from "zod";

export const {MODELVAR}Schema = z.object({
  id: z.string({ required_error: "Id cannot be null" }),
  createdAt: z.date({ required_error: "CreatedAt cannot be null" }),
  updatedAt: z.date({ required_error: "UpdatedAt cannot be null" }),
  {ZOD_SCHEMA},
});

export type TOrder = z.infer<typeof {MODELVAR}Schema>;

export const make{MODEL} = ({ validateModel }: makeModelParams<{TNAME}>) => {
  return (modelData: TRawData) => {
    const validatedModel = validateModel(modelData);
    return validatedModel;
  };
};
`;
