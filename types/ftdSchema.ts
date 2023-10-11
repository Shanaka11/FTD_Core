type tAttributeFlags = "KMI-" | "AMIU" | "AMI-" | "A-I-" | "A-IU";
// type tAttributeType = "String" | "Number" | "Date";
type tAttributeItemNoString = {
  type: "Number" | "Date";
};
type tAttributeItemString = {
  type: "String";
  maxLength: number;
};
export type tAttributeItem = {
  label?: string;
  flags: tAttributeFlags;
} & (tAttributeItemNoString | tAttributeItemString);

export type tAattributes = Record<string, tAttributeItem>;

export type tModel = {
  name: string;
  attributes: tAattributes;
};
