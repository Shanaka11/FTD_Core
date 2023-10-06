import { exit } from "process";

import { readOrderUseCase } from "./Order/order/orderUseCases.js";

const execute = async () => {
  try {
    const data = await readOrderUseCase({
      keys: {
        id: "123",
      },
    });
    console.log(data);
    exit();
  } catch (e) {
    throw e;
  }
};

execute();
