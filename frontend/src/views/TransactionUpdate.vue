<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { fetchTransactionById, updateTransaction, uploadTransactionImage, type TransactionPayload } from '@/lib/api';
import { ASSET_URL } from '@/config/config';

const props = defineProps<{
    transactionId: string
}>()

defineEmits<{
    (e: 'cancel'): void
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

</script>

<template>
    <div @click.self="$emit('cancel')" class="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div class="bg-white rounded-xl shadow-xl w-full max-w-xl p-6 space-y-4">
            <div class="flex items-center justify-between border-b border-slate-100 pb-3">
                <h2 class="text-xl font-bold text-slate-800">Add Transaction</h2>
                <button type="button" @click="$emit('cancel')" class="text-slate-400 hover:text-slate-600 text-lg font-bold p-1">
                    ✕
                </button>
            </div>
            <form @submit.prevent="handleUpdate" class="space-y-3">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div class="md:col-span-2">
                        <label for="type">Transaction Type</label>
                        <select name="type" id="type" v-model="type" class="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-base text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                            <option value="" disabled>Select type</option>
                            <option value="INCOME">Income</option>
                            <option value="EXPENSE">Expense</option>
                        </select>
                    </div>
                    
                    <div class="md:col-span-2">
                        <label for="amount">Amount</label>
                        <input type="number" id="amount" v-model.number="amount" class="w-full border border-slate-300 rounded-lg p-2.5 text-base focus:outline-none focus:ring-2 focus:ring-indigo-500">
                    </div>

                    <div class="md:col-span-2">
                        <label for="category">Category</label>
                        <input type="text" id="category" v-model="category" class="w-full border border-slate-300 rounded-lg p-2.5 text-base focus:outline-none focus:ring-2 focus:ring-indigo-500">
                    </div>
                    <div class="md:col-span-2">
                        <label for="description">Description</label>
                        <textarea name="description" id="description" v-model="description" class="w-full border border-slate-300 rounded-lg p-2.5 text-base resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500"></textarea>
                    </div>

                    <div class="md:col-span-2">
                        <label for="transactionDate">Transaction Date</label>
                        <input type="date" id="transactionDate" v-model="transactionDate" class="w-full border border-slate-300 rounded-lg p-2.5 text-base focus:outline-none focus:ring-2 focus:ring-indigo-500">
                    </div>

                    <div class="md:col-span-2">
                        <label for="image" class="block text-xs font-semibold text-slate-600 mb-1">Receipt Image</label>
                        <div v-if="existingImage" class="mb-3 flex items-center space-x-3 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                            <img :src="`${ASSET_URL}${existingImage}`" alt="Current Image" class="size-16 object-cover rounded-lg border border-slate-300 shadow-sm"/>
                            <div class="flex flex-col">
                                <p class="text-xs font-semibold text-slate-700"> Current Receipt </p>
                                <p class="text-[11px] text-slate-400"> Choose a new file below to replace </p>
                            </div>
                        </div>
                        <input type="file" accept="image/jpeg,image/png,image/webp,image/jpg" @change="handleFileChange" class="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 transition">
                       
                    </div>

                    <div class="flex gap-2 md:col-span-2 pt-2 flex justify-end">
                        <button type="button" class="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg" @click="$emit('cancel')">Cancel</button>
                        <button type="submit" class="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg">Update Transaction</button>
                        <p v-if="error" style="color: red;">{{ error }}</p>
                    </div>
                    
                </div>
            </form>
        </div>
    </div>
</template>

<style scoped>

</style>