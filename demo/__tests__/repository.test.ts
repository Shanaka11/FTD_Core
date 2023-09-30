import { makeReadModel } from "../../lib/db/crudRepository/readModel";

const mockQueryExecutor = (query: string) => {
  return [query];
};

describe("CRUD Repository", () => {
  describe("Read Model Method", () => {
    const readModel = makeReadModel(mockQueryExecutor);

    it("Select all from user", () => {
      const result = readModel({
        model: "user",
      });
      expect(result).toBeDefined();
      expect(result.length).toBe(1);
      expect(result[0]).toBe("SELECT * FROM USER ");
    });

    it("Select columns from order line when id is given", () => {
      const result = readModel({
        model: "orderLine",
        columns: ["orderNo", "orderLineNo", "amount"],
        key: "123",
      });

      expect(result).toBeDefined();
      expect(result.length).toBe(1);
      expect(result[0]).toBe(
        "SELECT ORDER_NO, ORDER_LINE_NO, AMOUNT FROM ORDER_LINE WHERE ID = 123",
      );
    });

    it("Select all when keys are given from user", () => {
      const result = readModel({
        model: "user",
        key: {
          orderNo: "123",
          orderLineNo: "1",
        },
      });

      expect(result).toBeDefined();
      expect(result.length).toBe(1);
      expect(result[0]).toBe(
        "SELECT * FROM USER WHERE ORDER_NO = 123 AND ORDER_LINE_NO = 1",
      );
    });

    it("Select all from user when a basic filter is given", () => {
      const result = readModel({
        model: "user",
        filter: "orderNo lte 12",
      });

      expect(result).toBeDefined();
      expect(result.length).toBe(1);
      expect(result[0]).toBe("SELECT * FROM USER WHERE orderNo >= 12");
    });
  });
});
