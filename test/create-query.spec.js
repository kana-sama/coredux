import { createQuery } from "../";

describe("createQuery", () => {
  it("always create unique values", () => {
    const a = createQuery();
    const b = createQuery();

    expect(a).not.toEqual(b);
  });
});
