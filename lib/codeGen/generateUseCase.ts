import { tAattributes, tModel } from "../../types/ftdSchema.js";
import { CURD_USECASES_TEMPLATE } from "../templates/crudUseCasesTemplate.js";
import { decodeAttributeType } from "./attributeTypeUtils.js";
import { capitalize, indent, simplize } from "./textUtils.js";

export const generateUseCase = (modelSchema: tModel) => {
  const { name, attributes } = modelSchema;

  const nameCapitalized = capitalize(name);
  const nameSimplized = simplize(name);
  const tName = `T${nameCapitalized}`;

  const content = createStringFromTemplate(
    {
      MODEL: nameCapitalized,
      TNAME: tName,
      MODELVAR: nameSimplized,
      MODELTYPE: createModelKeyType(tName, attributes),
    },
    CURD_USECASES_TEMPLATE,
  );
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
  content += `;\n};`;

  return content;
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