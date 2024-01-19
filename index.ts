#!/usr/bin/env node
import { Command } from "commander";

import "dotenv/config";

import { createDefaultConfig } from "./lib/createDefaultConfig.js";
import {
  deployDb,
  initializedForeignKeyConstraintCreation,
} from "./lib/db/migration/deployDb.js";
import { generateCoreFiles } from "./lib/generateCoreFiles.js";
import { tAattributes, tRelationship } from "./types/ftdSchema.js";

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
  const map = new Map<string, tRelationship>();
  const attrMap = new Map<string, tAattributes>();

  const rel1: tRelationship = {
    orderRef: {
      model: "customerOrder",
      relationship: "ONE_TO_ONE",
      mapping: {
        from: ["OrderNo"],
        to: ["Id"],
      },
      onDelete: "CASCADE",
    },
    profileRef: {
      model: "Profile",
      relationship: "ONE_TO_ONE",
      mapping: {
        from: ["ProfileId"],
        to: ["Id"],
      },
      onDelete: "RESTRICT",
    },
  };

  const attr: tAattributes = {
    OrderNo: { type: "Number", flags: "KMI-" },
    ProfileId: { type: "Number", flags: "AMI-" },
  };

  map.set("OrderLine", rel1);
  attrMap.set("OrderLine", attr);
  await initializedForeignKeyConstraintCreation(map, attrMap);
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
