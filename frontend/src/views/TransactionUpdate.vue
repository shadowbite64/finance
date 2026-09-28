<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { fetchTransactionById, updateTransaction, uploadTransactionImage, type TransactionPayload } from '@/lib/api';
import { ASSET_URL } from '@/config/config';

const props = defineProps<{
    transactionId: string
}>()

const type = ref('')
const amount = ref('')
const category = ref('')
const description = ref('')
const transactionDate = ref('')
const existingImage = ref<string | null>(null)
const newImage = ref<File | null>(null)

const error = ref<string | null>(null)

async function loadTransaction() {
    error.value = null
    try {
        const data = await fetchTransactionById(props.transactionId)
        type.value = data.type
        amount.value = String(data.amount) 
        category.value = data.category ?? ''
        description.value = data.description ?? ''
        existingImage.value = data.image

        if(data.transactionDate) {
            transactionDate.value = new Date(data.transactionDate).toISOString().split('T')[0] ?? ''
        }
    } catch (err: any) {
        error.value = err.message || "Could not load transaction"
    }
}

onMounted(() => {
    loadTransaction()
})

async function handleUpdate() {
    error.value = null
    try {
        const payload: Partial<TransactionPayload> = {
            type: type.value as 'INCOME' | 'EXPENSE',
            amount: amount.value,
            category: category.value,
            description: description.value,
            transactionDate: transactionDate.value,
        }

        await updateTransaction(props.transactionId, payload)

        if(newImage.value) {
            await uploadTransactionImage(props.transactionId, newImage.value)
        }

        location.reload();
    } catch (err: any) {
        error.value = err.message || "Failed to update transaction"
    }
}

function handleFileChange(event: Event) {
    const target = event.target as HTMLInputElement
    newImage.value = target.files?.[0] ?? null
}

defineEmits(['cancel'])

</script>

<template>
    <form @submit.prevent="handleUpdate">
        <label for="type">Type</label>
        <select name="type" id="type" v-model="type">
            <option value="INCOME">Income</option>
            <option value="EXPENSE">Expense</option>
        </select>

        <label for="amount">Amount</label>
        <input type="number" id="amount" v-model="amount">

        <label for="category">Category</label>
        <input type="text" id="category" v-model="category">

        <label for="description">Description</label>
        <textarea name="description" id="description" v-model="description"></textarea>

        <label for="transactionDate">Transaction Date</label>
        <input type="date" id="transactionDate" v-model="transactionDate">

        <label for="image">Image</label>
        <img v-if="existingImage" :src="`${ASSET_URL}${existingImage}`" alt="Existing Image">
        <input type="file" accept="image/jpeg,image/png,image/webp,image/jpg" @change="handleFileChange">

        <button type="submit">Update Transaction</button>
        <button type="button" @click="$emit('cancel')">Cancel</button>
    </form>

</template>

<style scoped>

</style>