// Generated Code, Do not modify
import { makeModelParams } from "@five12days/core";

export type TOrderLine = {
  id?: string;
  createdAt?: string;
  updatedAt?: string;
  orderNo: number;
  lineNo: number;
  itemNo: string;
  itemDescription?: string;
  amount: number;
};

export const makeOrderLine = ({
  generateId,
  validateModel,
}: makeModelParams<TOrderLine>) => {
  return (modelData: TOrderLine) => {
    const model = {
      id: generateId(),
      createdAt: modelData.createdAt,
      updatedAt: modelData.updatedAt,
      orderNo: modelData.orderNo,
      lineNo: modelData.lineNo,
      itemNo: modelData.itemNo,
      itemDescription: modelData.itemDescription,
      amount: modelData.amount,
    };
    return model;
  };
};
