<template>
  <div :class="[$i18n.locale === 'ar' ? 'rtl' : 'ltr']" class="window w-screen h-screen overflow-hidden">
    <HeaderNav />
    
    <div class="dashboard grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 p-4">
      <div class="card bg-blue-500 text-white p-10 shadow-lg">
        <h3 class="text-lg font-semibold">{{ $t('totalSales') }}</h3>
        <p class="text-2xl font-bold">{{ formatCurrency(salesData.length) }}</p>
      </div>
      
      <div class="card bg-green-500 text-white p-10 shadow-lg">
        <h3 class="text-lg font-semibold">{{ $t('salesToday') }}</h3>
        <p class="text-2xl font-bold">{{ formatCurrency(salesToday) }}</p>
      </div>
      
      <div class="card bg-yellow-500 text-white p-10 shadow-lg">
        <h3 class="text-lg font-semibold">{{ $t('totalCustomers') }}</h3>
        <p class="text-2xl font-bold">{{ totalCustomers }}</p>
      </div>
      
      <div class="card bg-red-500 text-white p-10 shadow-lg">
        <h3 class="text-lg font-semibold">{{ $t('totalInvoices') }}</h3>
        <p class="text-2xl font-bold">{{ totalInvoices }}</p>
      </div>

      <div class="card bg-violet-600 text-white p-10 shadow-lg">
        <h3 class="text-lg font-semibold">{{ $t('totalSubmited') }}</h3>
        <p class="text-2xl font-bold">{{ totalSubmited }}</p>
      </div>
    </div>

    
    
    <div class="sales-table mt-10 m-2">
      <h2 class="text-xl font-semibold mb-4">{{ $t('recentSales') }}</h2>
      <table class="min-w-full bg-white rounded-lg shadow-md overflow-y-scroll">
        <thead>
          <tr>
            <th class="py-2 px-4 border-b">{{ $t('salesDate') }}</th>
            <th class="py-2 px-4 border-b">{{ $t('invoiceNo') }}</th>
            <th class="py-2 px-4 border-b">{{ $t('customer') }}</th>
            <th class="py-2 px-4 border-b">{{ $t('Amount') }}</th>
            <th class="py-2 px-4 border-b">{{ $t('SalesMan') }}</th>
            <th class="py-2 px-4 border-b">{{ $t('zatca_status') }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="sale in salesData" :key="sale.name" class="hover:bg-gray-100">
            <td class="py-2 px-4 border-b">{{ sale.posting_date }}</td>
            <td class="py-2 px-4 border-b">{{ sale.name }}</td>
            <td class="py-2 px-4 border-b">{{ sale.customer_name }}</td>

            <td class="py-2 px-4 border-b text-right">{{ sale.grand_total.toFixed(2) }}</td>
            <td class="py-2 px-4 border-b">{{ sale.pos_profile }}</td>
            <td class="py-2 px-4 border-b">{{ sale.custom_zatca_status }}</td>
          </tr>
        </tbody>
      </table>
    </div>
 

    
  <div v-if="showPopup && salesPersons.length > 0 && openingEntry" class="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-50">
      <div class="bg-gray-600 shadow-lg p-6 w-full max-w-2xl">
        <div>
            <label class="block text-white">Company</label>
            <select v-model="company" class="text-white w-full p-2 bg-gray-700 text-xl">
              <option value="">Select Company</option>
              <option v-for="company in getCompany()" :key="company.id" :value="company.company">
                {{ company.company }}
              </option>
            </select>
          </div>

          <div class="my-5">
            <label class="block text-white">Pos Profile</label>
            <select @change="getModeofpayments" v-model="pos_profile" class="text-white w-full p-2 bg-gray-700 text-xl">
              <option value="">Select Pos Profile</option>
              <option v-for="profile in this.salesPersons" selected="true" :key="profile.id" :value="profile.name">
                {{ profile.name }}
              </option>
            </select>
          </div>
        <div class="border rounded-lg p-4">
  <!-- Header Row -->
        <div class="grid grid-cols-2 gap-4 font-semibold text-gray-700">
          <div class="text-white">Mode of Payment</div>
          <div class="text-white">Opening Amount</div>
        </div>
        <!-- Divider -->
        <div class="border-b my-2"></div>
        <!-- Payment Rows -->
        <div v-for="(payment, index) in payment_methods" :key="index" class="grid grid-cols-2 gap-4 items-center py-2">
          <!-- Mode of Payment Column -->
          <div class="text-white">{{ payment.mode }}</div>
          <!-- Opening Amount Input Column -->
          <div class="flex items-center">
            
            <input v-if="payment.mode=='Cash'"
              type="number"
              v-model="cash"
              class="w-full p-2  border-gray-300 bg-gray-700 text-white"
            />
            <input v-else
              type="number"
              v-model="bankCard"
              class="w-full p-2  border-gray-300 bg-gray-700 text-white"
            />
          </div>
        </div>
          
      </div>

        <div class="grid grid-cols-1 gap-4 border mt-5 mb-5">

          <div >
          <button  @click="createPOSOpeningEntry()" class="w-full bg-green-500 text-white px-2 py-2 mr-2">Submit</button>
          </div>
          
          
        </div>
        
      </div>
    </div>

      <div v-if="salesPersons.length==0 && showPopup" class="relative z-10" aria-labelledby="modal-title" role="dialog" aria-modal="true">
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>

        <div class="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <div class="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
              <div class="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                <div class="sm:flex sm:items-start">
                  <div class="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                    <svg class="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true" data-slot="icon">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
                    </svg>
                  </div>
                  <div class="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                    <h3 class="text-base font-semibold leading-6 text-gray-900" id="modal-title">Warning</h3>
                    <div class="mt-2">
                      <p class="text-sm text-gray-500">POS Profiles are does'nt exists the logged user</p>
                    </div>
                  </div>
                </div>
              </div>
              <div class="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                <button type="button" class="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto">Logout</button>
                
              </div>
            </div>
          </div>
        </div>
      </div>


  </div>
</template>


<script>
import moment from "moment";
import HeaderNav from "../components/HeaderNav.vue";
import axios from "axios";



export default {
  components: {
    HeaderNav
  },
  data() {
    return {
      openingEntry:true,
      baseURL: localStorage.getItem('baseURL'),
      totalSales: 0,
      salesToday: 0,
      totalCustomers: 0,
      totalInvoices: 0,
      totalSubmited:0,
      recentSales: [],
      salesData:[],
      showPopup: true,
      posUser: "",
      cash: 0,
      bankCard: 0,
      netTotal: 0,
      taxAndCharges: this.vatTotal ? this.vatTotal : 0,
      totalAmount: '',
      discountAmount: 0,
      grandTotal: '',
      roundedTotal: '',
      isCreditSale: false,
      useCustomerCredit: false,
      salesPerson: '',
      salesPersons: [],
      company : '',
      payment_methods: [],
      user :JSON.parse(localStorage.getItem('user')) ,
      currency:"SAR",
      pos_profile:""
    };
  },
  mounted() {
    this.user = JSON.parse(localStorage.getItem('user'));
    this.fetchDashboardData();
    this.salesPersons = (localStorage.getItem('pos')) ?  (JSON.parse(localStorage.getItem('pos'))) : [];
    this.getCompany()
    this.openingEntry = (localStorage.getItem('openingEntry')) ?  false : true;
  },
  computed(){
    // totalSalesAmount(item){
    //     return this.totalSales = this.totalSales+item.amount;
    // }
  },
  methods: {
    async fetchDashboardData() {
      try {
        
        let url = this.baseURL+'/api/resource/Sales Invoice?limit=20&offset=0&fields=["name","grand_total","posting_date","customer_name","pos_profile","custom_zatca_status"]&order_by=name desc';
           axios.get(url, 
          { headers: {"Authorization" : `Basic ${localStorage.getItem('token')}`} }
          ).then(result => {
              //console.log(result.data.message);
              this.salesData = result.data.data;
              console.log(result);
            // this.salesToday = salesData.salesToday;
            // this.totalCustomers = salesData.totalCustomers;
            // this.totalInvoices = salesData.totalInvoices;
            // this.recentSales = salesData.recentSales;
              
          });
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    },
    
    formatCurrency(value) {
      if (!value) return '';
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: this.salesPersons[0].currency
      }).format(value);
    },
    closePopup() {
        this.showPopup = false;
     },
     getCompany(){
        this.company = this.salesPersons?.length > 0 ? this.salesPersons[0].company : ""
        this.currency = this.salesPersons?.length > 0 ? this.salesPersons[0].currency : ""
        this.pos_profile = this.salesPersons?.length > 0 ? this.salesPersons[0].name : ""
        
        if(this.salesPersons.length > 0)
        {
          console.log(this.salesPersons);
          
          this.payment_methods =  this.salesPersons[0].payment_methods.map(modes => ({
              mode: modes.mode_of_payment,
              amount: 0,
          }))
        }
        
        return this.salesPersons.filter((value, index, self) => self.findIndex(v => v.company === value.company) === index);
     },

     async createPOSOpeningEntry() {
  const data = {
    "company": this.company,
    "posting_date": moment(new Date()).format('YYYY-MM-DD'),
    "pos_profile": this.pos_profile,
    "user": this.user.email.toString(),
    "period_start_date": moment(new Date()).format('YYYY-MM-DD'),
    "balance_details": this.payment_methods
      .filter(method => method.mode) // Ensure mode_of_payment is present
      .map(method => ({
        mode_of_payment: method.mode,
        opening_amount: (method.mode === 'Cash') ? this.cash : this.bankCard
      })),
  };
  
  localStorage.setItem('openingEntry', JSON.stringify(data));
  this.openingEntry = (localStorage.getItem('openingEntry')) ? false : true;

  try {
    const url = `${this.baseURL}/api/resource/POS Opening Entry`;
    const token = localStorage.getItem('token'); 
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${token}`, 
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    
    const result = await response.json();
    console.log('POS Opening Entry created successfully:', result);

    // Submitting the POS Opening Entry
    //https://dev14.erpx.one/api/method/frappe.desk.form.save.savedocs
    const submitUrl = `${this.baseURL}/api/resource/POS Opening Entry/${result.data.name}/action`;
    const submitResponse = await fetch(submitUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ action: "Submit" }) // Specify the submit action
    });

    if (!submitResponse.ok) {
      throw new Error(`HTTP error while submitting! Status: ${submitResponse.status}`);
    }

    alert('POS Opening Entry created and submitted successfully');
    console.log('POS Opening Entry submitted successfully:', await submitResponse.json());
  } catch (error) {
    console.error('Error creating or submitting POS Opening Entry:', error);
  }
}


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
  


