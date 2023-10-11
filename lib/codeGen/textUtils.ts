import { TValue } from "../../types/repositoryTypes";

const capitalize = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

const simplize = (str: string) => {
  return str.charAt(0).toLowerCase() + str.slice(1);
};

const indent = (tabs: number) => {
  const indentDelimeter = "  "; // 2 spaces
  return indentDelimeter.repeat(tabs);
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

const camelToSnakeCase = (str: string) => {
  return str.replace(/([A-Z])/g, "_$1").toUpperCase();
};

const snakeToCamel = (str: string): string =>
  str.replace(/_([a-z])/g, (_, letter: string) => letter.toUpperCase());

export const arrayToCommaSeparatedString = (values: TValue[]) => {
  return values.join(", ");
};

export {
  capitalize,
  simplize,
  indent,
  createStringFromTemplate,
  camelToSnakeCase,
  snakeToCamel,
};
