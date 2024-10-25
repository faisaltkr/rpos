<template>
    <div class="mb-4">
      <div class="relative">
        
        <input
          type="text"
          v-model="searchQuery"
          @input="filterCustomers"
          placeholder="Search for a customer..."
          class="w-full p-2  text-white bg-gray-900" 
        />
        <button
          v-if="selectedCustomer"
          @click="clearCustomer"
          class="absolute right-2 top-2 text-gray-500 hover:text-red-500"
        >✖
        </button>
      </div>
      <ul v-if="filteredCustomers.length > 0" class="absolute border bg-gray-800 rounded-md mt-2 max-h-48 overflow-y-auto w-100">
        <li
          v-for="customer in filteredCustomers"
          :key="customer.id"
          @click="selectCustomer(customer)"
          class="p-2 cursor-pointer hover:bg-gray-600"
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
        searchQuery: 'CASH',
        customers: [],
        filteredCustomers: [],
        selectedCustomer: 'CASH'
      };
    },
    created() {
      this.fetchCustomersFromLocalStorage();
    },
    methods: {
      fetchCustomersFromLocalStorage() {
        const customersData = localStorage.getItem('customers');
        this.customers = customersData ? JSON.parse(customersData) : [];
      },
      filterCustomers() {
        this.filteredCustomers = this.customers.filter(customer =>
          customer.customer_name.toLowerCase().includes(this.searchQuery.toLowerCase())
        );
      },
      selectCustomer(customer) {
        this.selectedCustomer = customer;
        this.searchQuery = customer.name;
        this.filteredCustomers = [];
        this.$emit('customer-selected', customer);
      },
      clearCustomer() {
        this.selectedCustomer = null;
        this.searchQuery = '';
        this.filteredCustomers = [];
        this.$emit('customer-cleared');
      },
    },
  };
  </script>
  
  <style scoped>
  ul {
    list-style-type: none;
    padding-left: 0;
  }
  li{
    z-index: 10000;
  }
  </style>
  