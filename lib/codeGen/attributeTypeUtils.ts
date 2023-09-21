import { tAttributeItem } from "../../types/ftdSchema";

export const decodeAttributeType = (attribute: tAttributeItem) => {
  let retString = "";
  if (attribute.flags === "A-I-" || attribute.flags === "A-IU") {
    retString = "?: ";
  } else {
    retString = ": ";
  }
  switch (attribute.type) {
    case "Date":
      retString += "Date";
      break;
    case "Number":
      retString += "number";
      break;
    case "String":
      retString += "string";
      break;
  }

  return retString;
};
