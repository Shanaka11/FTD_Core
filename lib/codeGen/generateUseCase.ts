import {
  tAattributes,
  tModel,
  tRelationship,
  tRelationshipAttr,
} from "../../types/ftdSchema.js";
import { modelMap } from "../generateCoreFiles.js";
import { CURD_USECASES_TEMPLATE } from "../templates/useCases/crudUseCasesTemplate.js";
import { decodeAttributeType } from "./attributeTypeUtils.js";
import {
  capitalize,
  createStringFromTemplate,
  indent,
  simplize,
} from "./textUtils.js";

export const generateUseCase = (modelSchema: tModel) => {
  const { name, attributes, relationships } = modelSchema;

  const nameCapitalized = capitalize(name);
  const nameSimplized = simplize(name);
  const tName = `T${nameCapitalized}`;

  const resolvedRelationships = resolveRelationships(
    nameSimplized,
    relationships,
  );

  const validationBlocks =
    resolvedRelationships !== ""
      ? resolvedRelationships.validationBlocks.join("\n")
      : "";

  const modelFilterString = generateKeyString(nameSimplized, attributes);
  const modelCheckUpdateString = generateCheckUpdateString(
    nameCapitalized,
    attributes,
  );
  const content = createStringFromTemplate(
    {
      MODEL: nameCapitalized,
      TNAME: tName,
      MODELVAR: nameSimplized,
      MODELTYPE: createModelKeyType(tName, attributes),
      IMPORTS:
        resolvedRelationships !== ""
          ? resolvedRelationships.checkExistImportString
          : "",
      VALIDATION: validationBlocks,
      FILTERSTRING: modelFilterString,
      CHECK_UPDATE: modelCheckUpdateString,
    },
    CURD_USECASES_TEMPLATE,
  );
  return content;
};

const createModelKeyType = (tName: string, attributes: tAattributes) => {
  let content = `type ${tName}Key = {\n`;
  let count = 0;
  content += indent(1);
  // Check if attributes is empty if so return an empty type
  const attributeArray = Object.entries(attributes);

  content += attributeArray
    .filter(([, attribute]) => {
      return attribute.flags === "KMI-";
    })
    .map(([key, attribute]) => {
      count++;
      return `${simplize(key)}${decodeAttributeType(attribute)}`;
    })
    .join(`;\n${indent(1)}`);

  if (count === 0) {
    content += `\n};`;
    return content;
  }

  content += `;\n};`;
  return content;
};

const resolveRelationships = (
  nameSimplized: string,
  relationships?: tRelationship,
) => {
  if (relationships === undefined) return ``;

  const sourceFilePath = modelMap.get(nameSimplized);
  const validationBlocks: string[] = [];
  if (sourceFilePath === undefined)
    throw new Error(
      `model ${nameSimplized} does not exist. Check the model name of the schema definition`,
    );

  const importStringArray: string[] = [];

  Object.values(relationships).forEach((relationship) => {
    const modelName = simplize(relationship.model);
    const moldeNameCapitalized = capitalize(relationship.model);
    const targetFilePath = modelMap.get(modelName);
    if (targetFilePath === undefined)
      throw new Error(
        `Model ${relationship.model} does not exist, Check the relationship definition's modelname`,
      );
    // Base usecase will have a checkExistcount method that will return how many records for the given key exist
    const importString = generateImportString(
      sourceFilePath,
      targetFilePath,
      `${modelName}BaseUseCases.gen.js`,
      `check${moldeNameCapitalized}Exist_`,
    );
    importStringArray.push(importString);

    // Generate the validation block
    const validationBlock = generateValidationBlocks(
      relationship,
      nameSimplized,
      modelName,
      moldeNameCapitalized,
    );

    if (validationBlock !== undefined) {
      validationBlocks.push(validationBlock);
    }
  });
  // Construct the import filepath from the source and target files for instance if the source is order/orderLine and the target is order/customerOrder then the import path should be ../customerOrder
  // if the source is order/orderLine and the target is education/student then the import should be ../../education/student
  // The function we need to import is checkCustomerOrderExist_ or checkStudentExist_
  // const importString = `import { {FUNCTION} } from {PATH}`;

  // Use this same loops to generate the validate relationships method
  // return importStringArray.join(";\n") + ";";
  return {
    checkExistImportString: importStringArray.join(";\n") + ";",
    validationBlocks,
  };
};

