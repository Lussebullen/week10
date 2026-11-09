import { z } from "zod";

export const OrderIdSchema = z.number().positive().int();
export const AmountSchema = z.number().positive().int();

//enums are case-sensitive, so we need to ensure that the input matches the expected case
export const PizzaTypeSchema = z.enum(["margherita", "pepperoni", "vegetarian"]);

export const PizzaSchema = z.object({
  type: PizzaTypeSchema,
  price: z.number().positive(),
});