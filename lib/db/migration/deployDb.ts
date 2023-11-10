import fs from "fs";
import path from "path";
import { RowDataPacket } from "mysql2";

import { tAattributes, tAttributeItem } from "../../../types/ftdSchema.js";
import { isTModel } from "../../../types/validateSchemaType.js";
import {
  camelToSnakeCase,
  createStringFromTemplate,
  simplize,
} from "../../codeGen/textUtils.js";
import { baseModelColumns } from "../../common/baseModelColumns.js";
// For now assume we will deploy all tables every time
// After that is done then figure out a way to deploy specific tables (flie path for a model file)

import { findFilesWithExtension } from "../../common/findFilesWithExtention.js";
import { srcPath } from "../../common/srcPath.js";
import { getConnection } from "../connecter/mysql/connecter.js";
import { makeExecuteQuery } from "../connecter/mysql/executeQuery.js";

const DB = "dev";

// Finally, Automatically detect changed model files and deploy tables only related to that
export const deployDb = async () => {
  // Get the model files
  const extension = ".ftd.json";
  const result = findFilesWithExtension(srcPath, extension);
  // Try making this async ?
  const tables = await getDeployedTables();
  result.map((filePath) => {
    const data: string = fs.readFileSync(filePath, "utf-8");
    const modelSchema: unknown = JSON.parse(data);
    if (isTModel(modelSchema)) {
      const directory = path.dirname(filePath);
      const { name, attributes } = modelSchema;

      const tableName = camelToSnakeCase(simplize(name));
      // Check if the table exist if exist then we should use alter table else create table
      if (tables.get(tableName) === undefined) {
        // Alter table
        // Check if the column exist, if exist then update it, else add it
      } else {
        // Create table
        createAndDeployTable(tableName, attributes);
      }
      console.log(tableName, attributes, directory);
    } else {
      const filename = filePath.replace(/^.*[\\/]/, "");
      throw new Error(
        `Schema error, Please check ${simplize(filename)} for errors.`,
      );
    }
  });
};

const getDeployedTables = async () => {
  const tables = new Map<string, Set<string>>();
  const executeQuery = makeExecuteQuery(await getConnection());
  const query = `SELECT TABLE_NAME, COLUMN_NAME FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = '${DB}'`;
  const dbTables = (await executeQuery(query)) as RowDataPacket[];

  dbTables.forEach((table) => {
    const tableName = table["TABLE_NAME"] as string;
    const columnName = table["COLUMN_NAME"] as string;
    const columns = tables.get(tableName);
    if (columns === undefined) {
      tables.set(tableName, new Set<string>().add(columnName));
    } else {
      tables.set(tableName, columns);
    }
  });
  return tables;
};

export const createAndDeployTable = (
  tableName: string,
  columns: tAattributes,
) => {
  const queryTemplate = `CREATE TABLE {TABLE_NAME} (\n{COLUMNS}\n)`;
  const fullAttSet = Object.assign(baseModelColumns, columns);

  const columnText = Object.entries(fullAttSet)
    .map(([key, properties]) => {
      return `${camelToSnakeCase(simplize(key))} ${generateColumnAttString(
        properties,
      )}`;
    })
    .join(`,\n`);

  const query = createStringFromTemplate(
    {
      TABLE_NAME: tableName,
      COLUMNS: columnText,
    },
    queryTemplate,
  );
  // Primary Key, Model Key
  //   const indexes = "";
  // Foreign Key constraints (One to One, One to Many, on_Delete behaviour)
  console.log(query);
};

const generateColumnAttString = (attribute: tAttributeItem) => {
  let attString = "";
  if (attribute.type === "String")
    attString += `VARCHAR(${attribute.maxLength})`;
  if (attribute.type === "Date") attString += `DATETIME`;
  if (attribute.type === "Number") attString += `INT`;
  if (
    attribute.flags === "AMI-" ||
    attribute.flags === "AMIU" ||
    attribute.flags === "KMI-"
  )
    attString += " NOT NULL";

  return attString;
};

// CREATE TABLE product_order (
//     no INT NOT NULL AUTO_INCREMENT,
//     product_category INT NOT NULL,
//     product_id INT NOT NULL,
//     customer_id INT NOT NULL,

//     PRIMARY KEY(no),
//     INDEX (product_category, product_id),
//     INDEX (customer_id),

//     FOREIGN KEY (product_category, product_id)
//       REFERENCES product(category, id)
//       ON UPDATE CASCADE ON DELETE RESTRICT,

//     FOREIGN KEY (customer_id)
//       REFERENCES customer(id)
// )
