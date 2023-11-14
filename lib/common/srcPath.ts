import path from "path";

const getSrcPath = () => {
  // TODO:This will generate the path for the src folder based on the values in the config, for now we will hardocde it
  return path.join(process.cwd(), "src");
};

export const srcPath = getSrcPath();
