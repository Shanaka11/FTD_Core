import { TRawData } from "../../types/makeModelParams.js";
import {
  camelToSnakeCase,
  formatDateToSqlString,
} from "../codeGen/textUtils.js";

export const generateKeyWhere = (keys: TRawData) => {
  const parameterArray: string[] = [];
  const filterString = Object.entries(keys)
    .map(([key, value]) => {
      if (value instanceof Date) {
        parameterArray.push(formatDateToSqlString(value));
        return `${camelToSnakeCase(key)} = ?`;
      }
      if (typeof value === "string") {
        parameterArray.push(value);
        return `${camelToSnakeCase(key)} = ?`;
      }
      if (value !== undefined) parameterArray.push(value.toString());
      return `${camelToSnakeCase(key)} = ?`;
    })
    .join(" AND ");
  return {
    filterString,
    parameterArray,
  };
};

export const generateWhereClause = (filter: string) => {
  const parameterArray: string[] = [];
  const methodRegex = /(\w+)\(([^)]+)\)/g;
  const filterRegex = /^(\s*[\w]+\([^)]*\)|\s*and|\s*or|\s*\(\s*|\s*\)\s*)*$/;
  // const temp1 = replaceOperators(filter);

  const appendToParameterArray = (param: string) => {
    parameterArray.push(param);
  };
  // Check if the filter string is valid i.e it should only contain method calls in addition to  ( ) AND OR

  if (!filterRegex.test(filter)) {
    throw new Error(
      "Incorrect filter. Please check the filter parameter and try again.",
    );
  }
  // Generate the string itself

  const temp = filter.replace(
    methodRegex,
    (match, methodName: string, args: string) => {
      const parameters = args.split(", ");
      // Combine parameterArray with the sliced parameter array (1, -1)
      return executeMethod(methodName, parameters, appendToParameterArray);
    },
  );
  return { filterString: `WHERE ${temp}`, parameterArray };
};

// const replaceOperators = (filter: string) => {
//   const replacements: Record<string, string> = {
//     eq: `=`,
//     gt: ">",
//     lt: `>`,
//     lte: "<=",
//     gte: ">=",
//     neq: "><",
//   };

//   const regexPattern = new RegExp(
//     `\\b(${Object.keys(replacements).join("|")})\\b|('[^']*')|(\\w+)`, // Exclude words inside single quotes
//     "g",
//   );

//   return filter.replace(
//     regexPattern,
//     (match, operator, quotedValue, fieldName) => {
//       if (operator) {
//         return replacements[operator as string];
//       } else if (fieldName) {
//         // Convert field name to snake_case and uppercase
//         // Check if this is a relationship or a method if not sorround it with quotation marks
//         checkForDangerousSql(fieldName as string);
//         return camelToSnakeCase(fieldName as string);
//       }
//       return (quotedValue as string) || match; // Return unchanged if not an operator or field name
//     },
//   );
// };

const executeMethod = (
  method: string,
  args: string[],
  addToParamArray: (param: string) => void,
) => {
  // Check if args have malformed strings
  if (args.length > 0) {
    checkForDangerousSql(args[0]);
    // Create the parameter array by slicing the args array from 1 - end
  }
  // Implement your methods here
  switch (method) {
    case "eq":
      addToParamArray(args[1]);
      return eq(args[0]);
    case "lt":
      addToParamArray(args[1]);
      return lt(args[0]);
    case "lte":
      addToParamArray(args[1]);
      return lte(args[0]);
    case "gt":
      addToParamArray(args[1]);
      return gt(args[0]);
    case "gte":
      addToParamArray(args[1]);
      return gte(args[0]);
    case "neq":
      addToParamArray(args[1]);
      return neq(args[0]);
    case "startsWith":
      addToParamArray(`${args[1]}%`);
      return startsWith(args[0]);
    case "endsWith":
      addToParamArray(`%${args[1]}`);
      return endsWith(args[0]);
    case "like":
      addToParamArray(args[1]);
      return like(args[0]);
    case "between":
      addToParamArray(args[1]);
      addToParamArray(args[2]);
      return between(args[0]);
    // Add more methods as needed
    default:
      throw new Error(`Unsupported method: ${method}`);
  }
};

const eq = (column: string) => {
  return `${camelToSnakeCase(column)} = ?`;
};

const lt = (column: string) => {
  return `${camelToSnakeCase(column)} < ?`;
};

const lte = (column: string) => {
  return `${camelToSnakeCase(column)} <= ?`;
};

const gt = (column: string) => {
  return `${camelToSnakeCase(column)} > ?`;
};

const gte = (column: string) => {
  return `${camelToSnakeCase(column)} >= ?`;
};

const neq = (column: string) => {
  return `${camelToSnakeCase(column)} >< ?`;
};

const startsWith = (column: string) => {
  return `${camelToSnakeCase(column)} LIKE ?`;
};

const endsWith = (column: string) => {
  return `${camelToSnakeCase(column)} LIKE ?`;
};

const like = (column: string) => {
  return `${camelToSnakeCase(column)} LIKE ?`;
};

const between = (column: string) => {
  return `${camelToSnakeCase(column)} BETWEEN ? AND ?`;
};

const checkForDangerousSql = (columnName: string) => {
  if (columnName.includes(" ")) throw new Error("Invalid column name");
};
// Filter would look like this "filter=(Objstate eq 'Parked') and ((startswith(OrderNo,'13')) or (startswith(OrderNo,'14')) or (OrderNo eq '12'))" figure out a way to decode this and create a where statement
// filter=(Objstate eq 'Parked') and ((startswith(OrderNo,'13')) or (startswith(OrderNo,'14')) or (OrderNo eq '12')) should be converted to WHERE objstate = 'Parked' AND (order_no like '13%' OR order_no = '12')
