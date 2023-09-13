import { tModel } from "@five12days/core/types/ftdSchema.js";

export const OrderLine: tModel = {
  name: "OrderLine",
  attributes: {
    OrderNo: { type: "Number", flags: "KMI-" },
    LineNo: { type: "Number", flags: "KMI-" },
    ItemNo: { type: "String", maxLength: 20, flags: "AMIU" },
    ItemDescription: { type: "String", maxLength: 100, flags: "A-IU" },
    Amount: { type: "Number", flags: "AMIU" },
  },
};
