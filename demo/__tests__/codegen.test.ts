import fs from "fs";
import path from "path";

import { deleteFile } from "../lib/deleteFile";
import { execCommand } from "../lib/mockCommandInvoke";
import { readFile } from "../lib/readFile";

//Utils
afterAll(() => {
  // Clear all generated files
  // Clear ftd_config.json
  try {
    fs.unlinkSync(path.join(process.cwd(), "ftd_config.json"));
  } catch (err) {
    console.error("Unable to remove test files");
  }
});

const compareFiles = (genPath: string, templateFilename: string) => {
  const genFile = readFile(genPath);
  const correctTemplateFile = readFile(
    path.join(process.cwd(), "templates/correct/", templateFilename),
  );
  const incorrectTemplateFile = readFile(
    path.join(process.cwd(), "templates/incorrect/", templateFilename),
  );

  expect(genFile).not.toBe("File Read Error");
  expect(correctTemplateFile).not.toBe("File Read Error");
  expect(incorrectTemplateFile).not.toBe("File Read Error");
  expect(genFile).toBe(correctTemplateFile);
  expect(genFile).not.toBe(incorrectTemplateFile);
};

const compareFileNotExist = (genPath: string) => {
  const data = readFile(genPath);

  expect(data).toBe("File Read Error");
};

const compareFileSet = (filePath: string) => {
  // When given a path like src/User/profile
  // Check all the files that should be generated

  // model file - orderLine.gen.ts
  const domainModal = filePath.replace(/^.*[\\\/]/, "");

  const modelFileName = domainModal + ".gen.ts";
  const templateModelFileName = domainModal + ".template.txt";
  it(`Checking ${modelFileName}`, () =>
    compareFiles(path.join(filePath, modelFileName), templateModelFileName));

  // useCase files - createOrderLine.gen.ts / readOrderLine.gen.ts / updateOrderLine.gen.ts / deleteOrderLine.gen.ts
  const modelBaseUseCaseFileName = domainModal + "BaseUseCases.gen.ts";
  const templateBaseUseCaseFileName = domainModal + "BaseUseCases.template.txt";
  it(`Checking ${modelBaseUseCaseFileName}`, () =>
    compareFiles(
      path.join(filePath, modelBaseUseCaseFileName),
      templateBaseUseCaseFileName,
    ));

  // useCase stubs -  createOrderLine.ts / readOrderLine.ts / updateOrderLine.ts / deleteOrderLine.ts
  const modelUseCaseStubFileName = domainModal + "UseCases.ts";
  const templateUseCaseStubFileName = domainModal + "UseCases.template.txt";
  it(`Checking ${modelUseCaseStubFileName}`, () =>
    compareFiles(
      path.join(filePath, modelUseCaseStubFileName),
      templateUseCaseStubFileName,
    ));
};

const compareFileSetNotExist = (filePath: string) => {
  const domainModal = filePath.replace(/^.*[\\\/]/, "");
  const modelFileName = domainModal + ".gen.ts";
  const baseUseCaseFileName = domainModal + "BaseUseCases.gen.ts";
  const useCaseFileName = domainModal + "UseCases.ts";
  // Check model
  it(`Checking ${modelFileName} does not exist`, () => {
    compareFileNotExist(path.join(filePath, modelFileName));
  });
  // Check use case
  it(`Checking ${baseUseCaseFileName} does not exist`, () => {
    compareFileNotExist(path.join(filePath, baseUseCaseFileName));
  });
  // Check use case stubs
  it(`Checking ${useCaseFileName} does not exist`, () => {
    compareFileNotExist(path.join(filePath, useCaseFileName));
  });
};

const removeFileSet = (filePath: string) => {
  const domainModal = filePath.replace(/^.*[\\\/]/, "");
  const modelFileName = domainModal + ".gen.ts";
  const baseUseCaseFileName = domainModal + "BaseUseCases.gen.ts";
  const useCaseFileName = domainModal + "UseCases.ts";

  deleteFile(path.join(filePath, modelFileName));
  deleteFile(path.join(filePath, baseUseCaseFileName));
  deleteFile(path.join(filePath, useCaseFileName));
};

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
  describe("Generate Code For All files", () => {
    it("Run code generation command", async () => {
      const cmdExec = execCommand("npm run ftd-core -- -gen");
      const { stderr } = await cmdExec;

      // No errors were thrown
      expect(stderr).toBe("");
    });

    // Check if the files are generated
    // Check src/Order/order/order.gen.ts
    compareFileSet(path.join(process.cwd(), "src/Order/order"));

    // Check src/Order/orderLine/orderLine.gen.ts
    compareFileSet(path.join(process.cwd(), "src/Order/orderLine"));

    // Check src/User/profile/profile.gen.ts
    compareFileSet(path.join(process.cwd(), "src/User/profile"));

    // remove the generated files
    // Remove model files
    afterAll(() => {
      removeFileSet(path.join(process.cwd(), "src/Order/order"));
      removeFileSet(path.join(process.cwd(), "src/Order/orderLine"));
      removeFileSet(path.join(process.cwd(), "src/User/profile"));
    });
  });

  describe("Generate Code for all files in the given folder", () => {
    it("Run code generation command", async () => {
      const cmdExec = execCommand("npm run ftd-core -- -gen ./Order");
      const { stderr } = await cmdExec;

      // No errors were thrown
      expect(stderr).toBe("");
    });

    // Check if the files are generated
    // Files should only be generated in the src/order/ folder and other folders should not be changed
    // Check if Order and Order Line files are generated
    // Check src/Order/order/order.gen.ts
    compareFileSet(path.join(process.cwd(), "src/Order/order"));
    // Check src/Order/orderLine/orderLine.gen.ts
    compareFileSet(path.join(process.cwd(), "src/Order/orderLine"));
    // Check if profile is not generated
    compareFileSetNotExist(path.join(process.cwd(), "src/User/profile"));

    // remove the generated files
    afterAll(() => {
      removeFileSet(path.join(process.cwd(), "src/Order/order"));
      removeFileSet(path.join(process.cwd(), "src/Order/orderLine"));
    });
  });
});
