<template>
    <div class="mb-4">
      <input
        v-model="searchQuery"
        @input="onSearch"
        placeholder="Search Items"
        class="w-full p-2 border rounded"
      />
    </div>
  </template>
  <script>
  export default {
    data() {
      return {
        searchQuery: '',
      };
    },
    methods: {
      onSearch() {
        this.$emit('search', this.searchQuery);
      },
    },
  };
  </script>
  