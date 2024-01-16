type tAttributeFlags = "KMI-" | "AMIU" | "AMI-" | "A-I-" | "A-IU";
// type tAttributeType = "String" | "Number" | "Date";
type tAttributeItemNoString = {
  type:
    | "Number"
    | "BigNumber"
    | "Decimal"
    | "Float"
    | "Date"
    | "Timestamp"
    | "Text"
    | "Url"
    | "Email";
};
type tAttributeItemString = {
  type: "String";
  maxLength: number;
};

type tAttributeItemEnum = {
  type: "Enum";
  enum: string[];
};
export type tAttributeItem = {
  label?: string;
  flags: tAttributeFlags;
} & (tAttributeItemNoString | tAttributeItemString | tAttributeItemEnum);

export type tAattributes = Record<string, tAttributeItem>;

export type tRelationship = Record<string, tRelationshipAttr>;

type tOnDelete = "CASCADE" | "RESTRICT" | "SET NULL";
type tRelationshipType = "ONE_TO_ONE" | "ONE_TO_MANY";
type tRelationshipMapping = {
  from: string[];
  to: string[];
};
export type tRelationshipAttr = {
  model: string;
  relationship: tRelationshipType;
  mapping: tRelationshipMapping;
  onDelete: tOnDelete;
};

export type tModel = {
  name: string;
  attributes: tAattributes;
  relationships?: tRelationship;
};
