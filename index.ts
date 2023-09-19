#!/usr/bin/env node
import { Command } from "commander";

import { generateModel } from "./lib/codeGen/generateModel.js";
import { createDefaultConfig } from "./lib/createDefaultConfig.js";
import { generateCoreFiles } from "./lib/generateCoreFiles.js";
import { tModel } from "./types/ftdSchema.js";
import { makeModelParams } from "./types/makeModelParams.js";

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
  const data: tModel = {
    name: "Order",
    attributes: {
      OrderNo: { type: "Number", flags: "KMI-" },
      TotalAmount: { type: "Number", flags: "AMIU" },
      Date: { type: "String", flags: "A-I-", maxLength: 4 },
    },
  };
  console.log(generateModel(data));
}

export { makeModelParams };
