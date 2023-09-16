import fs from "fs";

export const readFile = (path: string) => {
  try {
    const data = fs.readFileSync(path);
    return data.toString();
  } catch (err) {
    if (err instanceof Error) {
      // e is narrowed to Error!
      return err.message;
    } else {
      return "File Read Error";
    }
  }
};
