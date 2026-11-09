import { describe, test, expect } from "vitest";
import { OrderIdSchema } from "./schemas";

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