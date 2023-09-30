import { camelToSnakeCase } from "../codeGen/textUtils";

export const generateKeyWhere = (keys: Record<string, string>) => {
  return Object.entries(keys)
    .map(([key, value]) => {
      return `${camelToSnakeCase(key)} = ${value}`;
    })
    .join(" AND ");
};

export const generateWhereClause = (filter: string) => {
  const methodRegex = /(\w+)\(([^)]+)\)/g;

  return `WHERE ${replaceOperators(
    filter.replace(methodRegex, (method: string, params: string) => {
      const args = params
        .split(",")
        .map((param) => param.trim().replace(/'/g, "")); // Extract and clean arguments
      return executeMethod(method, ...args);
    }),
  )}`;
};

const replaceOperators = (filter: string) => {
  const replacements: Record<string, string> = {
    eq: `=`,
    gt: "<",
    lt: `>`,
    lte: ">=",
    gte: "<=",
    neq: "><",
  };

  const regexPattern = new RegExp(
    `\\b(${Object.keys(replacements).join("|")})\\b`,
    "g",
  );

  return filter.replace(regexPattern, (match) => replacements[match]);
};

const executeMethod = (method: string, ...args: string[]) => {
  // Implement your methods here
  switch (method) {
    case "startsWith":
      return startsWith(args[0], args[1]);
    case "endsWith":
      return endsWith(args[0], args[1]);
    // Add more methods as needed
    default:
      throw new Error(`Unsupported method: ${method}`);
  }
};

const startsWith = (column: string, value: string) => {
  return `${camelToSnakeCase(column)} LIKE '${value}%'`;
};

const endsWith = (column: string, value: string) => {
  return `${camelToSnakeCase(column)} LIKE '%${value}'`;
};
