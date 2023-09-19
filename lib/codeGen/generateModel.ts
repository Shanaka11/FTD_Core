import { tAattributes, tModel } from "../../types/ftdSchema.js";
import { capitalize, simplize } from "./textUtils.js";

export const generateModel = (modelSchema: tModel) => {
  const { name, attributes } = modelSchema;

  let content = `// Generated Code, Do not modify\n`;
  content += `export const make${capitalize(
    name,
  )} = ({ generateId, validateModel }) => {\n`;
  content += `\treturn (modelData) => {\n`;
  content += `\t\tconst model = {\n`;
  content += `\t\t\tid: generateId(),\n`;
  content += `\t\t\t${generateAttributes(attributes)}\n`;
  content += `\t\t}\n`;
  content += `\t}\n`;
  content += `}`;
  return content;
};

const generateAttributes = (attributes: tAattributes) => {
  return Object.entries(attributes)
    .map(([key]) => {
      return `${simplize(key)}: modelData.${simplize(key)}`;
    })
    .join(`,\n\t\t\t`);
};
