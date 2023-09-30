import { makeCreateModel } from "../../lib/db/crudRepository/createModel";
import { makeDeleteModel } from "../../lib/db/crudRepository/deleteModel";
import { makeReadModel } from "../../lib/db/crudRepository/readModel";
import { makeUpdateModel } from "../../lib/db/crudRepository/updateModel";

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

  describe("Create Model Method", () => {
    const createModel = makeCreateModel(mockQueryExecutor);

    it("Create an order", () => {
      const result = createModel({
        model: "user",
        columns: ["orderNo", "orderLineNo", "amount"],
        values: ["123", "2", "100"],
      });

      expect(result).toBeDefined();
      expect(result.length).toBe(1);
      expect(result[0]).toBe(
        "INSERT INTO USER (ORDER_NO, ORDER_LINE_NO, AMOUNT) VALUES (123, 2, 100)",
      );
    });
  });

  describe("Update Model Method", () => {
    const updateModel = makeUpdateModel(mockQueryExecutor);

    it("Update an order", () => {
      const result = updateModel({
        model: "user",
        columns: ["amount", "discount"],
        values: ["2", "100"],
        key: "1233",
      });

      expect(result).toBeDefined();
      expect(result.length).toBe(1);
      expect(result[0]).toBe(
        "UPDATE USER SET AMOUNT = 2, DISCOUNT = 100 WHERE ID = 1233",
      );
    });
  });

  describe("Delete Model Method", () => {
    const deleteModel = makeDeleteModel(mockQueryExecutor);

    it("Delete an order", () => {
      const result = deleteModel({
        model: "user",
        key: "1233",
      });

      expect(result).toBeDefined();
      expect(result.length).toBe(1);
      expect(result[0]).toBe("DELETE FROM USER WHERE ID = 1233");
    });
  });
});
