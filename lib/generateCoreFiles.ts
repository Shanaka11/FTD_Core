import fs from "fs";
import path from "path";

import { isTModel } from "../types/validateSchemaType.js";
import { generateModel } from "./codeGen/generateModel.js";

// import { fileURLToPath } from "url";

export const generateCoreFiles = (dirPath?: string) => {
  try {
    if (dirPath != undefined) {
      // TODO: We should get the full path, for instance if we invoke -gen , when in the Order folder, then -gen -orderLine, or -gen . should generate the files in the correct folder
      console.log(dirPath);
      generateCoreFiles_(path.join(process.cwd(), "src", dirPath));
      return;
    }
    // Generate Model File
    // Generate UseCases and Stubs
    // As a start do not use the config file
    // All files will be generated in this iteration
    // Search for files in the src folder (Fore now we assume sources are in the src/<Models> folder, this can be a src/server/<model> or server/<model> depending on whats defined as the src in the config file)
    generateCoreFiles_(path.join(process.cwd(), "src"));
  } catch (err) {
    if (err instanceof Error) {
      // e is narrowed to Error!
      console.error(err.message);
    } else {
      console.error(err);
    }
  }
};

const generateCoreFiles_ = (dirPath: string) => {
  const rootFolder = dirPath; // Replace with your root folder path
  const extension = ".ftd.json";
  const result = findFilesWithExtension(rootFolder, extension);

  result.forEach((filePath) => {
    const data: string = fs.readFileSync(filePath, "utf-8");
    const modelData: unknown = JSON.parse(data);
    if (isTModel(modelData)) {
      const code = generateModel(modelData);
      const directory = path.dirname(filePath);
      fs.writeFileSync(`${directory}/${modelData.name}.gen.ts`, code);
      console.log(`${modelData.name}.gen.ts Created successfully.`);
    } else {
      const filename = filePath.replace(/^.*[\\/]/, "");
      throw new Error(`Schema error, Please check ${filename} for errors.`);
    }
  });
};

const findFilesWithExtension = (rootDir: string, extension: string) => {
  const fileList: string[] = [];

  const traverseDir = (currentDir: string) => {
    const files = fs.readdirSync(currentDir);

    for (const file of files) {
      const filePath = path.join(currentDir, file);
      const stat = fs.statSync(filePath);

      if (stat.isDirectory()) {
        traverseDir(filePath);
      } else if (file.endsWith(extension)) {
        fileList.push(filePath);
      }
    }
  };

  traverseDir(rootDir);
  return fileList;
};
