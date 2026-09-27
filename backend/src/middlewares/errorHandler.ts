import type { Request, Response, NextFunction, ErrorRequestHandler } from "express";
import { Prisma } from "../generated/prisma/client.js";

export const errorHandler: ErrorRequestHandler = (err: unknown, req: Request, res: Response, next: NextFunction) => {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2025") {
        return res.status(404).json({ message: "Transaction not found" });
    }

    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") {
        res.status(409).json({
            message: "unique constraint failed",
            fields: err.meta?.target,
        });
        return;
    }

    if (err instanceof Error && err.name === "MulterError") {
        return res.status(400).json({
            message: err.message,
        });
    }

    if (typeof err === "object" && err !== null && ("status" in err || "statusCode" in err )) {
        const status = (err as any).status || (err as any).statusCode;
        const message = (err as any).message || "Bad Request";
        return res.status(status).json({ message });
    }

    if (err instanceof SyntaxError && "status" in err && (err as any).status === 400) {
        return res.status(400).json({
            message: "Invalid JSON payload",
        })
    }

    console.error("Unhandled Error: ", err);
    res.status(500).json({
        message: "Internal server error",
    });
}