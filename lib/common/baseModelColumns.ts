import { tAattributes } from "../../types/ftdSchema";

export const baseModelColumns: tAattributes = {
  Id: { type: "String", maxLength: 36, flags: "KMI-" },
  CreatedAt: { type: "Date", flags: "AMI-" },
  UpdatedAt: { type: "Date", flags: "AMIU" },
};
