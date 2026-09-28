<script setup lang="ts">
import { ref } from 'vue'
import { createTransaction, uploadTransactionImage, type TransactionPayload } from '@/lib/api'

const type = ref('')
const amount = ref('')
const category = ref('')
const description = ref('')
const transactionDate = ref('')
const image = ref<File | null>(null)

const error = ref<string | null>(null)

async function addTransaction() {
    error.value = null

    if(!type.value || !amount.value) {
        error.value = "Type and Amount can't be empty"
        return
    }

    const payload: TransactionPayload = {
        type: type.value as 'INCOME' | 'EXPENSE',
        amount: amount.value,
        category: category.value,
        description: description.value,
        transactionDate: transactionDate.value,
    }

    try {
        const data = await createTransaction(payload)
        if(image.value) {
            await uploadTransactionImage(data.id, image.value)
        }
        location.reload()
    } catch (err: any) {
        error.value = err.message || "Failed to create transaction"
    }
}

function handleFileChange(event: Event) {
    const target = event.target as HTMLInputElement
    image.value = target.files?.[0] ?? null
}

</script>

<template>
    <form @submit.prevent="addTransaction">
        <label for="type">Type</label>
        <select name="type" id="type" v-model="type">
            <option value="" disabled>Select type</option>
            <option value="INCOME">Income</option>
            <option value="EXPENSE">Expense</option>
        </select>

        <label for="amount">Amount</label>
        <input type="number" id="amount" v-model.number="amount">

        <label for="category">Category</label>
        <input type="text" id="category" v-model="category">

        <label for="description">Description</label>
        <textarea name="description" id="description" v-model="description"></textarea>

        <label for="transactionDate">Transaction Date</label>
        <input type="date" id="transactionDate" v-model="transactionDate">

        <label for="image">Image</label>
        <input type="file" accept="image/jpeg,image/png,image/webp,image/jpg" @change="handleFileChange">

        <button type="submit">Add Transaction</button>
        <p v-if="error" style="color: red;">{{ error }}</p>

    </form>
</template>

<style scoped>
</style>