import { describe, test, expect } from "vitest";
import { chargeCustomer, createPizza, orderPizza, sendOrder } from "./pizzashop";

describe("Pizza Shop Unit Tests", () => {
  test("createPizza returns correct type and price", () => {
    const pizza = createPizza("margherita");
    expect(pizza).toEqual({ type: "margherita", price: 100 });

    const pizza2 = createPizza("vegetarian");
    expect(pizza2).toEqual({ type: "vegetarian", price: 110 });
  });

  test("createPizza throws for unknown type", () => {
    expect(() => createPizza("hawaii")).toThrow();
  });

  test("chargeCustomer throws for invalid order IDs", () => {
    expect(() => chargeCustomer(-1, 100)).toThrow();
    expect(() => chargeCustomer("abc", 100)).toThrow();
    expect(() => chargeCustomer(null, 100)).toThrow();
    expect(() => chargeCustomer(undefined, 100)).toThrow();
    expect(() => chargeCustomer(12.5, 100)).toThrow();
    expect(() => chargeCustomer(10, 0)).toThrow(); // Invalid amount
    expect(() => chargeCustomer(0, 5)).toThrow(); // Should throw for invalid order ID but fails to do so
  });

  test("sendOrder returns a numeric order id", () => {
    const id = sendOrder({ type: "pepperoni", price: 120 });

    expect(typeof id).toBe("number");
    expect(Number.isInteger(id)).toBe(true);
    expect(id).toBeGreaterThanOrEqual(0);
    expect(id).toBeLessThan(1000);
  });

  test("orderPizza returns true for a valid pizza", () => {
    const result = orderPizza("pepperoni");
    expect(result).toBe(true);
    const result2 = orderPizza("vegetarian");
    expect(result2).toBe(true);
  });
});
