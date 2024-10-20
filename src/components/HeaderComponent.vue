<template>
    <div class="flex items-center justify-between p-2 pb-4 bg-gray-700">
      <div class="flex-1 flex overflow-hidden">
        
          <div class="w-1/4 p-2 bg-gray-700 overflow-y-auto">
              <!-- <SearchBar @search="searchItems" @barcode-search="searchByBarcode" /> -->
              <input autofocus type="text" v-model="query" class="w-full p-2 text-white bg-gray-800" placeholder="Search products by name, code, or barcode..." @input="onSearch" @keydown.enter="handleBarcodeSearch" />
              
          </div>
          <div class="w-1/4 p-2 bg-gray-700 overflow-y-auto">
            <button class="w-full  p-2 text-white bg-gray-600" @click="clearSearch">
                Clear
              </button>
          </div>
        
          <div class="w-2/4 p-2 bg-gray-700 overflow-y-auto">
            <CustomerSelect @customer-selected="handleCustomerSelected" @customer-cleared="handleCustomerCleared" />
          </div>
        </div>
      <!-- <div class="space-x-2">
        <button class="btn bg-green-600 text-white" @click="onPayment">F10 Payment</button>
        <button class="btn bg-blue-600 text-white">F12 Cash</button>
        <button class="btn bg-yellow-600 text-white">F9 Save Sale</button>
      </div> -->
      <!-- <div>
        <input
          type="text"
          class="input bg-gray-800 text-white placeholder-gray-500"
          placeholder="Search products by name, code or barcode"
          @input="$emit('search', $event.target.value)"
        />
      </div> -->
    </div>
  </template>
  
  <script>
// import SearchBar from './SearchBar.vue';
import CustomerSelect from './CustomerSelect.vue';
  
  export default {
    components:{
      CustomerSelect,
    },
    data() {
      return {
        query: '', // Search query
        selectedCustomer: null,
      }
    },
    methods: {
      onSearch() {
        this.$emit('search', this.query) // Emit search event for general search
      },
      handleBarcodeSearch() {
        this.$emit('barcode-search', this.query) // Emit barcode-search event for barcode-specific searches
        this.query = '' // Clear the query after barcode is processed
        
      },
      clearSearch() {
        this.query = ''
        this.onSearch() // Clear search results in parent
      },
      onPayment() {
        this.$emit('payment')
      },
      handleCustomerSelected(customer) {
        this.selectedCustomer = customer;
      },
      handleCustomerCleared() {
        this.selectedCustomer = null;
      },
      removeItemFromCart(index) {
        this.cart.splice(index, 1);
      },
    }
  }
  </script>
  
  <style scoped>
  .btn {
    padding: 0.5rem 1rem;
    border-radius: 0.25rem;
  }
  .input {
    padding: 0.5rem;
    border-radius: 0.25rem;
    border: 1px solid #444;
    width: 300px;
  }
  </style>
  