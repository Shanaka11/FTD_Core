import fs from "fs";
import path from "path";

// import { fileURLToPath } from "url";

export const generateCoreFiles = () => {
  try {
    // Generate Model File
    // Generate UseCases and Stubs
    const configPath = path.join(process.cwd(), "ftd_config.json");
    const data = fs.readFileSync(configPath, "utf8");
    console.log(data);
    // As a start do not use the config file
    // All files will be generated in this iteration
    // Search for files in the src folder (Fore now we assume sources are in the src/<Models> folder, this can be a src/server/<model> or server/<model> depending on whats defined as the src in the config file)

    const rootFolder = path.join(process.cwd(), "src"); // Replace with your root folder path
    const extension = ".ftd.ts";
    const result = findFilesWithExtension(rootFolder, extension);

    console.log("Files with extension " + extension + ":");
    console.log(result);
    // Next generate files that are in the path given or the file in the path
    // Should force replace files that exist
  } catch (err) {
    console.log(err);
    console.error(
      "ftd_config.json file is missing, please npx ftd-core -init, or add it manually",
    );
  }
};

function findFilesWithExtension(rootDir: string, extension: string) {
  const fileList: string[] = [];

  function traverseDir(currentDir: string) {
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
  }

  traverseDir(rootDir);
  return fileList;
}
