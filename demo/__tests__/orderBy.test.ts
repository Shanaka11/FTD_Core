import {
  generateOrderByClause,
  generateWhereClause,
} from "../../lib/db/filterMethods";

describe("Generation of order by strings", () => {
  it("With only a single column", () => {
    const clientString = `orderNo`;
    const serverString = generateOrderByClause(clientString);

    expect(serverString).toBe(`ORDER BY ORDER_NO`);
  });

  it("With multiple columns with different ordering", () => {
    const clientString = `orderNo,customer:DESC,amount`;
    const serverString = generateOrderByClause(clientString);

    expect(serverString).toBe(`ORDER BY ORDER_NO, CUSTOMER DESC, AMOUNT`);
  });

  it("Incorrect ordering", () => {
    let clientString = `orderNo,customer:,amount`;

    expect(() => generateOrderByClause(clientString)).toThrow(
      "Ordering is wrong, It should be DESC. Please check the parameter and try again.",
    );

    clientString = `orderNo,customer:ASC,amount`;

    expect(() => generateOrderByClause(clientString)).toThrow(
      "Ordering is wrong, It should be DESC. Please check the parameter and try again.",
    );
  });

  it("Incorrect order by string", () => {
    // There should not be any spaces in the string
    let clientString = `orderNo,customer: DESC,amount`;

    expect(() => generateOrderByClause(clientString)).toThrow(
      "Incorrect orderBy clause. check for spaces and try again.",
    );

    clientString = `orderNo, customer,amount`;

    expect(() => generateOrderByClause(clientString)).toThrow(
      "Incorrect orderBy clause. check for spaces and try again.",
    );
  });
});
