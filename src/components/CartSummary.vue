<template>
    <div class="flex flex-col h-full">
      <div class="flex-1 overflow-y-auto">
        <div v-if="cart.length === 0" class="text-gray-500 text-center">
          No items
        </div>
        <div v-else>
          <div v-for="(item, index) in cart" :key="index" class="flex justify-between items-center border-b p-2">
            <span>{{ item.name }}</span>
            <span>${{ item.total.toFixed(2) }}</span>
            <button class="text-red-500"  @click="emitRemoveItem(index)"><i class="fa fa-trash"></i></button>
          </div>
        </div>
      </div>
  
      <div class="bg-gray-800 p-4 mt-4 rounded-lg">
        <div class="flex justify-between mb-2">
          <span>Subtotal:</span>
          <span>${{ subtotal.toFixed(2) }}</span>
        </div>
        <div class="flex justify-between mb-2">
          <span>VAT:</span>
          <span>${{ vat.toFixed(2) }}</span>
        </div>
        <div class="flex justify-between font-bold mb-4">
          <span>Total:</span>
          <span>${{ total.toFixed(2) }}</span>
          
        </div>
        <div class="flex justify-between mt-4">
          <button class="flex items-center w-full p-2 bg-green-600 rounded text-white" @click="saveInvoice">
            <i class="fa fa-save mr-2"></i> Save & Print
          </button>
        </div>

        <FooterComponent @clear-order="ClearOrder"></FooterComponent>
      </div>
    </div>
  </template>
  
  <script>
import axios from 'axios';
import FooterComponent from './FooterComponent.vue';
import moment from 'moment';

  export default {
    components:{
        FooterComponent
    },
    data(){
        return{
            baseURL:localStorage.getItem('baseURL') ?? "",
            pos : JSON.parse(localStorage.getItem('pos')),
            invoiceNo: "",
            salesDate: moment(new Date()).format('DD-MM-YYYY'),
        }
    },
    props: {
      cart: Array,
    },
    computed: {
      subtotal() {
        return this.cart.reduce((acc, item) => acc + (item.total ? parseFloat(item.total) : 0), 0);
      },
      vat() {
        return this.cart.reduce((acc, item) => acc + (item.vat ? parseFloat(item.vat) : 0), 0);
      },
      total() {
        return this.subtotal + this.vat;
      }
    },
    methods: {
        emitRemoveItem(index) {
            this.$emit('remove-item', index); // Emit an event to notify the parent component
        },
        async saveInvoice() {
      try {
            // 1. Gather the invoice data

            let items = this.cart.map(function(item){
                  if(item.code!=""){
                    return {
                      item_code: item.item_code,
                      qty: item.quantity,
                      rate: item.price
                    }
                  }
                    
              });
              var filtered = items.filter(function (el) {
                return el != null;
              });
              
            const invoiceData = {
                // Prepare data according to ERPNext Sales Invoice DocType
                customer: "CASH",
                due_date:moment(new Date()).format('YYYY-MM-DD'),
                posting_date:moment(new Date()).format('YYYY-MM-DD'),
                company:(this.pos.pos_profiles.length > 0) ? this.pos.pos_profiles[0].company : "Exone Technologies",
                is_pos:1,
                currency:"SAR",
                exchange_rate:"22",
                items : filtered
            };


          let sendToERPNext=this.baseURL+"/api/resource/Sales Invoice";
          axios.defaults.headers.post['Content-Type'] = 'application/json';
          axios.defaults.headers.post['Authorization'] = `Basic ${localStorage.getItem('token')}`;
       
          axios.post(sendToERPNext, invoiceData).then(erpResponse => {
            const erpResult = erpResponse.data.data;
            console.log(erpResult);
            //this.printInvoiceDirectly(erpResult);
            
            this.invoiceNo = erpResult.name;
            this.printInvoice(this.invoiceNo);
            alert('Invoice saved in ERPNext and sent to ZATCA successfully!');
            this.$emit('clear-cart');
          });
            
        } catch (error) {
            console.error('Error during save process:', error);
        }
    
    },
      printInvoice(invoiceId) {
        // Open a new window to print the invoice using ERPNext print template
        window.open(`/api/method/frappe.utils.print_format.print_html?doctype=Sales Invoice&name=${invoiceId}&format=Your_Print_Format&no_letterhead=0`, '_blank');
      },
      ClearOrder() {
        this.$emit('clear-cart'); // Emit an event to notify the parent component
     },
    },
    
  }
  </script>
  
  <style scoped>
  .flex-1 {
    flex: 1;
  }
  .text-red-500 {
  cursor: pointer;
}
  </style>
  