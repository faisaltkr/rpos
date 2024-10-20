<template>
    <div v-if="showPayment" class="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-50">
      <div class="bg-gray-600 shadow-lg p-6 w-full max-w-2xl">
        <div class="grid grid-cols-2 gap-4">
          <!-- Payment fields -->
          <div>
            <label class="block text-white">Paid Amount</label>
            <input type="text" class="text-black w-full p-2 border" v-model="paidAmount" />
          </div>
          <div>
            <label class="block text-white">To Be Paid</label>
            <input type="text" class="text-black w-full p-2 border" v-model="toBePaid" />
          </div>
          <div>
            <label class="block text-white">Cash</label>
            <input type="text" class="text-black w-full p-2 border" v-model="cash" />
            <button class="mt-2 w-full bg-teal-500 text-white p-2">Cash</button>
          </div>
          <div>
            <label class="block text-white">Bank Card</label>
            <input type="text" class="text-black w-full p-2 border" v-model="bankCard" />
            <button class="mt-2 w-full bg-teal-500 text-white p-2">Bank Card</button>
          </div>
  
          <!-- Additional payment details -->
          <div>
            <label class="block text-white">Net Total</label>
            <input type="text" class="text-black w-full p-2 border" v-model="netTotal" />
          </div>
          <div>
            <label class="block text-white">Tax and Charges</label>
            <input type="text" class="text-black w-full p-2 border" v-model="taxAndCharges" />
          </div>
          <div>
            <label class="block text-white">Total Amount</label>
            <input type="text" class="text-black w-full p-2 border" v-model="totalAmount" />
          </div>
          <div>
            <label class="block text-white">Discount Amount</label>
            <input type="text" class="text-black w-full p-2 border" v-model="discountAmount" />
          </div>
          <div>
            <label class="block text-white">Grand Total</label>
            <input type="text" class="text-black w-full p-2 border" v-model="grandTotal" />
          </div>
          <div>
            <label class="block text-white">Rounded Total</label>
            <input type="text" class="text-black w-full p-2 border" v-model="roundedTotal" />
          </div>
  
          <!-- Toggle switches -->
          <div class="col-span-2 flex justify-between items-center mt-4">
            <label>
              <input type="checkbox" v-model="isCreditSale" class="mr-2" />
              Is Credit Sale
            </label>
            <label>
              <input type="checkbox" v-model="useCustomerCredit" class="mr-2" />
              Use Customer Credit
            </label>
          </div>
  
          <!-- Sales Person Dropdown -->
          <div class="col-span-2 mt-4">
            <label class="block text-white">Sales Person</label>
            <select v-model="salesPerson" class="w-full p-2 bg-gray-700">
              <option value="">Select Sales Person</option>
              <option v-for="person in salesPersons.pos_profiles" :key="person.id" :value="person.name">
                {{ person.name }}
              </option>
            </select>
          </div>

          <div>
            <button @click="saveInvoice()" class="w-full bg-green-500 text-white px-2 py-2 mr-2">Submit</button>
          </div>
          <div>
            <button @click="saveInvoice()" class="w-full bg-green-500 text-white px-2 py-2 mr-2">Submit & Print</button>
          </div>

          <div class="col-span-2">
            <button @click="closeModal" class="w-full bg-red-500 text-white px-2 py-2">Cance Payment</button>
          </div>
        </div>
        
      </div>
    </div>
  </template>
  
  <script>
  export default {
    props: {
        showPayment: {
        type: Boolean,
        default: false,
      },
      cart:Array,
      cartTotal:Number,
      vatTotal:Number
    },
    data() {
      return {
        posUser: "",
        paidAmount: this.cartTotal || 0,
        toBePaid: this.cartTotal ? this.cartTotal : 0,
        cash: 0,
        bankCard: 0,
        netTotal: 0,
        taxAndCharges: this.vatTotal ? this.vatTotal : 0,
        totalAmount: '',
        discountAmount: '',
        grandTotal: '',
        roundedTotal: '',
        isCreditSale: false,
        useCustomerCredit: false,
        salesPerson: '',
        salesPersons: JSON.parse(localStorage.getItem('pos')),
      };

    },

    watch: {
    // Watch for changes in props and update local data properties
    paidAmount(newVal) {
      this.paidAmount = newVal;
      
    },
    toBePaid(newVal) {
      this.toBePaid = newVal;
    },
  },

    methods: {
      closeModal() {
        this.$emit('showPayment',false);
      },

      getAssignAmout(){
        this.paidAmount = this.cartTotal;
      }
    }
  };
  </script>
  
  <style scoped>
  /* Add any custom styles here */
  </style>
  