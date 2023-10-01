#!/usr/bin/env node
import { Command } from "commander";

import { createDefaultConfig } from "./lib/createDefaultConfig.js";
import { makeCreateModel } from "./lib/db/crudRepository/createModel.js";
import { makeDeleteModel } from "./lib/db/crudRepository/deleteModel.js";
import { makeReadModel } from "./lib/db/crudRepository/readModel.js";
import { makeUpdateModel } from "./lib/db/crudRepository/updateModel.js";
import { generateCoreFiles } from "./lib/generateCoreFiles.js";
import { generateId } from "./lib/generateId.js";
import { makeModelParams } from "./types/makeModelParams.js";
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

if (options.Test) {
  // console.log(generateQueryString("orderLine", "SELECT"));
  // console.log(
  //   generateQueryString("orderLine", "SELECT", ["id", "orderNo", "updatedAt"]),
  // );
}

export {
  makeModelParams,
  TModelKey,
  isIdPresent,
  TBaseUseCase,
  TBaseUseCaseCheckChanged,
  TGetModelUseCase,
  TMakeGetModelUseCase,
  makeCreateModel,
  makeReadModel,
  makeUpdateModel,
  makeDeleteModel,
  generateId,
};
