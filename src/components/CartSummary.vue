<template>
    <div class="flex flex-col h-full">
      <div class="flex-1 overflow-y-auto">
        <div v-if="cart.length === 0" class="text-gray-500 text-center">
          No items
        </div>
        <div v-else>
          <div class="grid grid-cols-9 p-2 border-b tex-lg text-sm font-bold-lg">
            <span class="text-left" >S.No</span>
            <span class="text-left col-span-3">Item Name</span>
            <span class="text-right">Rate</span>
            <span class="text-right">QTY</span>
            <span class="text-right">Vat</span>
            <span class="text-right">Total</span>
            <span class="text-right">Del</span>
          </div>
          <div v-for="(item, index) in cart" :key="index" class="grid grid-cols-9 p-2 border-b" @click="editQty(item)">
            <span class="text-left">{{ index+1 }}</span>
           
            <span class="text-left col-span-3">{{ item.name }}</span>
            <span class="text-right">{{ item.price }}</span>
            <span class="text-right">{{ item.quantity }}</span>
            <span class="text-right">{{ item.vat.toFixed(2) }}</span>
            <span class="text-right">{{ item.total.toFixed(2) }}</span>
            <span class="text-right"><button class="text-red-500"  @click="emitRemoveItem(index)"><i class="fa fa-trash"></i></button></span>
          </div>
        </div>
      </div>
  
      <div class="bg-gray-800 p-4 mt-4 rounded-lg">
        <div class="flex justify-between mb-2">
          <span>Subtotal:</span>
          
          <span>{{ subtotal.toFixed(2) }}</span>
        </div>
        <div class="flex justify-between mb-2">
          <span>VAT:</span>
          <span>{{ vat.toFixed(2) }}</span>
        </div>
        <div class="flex justify-between font-bold mb-4">
          <span>Total:</span>
          <span>{{ total.toFixed(2) }}</span>
          
        </div>
        <div class="flex justify-between ">
          <button v-if="cart.length > 0" ref="PaymentBtn" class="p-2 my-2 w-full bg-green-600 text-white text-xl" @click="payNow">
             Pay Now
          </button>
        </div>

    
      </div>


     <!-- <PaymentModal :cart="cart" :cartTotal="total" :vatTotal="vat" :showPayment="showPayment"></PaymentModal> -->

     <div v-if="showPayment" class="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-50">
      <div class="bg-gray-600 shadow-lg p-6 w-full max-w-2xl">

        <div class="grid grid-cols-2 gap-4">
          <!-- Payment fields -->
          <div>
            <label class="block text-white">Payable Amount</label>
            <input type="text" class="text-white  w-full p-4 text-4xl" v-model="total" />
          </div>
          <div>
            <label class="block text-white">Discount Amount</label>
            <input type="text" class="text-white  w-full p-4 text-4xl" v-model="discountAmount" />
          </div>
          <div >
            <!-- <label class="block text-white">Cash</label> -->
            
            <button @click="cashSale" class="mt-2 w-full bg-teal-500 text-white p-3 text-3xl">Cash</button>
            <button @click="BankSale" class="mt-2 w-full bg-teal-500 text-white p-3 text-3xl">Bank Card</button>
          </div>
          <div class="mt-2">
            <!-- <label class="block text-white">Bank Card</label> -->
            <input type="text"  ref="cashInput" :disabled="cash_disabled" :class="{'disabled':cash_disabled}" class="text-white mb-2  w-full p-3 text-3xl" v-model="cash" />
            <input type="text" :disabled="bank_disabled" :class="{'disabled':bank_disabled}" class="text-white  w-full p-3 text-3xl" v-model="bankCard" />
            
          </div>
        </div>
          <div>
            <label class="block text-white">Balance</label>
            <input  type="text" class="text-white  w-full p-2 text-3xl" :class="{'disabled':balance_disabled}" :disabled="balance_disabled" v-model="balance" />
          </div>
          <div class="grid grid-cols-2 gap-4">
  
          <!-- Toggle switches -->
          <div class="col-span-2 flex justify-between items-center mt-4">
            <label>
              <input type="checkbox" @click="creditSale" v-model="isCreditSale" class="mr-2" />
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
            <select v-model="pos_profile" class="w-full p-2 bg-gray-700">
              <option value="">Select Sales Person</option>
              <option v-for="person in pos" :key="person.id" :value="person.name">
                {{ person.name }}
              </option>
            </select>
          </div>

          <div>
            <button v-if="amountGiven" @click="saveInvoice()" class="w-full bg-green-500 text-white px-2 py-2 mr-2">Submit</button>
          </div>
          <div>
            <button v-if="amountGiven" @click="saveInvoice()" class="w-full bg-green-500 text-white px-2 py-2 mr-2">Submit & Print</button>
          </div>

          <div class="col-span-2">
            <button @click="closeModal" class="w-full bg-red-500 text-white px-2 py-2">Cance Payment</button>
          </div>
        </div>
        
      </div>
    </div>


    <div v-if="showEdit" class="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-50">
      <div class="bg-gray-600 shadow-lg p-6 w-full max-w-xl">

        <div class="grid grid-cols-1 gap-4">
          <!-- Payment fields -->
          <div>
            <label class="block text-white">Update Quantity</label>
            <input type="text" class="text-white  w-full p-4 text-4xl" v-model="cartUpdate.qty" />
          </div>
          
        </div>
          
          <div class="grid grid-cols-2 gap-4 mt-3">
          <div>
            <button @click="updateItemQuantity(cartUpdate.item_code, cartUpdate.qty)" class="w-full bg-green-500 text-white px-2 py-2">Save</button>
          </div>

          <div >
            <button @click="showEdit=false" class="w-full bg-red-500 text-white px-2 py-2">Close</button>
          </div>
        </div>
        
      </div>
    </div>

    </div>
  </template>
  
  <script>
