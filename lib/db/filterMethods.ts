import { TRawData } from "../../types/makeModelParams.js";
import {
  camelToSnakeCase,
  formatDateToSqlString,
} from "../codeGen/textUtils.js";

export const generateKeyWhere = (keys: TRawData) => {
  return Object.entries(keys)
    .map(([key, value]) => {
      if (value instanceof Date) {
        return `${camelToSnakeCase(key)} = '${formatDateToSqlString(value)}'`;
      }
      if (typeof value === "string") {
        return `${camelToSnakeCase(key)} = '${value}'`;
      }
      return `${camelToSnakeCase(key)} = ${value}`;
    })
    .join(" AND ");
};

export const generateWhereClause = (filter: string) => {
  const methodRegex = /(\w+)\(([^)]+)\)/g;
  const temp1 = replaceOperators(filter);
  const temp = temp1.replace(
    methodRegex,
    (match, methodName: string, args: string) => {
      return executeMethod(methodName, args.split(", "));
    },
  );
  return `WHERE ${temp}`;
};

const replaceOperators = (filter: string) => {
  const replacements: Record<string, string> = {
    eq: `=`,
    gt: ">",
    lt: `>`,
    lte: "<=",
    gte: ">=",
    neq: "><",
  };

  const regexPattern = new RegExp(
    `\\b(${Object.keys(replacements).join("|")})\\b|('[^']*')|(\\w+)`, // Exclude words inside single quotes
    "g",
  );

  return filter.replace(
    regexPattern,
    (match, operator, quotedValue, fieldName) => {
      if (operator) {
        return replacements[operator as string];
      } else if (fieldName) {
        // Convert field name to snake_case and uppercase
        return camelToSnakeCase(fieldName as string);
      }
      return (quotedValue as string) || match; // Return unchanged if not an operator or field name
    },
  );
};

const executeMethod = (method: string, args: string[]) => {
  // Implement your methods here
  switch (method) {
    case "STARTS_WITH":
      return startsWith(args[0], args[1]);
    case "ENDS_WITH":
      return endsWith(args[0], args[1]);
    case "LIKE":
      return like(args[0], args[1]);
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

const like = (column: string, value: string) => {
  return `${camelToSnakeCase(column)} LIKE '${value}'`;
};

// Filter would look like this "filter=(Objstate eq 'Parked') and ((startswith(OrderNo,'13')) or (startswith(OrderNo,'14')) or (OrderNo eq '12'))" figure out a way to decode this and create a where statement
// filter=(Objstate eq 'Parked') and ((startswith(OrderNo,'13')) or (startswith(OrderNo,'14')) or (OrderNo eq '12')) should be converted to WHERE objstate = 'Parked' AND (order_no like '13%' OR order_no = '12')
