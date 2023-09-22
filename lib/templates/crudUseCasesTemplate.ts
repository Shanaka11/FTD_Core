import { CHECK_ORDER_CHANGED_TEMPLATE } from "./checkOrderChangedTemplate.js";
import { CREATE_MODEL_USECASE_TEMPLATE } from "./createModelUseCaseTemplate.js";
import { DELETE_MODEL_USECASE_TEMPLATE } from "./deleteModelUseCaseTemplate.js";
import { READ_MODEL_USECASE_TEMPLATE } from "./readModelUseCaseTemplate.js";
import { UPDATE_MODEL_USECASE_TEMPLATE } from "./updateModelUseCaseTemplate.js";

export const CURD_USECASES_TEMPLATE = `// Generated Code, Do not modify
import { isIdPresent, TModelKey } from "@five12days/core";

import { make{MODEL}, {TNAME} } from "./{MODELVAR}.gen.js";

{MODELTYPE}

${READ_MODEL_USECASE_TEMPLATE}

${CREATE_MODEL_USECASE_TEMPLATE}

${UPDATE_MODEL_USECASE_TEMPLATE}

${DELETE_MODEL_USECASE_TEMPLATE}

${CHECK_ORDER_CHANGED_TEMPLATE}
`;
