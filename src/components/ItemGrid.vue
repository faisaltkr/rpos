<template>
    <div class="grid grid-cols-4 gap-4">
     
      <div
        v-for="item in items"
        :key="item.item_code"
        class="bg-white p-4 shadow rounded cursor-pointer"
        @click="addToCart(item)"
      >
      
        <img :src="'https://as1.ftcdn.net/v2/jpg/00/70/62/40/1000_F_70624079_oK7bRAjfxEF6thKmaWewjBqgAlMHPSl4.jpg'" alt="Item Image" class="w-full h-24 object-cover" />
        <div class="mt-2 text-gray-700 font-bold">{{ item.item_name }}</div>
        <div class="text-gray-500">{{ item.standard_rate }} ر.س</div>
        <div class="text-gray-500">{{ item.stock_uom }}</div>
      </div>
    </div>
  </template>
  <script>
  export default {
    props: {
      items: Array,
    },
    methods: {
      addToCart(item) {
        this.$emit('add-to-cart', item);
      },
    },
  };
  </script>
  