<template>
    <div>
      <!-- Button to open the popup -->
      <button @click="showPopup = true">Open Popup</button>
  
      <!-- Popup Modal -->
      <div v-if="showPopup" class="modal-overlay" @click.self="closePopup">
        <div class="modal-content">
          <h3>Popup Title</h3>
          <p>This is a simple popup content.</p>
          <button @click="closePopup">Close</button>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        showPopup: false,
      };
    },
    methods: {
      closePopup() {
        this.showPopup = false;
      },
    },
  };
  </script>
  
  <style scoped>
  /* Basic styles for the modal */
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
  }
  
  .modal-content {
    background: white;
    padding: 20px;
    border-radius: 5px;
    width: 300px;
    text-align: center;
  }
  </style>
  