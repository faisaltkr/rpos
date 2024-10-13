<template>
    <div>
      <h2 class="text-lg font-semibold mb-4">Customer Search</h2>
      <input
        v-model="query"
        @input="searchCustomers"
        placeholder="Search customers..."
        class="w-full p-2 border rounded"
      />
      <ul class="mt-2">
        <li
          v-for="customer in results"
          :key="customer.id"
          @click="selectCustomer(customer)"
          class="p-2 cursor-pointer hover:bg-gray-200 rounded"
        >
          {{ customer.name }}
        </li>
      </ul>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        query: '',
        results: []
      }
    },
    methods: {
      async searchCustomers() {
        if (this.query.length < 3) {
          this.results = [];
          return;
        }
  
        try {
          const response = await fetch(`https://api.example.com/customers?search=${this.query}`);
          const data = await response.json();
          this.results = data;
        } catch (error) {
          console.error('Error fetching customers:', error);
        }
      },
      selectCustomer(customer) {
        this.$emit('customer-selected', customer);
        this.query = '';
        this.results = [];
      }
    }
  }
  </script>
  