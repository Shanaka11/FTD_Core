import fs from "fs";
import path from "path";

import { isTModel } from "../types/validateSchemaType.js";
import { generateModel } from "./codeGen/generateModel.js";
import { generateUseCase } from "./codeGen/generateUseCase.js";
import { generateUseCaseStubs } from "./codeGen/generateUseCaseStubs.js";
import { simplize } from "./codeGen/textUtils.js";
import { findFilesWithExtension } from "./common/findFiles.js";
import { srcPath } from "./common/srcPath.js";
import { writeFileSync } from "./common/writeGeneratedFile.js";

// import { fileURLToPath } from "url";
export const modelMap = new Map<string, string>();

export const generateCoreFiles = (dirPath?: string) => {
  try {
    // Generate Model File
    // Generate UseCases and Stubs
    // As a start do not use the config file
    // All files will be generated in this iteration
    // Search for files in the src folder (Fore now we assume sources are in the src/<Models> folder, this can be a src/server/<model> or server/<model> depending on whats defined as the src in the config file)
    generateCoreFiles_(srcPath, dirPath === undefined);
    if (dirPath !== undefined) {
      generateCoreFiles_(path.join(srcPath, dirPath));
    }
  } catch (err) {
    if (err instanceof Error) {
      // e is narrowed to Error!
      console.error(err.message);
    } else {
      console.error(err);
    }
  }
};

const generateCoreFiles_ = (dirPath: string, generate: boolean = true) => {
  // console.log(dirPath);
  const rootFolder = dirPath; // Replace with your root folder path
  const extension = ".ftd.json";
  const result = findFilesWithExtension(rootFolder, extension);
  generateFolderStructure(result);
  // Try making this async
  result.forEach((filePath) => {
    if (!generate) return;
    try {
      const data: string = fs.readFileSync(filePath, "utf-8");
      const modelData: unknown = JSON.parse(data);
      if (isTModel(modelData)) {
        const directory = path.dirname(filePath);
        // Model
        const modelCode = generateModel(modelData);

        writeFileSync(
          `${directory}/gen/${simplize(modelData.name)}.gen.ts`,
          modelCode,
        );
        console.log(`${simplize(modelData.name)}.gen.ts Created successfully.`);

        // Usecases
        const useCaseCode = generateUseCase(modelData);
        writeFileSync(
          `${directory}/gen/${simplize(modelData.name)}BaseUseCases.gen.ts`,
          useCaseCode,
        );
        console.log(
          `${simplize(
            modelData.name,
          )}BaseUseCases.gen.ts Created successfully.`,
        );

        // Usecase stubs
        // Check if a file exists if so do not overwright it
        const stubExists = fs.existsSync(
          `${directory}/useCases/${simplize(modelData.name)}UseCases.ts`,
        );
        if (stubExists) {
          console.log(
            `${simplize(
              modelData.name,
            )}UseCases.ts Already exists, no file was generated.`,
          );
        } else {
          const useCaseStubCode = generateUseCaseStubs(modelData);
          writeFileSync(
            `${directory}/useCases/${simplize(modelData.name)}UseCases.ts`,
            useCaseStubCode,
          );
          console.log(
            `${simplize(modelData.name)}UseCases.ts Created successfully.`,
          );
        }
      } else {
        const filename = filePath.replace(/^.*[\\/]/, "");
        throw new Error(
          `Schema error, Please check ${simplize(filename)} for errors.`,
        );
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        // e is narrowed to Error!
        const filename = filePath.replace(/^.*[\\/]/, "");
        console.error(`${filename} has errors: ${err.message}`);
      } else {
        console.error(err);
      }
    }
  });
};

const generateFolderStructure = (filePaths: string[]) => {
  filePaths.forEach((filePath) => {
    const relativePath = path.dirname(filePath.split(`${srcPath}/`)[1]);
    const lastSlashIndex = relativePath.lastIndexOf("/");
    const model =
      lastSlashIndex !== -1 ? relativePath.slice(lastSlashIndex + 1) : filePath;
    modelMap.set(simplize(model), relativePath);
  });
};
