<script setup lang="ts">
import { ref } from 'vue'
import { createTransaction, uploadTransactionImage, type TransactionPayload } from '@/lib/api'

const emit = defineEmits<{
    (e: 'close'): void
}>()

const type = ref('')
const amount = ref('')
const category = ref('')
const description = ref('')
const transactionDate = ref('')
const image = ref<File | null>(null)

const imagePreviewUrl = ref<string | null>(null)

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
        if(imagePreviewUrl.value) {
            URL.revokeObjectURL(imagePreviewUrl.value)
        }
        
        emit('close')
        location.reload()
    } catch (err: any) {
        error.value = err.message || "Failed to create transaction"
    }

    
}

function handleFileChange(event: Event) {
    const target = event.target as HTMLInputElement
    const file = target.files?.[0] ?? null
    image.value = file
    
    if (file) {
        imagePreviewUrl.value = URL.createObjectURL(file)
    } else {
        imagePreviewUrl.value = null
    }
}
</script>

<template>
    <div @click.self="$emit('close')" class="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div class="bg-white rounded-xl shadow-xl w-full max-w-xl p-6 space-y-4">
            <div class="flex items-center justify-between border-b border-slate-100 pb-3">
                <h2 class="text-xl font-bold text-slate-800">Add Transaction</h2>
                <button type="button" @click="$emit('close')" class="text-slate-400 hover:text-slate-600 text-lg font-bold p-1">
                    ✕
                </button>
            </div>
            <form @submit.prevent="addTransaction" class="space-y-3">
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
                        <input type="file" accept="image/jpeg,image/png,image/webp,image/jpg" @change="handleFileChange" class="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 transition">
                        <div v-if="imagePreviewUrl" class="mt-3 flex items-center space-x-3 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                            <img :src="imagePreviewUrl" alt="Preview" class="w-16 h-16 object-cover rounded-lg border border-slate-300 shadow-sm">
                            <div>
                                <p class="text-xs font-semibold text-slate-700">Receipt Preview</p>
                                <p class="text-[11px] text-slate-400">Ready to upload</p>
                            </div>
                        </div>
                    </div>

                    <div class="md:col-span-2 pt-2 flex justify-end">
                        <button type="submit" class="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg">Add Transaction</button>
                        <p v-if="error" style="color: red;">{{ error }}</p>
                    </div>
                    
                </div>
            </form>
        </div>
    </div>
</template>

<style scoped>
</style>