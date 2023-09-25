import { tModel } from "../../types/ftdSchema.js";
import { CRUD_USECASE_STUB_TEMPLATE } from "../templates/useCasesStub/crudUseCasesStubTemplate.js";
import { capitalize, createStringFromTemplate, simplize } from "./textUtils.js";

export const generateUseCaseStubs = (modelSchema: tModel) => {
  const { name } = modelSchema;

  const nameCapitalized = capitalize(name);
  const nameSimplized = simplize(name);
  const tName = `T${nameCapitalized}`;

  const content = createStringFromTemplate(
    {
      MODEL: nameCapitalized,
      TNAME: tName,
      MODELVAR: nameSimplized,
    },
    CRUD_USECASE_STUB_TEMPLATE,
  );
  return content;
};
