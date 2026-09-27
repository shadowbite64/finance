import { z } from "zod";

export const createTransactionSchema = z.object({
    type: z.enum(["INCOME", "EXPENSE"]),
    amount: z.coerce.number().positive(),
    category: z.string().optional(),
    description: z.string().optional(),
    transactionDate: z.coerce.date().optional(),
    image: z.string().optional(),
});


export const updateTransactionSchema = createTransactionSchema.partial();