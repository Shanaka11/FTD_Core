import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// import { fileURLToPath } from "url";

export const generateCoreFiles = (dirPath?: string) => {
  try {
    const configPath = path.join(process.cwd(), "ftd_config.json");
    const data = fs.readFileSync(configPath, "utf8");
    console.log(data);

    const filename = fileURLToPath(import.meta.url);
    const dirname = path.dirname(filename);

    if (dirPath != undefined) {
      // For testing we will assume that path will always be src/Order/order
      // Copy Order
      let destinationPath = path.join(
        process.cwd(),
        "src/Order/order/order.gen.ts",
      );
      let sourcePath = path.join(dirname, "../", "templates/order.gen.ts");

      fs.copyFileSync(sourcePath, destinationPath);
      console.log("Created order.gen.ts");

      // Copy Order Line
      destinationPath = path.join(
        process.cwd(),
        "src/Order/orderLine/orderLine.gen.ts",
      );
      sourcePath = path.join(dirname, "../", "templates/orderLine.gen.ts");

      fs.copyFileSync(sourcePath, destinationPath);
      console.log("Created orderLine.gen.ts");
      return dirPath;
    }
    // Generate Model File
    // Generate UseCases and Stubs
    // As a start do not use the config file
    // All files will be generated in this iteration
    // Search for files in the src folder (Fore now we assume sources are in the src/<Models> folder, this can be a src/server/<model> or server/<model> depending on whats defined as the src in the config file)
    const rootFolder = path.join(process.cwd(), "src"); // Replace with your root folder path
    const extension = ".ftd.json";
    const result = findFilesWithExtension(rootFolder, extension);

    console.log("Files with extension " + extension + ":");
    console.log(result);

    // Copy Order
    let destinationPath = path.join(
      process.cwd(),
      "src/Order/order/order.gen.ts",
    );
    let sourcePath = path.join(dirname, "../", "templates/order.gen.ts");

    fs.copyFileSync(sourcePath, destinationPath);
    console.log("Created order.gen.ts");

    // Copy Order Line
    destinationPath = path.join(
      process.cwd(),
      "src/Order/orderLine/orderLine.gen.ts",
    );
    sourcePath = path.join(dirname, "../", "templates/orderLine.gen.ts");

    fs.copyFileSync(sourcePath, destinationPath);
    console.log("Created orderLine.gen.ts");

    // Copy Profile
    destinationPath = path.join(
      process.cwd(),
      "src/User/profile/profile.gen.ts",
    );
    sourcePath = path.join(dirname, "../", "templates/profile.gen.ts");

    fs.copyFileSync(sourcePath, destinationPath);
    console.log("Created profile.gen.ts");
    return;
    // result.forEach((filePath) => {
    //   const
    //   const destinationPath = path.join(path.dirname(filePath));
    //   fs.copyFileSync(sourcePath, destinationPath, fs.constants.COPYFILE_EXCL);
    // })
    // Next generate files that are in the path given or the file in the path
    // Should force replace files that exist
  } catch (err) {
    if (err instanceof Error) {
      // e is narrowed to Error!
      console.error(err.message);
    } else {
      console.error(err);
    }
  }
};

function findFilesWithExtension(rootDir: string, extension: string) {
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
}
