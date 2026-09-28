<script setup lang="ts">
import TransactionList from './views/TransactionList.vue';
import TransactionCreate from './views/TransactionCreate.vue';
import TransactionUpdate from './views/TransactionUpdate.vue';
import { ref } from 'vue';

const editingId = ref<string | null>(null);
</script>

<template>
  <TransactionList @edit="editingId = $event"/>
  <TransactionUpdate v-if="editingId" 
    :transactionId="editingId" 
    @cancel="editingId = null" 
  />
  <TransactionCreate v-else />
  
</template>

<style scoped></style>
