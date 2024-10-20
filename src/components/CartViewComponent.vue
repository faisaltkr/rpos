<template>
    <div class="bg-white shadow rounded p-4 w-full">
      <h3 class="font-bold text-lg mb-2">Customer: {{ customer }}</h3>
      <table class="w-full text-left border-collapse">
        <thead>
          <tr>
            <th class="border-b p-2">Name</th>
            <th class="border-b p-2">QTY</th>
            <th class="border-b p-2">UOM</th>
            <th class="border-b p-2">Rate</th>
            <th class="border-b p-2">Amount</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in cartItems" :key="item.id">
            <td class="border-b p-2">{{ item.item_name }}</td>
            <td class="border-b p-2">{{ item.qty }}</td>
            <td class="border-b p-2">{{ item.stock_uom }}</td>
            <td class="border-b p-2">{{ item.standard_rate }}</td>
            <td class="border-b p-2">{{ item.amount }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </template>
  <script>
  export default {
    props: {
      customer: String,
      cartItems: Array,
    },
  };
  </script>
  <style scoped>
    .cart {
      border: 1px solid #ccc;
      padding: 10px;
      flex: 1;
    }
    table {
      width: 100%;
      border-collapse: collapse;
    }
    th, td {
      border: 1px solid #ccc;
      padding: 5px;
    }
  </style>