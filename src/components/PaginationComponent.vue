<template>
    <div class="flex justify-center mt-4">
      <button
        class="px-4 py-2 mx-1 text-white bg-blue-600 rounded hover:bg-blue-700"
        @click="goToPreviousPage"
        :disabled="currentPage === 1"
      >
        Previous
      </button>
      <span class="mx-2 text-gray-700">Page {{ currentPage }} of {{ totalPages }}</span>
      <button
        class="px-4 py-2 mx-1 text-white bg-blue-600 rounded hover:bg-blue-700"
        @click="goToNextPage"
        :disabled="currentPage === totalPages"
      >
        Next
      </button>
    </div>
  </template>
  
  <script>
  export default {
    name: 'PaginationComponent',
    props: {
      currentPage: Number,
      totalPages: Number,
    },
    methods: {
      goToPreviousPage() {
        this.$emit('change-page', this.currentPage - 1);
      },
      goToNextPage() {
        this.$emit('change-page', this.currentPage + 1);
      },
    },
  };
  </script>
  
  <style scoped>
  button:disabled {
    opacity: 0.5;
  }
  </style>
  