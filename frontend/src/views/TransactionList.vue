<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { fetchTransactions, deleteTransaction, type Transaction } from '@/lib/api'
import { ASSET_URL } from '@/config/config';
import { computed } from'vue'

const transactions = ref<Transaction[]>([])
const loading = ref(true)
const error = ref<string | null>(null)

const emit = defineEmits<{
  (e: 'edit', id: string): void
}>()

const totalIncome = computed(() =>
    transactions.value.filter(t => t.type === 'INCOME').reduce((sum, t) => sum + Number(t.amount), 0)
)

const totalExpense = computed(() =>
    transactions.value.filter(t => t.type === 'EXPENSE').reduce((sum, t) => sum + Number(t.amount), 0)
)

const balance = computed(() => totalIncome.value - totalExpense.value)


async function loadTransactions() {
    try {
        const data = await fetchTransactions()
        transactions.value = data
    } catch (err) {
        console.error(err)
        error.value = 'Failed to fetch transactions'
    } finally {
        loading.value = false
    }
}

async function executeDelete(id: string) {
    try {
        await deleteTransaction(id)
        await loadTransactions()
    } catch (err) {
        console.error(err)
    }
}

function formatDate(dateStr: string) {
    if(!dateStr) return '-'
    const date = new Date(dateStr)

    return new Intl.DateTimeFormat('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    }).format(date)
}
onMounted(() => {
  loadTransactions();
});
</script>

<template>
    <main class="p-6 min-h-screen">
    <div v-if="loading">Loading transactions...</div>
    <div v-if="error">{{ error }}</div>
    <div v-if="transactions.length === 0">No transactions recorded yet.</div>

    <section v-else>
        <div class="bg-white shadow-sm border border-slate-200 rounded-lg p-4 mb-6">
            <p class="text-emerald-600 font-bold text-lg">Total Income: {{ totalIncome }}</p>
            <p class="text-red-600 font-bold text-lg">Total Expense: {{ totalExpense }}</p>
            <p class="font-bold text-xl">Balance: {{ balance }}</p>
        </div>
        
        <table class="min-w-full border-b border-slate-200">
            <thead>
                <tr class="bg-slate-200">
                    <th class="p-3 text-left text-base text-slate-700 uppercase">Transaction Date</th>
                    <th class="p-3 text-left text-base text-slate-700 uppercase">Type</th>
                    <th class="p-3 text-left text-base text-slate-700 uppercase">Amount</th>
                    <th class="p-3 text-left text-base text-slate-700 uppercase">Category</th>
                    <th class="p-3 text-left text-base text-slate-700 uppercase">Description</th>
                    <th class="p-3 text-left text-base text-slate-700 uppercase">Image</th>
                    <th class="p-3 text-left text-base text-slate-700 uppercase">Actions</th>
                </tr>
            </thead>
            <tbody class="bg-white divide-y divide-slate-200">
                <tr v-for="transaction in transactions" :key="transaction.id">
                    <td class="p-3 text-slate-700">{{ formatDate(transaction.transactionDate) }}</td>
                    <td class="p-3 text-slate-700">{{ transaction.type }}</td>
                    <td class="p-3 text-slate-700">{{ transaction.amount }}</td>
                    <td class="p-3 text-slate-700">{{ transaction.category }}</td>
                    <td class="p-3 text-slate-700">{{ transaction.description }}</td>
                    <td class="p-3 text-slate-700">
                        <img class="size-15" v-if="transaction.image" :src="`${ASSET_URL}${transaction.image}`" />
                        <span v-else>No image</span>
                    </td>
                    <td class="p-3">
                        <div class="flex gap-2">
                            <button class="bg-indigo-600 text-white px-2 py-1 rounded-lg hover:bg-indigo-700" @click="$emit('edit', transaction.id)">Edit</button>
                            <button class="bg-red-600 text-white px-3 py-1 rounded-lg hover:bg-red-700" @click="executeDelete(transaction.id)">Delete</button> 
                        </div>
                    </td>
                </tr>
            </tbody>   
        </table>
    </section>
    </main>
</template>

<style scoped>

</style>