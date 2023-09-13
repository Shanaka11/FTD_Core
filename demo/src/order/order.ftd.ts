import { tModel } from "@five12days/core/types/ftdSchema.js";

export const Order: tModel = {
  name: "Order",
  attributes: {
    OrderNo: { type: "Number", flags: "KMI-" },
    TotalAmount: { type: "Number", flags: "AMIU" },
    Date: { type: "Date", flags: "AMIU" },
  },
};
