import {
  executeTransaction,
  generateId,
  makeCreateModel,
  makeDeleteModel,
  makeReadModel,
  makeUpdateModel,
  TExecuteQuery,
  TGetModelUseCase,
  TRawData,
  validateModel,
} from "@five12days/core";

import { noPkSchema, TNoPk } from "../gen/noPk.gen.js";
import {
  makeCreateNoPkBaseUseCase,
  makeDeleteNoPkBaseUseCase,
  makeReadNoPkBaseUseCase,
  makeUpdateNoPkBaseUseCase,
  TNoPkKey,
} from "../gen/noPkBaseUseCases.gen.js";

const validateNoPkModel = (data: TRawData) => {
  return validateModel<TNoPk>(noPkSchema, data);
};

// READ
export const readNoPkUseCase_ = async (
  { keys, columns, filter, orderBy, page, pageSize }: TGetModelUseCase<TNoPkKey>,
  executeQuery: TExecuteQuery,
) => {
  // Add business logic that should be executed before the core method
  const readNoPkBaseUseCase = makeReadNoPkBaseUseCase({
    repository: { readModel: makeReadModel(executeQuery) },
    executeQuery,
  });
  const noPks = await readNoPkBaseUseCase({
    keys,
    columns,
    filter,
    orderBy,
    page,
    pageSize
  });
  // Add business logic that should be executed after the core method

  return noPks;
};

export const readNoPkUseCase = async (data: TGetModelUseCase<TNoPkKey>) => {
  const retData = await executeTransaction<
    TGetModelUseCase<TNoPkKey>,
    TNoPk[]
  >(data, readNoPkUseCase_);
  return retData;
};

// CREATE
export const createNoPkUseCase_ = async (
  noPkData: Partial<TNoPk>,
  executeQuery: TExecuteQuery,
) => {
  // Add business logic that should be executed before the core method
  const createNoPkBaseUseCase = makeCreateNoPkBaseUseCase({
    generateId,
    validateModel: validateNoPkModel,
    repository: {
      readModel: makeReadModel(executeQuery),
      createModel: makeCreateModel(executeQuery),      
    },
    executeQuery,
  });

  const createdNoPk = await createNoPkBaseUseCase(noPkData);
  // Add business logic that should be executed after the core method

  return createdNoPk;
};

export const createNoPkUseCase = async (data: Partial<TNoPk>) => {
  const retData = await executeTransaction<Partial<TNoPk>, boolean>(
    data,
    createNoPkUseCase_,
  );

  return retData;
};

// UPDATE
export const updateNoPkUseCase_ = async (
  noPkData: TNoPk,
  executeQuery: TExecuteQuery,
) => {
  // Add business logic that should be executed before the core method
  const updateNoPkBaseUseCase = makeUpdateNoPkBaseUseCase({
    generateId,
    validateModel: validateNoPkModel,
    repository: {
      readModel: makeReadModel(executeQuery),
      updateModel: makeUpdateModel(executeQuery),      
    },
    executeQuery,
  });

  const updatedNoPk = await updateNoPkBaseUseCase(noPkData);
  // Add business logic that should be executed after the core method

  return updatedNoPk;
};

export const updateNoPkUseCase = async (data: TNoPk) => {
  const retData = await executeTransaction<TNoPk, boolean>(
    data,
    updateNoPkUseCase_,
  );

  return retData;
};

// DELETE
export const deleteNoPkUseCase_ = async (
  noPkData: TNoPk,
  executeQuery: TExecuteQuery,
) => {
  // Add business logic that should be executed before the core method
  const deleteNoPkBaseUseCase = makeDeleteNoPkBaseUseCase({
    generateId,
    validateModel: validateNoPkModel,
    repository: {
      readModel: makeReadModel(executeQuery),
      deleteModel: makeDeleteModel(executeQuery),      
    },
    executeQuery,
  });

  const deletedNoPk = deleteNoPkBaseUseCase(noPkData);
  // Add business logic that should be executed after the core method

  return deletedNoPk;
};

export const deleteNoPkUseCase = async (data: TNoPk) => {
  const retData = await executeTransaction<TNoPk, boolean>(
    data,
    deleteNoPkUseCase_,
  );

  return retData;
};
