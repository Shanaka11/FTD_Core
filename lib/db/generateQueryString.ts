import { TValue } from "../../types/repositoryTypes.js";
import {
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
  orderBy?: string,
  page?: number,
  pageSize?: number,
) => {
  let pagination;
  if (page !== undefined && pageSize !== undefined) {
    pagination = `LIMIT ${pageSize} OFFSET ${page - 1}`;
  }
  const mappingValues = {
    FIELDS: generateSqlColumnString(columns),
    TABLE_NAME: camelToSnakeCase(table),
    WHERE: where ?? "",
    ORDER_BY: orderBy ?? "",
    PAGINATION: pagination ?? "",
  };
  return createStringFromTemplate(mappingValues, SELECT_QUERY_TEMPLATE);
};

export const generateCreateQueryString = (
  table: string,
  columns: string[],
  values: TValue[],
) => {
  const mappingValues = {
    TABLE_NAME: camelToSnakeCase(table),
    COLUMNS: generateSqlColumnString(columns),
    VALUES: values.map(() => "?").join(", "),
  };
  return createStringFromTemplate(mappingValues, CREATE_QUERY_TEMPLATE);
};

export const generateUpdateQueryString = (
  table: string,
  columns: string[],
  where: string,
) => {
  const mappingValues = {
    TABLE_NAME: camelToSnakeCase(table),
    COLUMNS: generateSqlColValuePair(columns),
    WHERE: where,
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
  return columns.map((column) => `${camelToSnakeCase(column)}`).join(", ");
};

const generateSqlColValuePair = (columns: string[]) => {
  return columns
    .map((column) => {
      return `${camelToSnakeCase(column)} = ?`;
    })
    .join(", ");
};
