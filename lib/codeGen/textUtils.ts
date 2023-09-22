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

export { capitalize, simplize, indent, createStringFromTemplate };
