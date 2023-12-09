import { tAattributes } from "../../types/ftdSchema";

// CreatedAt and UpdatedAt are numbers because we get the date using miliseconds that we get from Date.now()
export const baseModelColumns: tAattributes = {
  Id: { type: "String", maxLength: 36, flags: "KMI-" },
  CreatedAt: { type: "Number", flags: "AMI-" },
  UpdatedAt: { type: "Number", flags: "AMIU" },
};