const generateImportString = (
  source: string,
  target: string,
  filename: string,
  functionName: string,
) => {
  const sourceParts = source.split("/");
  const targetParts = target.split("/");

  let importString = "";

  // Find common prefix
  let commonPrefixIndex = 0;
  while (
    commonPrefixIndex < sourceParts.length &&
    commonPrefixIndex < targetParts.length &&
    sourceParts[commonPrefixIndex] === targetParts[commonPrefixIndex]
  ) {
    // Keep in mind that since we always increment it after the last common element
    commonPrefixIndex++;
  }

  // Add relative path to reach the common prefix
  if (commonPrefixIndex === targetParts.length) {
    importString += `./`;
  } else {
    importString = "../";
    for (let i = sourceParts.length; i > commonPrefixIndex; i--) {
      importString += "../";
    }
  }

  // Add path from the common prefix to the target
  for (let i = commonPrefixIndex; i < targetParts.length; i++) {
    importString += targetParts[i];
  }

  return `import { ${functionName} } from "${importString}/gen/${filename}"`;
};

const generateValidationBlocks = (
  relationship: tRelationshipAttr,
  sourceModel: string, // The model we are generating the code for
  modelName: string, // The model we have the relationship with
  modelNameCapitalized: string,
) => {
  const checkParentExistTemplate = `// Check the parent
  await check{TARGET_MODEL}Exist_(
    { {KEYSTRING} },
    executeQuery,
    "TRIGGER_WHEN_NOT_EXIST",
  );`;

  const checkChildExistTemplate = `
  // Check the children
  const {SOURCE_MODEL_VAR}s = await read{SOURCE_MODEL}UseCase_(
    {
      filter: {FILTER_STRING}
    },
    executeQuery,
  );
  if ({SOURCE_MODEL_VAR}s.length > 0) {
    throw new Error(
      "{SOURCE_MODEL_VAR} with the " + {ERROR_STRING} + " already exist",
    );
  }
  `;

  const keyString = relationship.mapping.to
    .map(
      (item, index) =>
        `${simplize(item)}: ${sourceModel}.${simplize(
          relationship.mapping.from[index],
        )}`,
    )
    .join(", ");

  const checkParentExist = createStringFromTemplate(
    {
      TARGET_MODEL: modelNameCapitalized,
      KEYSTRING: keyString,
      MODELVAR: sourceModel,
    },
    checkParentExistTemplate,
  );

  if (relationship.relationship === "ONE_TO_MANY") return checkParentExist;

  if (relationship.relationship === "ONE_TO_ONE") {
    // Check if children exist
    const filterString = relationship.mapping.to
      .map(
        (item, index) =>
          `"${item} eq " + ${sourceModel}.${simplize(
            relationship.mapping.from[index],
          )}`,
      )
      .join(` + "AND" + `);

    const errorString = relationship.mapping.to
      .map(
        (item, index) =>
          `"${item} = " + ${sourceModel}.${simplize(
            relationship.mapping.from[index],
          )}`,
      )
      .join(` + " " + `);

    const checkChildExist = createStringFromTemplate(
      {
        SOURCE_MODEL_VAR: sourceModel,
        SOURCE_MODEL: capitalize(sourceModel),
        MODELVAR: modelName,
        MODEL: modelNameCapitalized,
        FILTER_STRING: filterString,
        ERROR_STRING: errorString,
      },
      checkChildExistTemplate,
    );

    return checkParentExist + "\n" + checkChildExist;
  }
};

const generateKeyString = (modelName: string, attributes: tAattributes) => {
  return Object.entries(attributes)
    .filter(([, attribute]) => attribute.flags === "KMI-")
    .reduce((retString, item) => {
      if (retString.length === 0) {
        return `${simplize(item[0])}: ${modelName}.${simplize(item[0])}`;
      }
      return `${retString}, ${simplize(item[0])}: ${modelName}.${simplize(
        item[0],
      )}`;
    }, "");
};

const generateCheckUpdateString = (
  modelName: string,
  attributes: tAattributes,
) => {
  const templateString = `checkIfFieldUpdated("{COLUMN}", new${modelName}.{COLUMN}, old${modelName}[0].{COLUMN})`;

  return Object.entries(attributes)
    .filter(
      ([, attribute]) =>
        attribute.flags === "AMI-" || attribute.flags === "KMI-",
    )
    .reduce((retString, item) => {
      if (retString.length === 0) {
        return createStringFromTemplate(
          { COLUMN: simplize(item[0]) },
          templateString,
        );
      }
      return `\n${
        indent(2) +
        createStringFromTemplate({ COLUMN: simplize(item[0]) }, templateString)
      }`;
    }, "");
};
