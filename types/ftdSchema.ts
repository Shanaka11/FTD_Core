type tAttributeFlags = "KMI-" | "AMIU" | "AMI-" | "A-I-" | "A-IU";
// type tAttributeType = "String" | "Number" | "Date";
type tAttributeItemNoString = {
  type: "Number" | "Date";
};
type tAttributeItemString = {
  type: "String";
  maxLength: number;
};
type tAttributeItem = {
  label?: string;
  flags: tAttributeFlags;
} & (tAttributeItemNoString | tAttributeItemString);
type tAattributes = Record<string, tAttributeItem>;

export type tModel = {
  name: string;
  attributes: tAattributes;
};

//  export type TodoPreview = Pick<Todo, "title" | "completed">;
/*
    A normal schema file would look like this

    export const model: tModel = {
        name: "Order",
        attributes: {
            OrderNo: {
            label: "Order Id",
            type: "String",
            flags: "KMI-",
            maxLength: 100,
            },
        },
        };

    export {
        name: 'Order'
        attributes : {
            name: { label: Name, type: String, max_length : 10, flags : KMIU  }
        },
        reference : {

        }
    }
*/
