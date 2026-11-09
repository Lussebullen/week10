import { describe, test, expect } from "vitest";
import { OrderIdSchema} from "./schemas";

//safeParse doesn’t throw. 
// It returns an object with success set to true or false, so it’s the most convenient for tests

// Testing OrderIdSchema = z.number().int().positive();
describe("OrderIdSchema", () => {
  test("accepts positive integers", () => {
    console.log(OrderIdSchema.safeParse(0)); //to see what the test output looks like.
    expect(OrderIdSchema.safeParse(1).success).toBe(true);
  });

  test("rejects zero and negative numbers", () => {
    expect(OrderIdSchema.safeParse(0).success).toBe(false);
    expect(OrderIdSchema.safeParse(-1).success).toBe(false);
  });
});