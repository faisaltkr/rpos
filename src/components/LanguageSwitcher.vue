<template>
  <div class="grid grid-cols-4 gap-4">
    <div
      v-for="item in items"
      :key="item.id"
      class="p-4 bg-gray-800 rounded-lg shadow cursor-pointer hover:bg-gray-700"
      @click="$emit('add-to-cart', item)"
    >
      <h3 class="text-lg font-semibold">{{ item.name }}</h3>
      <p class="text-sm text-gray-500">{{ item.code }}</p>
      <p class="text-xl font-bold">{{ formatCurrency(item.price) }}</p>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    items: {
      type: Array,
      required: true
    }
  },
  methods: {
    formatCurrency(value) {
      return `$${value ? value.toFixed(2) : '0.00'}`; // Handle undefined values
    }
  }
}
</script>
