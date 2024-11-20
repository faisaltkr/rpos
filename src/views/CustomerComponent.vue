<template>
 
  <div class="flex flex-col w-screen h-screen bg-gray-800 text-white">
    <HeaderNav />
  
    <div class="container mx-auto mt-2">
      <h1 class="text-white text-4xl my-4">Add Customer</h1>
    <div class="flex-1 flex overflow-hidden loading">
      
      <form @submit.prevent="createCustomer">
      <div class="grid grid-cols-2 gap-4 m-2 p-4">
        

            <div>
              <label for="" class="text-white">Customer Name</label>
              <input type="text" v-model="customer.customer_name" class="mt-2 p-2 text-white bg-gray-600">
            </div>

            <div>
              <label for="" class="text-white">Territory</label>
              <input type="text" v-model="customer.territory" class="mt-2 p-2 text-white bg-gray-600">
            </div>
            <!-- <div>
              <label for="" class="text-white">Zatca Simplified ( B2C )</label>
              <input type="checkbox" v-model="customer.custom_b2c" class="mt-2 p-2 text-white bg-gray-600">
            </div> -->
            <div>
                <div class="flex items-center mt-8 bg-gray-600 p-2">
                  
                    <input id="inline-checkbox" type="checkbox" v-model="customer.custom_b2c" @click="calculateTaxInclusive" class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600 pr-4">
                    <label for="inline-checkbox" class="ms-2 text-sm font-medium text-white dark:text-gray-300">Zatca Simplified ( B2C )</label>
                </div>
              </div>

            <div>
              <label for="" class="text-white">Customer Name in Arabic</label>
              <input type="text" v-model="customer.customer_name_in_arabic" class="mt-2 p-2 text-white bg-gray-600">
            </div>
            <div>
              <label for="" class="text-white">Customer Type</label>
              <input type="text" v-model="customer.customer_type" class="mt-2 p-2 text-white bg-gray-600">
            </div>

            <div>
              <label for="" class="text-white">Customer Group</label>
              <input type="text" v-model="customer.customer_group" class="mt-2 p-2 text-white bg-gray-600">
            </div>
            <div>
              <label for="" class="text-white">Mobile</label>
              <input type="text" v-model="customer.mobile_no" class="mt-2 p-2 text-white bg-gray-600">
            </div>

            <div>
              <label for="" class="text-white">Email Id</label>
              <input type="text" v-model="customer.email_id" class="mt-2 p-2 text-white bg-gray-600">
            </div>

            <div>
              <label for="" class="text-white">Street Name</label>
              <input type="text" v-model="customer.address_line1" class="mt-2 p-2 text-white bg-gray-600">
            </div>

            <div>
              <label for="" class="text-white">Building Number</label>
              <input type="text" v-model="customer.address_line2" class="mt-2 p-2 text-white bg-gray-600">
            </div>
            <div>
              <label for="" class="text-white">City</label>
              <input type="text" v-model="customer.city" class="mt-2 p-2 text-white bg-gray-600">
            </div>

            <div>
              <label for="" class="text-white">Country</label>
              <input type="text" v-model="customer.country" class="mt-2 p-2 text-white bg-gray-600">
            </div>
            <div class="text-right">
              <button class="p-2 px-10  bg-green-600 ">Save</button>
           </div>
            
        
      </div>
    </form>
    </div>
  </div>

  </div>

  
</template>

<script>
import HeaderNav from "../components/HeaderNav.vue";


export default {
  components: {
    HeaderNav
  },
  data() {
    return {
      baseURL:localStorage.getItem('baseURL'),
      customer: {
        customer_name: '',
        customer_group: 'All Customer Groups',
        territory: 'All Territories',
        customer_name_in_arabic:"",
        custom_b2c:0,
        customer_type: 'Individual',  // Default to 'cash'
        mobile_no: '',
        email_id: '',
        address_line1:"",
        city:"",
        country:"Saudi Arabia"
      }
    };
  },
  methods: {
    async createCustomer() {
      try {

        const response = await fetch(this.baseURL+'/api/resource/Customer', { // Replace with actual API endpoint
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Basic ${localStorage.getItem('token')}`
          },
          body: JSON.stringify(this.customer)
        });

        if (response.ok) {
          alert('Customer Added successfully!');
          this.clearForm();
        } else {
          const errorData = await response.json();
          alert('Error registering customer: ' + errorData.message);
        }
      } catch (error) {
        console.error('Error:', error);
        alert('An error occurred while registering the customer.');
      }
    },
    clearForm() {
      this.customer = {
        customer_name: '',
        customer_group: 'All Customer Groups',
        territory: 'All Territories',
        customer_name_in_arabic:"",
        custom_b2c:0,
        customer_type: 'Individual',  // Default to 'cash'
        mobile_no: '1234567890',
        email_id: '',
        address_line1:"",
        city:"",
        country:"SA"
      };
    }
  }
};
</script>

<style scoped>

</style>
