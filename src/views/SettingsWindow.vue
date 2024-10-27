<template>
    
  <div class="flex flex-col w-screen h-screen bg-gray-800 text-white">
    
  <HeaderNav></HeaderNav>
   
  <h1 class="text-3xl m-5">Settings</h1>
    <div class="flex-1 flex overflow-hidden loading">
      
      <div class="w-2/4 p-4 bg-gray-800 overflow-y-auto">
        
        <form @submit.prevent="saveSettings">
          <label for="">Enter Printer Name</label>
          <input type="text" v-model="settings.printer" class="p-2 bg-gray-500">

          <button 
          type="submit" 
          class=" bg-blue-500 text-white p-3 mt-2 font-semibold hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300"
        >
          {{ $t('register') }}
        </button>
        </form>
      </div>


      <div class="w-2/4 p-4 bg-gray-800 overflow-y-auto">

        <!-- Printer Name : {{ settings.printer }} -->

      </div>


      
    </div>

  
  </div>
</template>

<script>
import 'font-awesome/css/font-awesome.css';
import HeaderNav from '@/components/HeaderNav.vue';

export default {
  components: {
    HeaderNav,
  },
  data() {
    return {
      settings: JSON.parse(localStorage.getItem('settings'))
    }
  },

  methods: {

    async saveSettings() {
      localStorage.setItem('settings',JSON.stringify(this.settings))
      this.settings = JSON.parse(localStorage.getItem('settings'))
      alert('Settings Saved Successfully');
    },

    clearSettings()
    {
      this.settings = {
        printer: '',
        place: ''
      }
    },

    
  }
 
}
</script>
