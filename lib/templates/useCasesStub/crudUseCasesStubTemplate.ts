export const CRUD_USECASE_STUB_TEMPLATE = `import {
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
} from "@five12days/core/dist/public";

import { {MODELVAR}Schema, {TNAME} } from "../gen/{MODELVAR}.gen";
import {
  makeCreate{MODEL}BaseUseCase,
  makeDelete{MODEL}BaseUseCase,
  makeRead{MODEL}BaseUseCase,
  makeUpdate{MODEL}BaseUseCase,
  {TNAME}Key,
} from "../gen/{MODELVAR}BaseUseCases.gen";

const validate{MODEL}Model = (data: TRawData) => {
  return validateModel<{TNAME}>({MODELVAR}Schema, data);
};

// READ
export const read{MODEL}UseCase_ = async (
  { keys, columns, filter, orderBy, page, pageSize }: TGetModelUseCase<{TNAME}Key>,
  executeQuery: TExecuteQuery,
) => {
  // Add business logic that should be executed before the core method
  const read{MODEL}BaseUseCase = makeRead{MODEL}BaseUseCase({
    repository: { readModel: makeReadModel(executeQuery) },
    executeQuery,
  });
  const {MODELVAR}s = await read{MODEL}BaseUseCase({
    keys,
    columns,
    filter,
    orderBy,
    page,
    pageSize
  });
  // Add business logic that should be executed after the core method

  return {MODELVAR}s;
};

export const read{MODEL}UseCase = async (data: TGetModelUseCase<{TNAME}Key>) => {
  try{

    const retData = await executeTransaction<
      TGetModelUseCase<{TNAME}Key>,
      {TNAME}[]
    >(data, read{MODEL}UseCase_);
    return retData;

  } catch (e:unknown) {

    if( e instanceof(Error) ){
      console.error(e.message);
      return { error: e.message };
    };
    throw e;

  }
};

// CREATE
export const create{MODEL}UseCase_ = async (
  {MODELVAR}Data: Partial<{TNAME}>,
  executeQuery: TExecuteQuery,
) => {
  // Add business logic that should be executed before the core method
  const create{MODEL}BaseUseCase = makeCreate{MODEL}BaseUseCase({
    generateId,
    validateModel: validate{MODEL}Model,
    repository: {
      readModel: makeReadModel(executeQuery),
      createModel: makeCreateModel(executeQuery),      
    },
    executeQuery,
  });

  const created{MODEL} = await create{MODEL}BaseUseCase({MODELVAR}Data);
  // Add business logic that should be executed after the core method

  return created{MODEL};
};

export const create{MODEL}UseCase = async (data: Partial<{TNAME}>) => {
  try{

    const retData = await executeTransaction<Partial<{TNAME}>, boolean>(
      data,
      create{MODEL}UseCase_,
    );
  
    if(retData) {
      return { message: "{MODEL} created"};
    }
    return { error: "Unable to create {MODEL}, please try again"};

  } catch (e:unknown) {
    if( e instanceof(Error) ){
      console.error(e.message);
      return { error: e.message };
    };
    throw e;
  }
};

// UPDATE
export const update{MODEL}UseCase_ = async (
  {MODELVAR}Data: {TNAME},
  executeQuery: TExecuteQuery,
) => {
  // Add business logic that should be executed before the core method
  const update{MODEL}BaseUseCase = makeUpdate{MODEL}BaseUseCase({
    generateId,
    validateModel: validate{MODEL}Model,
    repository: {
      readModel: makeReadModel(executeQuery),
      updateModel: makeUpdateModel(executeQuery),      
    },
    executeQuery,
  });

  const updated{MODEL} = await update{MODEL}BaseUseCase({MODELVAR}Data);
  // Add business logic that should be executed after the core method

  return updated{MODEL};
};

export const update{MODEL}UseCase = async (data: {TNAME}) => {
  try{

    const retData = await executeTransaction<{TNAME}, boolean>(
      data,
      update{MODEL}UseCase_,
    );
  
    if(retData) {
      return { message: "{MODEL} updated"};
    }
    return { error: "Unable to update {MODEL}, please try again"};

  } catch (e:unknown) {

    if( e instanceof(Error) ){
      console.error(e.message);
      return { error: e.message };
    };
    throw e;

  }
};

// DELETE
export const delete{MODEL}UseCase_ = async (
  {MODELVAR}Data: {TNAME},
  executeQuery: TExecuteQuery,
) => {
  // Add business logic that should be executed before the core method
  const delete{MODEL}BaseUseCase = makeDelete{MODEL}BaseUseCase({
    generateId,
    validateModel: validate{MODEL}Model,
    repository: {
      readModel: makeReadModel(executeQuery),
      deleteModel: makeDeleteModel(executeQuery),      
    },
    executeQuery,
  });

  const deleted{MODEL} = delete{MODEL}BaseUseCase({MODELVAR}Data);
  // Add business logic that should be executed after the core method

  return deleted{MODEL};
};

export const delete{MODEL}UseCase = async (data: {TNAME}) => {
  try{

    const retData = await executeTransaction<{TNAME}, boolean>(
      data,
      delete{MODEL}UseCase_,
    );
  
    if(retData) {
      return { message: "{MODEL} deleted"};
    }
    return { error: "Unable to delete {MODEL}, please try again"};

  } catch (e:unknown) {

    if( e instanceof(Error) ){
      console.error(e.message);
      return { error: e.message };
    };
    throw e;

  }
};
`;
/*
export const CRUD_USECASE_STUB_TEMPLATE = `import {
  makeCreateModel,
  makeDeleteModel,
  makeReadModel,
  makeUpdateModel,
  TGetModelUseCase,
  generateId,
} from "@five12days/core";

import { {TNAME} } from "./{MODELVAR}.gen";
import {
  makeCreate{MODEL}BaseUseCase,
  makeDelete{MODEL}BaseUseCase,
  makeRead{MODEL}BaseUseCase,
  makeUpdate{MODEL}BaseUseCase,
  {TNAME}Key,
} from "./{MODELVAR}BaseUseCases.gen";

const executeQuery = (query: string) => [query];
const validateModel = () => true;

export const read{MODEL}UseCase = ({
  keys,
  columns,
  filter,
}: TGetModelUseCase<{TNAME}Key>) => {
  const read{MODEL}BaseUseCase = makeRead{MODEL}BaseUseCase({
    repository: { readModel: makeReadModel(executeQuery) },
  });
  const {MODELVAR}s = read{MODEL}BaseUseCase({ keys, columns, filter });
  // Add business logic that should be executed after the core method

  return {MODELVAR}s;
};

export const makeCreate{MODEL}UseCase = ({MODELVAR}Data: {TNAME}) => {
  // Add business logic that should be executed before the core method
  const create{MODEL}BaseUseCase = makeCreate{MODEL}BaseUseCase({
    generateId,
    validateModel,
    repository: { 
      readModel: makeReadModel(executeQuery),
      createModel: makeCreateModel(executeQuery),
    },
  });

  const created{MODEL} = create{MODEL}BaseUseCase({MODELVAR}Data);
  // Add business logic that should be executed after the core method

  return created{MODEL};
};

export const makeUpdate{MODEL}UseCase = ({MODELVAR}Data: {TNAME}) => {
  // Add business logic that should be executed before the core method
  const update{MODEL}BaseUseCase = makeUpdate{MODEL}BaseUseCase({
    generateId,
    validateModel,
    repository: { 
      readModel: makeReadModel(executeQuery),
      updateModel: makeUpdateModel(executeQuery),
    },
  });

  const updated{MODEL} = update{MODEL}BaseUseCase({MODELVAR}Data);
  // Add business logic that should be executed after the core method

  return updated{MODEL};
};

export const makeDelete{MODEL}UseCase = ({MODELVAR}Data: {TNAME}) => {
  // Add business logic that should be executed before the core method
  const delete{MODEL}BaseUseCase = makeDelete{MODEL}BaseUseCase({
    generateId,
    validateModel,
    repository: { 
      readModel: makeReadModel(executeQuery),
      deleteModel: makeDeleteModel(executeQuery),
    },
  });

  const deleted{MODEL} = delete{MODEL}BaseUseCase({MODELVAR}Data);
  // Add business logic that should be executed after the core method

  return deleted{MODEL};
};
`;
*/
