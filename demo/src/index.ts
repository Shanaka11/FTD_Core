import { exit } from "process";

import {
  createCustomerOrderUseCase,
  deleteCustomerOrderUseCase,
  readCustomerOrderUseCase,
  updateCustomerOrderUseCase,
} from "./Order/customerOrder/useCases/customerOrderUseCases.js";
import { createProfileUseCase } from "./User/profile/useCases/profileUseCases.js";

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
    // const create = await createCustomerOrderUseCase({
    //   orderNo: 603,
    //   date: new Date("1991-11-19T12:30:00"),
    //   totalAmount: 12000,
    // });
    // const create = await createProfileUseCase({
    //   profileId: 123,
    //   dateOfBirth: new Date("1957-11-19T12:30:00"),
    // });
    // if (create) {
    //   console.log("Order Created");
    // } else {
    //   console.log("Order not created");
    // }
    // const data = await readCustomerOrderUseCase({
    //   filter: "between(orderNo, 601, 602)",
    //   orderBy: "orderNo",
    //   page: 1,
    //   pageSize: 1,
    // });
    // console.log(data);
    // console.log(data[0].date?.toLocaleString("en-US", { timeZone: "IST" }));
    exit();
  } catch (e) {
    throw e;
  }
};

execute();
