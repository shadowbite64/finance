import express from "express";
import prisma from "./lib/prisma.js";
import transactionsRoutes from "./routes/transactionsRoutes.js"

const app = express();


app.use(express.json());
app.use("/api/transactions", transactionsRoutes);

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});