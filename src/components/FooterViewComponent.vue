<template>
    <div class="flex justify-between bg-gray-800 p-4 shadow mt-4">
      <button class="pl-2 bg-gray-700" @click="$emit('toggle-view')">{{ viewMode==='Grid' ? 'List' : 'Grid' }}</button>
      <div class="flex space-x-2">
        <button @click="hold" class="bg-yellow-500 text-white px-4 py-2 rounded">Hold</button>
        <button @click="returnItem" class="bg-blue-500 text-white px-4 py-2 rounded">Return</button>
      </div>
    </div>
  </template>

<script>
export default {
  
  props: {
    total: Number,
    additionalDiscount: Number,
    viewMode:String,
  },
  methods: {
    pay() {
      // Implement pay logic
    },
    cancel() {
      // Implement cancel logic
    },
    hold() {
      // Implement hold logic
    },
    returnItem() {
      // Implement return logic
    },
  },
};
</script>
<style scoped>
  .footer {
    display: flex;
    justify-content: space-around;
    padding: 10px;
    background-color: #f5f5f5;
  }
  button {
    padding: 5px 10px;
    margin: 0 5px;
  }
</style>