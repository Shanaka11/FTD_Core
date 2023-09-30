import { generateKeyWhere, generateWhereClause } from "./filterMethods";
import {
  generateCreateQueryString,
  generateDeleteQueryString,
  generateSelectQueryString,
  generateUpdateQueryString,
} from "./generateQueryString";

type ReadModelParams = {
  model: string;
  key?: string | Record<string, string>;
  columns?: string[];
  filter?: string;
};

type CreateModelParams = {
  model: string;
  columns: string[];
  values: string[];
};

type UpdateModelParams = {
  model: string;
  columns: string[];
  values: string[];
};

type DeleteModelParams = {
  model: string;
  key: string;
};
// Handle pagination as well
// Handle permissions
// Filter would look like this "filter=(Objstate eq 'Parked') and ((startswith(OrderNo,'13')) or (startswith(OrderNo,'14')) or (OrderNo eq '12'))" figure out a way to decode this and create a where statement

// Start Transaction Method
const startTransaction = () => {
  console.log("Start Transaction");
};

// End Transaction Method
const endTransaction = () => {
  console.log("End Transaction");
};

// Read Models
const readModel = ({ model, key, columns, filter }: ReadModelParams) => {
  // Create Query String
  // Check if the key is a string or object, if its a string  then its the ID, else it is the Keys
  // If either keys or the id is there then ignore rest of the filters
  let where = "";
  if (key != undefined) {
    if (typeof key === "string") {
      where = `WHERE ID = ${key}`;
    } else {
      where = `WHERE ${generateKeyWhere(key)}`;
    }
  } else if (filter !== undefined) {
    // construct the where clause from the filter string
    where = generateWhereClause(filter);
  }
  const queryString = generateSelectQueryString(model, columns, where);
  console.log(queryString);
  // Connect to the db
  // Execute the query
  // Close the connection db
};

// Create Model
const createModel = ({ model, columns, values }: CreateModelParams) => {
  const queryString = generateCreateQueryString(model, columns, values);
  console.log(queryString);
  // Connect to the db
  // Execute the query
  // Close the connection db
};

// Update Model
const updateModel = ({ model, columns, values }: UpdateModelParams) => {
  const queryString = generateUpdateQueryString(model, columns, values);
  console.log(queryString);
  // Connect to the db
  // Execute the query
  // Close the connection db
};

// Delete Model
const deleteModel = ({ model, key }: DeleteModelParams) => {
  const where = `WHERE ID = ${key}`;
  const queryString = generateDeleteQueryString(model, where);
  console.log(queryString);
  // Connect to the db
  // Execute the query
  // Close the connection db
};

export {
  readModel,
  createModel,
  updateModel,
  deleteModel,
  startTransaction,
  endTransaction,
};