import axios from 'axios';

import moment from 'moment';


// import PaymentModal from './PaymentModal.vue';

  export default {
    data(){
        return{
            showEdit:false,
            cash_disabled:false,
            bank_disabled:true,
            balance_disabled:false,
            showPayment:false,
            qty:1,
            baseURL:localStorage.getItem('baseURL') ?? "",
            pos : JSON.parse(localStorage.getItem('pos')),
            invoiceNo: "",
            salesDate: moment(new Date()).format('DD-MM-YYYY'),
            posUser: "",
            paidAmount: "",
            toBePaid: "",
            cash: 0,
            bankCard: 0,
            netTotal: "",
            taxAndCharges: this.vatTotal ? this.vatTotal : 0,
            totalAmount: '',
            discountAmount: "",
            grandTotal: '',
            roundedTotal: '',
            isCreditSale: false,
            useCustomerCredit: false,
            salesPerson: '',
            openingEntry:JSON.parse(localStorage.getItem('openingEntry')),
            printerName: 'Save as PDF',
            settings: localStorage.getItem('settings') ? JSON.parse(localStorage.getItem('settings')) : "",
            cartUpdate:{
              qty:0,
              item_code:0
            }
        }
    },
    props: {
      cart: Array,
    },
    watch: {
        showPayment(newVal) {
          if (newVal) {
            // When showPayment is true, wait for the next DOM update and focus the Cash input
            this.$nextTick(() => {
              this.$refs.cashInput.focus();
            });

            
          }
        }
    },
    created() {
        //this.initializeQZ();
    },
    mounted(){
      this.pos_profile = this.openingEntry.pos_profile;

    },

    computed: {
      subtotal() {
        return this.cart.reduce((acc, item) => acc + (item.total ? parseFloat(item.total) : 0), 0);
      },
      vat() {
        return this.cart.reduce((acc, item) => acc + (item.vat ? parseFloat(item.vat) : 0), 0);
      },
      total() {
        return this.subtotal.toFixed(2) - this.discountAmount;
      },
      amountGiven(){
        let amount = parseFloat(this.cash)+parseFloat(this.bankCard);
        if(amount>= this.total || this.isCreditSale==1){
          return true;
        }
        return false;
      },
      balance(){
          if(this.cash > 0 || this.bankCard > 0){
            let amt = parseFloat(this.cash)+parseFloat(this.bankCard) - this.total; 
            return amt.toFixed(2)
          }
          return 0;
      },
      paymentMethods(){
          let paymentMethods=[]
            if(this.cash > 0)
            {
              paymentMethods.push({mode_of_payment:"Cash",amount:this.cash})
            } 
            if(this.bankCard > 0)
            {
              paymentMethods.push({mode_of_payment:"Bank Card", amount:this.bankCard})
            } 

            return paymentMethods;
        },
      
    },
    methods: {



        editQty(item)
        {
            console.log(item);
            
            this.showEdit = true;
            this.cartUpdate.qty = item.quantity;
            this.cartUpdate.item_code = item.item_code;
        },
        updateItemQuantity(itemCode, newQuantity) {
  // Find the item in the cart based on its item_code
          const item = this.cart.find(cartItem => cartItem.item_code === itemCode);

          // If the item exists, update its quantity and recalculate total and VAT
          if (item) {
            item.quantity = newQuantity;
            const baseTotal = (item.price * item.quantity) || 0;
            const vatAmount = (baseTotal * item.vatRate) / 100 || 0;
            item.total = baseTotal + vatAmount;
            item.vat = vatAmount;

            this.showEdit = false;
          } else {
            console.warn('Item not found in cart');
          }
        },

        Cashfocus(input){
            input.focus()
        },
        payNow(){
            this.showPayment =true;
            this.balance = "";
            this.cash = "";
            this.bankCard=0;
            this.cash_disabled = false;
            this.bank_disabled = true;
        },
        cashSale(){
          this.cash_disabled = !this.cash_disabled;
          this.cash = "";
          this.bankCard = 0;
        },
        BankSale(){
            this.bank_disabled = !this.bank_disabled;
            this.cash = 0;
            this.bankCard = "";
        },
        creditSale(){
            this.balance = 0;
            this.cash = 0;
            this.bankCard=0;
            this.cash_disabled = true;
            this.bank_disabled = true;
            this.balance_disabled = true;
            this.amountGiven = true;
        },
        closeModal() {
          this.showPayment=false;
        },
        amountCalculate(){
          let amount = parseFloat(this.cash)+parseFloat(this.bankCard);
            this.balance = parseFloat(amount)-parseFloat(this.total);
        },
        ReduceDiscount(){
            this.total = parseFloat(this.total) - parseFloat(this.discountAmount)
        },
        emitRemoveItem(index) {
            this.$emit('remove-item', index); // Emit an event to notify the parent component
        },
        async saveInvoice() {
          try {
            // 1. Gather the invoice data
            this.loading = true;
            
            if(this.cart.length==0)
            {
              alert('Please add some items into cart');
              return false;
            }

            let items = this.cart.map(function(item){
                  if(item.code!=""){
                    return {
                      item_code: item.item_code,
                      qty: item.quantity,
                      rate: item.price,
                      vat:item.vatRate,
                      vat_amount:item.vat
                    }
                  }
              });
              var filtered = items.filter(function (el) {
                return el != null;
              });

            let totalVATAmount = filtered.reduce((accum, item) => accum + item.vat_amount, 0);
            // if(this.creditSale){

            // }
              
            const invoiceData = {
                // Prepare data according to ERPNext Sales Invoice DocType
                customer: "CASH",
                due_date:moment(new Date()).format('YYYY-MM-DD'),
                posting_date:moment(new Date()).format('YYYY-MM-DD'),
                company:(this.pos.length > 0) ? this.pos[0].company : "Exone Technologies",
                is_pos:1,
                currency:this.pos[0].currency,
                exchange_rate:"1",
                items : filtered,
                taxes: [
                {
                  charge_type: "On Net Total",
                  account_head: "VAT 15% - ET", // The account head for VAT in ERPNext
                  rate: 0, // If the rate is not fixed, you can keep it 0 and calculate the actual VAT amount below
                  tax_amount: totalVATAmount, // The calculated total VAT amount
                  description: "VAT",
                }
              ],
              payments: this.paymentMethods
            };


          let sendToERPNext=this.baseURL+"/api/resource/Sales Invoice";
          
          axios.defaults.headers.post['Content-Type'] = 'application/json';
          axios.defaults.headers.post['Authorization'] = `Basic ${localStorage.getItem('token')}`;
       
          axios.post(sendToERPNext, invoiceData).then(erpResponse => {
            const erpResult = erpResponse.data.data;
            console.log(erpResult);
            //this.printInvoiceDirectly(erpResult);
            this.invoiceNo = erpResult.name;
            let submitody = {"doc": erpResult}
            let submitAPI=this.baseURL+`/api/method/frappe.client.submit`;
            axios.post(submitAPI,submitody).then(submitResponse => {
              console.log(submitResponse);
            });
            
            this.printInvoice(this.invoiceNo);
            alert('Invoice saved and sent to ZATCA successfully!');
            this.ClearOrder()
            this.showPayment =false;
          });
            
        } catch (error) {
            console.error('Error during save process:', error);
        }
    
    },

      ClearOrder() {
        this.$emit('clear-cart'); // Emit an event to notify the parent component
     },


    // async fetchInvoicePrintFormat(invoiceName) {
    //   try {
    //     const response = await axios.get(
    //       `${this.baseURL}/api/method/frappe.utils.print_format.download_pdf`,
    //       {
    //         params: {
    //           doctype: "Sales Invoice",
    //           name: invoiceName,
    //           format: "Standard", // Replace with your custom print format name if needed
    //           no_letterhead: 0
    //         },
    //         headers: {
    //           Authorization: `Basic ${localStorage.getItem('token')}`
    //         }
    //       }
    //     );
    //     return response.data;
    //   } catch (error) {
    //     console.error("Error fetching the Sales Invoice print format:", error);
    //     return null;
    //   }
    // },

    async printInvoice(invoiceName) {
      try {

        console.log(window.JSPM, invoiceId)
        if(window.JSPM) {
          window.JSPM.JSPrintManager.auto_reconnect = true;
          window.JSPM.JSPrintManager.start();
          window.JSPM.JSPrintManager.WS.onStatusChanged = function () {
              if (window.JSPM.JSPrintManager.websocket_status == window.JSPM.WSStatus.Open) {
                  var cpj = new window.JSPM.ClientPrintJob();
                  cpj.clientPrinter = new window.JSPM.DefaultPrinter();
                  var my_file1 = new window.JSPM.PrintFilePDF('../../images/test.pdf', window.JSPM.FileSourceType.URL, 'MyFile.pdf', 1);
                  cpj.files.push(my_file1);
                  cpj.sendToClient();
              }
          };
        }
        
        // Fetch the print layout from ERPNext
        const printFormat = 'KSA POS Invoice'; // Set your print format here
        var targetUrl = this.baseURL+`/api/method/frappe.utils.print_format.download_pdf?doctype=Sales%20Invoice&name=${invoiceName}&format=${printFormat}`;
        console.log(targetUrl)
        const response = await fetch(targetUrl,
          {
            responseType: 'arraybuffer',
            headers: {
              Authorization: 'Basic '+localStorage.getItem('token'),
            }
          }
        );
        const pdfBlob = await response.blob();
        const pdfData = await pdfBlob.arrayBuffer();


        console.log(pdfData);

        // Send print job to the printer

        console.log('Print job sent successfully!');
      } catch (error) {
        console.error('Error printing invoice:', error);
      }
    },


    

    arrayBufferToBase64(buffer) {
      let binary = '';
      const bytes = new Uint8Array(buffer);
      const len = bytes.byteLength;
      for (let i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
      }
      // Encode the binary string as Base64
      return window.btoa(binary);
    }

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
table thead th, input{
  background-color: rgb(17 24 39)
}
.disabled{
  background-color: rgb(48, 52, 59, 0.3)
}
  </style>
  