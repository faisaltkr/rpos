<template>
 
  <div :class="[$i18n.locale === 'ar' ? 'rtl' : 'ltr']" class="window w-5/6 h-screen overflow-hidden">
    <HeaderNav />
  

    <div class="form-container max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md">
      <h2 class="text-3xl font-semibold mb-6">{{ $t('createCustomer') }}</h2>

      <form @submit.prevent="registerCustomer">
        <!-- Customer Name -->
        <div class="form-group mb-6">
          <label for="customerName" class="block text-sm font-medium">{{ $t('customerName') }}</label>
          <input 
            type="text" 
            id="customerName" 
            v-model="customer.name" 
            class="mt-2 block w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring focus:border-blue-500"
            placeholder="Enter Customer Name"
            required 
          />
        </div>

        <!-- Customer Code -->
        <div class="form-group mb-6">
          <label for="customerCode" class="block text-sm font-medium">{{ $t('customerCode') }}</label>
          <input 
            type="text" 
            id="customerCode" 
            v-model="customer.code" 
            class="mt-2 block w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring focus:border-blue-500"
            placeholder="Enter Customer Code"
            required 
          />
        </div>

        <!-- Address -->
        <div class="form-group mb-6">
          <label for="address" class="block text-sm font-medium">{{ $t('address') }}</label>
          <textarea 
            id="address" 
            v-model="customer.address" 
            class="mt-2 block w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring focus:border-blue-500"
            placeholder="Enter Address"
            required 
          ></textarea>
        </div>

        <!-- Customer Type (Cash or Credit) -->
        <div class="form-group mb-6">
          <label for="customerType" class="block text-sm font-medium">{{ $t('customerType') }}</label>
          <select 
            id="customerType" 
            v-model="customer.type" 
            class="mt-2 block w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring focus:border-blue-500"
            required
          >
            <option value="cash">{{ $t('cashCustomer') }}</option>
            <option value="credit">{{ $t('creditCustomer') }}</option>
          </select>
        </div>

        <!-- Mobile -->
        <div class="form-group mb-6">
          <label for="mobile" class="block text-sm font-medium">{{ $t('mobile') }}</label>
          <input 
            type="text" 
            id="mobile" 
            v-model="customer.mobile" 
            class="mt-2 block w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring focus:border-blue-500"
            placeholder="Enter Mobile Number"
            required 
          />
        </div>

        <!-- Place -->
        <div class="form-group mb-6">
          <label for="place" class="block text-sm font-medium">{{ $t('place') }}</label>
          <input 
            type="text" 
            id="place" 
            v-model="customer.place" 
            class="mt-2 block w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring focus:border-blue-500"
            placeholder="Enter Place"
            required 
          />
        </div>

        <!-- Submit Button -->
        <button 
          type="submit" 
          class="w-full bg-blue-500 text-white p-3 rounded-lg font-semibold hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300"
        >
          {{ $t('register') }}
        </button>
      </form>
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
      customer: {
        name: '',
        code: '',
        address: '',
        type: 'cash',  // Default to 'cash'
        mobile: '',
        place: ''
      }
    };
  },
  methods: {
    async registerCustomer() {
      try {
        const response = await fetch('https://dummyjson.com/customers/add', { // Replace with actual API endpoint
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(this.customer)
        });

        if (response.ok) {
          alert('Customer registered successfully!');
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
        name: '',
        code: '',
        address: '',
        type: 'cash',
        mobile: '',
        place: ''
      };
    }
  }
};
</script>

<style scoped>
.form-container {
  background-color: #f9f9f9;
}

input[type="text"],
textarea,
select {
  background-color: #fff;
  border: 1px solid #ddd;
  padding: 10px;
  margin-bottom: 10px;
  font-size: 14px;
  border-radius: 5px;
}

button {
  cursor: pointer;
  transition: background-color 0.3s ease;
}

button:hover {
  background-color: #0056b3;
}
</style>
