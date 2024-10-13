<template>
    <div class="flex items-center justify-between p-4 bg-gray-700">
      <div class="space-x-2">
        <button class="btn bg-green-600 text-white" @click="onPayment">F10 Payment</button>
        <button class="btn bg-blue-600 text-white">F12 Cash</button>
        <button class="btn bg-yellow-600 text-white">F9 Save Sale</button>
      </div>
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
  export default {
    methods: {
      onPayment() {
        this.$emit('payment')
      }
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
  