import fs from "fs";
// import path from "path";
import { RowDataPacket } from "mysql2";

import {
  tAattributes,
  tAttributeItem,
  tRelationship,
  tRelationshipAttr,
} from "../../../types/ftdSchema.js";
import { isTModel } from "../../../types/validateSchemaType.js";
import {
  camelToSnakeCase,
  createStringFromTemplate,
  simplize,
} from "../../codeGen/textUtils.js";
import { baseModelColumns } from "../../common/baseModelColumns.js";
import {
  findFilesByName,
  findFilesWithExtension,
} from "../../common/findFiles.js";
import { srcPath } from "../../common/srcPath.js";
import {
  getAdminConnection,
  getConnection,
} from "../connecter/mysql/connecter.js";
import { makeExecuteQuery } from "../connecter/mysql/executeQuery.js";

// When foreign keys are introduced, maybe we have to figure out the deployment order
// Finally, Automatically detect changed model files and deploy tables only related to that
export const deployDb = async (filename: string) => {
  // Get the model files
  try {
    const result = getFiles(filename);
    const tables = await getDeployedTables();
    const relationshipMap = new Map<string, tRelationship>();
    const attributeMap = new Map<string, tAattributes>();

    for (const filePath of result) {
      const data = fs.readFileSync(filePath, "utf-8");
      const modelSchema: unknown = JSON.parse(data);

      if (isTModel(modelSchema)) {
        const { name, attributes, relationships } = modelSchema;

        if (relationships !== undefined) {
          relationshipMap.set(name, relationships);
          attributeMap.set(name, attributes);
        }

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
    // Alter tables to add foreign key constraints
    console.log("Deploying Foreign Key Constraints and Indexes");
    await initializedForeignKeyConstraintCreation(
      relationshipMap,
      attributeMap,
    );
    console.log("Finished Deploying Foreign Key Constraints and Indexes");
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
  const query = `SELECT TABLE_NAME, COLUMN_NAME FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = '${process.env.DB_NAME}'`;
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

const createModelKeyIndex = (columns: tAattributes, update: boolean) => {
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
    return `DROP CONSTRAINT MODEL_KEYS_IDX,\nADD CONSTRAINT MODEL_KEYS_IDX UNIQUE (${keyString})`;
  }

  return `UNIQUE INDEX MODEL_KEYS_IDX (${keyString})`;
};
export const initializedForeignKeyConstraintCreation = async (
  relationshipMap: Map<string, tRelationship>,
  attributeMap: Map<string, tAattributes>,
) => {
  const querySet: string[] = [];
  for (const tableRelationShips of relationshipMap) {
    const [tableName, relationships] = tableRelationShips;
    const attributes = attributeMap.get(tableName);
    if (attributes) {
      const tempQuery = await createAndDeployForeignKeyConstraintsForTable(
        tableName,
        relationships,
        attributes,
      );
      querySet.push(tempQuery);
    }
  }
  // console.log(querySet.join(";"));
  if (querySet.length > 0) {
    const connection = await getAdminConnection();
    const executeQuery = makeExecuteQuery(connection);
    await executeQuery(querySet.join(";"));
    connection.destroy();
  }
};

const createAndDeployForeignKeyConstraintsForTable = async (
  tableName: string,
  relationships: tRelationship,
  attributes: tAattributes,
) => {
  // Get a list of deployed indexes for the table
  const baseQuery = `ALTER TABLE {TABLE_NAME} {FOREIGN_KEYS}{INDEXS}`;
  const baseForeignKeyDropQuery = `ALTER TABLE {TABLE_NAME} {FOREIGN_KEYS}`;

  const indexStringArray: string[] = [];
  const foregKeyStringArray: string[] = [];
  const dropForeignKeyStringArray: string[] = [];
  const deployedIndexes = await getDeployedIndexForTable(tableName);
  const deployedForeginKeys = await getDeployedForeginKeysForTable(tableName);

  for (const [relationshipName, relationship] of Object.entries(
    relationships,
  )) {
    if (relationship.relationship === "ONE_TO_ONE") {
      // Check if from is a key
      const keyString = camelToSnakeCase(
        relationship.mapping.from
          .filter((item) => attributes[item].flags !== "KMI-")
          .join(","),
      );
      // Get a list of indexes that are present in the table, if the index exist then drop and add it else add it
      if (keyString !== "") {
        const indexName = `${camelToSnakeCase(relationshipName)}_IDX`;
        if (deployedIndexes.has(indexName)) {
          const indexString = `DROP INDEX ${indexName}`;
          indexStringArray.push(indexString);
        }
        const indexString = `ADD UNIQUE INDEX ${indexName} (${keyString})`;
        indexStringArray.push(indexString);
      }
    }
    const foreignKeyExist = deployedForeginKeys.has(
      camelToSnakeCase(simplize(relationshipName)),
    );
    if (foreignKeyExist) {
      dropForeignKeyStringArray.push(
        createForeignKeyString(relationshipName, relationship, true),
      );
    }
    foregKeyStringArray.push(
      createForeignKeyString(relationshipName, relationship, false),
    );
  }
  const dropForeignKeysString = dropForeignKeyStringArray.join(",");
  const dropQuery = createStringFromTemplate(
    {
      TABLE_NAME: camelToSnakeCase(simplize(tableName)),
      FOREIGN_KEYS: dropForeignKeysString,
    },
    baseForeignKeyDropQuery,
  );
  const foreginKeysString =
    foregKeyStringArray.length > 0 ? foregKeyStringArray.join(",") : "";

  const query = createStringFromTemplate(
    {
      TABLE_NAME: camelToSnakeCase(simplize(tableName)),
      FOREIGN_KEYS: foreginKeysString,
      INDEXS:
        indexStringArray.length > 0 ? `,${indexStringArray.join(",")}` : "",
    },
    baseQuery,
  );
  if (dropForeignKeysString.length > 0) {
    return dropQuery + ";" + query;
  }
  return query;
};

const getDeployedIndexForTable = async (tableName: string) => {
  const query = `SHOW INDEX FROM ${camelToSnakeCase(simplize(tableName))}`;
  const connection = await getConnection();
  const executeQuery = makeExecuteQuery(connection);
  const indexSet = new Set<string>();

  const indexes = (await executeQuery(query)) as { Key_name: string }[];
  indexes.forEach((index) => indexSet.add(index.Key_name));
  connection.release();
  return indexSet;
};

const getDeployedForeginKeysForTable = async (tableName: string) => {
  const checkDeployedForeignKeysQuery = `SELECT CONSTRAINT_NAME FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE WHERE REFERENCED_TABLE_SCHEMA = '${
    process.env.DB_NAME
  }' AND TABLE_NAME = '${camelToSnakeCase(simplize(tableName))}'`;
  const connection = await getConnection();
  const executeQuery = makeExecuteQuery(connection);
  const foreignKeys = (await executeQuery(checkDeployedForeignKeysQuery)) as {
    CONSTRAINT_NAME: string;
  }[];
  connection.release();
  const foreignKeySet = new Set<string>();

  foreignKeys.forEach((foreignKey) =>
    foreignKeySet.add(foreignKey.CONSTRAINT_NAME),
  );
  return foreignKeySet;
};

const createForeignKeyString = (
  relationshipName: string,
  relationship: tRelationshipAttr,
  exist: boolean,
) => {
  // Check if the foreign key exist if exist drop it and insert new one
  const baseDropConstraintString = `DROP CONSTRAINT {RELATIONSHIP_NAME}`;
  const baseConstraintString = `ADD CONSTRAINT {RELATIONSHIP_NAME} FOREIGN KEY ({FROM_COLUMNS}) REFERENCES {TARGET_TABLE} ({TO_COLUMNS}) ON DELETE {ON_DELETE} ON UPDATE {ON_DELETE}`;
  if (exist) {
    return createStringFromTemplate(
      {
        RELATIONSHIP_NAME: camelToSnakeCase(simplize(relationshipName)),
        FROM_COLUMNS: relationship.mapping.from
          .map((column) => camelToSnakeCase(simplize(column)))
          .join(","),
        TO_COLUMNS: relationship.mapping.to
          .map((column) => camelToSnakeCase(simplize(column)))
          .join(","),
        TARGET_TABLE: camelToSnakeCase(simplize(relationship.model)),
        ON_DELETE: relationship.onDelete,
      },
      `${baseDropConstraintString}`,
    );
  }
  return createStringFromTemplate(
    {
      RELATIONSHIP_NAME: camelToSnakeCase(simplize(relationshipName)),
      FROM_COLUMNS: relationship.mapping.from
        .map((column) => camelToSnakeCase(simplize(column)))
        .join(","),
      TO_COLUMNS: relationship.mapping.to
        .map((column) => camelToSnakeCase(simplize(column)))
        .join(","),
      TARGET_TABLE: camelToSnakeCase(simplize(relationship.model)),
      ON_DELETE: relationship.onDelete,
    },
    baseConstraintString,
  );
};

const getFiles = (fileName: string) => {
  const extension = ".ftd.json";
  if (fileName === "all") return findFilesWithExtension(srcPath, extension);
  return findFilesByName(srcPath, fileName + extension);
};
