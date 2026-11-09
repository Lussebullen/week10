import { describe, test, expect } from "vitest";
import { AmountSchema, OrderIdSchema } from "./schemas";
import { PizzaTypeSchema, PizzaSchema } from "./schemas";

//safeParse doesn’t throw. 
// It returns an object with success set to true or false, so it’s convenient for tests
describe("OrderIdSchema", () => {
  test("accepts positive integers", () => {
    expect(OrderIdSchema.safeParse(1).success).toBe(true);
    expect(OrderIdSchema.safeParse(42).success).toBe(true);
  });

  test("rejects zero and negative numbers", () => {
    expect(OrderIdSchema.safeParse(0).success).toBe(false);
    expect(OrderIdSchema.safeParse(-1).success).toBe(false);
  });

  test("rejects non-integers", () => {
    expect(OrderIdSchema.safeParse(12.5).success).toBe(false);
  });

  test("rejects non-numbers", () => {
    expect(OrderIdSchema.safeParse("abc").success).toBe(false);
    expect(OrderIdSchema.safeParse("5").success).toBe(false);
    expect(OrderIdSchema.safeParse(null).success).toBe(false);
    expect(OrderIdSchema.safeParse(undefined).success).toBe(false);
  });
});

describe("AmountSchema", () => {
  test("accepts positive numbers", () => {
    expect(AmountSchema.safeParse(1).success).toBe(true);
    expect(AmountSchema.safeParse(42).success).toBe(true);
  });

  test("rejects zero and negative numbers", () => {
    expect(AmountSchema.safeParse(0).success).toBe(false);
    expect(AmountSchema.safeParse(-1).success).toBe(false);
  });
test("rejects non-integers", () => {
    expect(AmountSchema.safeParse(12.5).success).toBe(false);
  });

  test("rejects non-numbers", () => {
    expect(AmountSchema.safeParse("abc").success).toBe(false);
    expect(AmountSchema.safeParse("5").success).toBe(false);
    expect(AmountSchema.safeParse(null).success).toBe(false);
    expect(AmountSchema.safeParse(undefined).success).toBe(false);
  });
});

//Test can also be combined into a single test using test.each() to iterate over multiple inputs, 
// which is more concise and easier to read.
describe("PizzaTypeSchema", () => {
  //all valid pizza types
  test.each(["margherita", "pepperoni", "vegetarian"])(
    "accepts %s",
    (type) => {
      expect(PizzaTypeSchema.safeParse(type).success).toBe(true);
    }
  );

  // Test invalid pizza types
  test.each(["hawaiian", "Margherita", "", 1, null, undefined])(
    "rejects %s",
    (type) => {
      expect(PizzaTypeSchema.safeParse(type).success).toBe(false);
    }
  );
});

describe("PizzaSchema", () => {
  test("accepts a valid pizza", () => {
    const result = PizzaSchema.safeParse({ type: "margherita", price: 95 });
    expect(result.success).toBe(true);
  });

  test("returns the parsed data", () => {
    const result = PizzaSchema.parse({ type: "pepperoni", price: 110 });
    expect(result).toEqual({ type: "pepperoni", price: 110 });
  });

  test("rejects an invalid type", () => {
    const result = PizzaSchema.safeParse({ type: "hawaiian", price: 95 });
    expect(result.success).toBe(false);
  });

  test.each([0, -10, "95", null])("rejects price %s", (price) => {
    const result = PizzaSchema.safeParse({ type: "margherita", price });
    expect(result.success).toBe(false);
  });

  test("rejects missing fields", () => {
    expect(PizzaSchema.safeParse({ type: "margherita" }).success).toBe(false);
    expect(PizzaSchema.safeParse({ price: 95 }).success).toBe(false);
    expect(PizzaSchema.safeParse({}).success).toBe(false);
  });

  test("rejects non-objects", () => {
    expect(PizzaSchema.safeParse(null).success).toBe(false);
    expect(PizzaSchema.safeParse("pizza").success).toBe(false);
  });

  test("object comaprison", () => {
    expect(PizzaSchema.parse({type: "pepperoni", price: 120})).toEqual({type: "pepperoni", price: 120});
  });
});