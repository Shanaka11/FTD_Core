import fs from "fs";

export const deleteFile = (path: string) => {
  try {
    fs.unlinkSync(path);
  } catch (err) {
    console.error(`Unable to remove test files at ${path}`);
  }
};
