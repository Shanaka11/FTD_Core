import fs from "fs";

export const readFile = (path: string) => {
  try {
    const data = fs.readFileSync(path);
    return data;
  } catch (err) {
    return "File Read Error";
  }
};
