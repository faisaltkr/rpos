<template>
  <div class="w-full h-screen overflow-hidden flex min-h-screen flex-col items-center justify-center bg-gray-50">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-full ">
      <div class="md:shrink-0">
        <img class="h-full w-full object-cover md:h-full md:w-full" src="../../public/images/whatis.jpg" alt="Modern building architecture">
      </div>
      <div>
        <div class="flex min-h-full flex-1 flex-col justify-center">
          <div class="sm:mx-auto sm:w-full sm:max-w-sm">
            <img class="mx-auto h-15 w-auto" src="../../public/images/exone_logo.jpg" alt="Your Company" />
            <h2 class="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">Sign in to your account</h2>
          </div>
          <div class="sm:mx-auto sm:w-full sm:max-w-sm">
            <form @submit.prevent="login" class="space-y-6" method="POST">
              <div>
                <label for="baseurl" class="block text-sm font-medium leading-6 text-gray-900">Your Domain URL</label>
                <div class="mt-2">
                  <input id="baseURL" v-model="baseURL" type="text" autocomplete="baseURL" required class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
                </div>
              </div>
              <div>
                <label for="email" class="block text-sm font-medium leading-6 text-gray-900">Username</label>
                <div class="mt-2">
                  <input id="email" v-model="username" type="text" autocomplete="email" required class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
                </div>
              </div>
              <div>
                <div class="flex items-center justify-between">
                  <label for="password" class="block text-sm font-medium leading-6 text-gray-900">Password</label>
                  <div class="text-sm">
                    <a href="#" class="font-semibold text-indigo-600 hover:text-indigo-500">Forgot password?</a>
                  </div>
                </div>
                <div class="mt-2">
                  <input id="password" v-model="password" type="password" autocomplete="current-password" required class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
                </div>
              </div>
              <div>
                <button type="submit" class="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                  <span v-if="!loading">Sign in</span>
                  <span v-else>
                    <svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.961 7.961 0 014 12H0c0 3.042 1.135 5.824 3 7.937l3-2.646z"></path>
                    </svg>
                  </span>
                  <span class="text-white">{{ message }}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import router from "../router";

export default {
  data() {
    return {
      baseURL: (localStorage.getItem('baseURL')) ? localStorage.getItem('baseURL') : "",
      username: '',
      password: '',
      loading: false,
      message:""
    };
  },
  methods: {
    login() {
      this.loading = true;
      let data={
          username:this.username,
          password:this.password
      }
        let url=this.baseURL+"/api/method/exone_api.auth.authenticate";
        axios.defaults.headers.post['Content-Type'] = 'application/json';
        axios.post(url, data).then(response => {
          //console.log(response.data.message);
        if(response.data.message.success==true)
        {
          this.message = "Syncing Items, Customers, Pos Profile etc"
          localStorage.setItem('baseURL',this.baseURL);
          localStorage.setItem('token',response.data.message.token);
          
          let customersUri = this.baseURL+'/api/resource/Customer?fields=["name", "customer_name", "customer_type", "customer_group", "territory","naming_series","custom_b2c"]';
          axios.get(customersUri, 
          { headers: {"Authorization" : `Basic ${localStorage.getItem('token')}`} }
          ).then(result => {
              
              let customers = result.data;
              const jsonData = JSON.stringify(customers, null, 2); // Pretty print JSON
              localStorage.setItem('customers',jsonData)
          });

          let items = this.baseURL+"/api/method/exone_api.masters.get_items_with_tax_template";
          axios.get(items, 
          { headers: {"Authorization" : `Basic ${localStorage.getItem('token')}`} }
          ).then(result => {
              //console.log(result.data.message);
              let items = result.data.message;
              const jsonItems = JSON.stringify(items, null, 2); // Pretty print JSON
              localStorage.setItem('items',jsonItems)
          });


          //fetching pos profile

          let pos_profile = this.baseURL+"/api/method/exone_api.masters.get_pos_profile_and_printer_configs";
          axios.get(pos_profile, 
          { headers: {"Authorization" : `Basic ${localStorage.getItem('token')}`} }
          ).then(result => {
              //console.log(result.data.message);
              let pos = result.data.message;
              const jsonPos= JSON.stringify(pos, null, 2); // Pretty print JSON
              localStorage.setItem('pos',jsonPos)
          });

          

          router.push("/dashboard");
        }
        }).catch(error => {
        if (error.response) {
            // Server responded with a status other than 2xx
            console.error('Response error', error.response.data);
        } else if (error.request) {
            // No response from server
            console.error('Request error', error.request);
        } else {
            // Axios encountered an error setting up the request
            console.error('Axios error', error.message);
        }
    });
    },

  }
};
</script>

<style>
html, body {
  height: 100%;
  margin: 0;
  width: 100%;
}
body {
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f0f0f0;
}
form input {
  padding-left: 8px;
}
</style>
