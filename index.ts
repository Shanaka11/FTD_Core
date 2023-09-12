import { Command } from "commander";

import { createDefaultConfig } from "./lib/createDefaultConfig.js";
import { generateCoreFiles } from "./lib/generateCoreFiles.js";
import { getCurrentPackageVersion } from "./lib/getPackageVersion.js";

const program = new Command();

program
  .version(getCurrentPackageVersion())
  .description("An example CLI for managing a directory")
  .option("-gen, --generate  [value]", "Generate core code from schema")
  .option("-init, --init", "Create the default ftdConfig.json file")
  .parse(process.argv);

const options = program.opts();

if (options.generate) {
  generateCoreFiles();
}

if (options.init) {
  createDefaultConfig();
}
