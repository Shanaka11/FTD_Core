import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

export const createDefaultConfig = () => {
  try {
    console.log("Create Default Config");
    // Fetch the ftd_config from the project root
    // Create a new ftd_config file in the new project
    const filename = fileURLToPath(import.meta.url);
    const dirname = path.dirname(filename);
    const sourcePath = path.join(
      dirname,
      "../",
      "templates",
      "ftd_config.json",
    );
    const destinationPath = path.join(process.cwd(), "ftd_config.json");
    fs.copyFileSync(sourcePath, destinationPath, fs.constants.COPYFILE_EXCL);
  } catch (err) {
    console.error(err);
    console.error("Unable to create ftd_config.json");
  }
};
