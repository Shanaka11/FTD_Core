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
  snakeToCamel,
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
import {
  makeExecuteMultipleQueries,
  makeExecuteQuery,
} from "../connecter/mysql/executeQuery.js";

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

      if (!isTModel(modelSchema)) {
        const filename = filePath.replace(/^.*[\\/]/, "");
        throw new Error(
          `Schema error, Please check ${simplize(filename)} for errors.`,
        );
      }

      const { name, attributes, relationships } = modelSchema;

      if (relationships !== undefined) {
        relationshipMap.set(name, relationships);
      }
      attributeMap.set(name, attributes);

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
    }
    // Alter tables to add foreign key constraints
    console.log("Deploying Foreign Key Constraints and Indexes");
    await initializedForeignKeyConstraintCreation(
      relationshipMap,
      attributeMap,
    );
    console.log("Finished Deploying Foreign Key Constraints and Indexes");

    console.log("Drop removed columns");
    await dropRemovedColumns(attributeMap);
    console.log("Finished dropping columns");
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
  const dbTables = (await executeQuery(query, true)) as RowDataPacket[];

  dbTables.forEach((table) => {
    const tableName = table["tableName"] as string;
    const columnName = table["columnName"] as string;
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
  const queryTemplate = `CREATE TABLE {TABLE_NAME} (\n{COLUMNS},\nPRIMARY KEY(ID)\n{INDEX})`;
  const fullAttSet = Object.assign(columns, baseModelColumns);

  const columnText = Object.entries(fullAttSet)
    .map(([key, properties]) => {
      return `${camelToSnakeCase(simplize(key))} ${generateColumnAttString(
        properties,
      )}`;
    })
    .join(`,\n`);

  // Model Key
  const index = `${await createModelKeyIndex(tableName, columns, false)}`;

  const query = createStringFromTemplate(
    {
      TABLE_NAME: tableName,
      COLUMNS: columnText,
      INDEX: (index !== "" ? "," : "") + index,
    },
    queryTemplate,
  );
  // Foreign Key constraints (One to One, One to Many, on_Delete behaviour)
  const executeQuery = makeExecuteQuery(await getConnection());
  await executeQuery(query, false);
};

export const updateAndDeployTable = async (
  tableName: string,
  columns: tAattributes,
  deployedColumns?: Set<string>,
) => {
  // For now we do not allow to drop columns
  const queryTemplate = `ALTER TABLE {TABLE_NAME}\n{COLUMNS}\n{INDEX}`;
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
  const index = `${await createModelKeyIndex(tableName, columns, true)}`;

  const query = createStringFromTemplate(
    {
      TABLE_NAME: tableName,
      COLUMNS: columnText + (index !== "" ? "," : ""),
      INDEX: index,
    },
    queryTemplate,
  );

  // Foreign Key constraints (One to One, One to Many, on_Delete behaviour)
  const executeQuery = makeExecuteQuery(await getConnection());
  await executeQuery(query, false);
};

const generateColumnAttString = (attribute: tAttributeItem) => {
  let attString = "";
  if (attribute.type === "String")
    attString += `VARCHAR(${attribute.maxLength})`;
  if (attribute.type === "Text") attString += `TEXT`;
  if (attribute.type === "Email") attString += `VARCHAR(255)`;
  if (attribute.type === "Url") attString += `VARCHAR(255)`;
  if (attribute.type === "Date") attString += `DATE`;
  if (attribute.type === "Timestamp") attString += "TIMESTAMP";
  if (attribute.type === "BigNumber") attString += "BIGINT";
  if (attribute.type === "Number") attString += `INT`;
  if (attribute.type === "Decimal") attString += `DECIMAL(12, 2)`;
  if (attribute.type === "Float") attString += `FLOAT`;
  if (attribute.type === "Enum") {
    attString += `VARCHAR(${attribute.enum.reduce(
      (max, str) => (str.length > max ? str.length : max),
      0,
    )})`;
  }
  if (
    attribute.flags === "AMI-" ||
    attribute.flags === "AMIU" ||
    attribute.flags === "KMI-"
  )
    attString += " NOT NULL";

  return attString;
};

const createModelKeyIndex = async (
  tableName: string,
  columns: tAattributes,
  update: boolean,
) => {
  const keyString = Object.entries(columns).reduce((acc, [key, value]) => {
    if (value.flags === "KMI-" && key !== "Id") {
      if (acc === ``) {
        acc = camelToSnakeCase(simplize(key));
      } else {
        acc = acc + ", " + camelToSnakeCase(simplize(key));
      }
    }
    return acc;
  }, ``);

  // When there are no user defined keys
  if (keyString === ``) {
    // IF updating and a constraint exist then drop it
    if (update) {
      const deployedModelKeys = await getDeployedForeginKeysForTable(
        snakeToCamel(tableName),
      );
      if (deployedModelKeys.has("MODEL_KEYS_IDX")) {
        return `DROP CONSTRAINT MODEL_KEYS_IDX`;
      }
    }
    return ``;
  }
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
    const executeQuery = makeExecuteMultipleQueries(connection);
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

  const indexes = (await executeQuery(query, true)) as { Key_name: string }[];
  indexes.forEach((index) => indexSet.add(index.Key_name));
  connection.release();
  return indexSet;
};

const getDeployedForeginKeysForTable = async (tableName: string) => {
  const checkDeployedForeignKeysQuery = `SELECT CONSTRAINT_NAME FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE WHERE CONSTRAINT_SCHEMA = '${
    process.env.DB_NAME
  }' AND TABLE_NAME = '${camelToSnakeCase(simplize(tableName))}'`;
  const connection = await getConnection();
  const executeQuery = makeExecuteQuery(connection);

  const foreignKeys = (await executeQuery(
    checkDeployedForeignKeysQuery,
    true,
  )) as {
    constraintName: string;
  }[];
  connection.release();
  const foreignKeySet = new Set<string>();

  foreignKeys.forEach((foreignKey) =>
    foreignKeySet.add(foreignKey.constraintName),
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

const dropRemovedColumns = async (attributeMap: Map<string, tAattributes>) => {
  // Loop the attributeMap and run generateDropColumnStringForTable on each pass
  // This will return an array of ALTER TABLE statements
  // Join the array with ; and then execute the query
  const querySet: string[] = [];
  for (const [tableName, attributes] of attributeMap) {
    const queryString = await generateDropColumnStringForTable(
      tableName,
      attributes,
    );
    if (queryString !== "") {
      querySet.push(
        await generateDropColumnStringForTable(tableName, attributes),
      );
    }
  }
  if (querySet.length > 0) {
    const connection = await getAdminConnection();
    const executeQuery = makeExecuteMultipleQueries(connection);
    await executeQuery(querySet.join(";"));
    connection.destroy();
  }
};

const generateDropColumnStringForTable = async (
  tableName: string,
  attributes: tAattributes,
) => {
  // Get the column names that exist in the table
  // Check with the attribute map
  // Check if a column name exist in the table and not in the attribute map
  // If not exist the generate a drop statement for the column
  // This should return something like
  /*
  'ALTER TABLE TABLE_NAME DROP COLUMNS A, DROP COULMN B'
   */
  const checkDeployedColumns = `DESCRIBE ${camelToSnakeCase(
    simplize(tableName),
  )}`;
  const dropColumnArray: string[] = [];
  const connection = await getConnection();
  const executeQuery = makeExecuteQuery(connection);

  const deployedColumns = (await executeQuery(checkDeployedColumns, true)) as {
    field: string;
  }[];
  connection.release();

  deployedColumns.forEach(({ field }) => {
    // Ignore base columns, Id, CreatedAt, UpdatedAt
    if (field === "ID" || field === "CREATED_AT" || field === "UPDATED_AT")
      return;
    if (attributes[snakeToCamel(field)] === undefined) {
      dropColumnArray.push(`DROP ${field}`);
    }
  });

  if (dropColumnArray.length === 0) return "";

  return `ALTER TABLE ${camelToSnakeCase(
    simplize(tableName),
  )} ${dropColumnArray.join(",")}`;
};
