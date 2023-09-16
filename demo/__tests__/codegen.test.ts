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
    const data = readFile("./ftd_config.json");
    // const cmdExec = execCommand("npm run ftd-core:gen");
    // const { stdout, stderr, code } = await cmdExec;

    // const trimmedStdout = stdout.split("\n");

    // expect(trimmedStdout[4]).toBe("");
    // expect(stderr).toBe(
    //   "ftd_config.json file is missing, please npx ftd-core -init, or add it manually\n",
    // );
    expect(data).toBe("File Read Error");
  });

  it("Create configuration file", async () => {
    // Create the default config
    const cmdExec = execCommand("npm run ftd-core -- -init");
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
describe("Code Generation Checks", () => {
  it("Generate Code For All files", async () => {
    const cmdExec = execCommand("npm run ftd-core -- -gen");
    const { stdout, stderr, code } = await cmdExec;

    // No errors were thrown
    expect(stderr).toBe("");

    // Check if the files are generated
    // Check src/Order/order/order.gen.ts
    // Check with correct template
    let genFile = readFile(
      path.join(process.cwd(), "src", "Order", "order", "order.gen.ts"),
    );
    let templateFile = readFile(
      path.join(process.cwd(), "templates", "order.gen.ts"),
    );
    expect(genFile).not.toBe("File Read Error");
    expect(templateFile).not.toBe("File Read Error");
    expect(genFile).toBe(templateFile);
    // Check with incorrect template

    // Check src/Order/orderLine/orderLine.gen.ts
    // Check src/User/profile/profile.gen.ts
    // remove the generated files
  });

  it("Generate Code for all files in the give folder", async () => {
    const cmdExec = execCommand("npm run ftd-core -- -gen --order");
    const { stdout, stderr, code } = await cmdExec;

    // No errors were thrown
    expect(stderr).toBe("");

    // Check if the files are generated
    // Files should only be generated in the src/order/ folder and other folders should not be changed

    // remove the generated files
  });

  it("Generate Code for all files in the give folder", async () => {
    const cmdExec = execCommand(
      "npm run ftd-core -- -gen --./order/order.ftd.json",
    );
    const { stdout, stderr, code } = await cmdExec;

    // No errors were thrown
    expect(stderr).toBe("");

    // Check if the files are generated
    // Only order_ftd.json should be generated and nothing else should be generated

    // remove the generated files
  });
});
