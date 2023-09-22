import { tAattributes, tModel } from "../../types/ftdSchema.js";
import { MAKE_CREATE_MODEL_TEMPLATE } from "../templates/makeCreateModelTemplate.js";
import { decodeAttributeType } from "./attributeTypeUtils.js";
import {
  capitalize,
  createStringFromTemplate,
  indent,
  simplize,
} from "./textUtils.js";

export const generateModel = (modelSchema: tModel) => {
  const { name, attributes } = modelSchema;

  const nameCapitalized = capitalize(name);
  const nameSimplized = simplize(name);
  const tName = `T${nameCapitalized}`;

  const content = createStringFromTemplate(
    {
      MODEL: nameCapitalized,
      TNAME: tName,
      MODELVAR: nameSimplized,
      TYPE_ATTRIBUTES: generateTypes(attributes),
      MODEL_ATTRIBUTES: generateAttributes(attributes),
    },
    MAKE_CREATE_MODEL_TEMPLATE,
  );
  return content;
};

const generateAttributes = (attributes: tAattributes) => {
  return Object.entries(attributes)
    .map(([key]) => {
      return `${simplize(key)}: modelData.${simplize(key)}`;
    })
    .join(`,\n${indent(3)}`);
};

const generateTypes = (attributes: tAattributes) => {
  const type = Object.entries(attributes)
    .map(([key, attribute]) => {
      return `${simplize(key)}${decodeAttributeType(attribute)}`;
    })
    .join(`;\n${indent(1)}`);

  return type;
};
