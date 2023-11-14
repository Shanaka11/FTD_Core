#!/usr/bin/env node
import { Command } from "commander";

import { createDefaultConfig } from "./lib/createDefaultConfig.js";
import { makeExecuteQuery } from "./lib/db/connecter/mysql/executeQuery.js";
import { executeTransaction } from "./lib/db/connecter/mysql/executeTransaction.js";
import { makeCreateModel } from "./lib/db/crudRepository/createModel.js";
import { makeDeleteModel } from "./lib/db/crudRepository/deleteModel.js";
import { makeReadModel } from "./lib/db/crudRepository/readModel.js";
import { makeUpdateModel } from "./lib/db/crudRepository/updateModel.js";
import { deployDb } from "./lib/db/migration/deployDb.js";
import { generateCoreFiles } from "./lib/generateCoreFiles.js";
import { generateId } from "./lib/generateId.js";
import { validateModelZod as validateModel } from "./lib/validation/zodValidation.js";
import { makeModelParams, TRawData } from "./types/makeModelParams.js";
import {
  TExecuteQuery,
  TExecuteQueryResponse,
  TValue,
} from "./types/repositoryTypes.js";
import {
  isIdPresent,
  TBaseUseCase,
  TBaseUseCaseCheckChanged,
  TGetModelUseCase,
  TMakeGetModelUseCase,
  TModelKey,
} from "./types/useCaseTypes.js";

const program = new Command();

program
  .description("An example CLI for managing a directory")
  .option("-gen, --generate  [value]", "Generate core code from schema")
  .option("-init, --init", "Create the default ftdConfig.json file")
  .option("-deploy [value]", "Deploy the tables to the db")
  .option("-test", "test scripts")
  .parse(process.argv);

const options = program.opts();

if (options.generate != undefined) {
  if (options.generate !== true) {
    generateCoreFiles(options.generate as string);
  } else {
    generateCoreFiles();
  }
}

if (options.init && !options.generate) {
  createDefaultConfig();
}

if (options.Deploy && !options.generate) {
  if (options.Deploy === true) {
    console.log(
      "Please enter the model file to be deployed, if you want to deploy all files use the command -deploy all",
    );
  } else {
    await deployDb(options.Deploy as string);
    console.log("Db Deployment Completed");
    process.exit(0);
  }
}

if (options.Test) {
  // const temp: tAattributes = {
  //   OrderNo: { type: "Number", flags: "KMI-" },
  //   TotalAmount: { type: "Number", flags: "AMIU" },
  //   Date: { type: "Date", flags: "A-I-" },
  //   Customer: { type: "String", maxLength: 21, flags: "A-IU" },
  // };
  // const deployedCols = new Set<string>();
  // deployedCols.add("ORDER_NO");
  // deployedCols.add("ID");
  // deployedCols.add("UPDATED_AT");
  // deployedCols.add("CREATED_AT");
  // deployedCols.add("TOTAL_AMOUNT");
  // deployedCols.add("DATE");
  // deployedCols.add("CUSTOMER");
  // updateAndDeployTable("CUSTOMER_ORDER2", temp, deployedCols);
  console.log("Tets");
}

export {
  makeModelParams,
  TModelKey,
  isIdPresent,
  TBaseUseCase,
  TBaseUseCaseCheckChanged,
  TGetModelUseCase,
  TMakeGetModelUseCase,
  TExecuteQuery,
  TExecuteQueryResponse,
  TRawData,
  TValue,
  makeCreateModel,
  makeReadModel,
  makeUpdateModel,
  makeDeleteModel,
  generateId,
  makeExecuteQuery,
  executeTransaction,
  validateModel,
};
