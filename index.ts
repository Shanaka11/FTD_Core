#!/usr/bin/env node
// import { loadConfig } from "./lib/loadConfig";

// loadConfig();
import { Command } from "commander";

const program = new Command();

program
  .version("1.0.0")
  .description("An example CLI for managing a directory")
  .option("-l, --ls  [value]", "List directory contents")
  .option("-m, --mkdir <value>", "Create a directory")
  .option("-t, --touch <value>", "Create a file")
  .parse(process.argv);

const options = program.opts();

if (options.ls) {
  console.log("LS");
}

if (options.mkdir) {
  console.log("MKDIR");
}

if (options.t) {
  console.log("T");
}
