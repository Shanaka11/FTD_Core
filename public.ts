import { checkIfFieldUpdated } from "./lib/common/checkIfFieldUpdated.js";
import { makeExecuteQuery } from "./lib/db/connecter/mysql/executeQuery.js";
import { executeTransaction } from "./lib/db/connecter/mysql/executeTransaction.js";
import { makeCreateModel } from "./lib/db/crudRepository/createModel.js";
import { makeDeleteModel } from "./lib/db/crudRepository/deleteModel.js";
import { makeReadModel } from "./lib/db/crudRepository/readModel.js";
import { makeUpdateModel } from "./lib/db/crudRepository/updateModel.js";
import { generateId } from "./lib/generateId.js";
import { validateModelZod as validateModel } from "./lib/validation/zodValidation.js";
import { makeModelParams, TRawData } from "./types/makeModelParams.js";
import {
  TExecuteQuery,
  TExecuteQueryResponse,
  TValue,
} from "./types/repositoryTypes.js";
import {
  isIdPresent,
  TBaseUseCase,
  TBaseUseCaseCheckChanged,
  TGetModelUseCase,
  TMakeGetModelUseCase,
  TModelKey,
} from "./types/useCaseTypes.js";

export {
  makeModelParams,
  TModelKey,
  TBaseUseCase,
  TBaseUseCaseCheckChanged,
  TGetModelUseCase,
  TMakeGetModelUseCase,
  TExecuteQuery,
  TExecuteQueryResponse,
  TRawData,
  TValue,
  isIdPresent,
  makeCreateModel,
  makeReadModel,
  makeUpdateModel,
  makeDeleteModel,
  generateId,
  makeExecuteQuery,
  executeTransaction,
  validateModel,
  checkIfFieldUpdated,
};

// const ftd = {

// };
