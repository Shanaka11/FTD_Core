import { CHECK_MODEL_CHANGED_TEMPLATE } from "./checkModelChangedTemplate.js";
import { CHECK_MODEL_EXISTS_TEMPLATE } from "./checkModelExistsTemplate.js";
import { CREATE_MODEL_USECASE_TEMPLATE } from "./createModelUseCaseTemplate.js";
import { DELETE_MODEL_USECASE_TEMPLATE } from "./deleteModelUseCaseTemplate.js";
import { READ_MODEL_USECASE_TEMPLATE } from "./readModelUseCaseTemplate.js";
import { UPDATE_MODEL_USECASE_TEMPLATE } from "./updateModelUseCaseTemplate.js";
import { VALIDATE_RELATIONSHIPS_TEMPLATE } from "./validateRelationshipsTemplate.js";

export const CURD_USECASES_TEMPLATE = `// Generated Code, Do not modify
import {
  checkIfFieldUpdated,
  isIdPresent,
  TBaseUseCase,
  TBaseUseCaseCheckChanged,
  TExecuteQuery,
  TGetModelUseCase,
  TMakeGetModelUseCase,
} from "@five12days/core";

{IMPORTS}
import { read{MODEL}UseCase_ } from "../useCases/{MODELVAR}UseCases.js";
import { make{MODEL}, {TNAME} } from "./{MODELVAR}.gen.js";

export {MODELTYPE}

${READ_MODEL_USECASE_TEMPLATE}

${CREATE_MODEL_USECASE_TEMPLATE}

${UPDATE_MODEL_USECASE_TEMPLATE}

${DELETE_MODEL_USECASE_TEMPLATE}

${CHECK_MODEL_CHANGED_TEMPLATE}

${VALIDATE_RELATIONSHIPS_TEMPLATE}

${CHECK_MODEL_EXISTS_TEMPLATE}
`;
