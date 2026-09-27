import { Router } from "express";
import prisma from "../lib/prisma.js";
import { Prisma } from "../generated/prisma/client.js";
import { createTransactionSchema, updateTransactionSchema } from "../schemas/transactionsSchema.js";
import fs from "node:fs/promises"

const router = Router();

// GET ALL TRANSACTIONS
router.get("/", async (req, res, next) => {
    try {
        const transactions = await prisma.transaction.findMany();
        res.json(transactions)
    } catch (error) {
        next(error)
    }
});

// GET TRANSACTION BY ID
router.get("/:id", async (req, res, next) => {
    try {
        const transaction = await prisma.transaction.findUnique({
            where: {
                id: req.params.id
            }
        });

        if(!transaction) {
            return res.status(404).json({
                message: "Product not found"
            });
        }
        
        res.json(transaction);

    } catch (error) {
        next(error);
    }
})

//CREATE TRANSACTION
router.post("/", async (req, res, next) => {
    try {
        const result = createTransactionSchema.safeParse(req.body);

        if(!result.success) {
            return res.status(400).json({
                message: "Invalid request body",
                error: result.error.flatten().fieldErrors,
            });
        }

        const transaction = await prisma.transaction.create({
            data: {
                type: result.data.type,
                amount: result.data.amount,
                category: result.data.category ?? null,
                description: result.data.description ?? null,
                transactionDate: result.data.transactionDate ?? new Date(),
            }
        });
        
        res.status(201).json(transaction);
    } catch (error) {
        next(error);
    }
})

// UPDATE PRODUCT
router.patch("/:id", async (req, res, next) => {
    const result = updateTransactionSchema.safeParse(req.body);

    if(!result.success) {
        return res.status(400).json({
            message: "Invalid request body",
            error: result.error.flatten().fieldErrors
        });
    }

    try {
        const transaction = await prisma.transaction.update({
            where: {
                id: req.params.id,
            },
            data: result.data,
        });

        res.json(transaction);
    } catch (error) {
        if(error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
            return res.status(404).json({
                message: "Transaction not found",
            });
        }
        next(error);
    }
})

export default router;