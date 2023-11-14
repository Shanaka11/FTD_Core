import fs from "fs";
import path from "path";

export const findFilesWithExtension = (rootDir: string, extension: string) => {
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

export const findFilesByName = (rootDir: string, filename: string) => {
  const fileList: string[] = [];

  const traverseDir = (currentDir: string) => {
    const files = fs.readdirSync(currentDir);

    for (const file of files) {
      const filePath = path.join(currentDir, file);
      const stat = fs.statSync(filePath);

      if (stat.isDirectory()) {
        traverseDir(filePath);
      } else if (file === filename) {
        fileList.push(filePath);
      }
    }
  };

  traverseDir(rootDir);
  return fileList;
};
