// Generated Code, Do not modify
import { makeModelParams } from "@five12days/core";

export type TOrder = {
  id?: string;
  createdAt?: string;
  updatedAt?: string;
  orderNo: number;
  totalAmount: number;
  date?: string;
};

export const makeOrder = ({
  generateId,
  validateModel,
}: makeModelParams<TOrder>) => {
  return (modelData: TOrder) => {
    const model = {
      id: generateId(),
      createdAt: modelData.createdAt,
      updatedAt: modelData.updatedAt,
      orderNo: modelData.orderNo,
      totalAmount: modelData.totalAmount,
      date: modelData.date,
    };
    return model;
  };
};
