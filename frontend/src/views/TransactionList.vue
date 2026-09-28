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

onMounted(() => {
  loadTransactions();
});
</script>

<template>
    <div v-if="loading">Loading transactions...</div>
    <div v-if="error">{{ error }}</div>
    <div v-if="transactions.length === 0">No transactions recorded yet.</div>

    <section v-else>
        <div>
            <p>Total Income: {{ totalIncome }}</p>
            <p>Total Expense: {{ totalExpense }}</p>
            <p>Balance: {{ balance }}</p>
        </div>
        
        <table>
            <thead>
                <tr>
                    <th>Transaction Date</th>
                    <th>Type</th>
                    <th>Amount</th>
                    <th>Category</th>
                    <th>Description</th>
                    <th>Image</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="transaction in transactions" :key="transaction.id">
                    <td>{{ transaction.transactionDate }}</td>
                    <td>{{ transaction.type }}</td>
                    <td>{{ transaction.amount }}</td>
                    <td>{{ transaction.category }}</td>
                    <td>{{ transaction.description }}</td>
                    <td>
                        <img v-if="transaction.image" :src="`${ASSET_URL}${transaction.image}`" />
                        <span v-else>No image</span>
                    </td>
                    <td>
                        <button @click="$emit('edit', transaction.id)">Edit</button>
                        <button @click="executeDelete(transaction.id)">Delete</button>
                    </td>
                </tr>
            </tbody>   
        </table>
    </section>
</template>

<style scoped>

</style>