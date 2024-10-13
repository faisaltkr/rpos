<template>
    <div class="flex items-center p-2 bg-gray-700">
        
      <input
        type="text"
        v-model="query"
        class="w-full p-2 text-black bg-gray-800"
        placeholder="Search products by name, code, or barcode..."
        @input="onSearch"
        @keydown.enter="handleBarcodeSearch"
      />
      <button class="ml-2 p-2 text-white bg-gray-600 rounded" @click="clearSearch">
        Clear
      </button>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        query: '' // Search query
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
      }
    }
  }
  </script>
  
  <style scoped>
  input {
    border: 1px solid #444;
    background-color: #f9f9f9;
  }
  </style>
  