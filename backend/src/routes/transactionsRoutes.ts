import { Router } from "express";
import prisma from "../lib/prisma.js";
import { Prisma } from "../generated/prisma/client.js";
import { createTransactionSchema, updateTransactionSchema } from "../schemas/transactionsSchema.js";
import upload from "../middlewares/upload.js"

import fs from "node:fs/promises"

const router = Router();

// GET ALL TRANSACTIONS
router.get("/", async (req, res) => {
    const transactions = await prisma.transaction.findMany();
    res.json(transactions)
});

// GET TRANSACTION BY ID
router.get("/:id", async (req, res) => {
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
})

//CREATE TRANSACTION
router.post("/", async (req, res) => {
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

    const transaction = await prisma.transaction.update({
        where: {
            id: req.params.id,
        },
        data: result.data,
    });

        res.json(transaction);
})

// DELETE TRANSACTION
router.delete("/:id", async (req, res, next) => {
    const transaction = await prisma.transaction.delete({
        where: { id: req.params.id }
    });

    // if (!transaction){

    // }

    return res.status(204).send();
})

// POST UPLOAD TRANSACTION
router.post("/:id/image", upload.single("image"), async (req, res) => {    
    if (!req.file) {
        return res.status(400).json({
            message: "No file uploaded",
        })
    }

    const transaction = await prisma.transaction.findUnique({
        where: {
            id: req.params.id as string,
        },
    });

    if (!transaction) {
        await fs.unlink(req.file.path).catch(() => {});
        return res.status(404).json({
            message: "Transaction not found",
        });
    }

    const oldImage = transaction.image;
    const image = `/uploads/${req.file.filename}`;
    const updateTransaction = await prisma.transaction.update({
        where: {
            id: req.params.id as string,
        },
        data: {
            image: image,
        },
    });

    if(oldImage) {
        const oldImagePath = oldImage.replace("/uploads/", "uploads/");

        await fs.unlink(oldImagePath).catch(() => {});
    }

    return res.status(200).json(updateTransaction);

})

export default router;