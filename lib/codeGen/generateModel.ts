import { tAattributes, tModel } from "../../types/ftdSchema.js";
import { MAKE_CREATE_MODEL_TEMPLATE } from "../templates/model/makeCreateModelTemplate.js";
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
      ZOD_SCHEMA: generateZodSchema(attributes),
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

export const generateZodSchema = (attributes: tAattributes) => {
  const schema = Object.entries(attributes)
    .map(([key, value]) => {
      let required = false;
      let retString = `${simplize(key)}: `;

      if (value.type === "Timestamp") {
        retString += `z.date`;
      } else if (
        value.type === "BigNumber" ||
        value.type === "Decimal" ||
        value.type === "Float"
      ) {
        retString += "z.number";
      } else {
        retString += `z.${simplize(value.type)}`;
      }

      if (
        value.flags === "AMI-" ||
        value.flags === "AMIU" ||
        value.flags === "KMI-"
      ) {
        required = true;
        retString += `({ required_error: "${key} cannot be null" })`;
      } else {
        retString += `()`;
      }

      if (value.type === "String") {
        retString += `.max(${value.maxLength})`;
      }

      if (!required) retString += `.optional()`;

      return retString;
    })
    .join(`,\n${indent(1)}`);

  return schema;
};
