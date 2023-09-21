import { tAattributes, tModel } from "../../types/ftdSchema.js";
import { decodeAttributeType } from "./attributeTypeUtils.js";
import { capitalize, indent, simplize } from "./textUtils.js";

export const generateModel = (modelSchema: tModel) => {
  const { name, attributes } = modelSchema;

  let content = `// Generated Code, Do not modify\n`;
  // Add imports
  content += `import { makeModelParams } from "@five12days/core";\n\n`;
  // Generate Type
  content += `export type T${capitalize(name)} = {\n`;
  content += `${generateTypes(attributes)};\n`;
  content += `};\n\n`;
  // Generate Make Model
  content += `export const make${capitalize(name)} = ({\n`;
  content += `${indent(1)}generateId,\n`;
  content += `${indent(1)}validateModel,\n`;
  content += `}: makeModelParams<T${capitalize(name)}>) => {\n`;
  content += `${indent(1)}return (modelData: T${capitalize(name)}) => {\n`;
  content += `${indent(2)}const model = {\n`;
  content += `${indent(3)}id: generateId(),\n`;
  content += `${indent(3)}createdAt: modelData.createdAt,\n`;
  content += `${indent(3)}updatedAt: modelData.updatedAt,\n`;
  content += `${indent(3)}${generateAttributes(attributes)},\n`;
  content += `${indent(2)}};\n`;
  content += `${indent(2)}return model;\n`;
  content += `${indent(1)}};\n`;
  content += `};\n`;
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
  let type = `${indent(1)}id?: string;\n`;
  type += `${indent(1)}createdAt?: string;\n`;
  type += `${indent(1)}updatedAt?: string;\n${indent(1)}`;
  type += Object.entries(attributes)
    .map(([key, attribute]) => {
      return `${simplize(key)}${decodeAttributeType(attribute)}`;
    })
    .join(`;\n${indent(1)}`);

  return type;
};
