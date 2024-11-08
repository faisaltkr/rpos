<template>
    
  <div class="flex flex-col w-screen h-screen bg-gray-800 text-white">
    
  <HeaderNav></HeaderNav>
   
  <h1 class="text-3xl m-5">Settings</h1>
    <div class="flex-1 flex overflow-hidden loading">
      
      <div class="w-2/4 p-4 bg-gray-800 overflow-y-auto">
        
        <form @submit.prevent="saveSettings" class="border m-4 p-4">
          <div class="mb-4">
          <label for="">Printer Name</label>
          <input type="text" v-model="settings.printer" class="p-2 bg-gray-500">
        </div>

        <div class="mb-2">
          <label for="">Print Format</label>
          <input type="text" v-model="settings.printFormat" class="p-2 bg-gray-500">
        </div>

          <button 
          type="submit" 
          class=" bg-blue-500 text-white p-3 mt-2 font-semibold hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300"
        >
          {{ 'Save Settings' }}
        </button>
        </form>

        <div class="border m-4 p-4"> 
          <button @click="synchData()" class="p-2 bg-green-400">Sync Items and Customers</button>
        </div>
      </div>


      <div class="w-2/4 p-4 bg-gray-800 overflow-y-auto">

          

      </div>


      
    </div>

  
  </div>
</template>

<script>
import 'font-awesome/css/font-awesome.css';
import HeaderNav from '@/components/HeaderNav.vue';
import axios from 'axios';

export default {
  components: {
    HeaderNav,
  },
  data() {
    return {
      baseURL:localStorage.getItem('baseURL'),
      settings:{
        printer : "",
        printFormat:""
      }
    }
  },

  created(){
    const savedSettings = localStorage.getItem('settings');
    if (savedSettings) {
      this.settings = JSON.parse(savedSettings);
    } else {
      this.settings = {
        printer: ''
      };
    }
  },

  methods: {

    async saveSettings() {
      localStorage.setItem('settings',JSON.stringify(this.settings))
      alert('Settings Saved Successfully');
    },

    async synchData(){

      let customersURL =this.baseURL + "/api/method/exone_api.masters.get_customers";
          axios.get(customersURL, {
            headers: {
              Authorization: `Basic ${localStorage.getItem("token")}`,
            },
          })
          .then((result) => {
            let customers = result.data.message;
            const jsonData = JSON.stringify(customers, null, 2); // Pretty print JSON
            localStorage.setItem("customers", jsonData);
          });

      let itemURL =this.baseURL +"/api/method/exone_api.masters.get_items_with_tax_template";
      axios.get(itemURL, {
        headers: {
          Authorization: `Basic ${localStorage.getItem("token")}`,
        },
      })
      .then((result) => {
        let items = result.data.message;
        const jsonItems = JSON.stringify(items, null, 2); // Pretty print JSON
        localStorage.setItem("items", jsonItems);
      });


      alert('Data Synched Successfully');


    },

    clearSettings()
    {
      this.settings = {
        printer: '',
        printFormat: ''
      }
    },

    
  }
 
}
</script>
