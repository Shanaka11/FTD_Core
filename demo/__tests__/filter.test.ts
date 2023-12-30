import { generateWhereClause } from "../../lib/db/filterMethods";

describe("Generation of filter strings", () => {
  it("With only a single search parameter", async () => {
    const clientFilterString = `(eq(objstate, Parked))`;
    const serverFilter = generateWhereClause(clientFilterString);

    expect(serverFilter.filterString).toBe(`WHERE (OBJSTATE = ?)`);
    expect(serverFilter.parameterArray).toEqual(["Parked"]);
  });

  it("With multiple simple search parameters", async () => {
    const clientFilterString = `eq(objstate, Parked) and eq(orderNo, 122A) and lt(amount, 1000)`;
    const serverFilter = generateWhereClause(clientFilterString);

    expect(serverFilter.filterString).toBe(
      `WHERE OBJSTATE = ? and ORDER_NO = ? and AMOUNT < ?`,
    );
    expect(serverFilter.parameterArray).toEqual(["Parked", "122A", "1000"]);
  });

  it("With a single complex search parameter 'StartsWith'", async () => {
    const clientFilterString = `startsWith(orderNo, 14)`;
    const serverFilter = generateWhereClause(clientFilterString);

    expect(serverFilter.filterString).toBe(`WHERE ORDER_NO LIKE ?`);
    expect(serverFilter.parameterArray).toEqual(["14%"]);
  });

  it("With multiple complex search parameter 'StartsWith', 'EndsWith', 'LIKE'", async () => {
    const clientFilterString = `startsWith(orderNo, 14) and endsWith(customerNo, 15) and like(state, %1234%)`;
    const serverFilter = generateWhereClause(clientFilterString);

    expect(serverFilter.filterString).toBe(
      `WHERE ORDER_NO LIKE ? and CUSTOMER_NO LIKE ? and STATE LIKE ?`,
    );
    expect(serverFilter.parameterArray).toEqual(["14%", "%15", "%1234%"]);
  });

  it("Complex search parameter", async () => {
    const clientFilterString = `lte(amount, 1000) and (lte(tax, 10) or gte(tax, 100)) startsWith(orderNo, 14) and endsWith(customerNo, 15) and like(state, %1234%) and neq(site, Kdy)`;
    const serverFilter = generateWhereClause(clientFilterString);

    expect(serverFilter.filterString).toBe(
      `WHERE AMOUNT <= ? and (TAX <= ? or TAX >= ?) ORDER_NO LIKE ? and CUSTOMER_NO LIKE ? and STATE LIKE ? and SITE >< ?`,
    );
    expect(serverFilter.parameterArray).toEqual([
      "1000",
      "10",
      "100",
      "14%",
      "%15",
      "%1234%",
      "Kdy",
    ]);
  });
  it("Filter string with incompatible methods", async () => {
    const clientFilterString = `1ck(1, 2)`;

    expect(() => generateWhereClause(clientFilterString)).toThrow(
      "Unsupported method: 1ck",
    );
  });
  it("Incompatible filter string", async () => {
    const clientFilterString = `startsWith(OrderNo,'13') orderBy:OrderNo:ASC and (endsWith(OrderNo,'14') or contains(OrderNo,'12'))`;

    expect(() => generateWhereClause(clientFilterString)).toThrow(
      "Incorrect filter. Please check the filter parameter and try again.",
    );
  });
});
