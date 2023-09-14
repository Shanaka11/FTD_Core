import path from "path";

import { execCommand } from "../lib/mockCommandInvoke";
import { readFile } from "../lib/readFile";

// Before running tests remove generated files

describe("Code Generation Prerequisits", () => {
  // First clear the generated files if there are any
  // Then run the generate command for the whole section
  // After it ran successfully check the generated file contents and paths are correct

  it("Check configuration file exist", async () => {
    // Give an error when config is not present
    const cmdExec = execCommand("npm run generate");
    const { stdout, stderr, code } = await cmdExec;

    const trimmedStdout = stdout.split("\n");

    expect(trimmedStdout[4]).toBe("");
    expect(stderr).toBe(
      "ftd_config.json file is missing, please npx ftd-core -init, or add it manually\n",
    );
    expect(code).toBe(0);
  });

  it("Create configuration file", async () => {
    // Create the default config
    const cmdExec = execCommand("npm run ftd-core:init");
    const { stdout, stderr, code } = await cmdExec;

    // Check if command executed without any issues
    expect(stderr).toBe("");
    expect(code).toBe(0);

    const trimmedStdout = stdout.split("\n");

    expect(trimmedStdout[4]).toBe("Create Default Config");

    // Check if the file is created
    const data = readFile(path.join(process.cwd(), "ftd_config.json"));

    expect(data).not.toBe("File Read Error");
  });
});

// Test the code generation itself
