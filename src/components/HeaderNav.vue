<template>
  <header class="header-nav p-2 bg-gray-900">
    <div class="grid grid-cols-3 gap-4">
      <div class="col-start-1 col-end-3">
        <nav class="pt-1">
          <ul class="menu inline-flex">
            <li class="bg-gray-200">
              <img src="../../public/images/favicon.jpg" class="h-6" alt="" />
            </li>
            <li>
              <router-link active-class="active-link" to="/dashboard">
                <b-icon icon="camera" font-scale="7.5"></b-icon>
                Dashboard
              </router-link>
            </li>
            <li>
              <b-icon icon="camera" font-scale="7.5"></b-icon>
              <router-link active-class="active-link" to="/sales">Sales</router-link>
            </li>
            <li><router-link active-class="active-link" to="/customer">Customer</router-link></li>
            <li><router-link active-class="active-link" to="/pos">POS</router-link></li>
            <li><router-link active-class="active-link" to="/report">Report</router-link></li>
            <li><router-link active-class="active-link" to="/settings">Settings</router-link></li>
          </ul>
        </nav>
      </div>
      <div>
        <ul>
          <li class="text-white">
            POS Profile:
            <button class="bg-gray-600 text-white py-1 px-2 mt-1">{{ pos_profile }}</button>
          </li>
        </ul>
      </div>
      <div class="col-end-7 col-span-2 relative flex justify-end items-center">
        <button class="text-white m-2" @click="switchLanguage('en')">English</button>
        <button class="text-white" @click="switchLanguage('ar')">العربية</button>
        <div class="relative">
          <button
            class="text-white bg-gray-600 py-1 px-2 ml-2"
            @click="toggleDropdown"
          >
            Menu
          </button>
          <div
            v-if="isDropdownOpen"
            class="absolute right-0 mt-2 w-48 bg-gray-700 rounded-md shadow-lg z-20"
          >
            <ul class="py-1">
              <li>
                <button
                  class="block px-4 py-2 text-white hover:bg-gray-100 hover:text-black w-full text-center"
                  @click="closeShift"
                >
                  Close Shift
                </button>
              </li>
              <li>
                <button
                  class="block px-4 py-2 text-white hover:bg-gray-100 hover:text-black w-full text-center"
                  @click="logout"
                >
                  Logout
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script>
 import router from '@/router';
import axios from 'axios'; // Import Axios


export default {
  name: 'HeaderNav',
  data() {
    return {
      baseURL:localStorage.getItem('baseURL'),
      pos_profile: "",
      openingEntry: "",
      isDropdownOpen: false,
      totalAmount:0
    };
  },
  mounted() {
    this.openingEntry = localStorage.getItem('openingEntry') ? JSON.parse(localStorage.getItem('openingEntry')) : "";
    this.pos_profile = this.openingEntry ? this.openingEntry.pos_profile : "";

    this.calculateTotalAmount()
  },
  methods: {

    calculateTotalAmount() {
  try {
    const today = new Date().toISOString().slice(0, 10); // Get today's date in YYYY-MM-DD format
    let url = `${this.baseURL}/api/resource/Sales Invoice?&offset=0&fields=["name","grand_total","posting_date","customer_name","pos_profile","custom_zatca_status"]&order_by=name desc`;

    axios.get(url, {
      headers: { "Authorization": `Basic ${localStorage.getItem('token')}` }
    }).then(result => {
      // Get the sales data
      const salesData = result.data.data;

      // Filter sales data to only include today's entries
      const todaysSales = salesData.filter(invoice => invoice.posting_date === today);

      // Calculate the total amount for today's sales
      const totalAmount = todaysSales.reduce((sum, invoice) => sum + invoice.grand_total, 0);

      const openingEnry = (this.openingEntry) ? this.openingEntry.balance_details : {}

      const opening_amount = openingEnry.reduce((sum, invoice) => sum + invoice.opening_amount, 0);
      this.totalAmount = (totalAmount + parseFloat(opening_amount)); // Store it in a data property if needed
      console.log('Total sales amount for today:', this.totalAmount);
    }).catch(error => {
      console.error('Error fetching sales invoices:', error);
    });
  } catch (error) {
    console.error('Error calculating total amount:', error);
  }
},

    switchLanguage(lang) {
      this.$i18n.locale = lang;
      document.documentElement.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
    },
    toggleDropdown() {
      this.isDropdownOpen = !this.isDropdownOpen;
    },
    async closeShift() {

      const closeShiftData = {
        doctype: "POS Closing Entry",
        pos_profile: this.pos_profile,
        posting_date: new Date().toISOString().slice(0, 10), // Current date
        posting_time: new Date().toLocaleTimeString("en-GB"), // Current time
        user:localStorage.getItem('email'),
        total_amount:this.totalAmount,
        // Add other fields as required by your POS Closing Entry
      };


      const url = `${this.baseURL}/api/resource/POS Closing Entry`;
        const token = localStorage.getItem('token'); // Replace with yo
        await fetch(url, {
          method: 'POST',
          headers: {
            'Authorization': `Basic ${token}`, // Set your authorization header
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(closeShiftData)
        }).then(response => {
          console.log(response);
          
            if (response.ok != false) {
              alert('Shift closed successfully');
            } else {
              alert('Failed to close shift');
            }
            localStorage.removeItem('openingEntry');
            router.push("/dashboard");
            window.location.href
            this.showPopup =true

            this.isDropdownOpen = false;
        }).catch(error => {
          console.error('Error closing shift:', error);
          alert('An error occurred while closing the shift');
          this.isDropdownOpen = false; // Close the dropdown after action
        });

      // axios.post(this.baseURL+'/api/api/resource/POS Closing Entry', closeShiftData)
      //   .then(response => {
      //     if (response.data.message === 'success') {
      //       alert('Shift closed successfully');
      //     } else {
      //       alert('Failed to close shift');
      //     }
      //     this.isDropdownOpen = false; // Close the dropdown after action
      //   })
      //   .catch(error => {
      //     console.error('Error closing shift:', error);
      //     alert('An error occurred while closing the shift');
      //     this.isDropdownOpen = false; // Close the dropdown after action
      //   });
    },


    logout() {
      localStorage.removeItem('token');
      this.$router.push('/login');
      this.isDropdownOpen = false;
    }
  }
};
</script>

<style scoped>
.header-nav {
  box-shadow: -1px -1px 7px 0px;
}
.header-nav nav ul {
  display: flex;
  list-style: none;
  padding: 0;
  margin: 0;
}
.header-nav nav ul li {
  margin-right: 20px;
}
.header-nav nav ul li a {
  color: white;
  text-decoration: none;
}

.relative {
  position: relative;
}
</style>
