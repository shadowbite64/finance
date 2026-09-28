<script setup lang="ts">
import TransactionList from './views/TransactionList.vue';
import TransactionCreate from './views/TransactionCreate.vue';
import TransactionUpdate from './views/TransactionUpdate.vue';
import { ref } from 'vue';

const editingId = ref<string | null>(null);

const showCreateModal = ref(false)
</script>

<template>
  <div class="min-h-screen bg-slate-100 text-slate-800 p-4 sm:p-6">
    <div class="max-w-7xl mx-auto space-y-6">
      <header class="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <h1 class="text-2xl font-bold text-slate-800">Finance Tracker</h1>
          </div>
          <button 
            @click="showCreateModal = true" 
            class="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-4 py-2 rounded-lg shadow-sm transition"
          >
             Add Transaction
          </button>
        </header>
        <TransactionList @edit="editingId = $event"/>
        <TransactionCreate v-if="showCreateModal" @close="showCreateModal = false"/>  
        <TransactionUpdate v-if="editingId" 
          :transactionId="editingId" 
          @cancel="editingId = null" 
        />
      </div>
  </div>
  
  
</template>

<style scoped></style>
