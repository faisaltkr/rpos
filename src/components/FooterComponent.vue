<template>
    <div class="flex justify-between p-4-lg ">
      <button class="btn bg-red-600 text-white" @click="$emit('clear-order')">Clear Order</button>
      <button class="btn bg-gray-600 text-white" @click="$emit('lock')">Lock</button>
      <button class="btn bg-gray-600 text-white" @click="$emit('repeat-round')">Repeat Round</button>
    </div>
  </template>
  
  <style scoped>
  .btn {
    padding: 0.5rem 1rem;
    border-radius: 0.25rem;
  }
  </style>
  