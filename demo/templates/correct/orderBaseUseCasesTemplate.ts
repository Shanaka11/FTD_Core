import { isIdPresent, TModelKey } from "@five12days/core";

import { makeOrder, TOrder } from "./order.template";

type TOrderKey = {
  orderId: string;
};

const makeReadOrderUseCase = ({ repository }: any) => {
  return (keys: TModelKey | TOrderKey) => {
    // This can be either default id created by the framework or it can be the combination of keys or it can be empty, additionally we should be able to pass filters here as well
    if (isIdPresent(keys)) {
      return repository.readModel(keys.id);
    }
    return repository.readModel(keys);
  };
};

const makeCreateOrderUseCase = ({
  generateId,
  validateModel,
  repository,
}: any) => {
  return (modelData: TOrder) => {
    const createOrder = makeOrder({
      generateId,
      validateModel,
    });

    const model = createOrder(modelData);

    // Check if a record exist for the keys (both system generated and user defined)
    // If exist then throw an error

    return repository.create(model);
  };
};

const makeUpdateOrderUseCase = ({
  generateId,
  validateModel,
  repository,
}: any) => {
  return (modelData: TOrder) => {
    const order = checkOrderChanged({
      generateId,
      validateModel,
      repository,
      modelData,
    });
    // If oldOrder is null then throw error stating record not exist
    // If oldOrder updatedAt is different than newOrder updatedAt then throw an error stating that record was updated by someone else
    // If all good then update the updatedAt date of the newOrder here
    repository.updateModel(order);
  };
};

const makeDeleteOrderUseCase = ({
  generateId,
  validateModel,
  repository,
}: any) => {
  return (modelData: TOrder) => {
    // If all good then delete the record
    const order = checkOrderChanged({
      generateId,
      validateModel,
      repository,
      modelData,
    });
    repository.deleteModel(order);
  };
};

const checkOrderChanged = ({
  generateId,
  validateModel,
  repository,
  modelData,
}: any) => {
  const createOrder = makeOrder({
    generateId,
    validateModel,
  });
  const readOrder = makeReadOrderUseCase({
    repository,
  });
  const newOrder = createOrder(modelData);
  const oldOrder = readOrder({
    id: newOrder.id,
  });
  // If oldOrder is null then throw error stating record not exist
  // If oldOrder updatedAt is different than newOrder updatedAt then throw an error stating that record was updated by someone else
  return newOrder;
};
