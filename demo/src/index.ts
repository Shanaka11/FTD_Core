import { exit } from "process";

import {
  createCustomerOrderUseCase,
  deleteCustomerOrderUseCase,
  readCustomerOrderUseCase,
  updateCustomerOrderUseCase,
} from "./Order/customerOrder/customerOrderUseCases.js";

const execute = async () => {
  try {
    // const deleted = await deleteCustomerOrderUseCase({
    //   orderNo: 556,
    //   createdAt: new Date("2023-10-11 07:00:17"),
    //   updatedAt: new Date("2023-10-11 08:00:51"),
    //   id: "c4a8801b-6a60-424b-a6b3-c8c69cbcc3db",
    //   totalAmount: 1000,
    //   date: new Date("2023-10-11 07:00:17"),
    // });

    // if (deleted) {
    //   console.log("Order Deleted");
    // } else {
    //   console.log("Order not deleted");
    // }
    // const update = await updateCustomerOrderUseCase({
    //   orderNo: 556,
    //   createdAt: new Date("2023-10-11 07:00:17"),
    //   updatedAt: new Date("2023-10-11 07:00:17"),
    //   id: "c4a8801b-6a60-424b-a6b3-c8c69cbcc3db",
    //   totalAmount: 1000,
    //   date: new Date("2023-10-11 07:00:17"),
    // });

    // if (update) {
    //   console.log("Order Updated");
    // } else {
    //   console.log("Order not updated");
    // }
    // const create = await createOrderUseCase({
    //   orderNo: 556,
    //   date: new Date(),
    //   totalAmount: 12301,
    // });

    // if (create) {
    //   console.log("Order Created");
    // } else {
    //   console.log("Order not created");
    // }
    // const data = await readCustomerOrderUseCase({
    //   filter: "between(orderNo, 312, 314) or eq(id, 400)",
    //   orderBy: "orderNo",
    // });
    // console.log(data);
    exit();
  } catch (e) {
    throw e;
  }
};

execute();
