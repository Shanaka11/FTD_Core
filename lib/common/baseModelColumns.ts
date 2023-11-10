import { tAattributes } from "../../types/ftdSchema";

export const baseModelColumns: tAattributes = {
  id: { type: "String", maxLength: 36, flags: "KMI-" },
  createdAt: { type: "Date", flags: "AMI-" },
  updatedAt: { type: "Date", flags: "AMIU" },
};
