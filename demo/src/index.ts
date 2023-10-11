import { exit } from "process";

import {
  createOrderUseCase,
  readOrderUseCase,
} from "./Order/order/orderUseCases.js";

const execute = async () => {
  try {
    const create = await createOrderUseCase({
      orderNo: 556,
      date: new Date(),
      totalAmount: 12301,
    });

    if (create) {
      console.log("Order Created");
    } else {
      console.log("Order not created");
    }
    // const data = await readOrderUseCase({
    //   keys: {
    //     id: "123",
    //   },
    // });
    // console.log(data);
    exit();
  } catch (e) {
    throw e;
  }
};

execute();
