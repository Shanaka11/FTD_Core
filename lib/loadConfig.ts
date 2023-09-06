import fs from "fs";
import path from "path";

export const loadConfig = async () => {
  const configPath = path.join(process.cwd(), "ftdconfig.json");
  let config = {};
  try {
    const configFileContent = fs.readFileSync(configPath, "utf-8");
    if (configFileContent.length === 0) throw new Error();
    config = JSON.parse(configFileContent);
    console.log(config);
  } catch (error: any) {
    console.error(
      "Config file does not exist run npx @five12days/core init command to create it automatically",
    );
  }
};
