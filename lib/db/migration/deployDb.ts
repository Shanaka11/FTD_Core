import fs from "fs";
// import path from "path";
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

// When foreign keys are introduced, maybe we have to figure out the deployment order
// Finally, Automatically detect changed model files and deploy tables only related to that
export const deployDb = async () => {
  // Get the model files
  try {
    const extension = ".ftd.json";
    const result = findFilesWithExtension(srcPath, extension);
    const tables = await getDeployedTables();

    for (const filePath of result) {
      const data = fs.readFileSync(filePath, "utf-8");
      const modelSchema: unknown = JSON.parse(data);

      if (isTModel(modelSchema)) {
        const { name, attributes } = modelSchema;
        const tableName = camelToSnakeCase(simplize(name));
        if (tables.get(tableName) !== undefined) {
          console.log(`${tableName}: Updating`);
          await updateAndDeployTable(
            tableName,
            attributes,
            tables.get(tableName),
          );
          console.log(`${tableName}: Updated`);
        } else {
          console.log(`${tableName}: Creating`);
          await createAndDeployTable(tableName, attributes);
          console.log(`${tableName}: Created`);
        }
      } else {
        const filename = filePath.replace(/^.*[\\/]/, "");
        throw new Error(
          `Schema error, Please check ${simplize(filename)} for errors.`,
        );
      }
    }
  } catch (e) {
    if (e instanceof Error) {
      console.log(e.message);
      return Promise.reject(new Error("Db Deplyment failed"));
    }
  }
};

const getDeployedTables = async () => {
  const tables = new Map<string, Set<string>>();
  const connection = await getConnection();
  const executeQuery = makeExecuteQuery(connection);
  const query = `SELECT TABLE_NAME, COLUMN_NAME FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = '${DB}'`;
  const dbTables = (await executeQuery(query)) as RowDataPacket[];

  dbTables.forEach((table) => {
    const tableName = table["TABLE_NAME"] as string;
    const columnName = table["COLUMN_NAME"] as string;
    const columns = tables.get(tableName);

    if (columns === undefined) {
      tables.set(tableName, new Set<string>().add(columnName));
    } else {
      tables.set(tableName, columns.add(columnName));
    }
  });
  return tables;
};

export const createAndDeployTable = async (
  tableName: string,
  columns: tAattributes,
) => {
  const queryTemplate = `CREATE TABLE {TABLE_NAME} (\n{COLUMNS},\nPRIMARY KEY(ID),\n{INDEX})`;
  const fullAttSet = Object.assign(baseModelColumns, columns);

  const columnText = Object.entries(fullAttSet)
    .map(([key, properties]) => {
      return `${camelToSnakeCase(simplize(key))} ${generateColumnAttString(
        properties,
      )}`;
    })
    .join(`,\n`);

  // Model Key
  const index = `${createModelKeyIndex(columns, false)}`;

  const query = createStringFromTemplate(
    {
      TABLE_NAME: tableName,
      COLUMNS: columnText,
      INDEX: index,
    },
    queryTemplate,
  );
  // Foreign Key constraints (One to One, One to Many, on_Delete behaviour)
  const executeQuery = makeExecuteQuery(await getConnection());
  await executeQuery(query);
};

export const updateAndDeployTable = async (
  tableName: string,
  columns: tAattributes,
  deployedColumns?: Set<string>,
) => {
  // For now we do not allow to drop columns
  const queryTemplate = `ALTER TABLE {TABLE_NAME}\n{COLUMNS},\n{INDEX}`;
  // When modifiying tables we do not change the base columns
  //   const fullAttSet = Object.assign(baseModelColumns, columns);

  const columnText = Object.entries(columns)
    .map(([key, properties]) => {
      const columnName = camelToSnakeCase(simplize(key));
      if (deployedColumns?.has(columnName)) {
        return `MODIFY COLUMN ${camelToSnakeCase(
          simplize(key),
        )} ${generateColumnAttString(properties)}`;
      } else {
        return `ADD ${camelToSnakeCase(
          simplize(key),
        )} ${generateColumnAttString(properties)}`;
      }
    })
    .join(`,\n`);

  // Model Key
  const index = `${createModelKeyIndex(columns, true)}`;

  const query = createStringFromTemplate(
    {
      TABLE_NAME: tableName,
      COLUMNS: columnText,
      INDEX: index,
    },
    queryTemplate,
  );

  // Foreign Key constraints (One to One, One to Many, on_Delete behaviour)
  const executeQuery = makeExecuteQuery(await getConnection());
  await executeQuery(query);
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

export const createModelKeyIndex = (columns: tAattributes, update: boolean) => {
  const keyString = Object.entries(columns).reduce((acc, [key, value]) => {
    if (value.flags === "KMI-") {
      if (acc === ``) {
        acc = camelToSnakeCase(simplize(key));
      } else {
        acc = acc + ", " + camelToSnakeCase(simplize(key));
      }
    }
    return acc;
  }, ``);

  // When updating we should drop the existing modelKey constraint and create it again with the new fields
  if (update) {
    return `DROP CONSTRAINT MODEL_KEYS,\nADD CONSTRAINT MODEL_KEYS UNIQUE (${keyString})`;
  }

  return `UNIQUE INDEX MODEL_KEYS (${keyString})`;
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
