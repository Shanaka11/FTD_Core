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

export { capitalize, simplize, indent };
