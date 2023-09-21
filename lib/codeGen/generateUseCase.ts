import { tAattributes, tModel } from "../../types/ftdSchema.js";
import { CHECK_ORDER_CHANGED_TEMPLATE } from "../templates/checkOrderChangedTemplate.js";
import { CREATE_MODEL_USECASE_TEMPLATE } from "../templates/createModelUseCaseTemplate.js";
import { DELETE_MODEL_USECASE_TEMPLATE } from "../templates/deleteModelUseCaseTemplate.js";
import { READ_MODEL_USECASE_TEMPLATE } from "../templates/readModelUseCaseTemplate.js";
import { UPDATE_MODEL_USECASE_TEMPLATE } from "../templates/updateModelUseCaseTemplate.js";
import { decodeAttributeType } from "./attributeTypeUtils.js";
import { capitalize, indent, simplize } from "./textUtils.js";

export const generateUseCase = (modelSchema: tModel) => {
  const { name, attributes } = modelSchema;

  const nameCapitalized = capitalize(name);
  const nameSimplized = simplize(name);
  const tName = `T${nameCapitalized}`;

  let content = `// Generated Code, Do not modify\n`;
  content += `import { isIdPresent, TModelKey } from "@five12days/core";\n\n`;
  content += `import { make${nameCapitalized}, ${tName} } from "./${nameSimplized}.gen";\n\n`;
  content += createModelKeyType(tName, attributes);
  content += createReadModelUseCase(nameCapitalized, tName, nameSimplized);
  content += createUpdateModelUseCase(nameCapitalized, tName, nameSimplized);
  content += createCreateModelUseCase(nameCapitalized, tName, nameSimplized);
  content += createDeleteModelUseCase(nameCapitalized, tName, nameSimplized);
  content += createCheckOrderChanged(nameCapitalized, tName, nameSimplized);
  return content;
};

const createModelKeyType = (tName: string, attributes: tAattributes) => {
  let content = `type ${tName}Key = {\n`;
  content += indent(1);
  content += Object.entries(attributes)
    .filter(([, attribute]) => {
      return attribute.flags === "KMI-";
    })
    .map(([key, attribute]) => {
      return `${simplize(key)}${decodeAttributeType(attribute)}`;
    })
    .join(`;\n${indent(1)}`);
  content += `;\n};\n\n`;

  return content;
};

export const createReadModelUseCase = (
  nameCapitalized: string,
  tName: string,
  nameSimplized: string,
) => {
  return createStringFromTemplate(
    {
      MODEL: nameCapitalized,
      TNAME: tName,
      MODELVAR: nameSimplized,
    },
    READ_MODEL_USECASE_TEMPLATE,
  );
};

const createUpdateModelUseCase = (
  nameCapitalized: string,
  tName: string,
  nameSimplized: string,
) => {
  return createStringFromTemplate(
    {
      MODEL: nameCapitalized,
      TNAME: tName,
      MODELVAR: nameSimplized,
    },
    UPDATE_MODEL_USECASE_TEMPLATE,
  );
};

const createCreateModelUseCase = (
  nameCapitalized: string,
  tName: string,
  nameSimplized: string,
) => {
  return createStringFromTemplate(
    {
      MODEL: nameCapitalized,
      TNAME: tName,
      MODELVAR: nameSimplized,
    },
    CREATE_MODEL_USECASE_TEMPLATE,
  );
};

const createDeleteModelUseCase = (
  nameCapitalized: string,
  tName: string,
  nameSimplized: string,
) => {
  return createStringFromTemplate(
    {
      MODEL: nameCapitalized,
      TNAME: tName,
      MODELVAR: nameSimplized,
    },
    DELETE_MODEL_USECASE_TEMPLATE,
  );
};

const createCheckOrderChanged = (
  nameCapitalized: string,
  tName: string,
  nameSimplized: string,
) => {
  return createStringFromTemplate(
    {
      MODEL: nameCapitalized,
      TNAME: tName,
      MODELVAR: nameSimplized,
    },
    CHECK_ORDER_CHANGED_TEMPLATE,
  );
};

const createStringFromTemplate = (
  values: Record<string, string>,
  template: string,
) => {
  return template.replace(/{([^{}]+)}/g, (match, key) => {
    if (typeof key === "string") {
      const replacement = values[key.trim()];
      return typeof replacement !== "undefined" ? replacement : match;
    }
    return match;
  });
};
