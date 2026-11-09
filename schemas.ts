import { z } from "zod";

export const OrderIdSchema = z.number().positive().int();
export const AmountSchema = z.number();