import fs from "fs";
import path from "path";

// import { fileURLToPath } from "url";

export const generateCoreFiles = () => {
  try {
    // Generate Model File
    // Generate UseCases and Stubs
    // const configPath = path.join(process.cwd(), "ftd_confog.json")
    // const __filename = fileURLToPath(import.meta.url);
    // const __dirname = path.dirname(__filename);
    const configPath = path.join(process.cwd(), "ftd_config.json");

    const data = fs.readFileSync(configPath, "utf8");
    console.log(data);
  } catch (err) {
    console.error(
      "ftd_config.json file is missing, please npx ftd-core -init, or add it manually",
    );
  }
};
