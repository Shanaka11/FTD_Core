export const CRUD_USECASE_STUB_TEMPLATE = `import {
  makeCreateModel,
  makeDeleteModel,
  makeReadModel,
  makeUpdateModel,
  TModelKey,
} from "@five12days/core";

import { {TNAME} } from "./{MODELVAR}.gen";
import {
  makeCreate{MODEL}BaseUseCase,
  makeDelete{MODEL}BaseUseCase,
  makeRead{MODEL}BaseUseCase,
  makeUpdate{MODEL}BaseUseCase,
  {TNAME}Key,
} from "./{MODELVAR}BaseUseCases.gen";

const generateId = () => "1234";
const validateModel = () => true;

export const read{MODEL}UseCase = (keys: TModelKey | {TNAME}Key) => {
  // Add business logic that should be executed before the core method
  const readModel = makeReadModel((input: string) => [input]);
  const read{MODEL}BaseUseCase = makeRead{MODEL}BaseUseCase({
    readModel,
  });
  const {MODELVAR}s = read{MODEL}BaseUseCase(keys);
  // Add business logic that should be executed after the core method

  return {MODELVAR}s;
};

export const makeCreate{MODEL}UseCase = ({MODELVAR}Data: {TNAME}) => {
  // Add business logic that should be executed before the core method
  const create{MODEL}BaseUseCase = makeCreate{MODEL}BaseUseCase({
    generateId,
    validateModel,
    repository,
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
    repository,
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
    repository,
  });

  const deleted{MODEL} = delete{MODEL}BaseUseCase({MODELVAR}Data);
  // Add business logic that should be executed after the core method

  return deleted{MODEL};
};
`;
