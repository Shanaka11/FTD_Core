import {
  arrayToCommaSeparatedString,
  camelToSnakeCase,
  createStringFromTemplate,
} from "../codeGen/textUtils.js";
import { CREATE_QUERY_TEMPLATE } from "./queryTemplates/createQueryTemplate.js";
import { DELETE_QUERY_TEMPLATE } from "./queryTemplates/deleteQueryTemplate.js";
import { SELECT_QUERY_TEMPLATE } from "./queryTemplates/selectQueryTemplate.js";
import { UPDATE_QUERY_TEMPLATE } from "./queryTemplates/updateQueryTemplate.js";

export const generateSelectQueryString = (
  table: string,
  columns?: string[],
  where?: string,
) => {
  const mappingValues = {
    FIELDS: generateSqlColumnString(columns),
    TABLE_NAME: camelToSnakeCase(table),
    WHERE: where ?? "",
  };
  return createStringFromTemplate(mappingValues, SELECT_QUERY_TEMPLATE);
};

export const generateCreateQueryString = (
  table: string,
  columns: string[],
  values: string[],
) => {
  const mappingValues = {
    TABLE_NAME: camelToSnakeCase(table),
    COLUMNS: generateSqlColumnString(columns),
    VALUES: arrayToCommaSeparatedString(values),
  };
  return createStringFromTemplate(mappingValues, CREATE_QUERY_TEMPLATE);
};

export const generateUpdateQueryString = (
  table: string,
  columns: string[],
  values: string[],
) => {
  const mappingValues = {
    TABLE_NAME: camelToSnakeCase(table),
    COLUMNS: generateSqlColValuePair(columns, values),
  };
  return createStringFromTemplate(mappingValues, UPDATE_QUERY_TEMPLATE);
};

export const generateDeleteQueryString = (table: string, where: string) => {
  const mappingValues = {
    TABLE_NAME: camelToSnakeCase(table),
    WHERE: where,
  };
  return createStringFromTemplate(mappingValues, DELETE_QUERY_TEMPLATE);
};
const generateSqlColumnString = (columns?: string[]) => {
  if (columns === undefined) return "*";
  return columns.map((column) => camelToSnakeCase(column)).join(", ");
};

const generateSqlColValuePair = (columns: string[], values: string[]) => {
  return columns
    .map((column, index) => `${camelToSnakeCase(column)} = ${values[index]}`)
    .join(", ");
};
