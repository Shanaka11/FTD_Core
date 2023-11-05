import { generateWhereClause } from "../../lib/db/filterMethods";

describe("Generation of filter strings", () => {
  it("With only a single search parameter", async () => {
    const clientFilterString = `(objstate eq 'Parked')`;
    const serverFilterString = generateWhereClause(clientFilterString);

    expect(serverFilterString).toBe(`WHERE (OBJSTATE = 'Parked')`);
  });

  it("With multiple simple search parameters", async () => {
    const clientFilterString = `objstate eq 'Parked' and orderNo eq '122A' and amount lt 1000`;
    const serverFilterString = generateWhereClause(clientFilterString);

    expect(serverFilterString).toBe(
      `WHERE OBJSTATE = 'Parked' AND ORDER_NO = '122A' AND AMOUNT > 1000`,
    );
  });

  it("With a single complex search parameter 'StartsWith'", async () => {
    const clientFilterString = `startsWith(orderNo, 14)`;
    const serverFilterString = generateWhereClause(clientFilterString);

    expect(serverFilterString).toBe(`WHERE ORDER_NO LIKE '14%'`);
  });

  it("With multiple complex search parameter 'StartsWith', 'EndsWith', 'LIKE'", async () => {
    const clientFilterString = `startsWith(orderNo, 14) and endsWith(customerNo, 15) and like(state, %1234%)`;
    const serverFilterString = generateWhereClause(clientFilterString);

    expect(serverFilterString).toBe(
      `WHERE ORDER_NO LIKE '14%' AND CUSTOMER_NO LIKE '%15' AND STATE LIKE '%1234%'`,
    );
  });

  it("Complex search parameter", async () => {
    const clientFilterString = `amount lte 1000 and (tax lte 10 or tax gte 100) startsWith(orderNo, 14) and endsWith(customerNo, 15) and like(state, %1234%) and site neq 'KDy'`;
    const serverFilterString = generateWhereClause(clientFilterString);

    expect(serverFilterString).toBe(
      `WHERE AMOUNT <= 1000 AND (TAX <= 10 OR TAX >= 100) ORDER_NO LIKE '14%' AND CUSTOMER_NO LIKE '%15' AND STATE LIKE '%1234%' AND SITE >< 'KDy'`,
    );
  });
});
