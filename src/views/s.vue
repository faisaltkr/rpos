<template>
    <div :class="[$i18n.locale === 'ar' ? 'rtl' : 'ltr']" class="window w-5/6 h-screen overflow-hidden">
      <HeaderNav />
      
      <form @submit.prevent>
        <div class="sales-form">
          <div class="header">
            <span class="p-1">{{ $t('dashboard') }}</span>
            <div class="actions">
              <button @click="save" class="btn save">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="h-6 w-6">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M3 3v18h18V6l-3-3H3ZM7.5 3v6h9V3M6 21v-9h12v9M14.25 5.25v1.5"/>
                </svg>
              {{ $t('save') }}
            </button>
            <button @click="clear" class="btn clear">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" width="24px" height="24px" viewBox="0 0 24 24" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M896 512c0-212.077-171.921-384-384-384-212.077 0-384 171.923-384 384 0 212.079 171.923 384 384 384 212.079 0 384-171.921 384-384zM579.883 398.863c12.497-12.497 32.759-12.497 45.257 0 12.493 12.497 12.493 32.757 0 45.254L557.257 512l67.878 67.883c12.497 12.497 12.497 32.759 0 45.257-12.493 12.493-32.755 12.493-45.252 0L512 557.257l-67.883 67.883c-12.497 12.493-32.757 12.493-45.254 0-12.497-12.497-12.497-32.759 0-45.257L466.744 512l-67.881-67.883c-12.497-12.497-12.497-32.758 0-45.254s32.757-12.497 45.254 0L512 466.744l67.883-67.881z"/></svg>
                {{ $t('clear') }}
            </button>
  
            <button @click="cancel" class="btn cancel">
              <svg width="24px" height="24px" viewBox="0 0 24 24" id="a2495f07-7746-4c27-a7cc-72112ecafc37" data-name="Livello 1" xmlns="http://www.w3.org/2000/svg"><title>prime</title><polygon id="c8ef3de6-eeb3-441f-adf3-4bc928b83c76" data-name="clear" points="18.41 2.36 12.05 8.73 5.69 2.36 2.86 5.19 9.22 11.56 2.86 17.92 5.69 20.75 12.05 14.38 18.41 20.75 21.24 17.92 14.88 11.56 21.24 5.19 18.41 2.36"/></svg>
                {{ $t('cancel') }}
            </button>
              
              
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <span class="p-1">{{ $t('invoiceNo') }}</span>
              <input type="text" v-model="invoiceNo" @keydown.enter="focusNext($event)" />
            </div>
  
            <div class="form-group flex justify-end">
              <span class="p-1">{{ $t('salesDate') }}</span>
              <input type="date" v-model="salesDate" @keydown.enter="focusNext($event)" />
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <span class="p-1">{{ $t('customer') }}</span>
              <input style="width: 10%;"
                placeholder="Code"
                type="text" 
                v-model="customerCodeQuery" 
                @input="searchCustomers" 
                @keydown.enter="focusNext($event)" 
              />
              <input 
                style="width: 20%;"
                placeholder="Select Customer"
                type="text" 
                v-model="customerQuery" 
                @input="searchCustomers" 
                @keydown.enter="focusNext($event)" 
              />
              <ul v-if="customerSuggestions.length" class="suggestions-dropdown">
                <li 
                  v-for="suggestion in customerSuggestions" 
                  :key="suggestion.id" 
                  @click="selectCustomer(suggestion)">
                  {{ suggestion.code }} - {{ suggestion.name }}
                </li>
              </ul>
            </div>
          </div>
          <div class="form-row">
            <div class="form-group flex">
              <span class="p-1">{{ $t('address') }}</span>
              <textarea class="address" v-model="customer.address" @keydown.enter="focusNext($event)" />
            </div>
          </div>
  
          <table class="table-auto overflow-scroll">
            <thead>
              <tr>
                <th width="10%">{{ $t('code') }}</th>
                <th width="25%">{{ $t('name') }}</th>
                <th width="10%">{{ $t('secondName') }}</th>
                <th width="5%">{{ $t('tax') }}</th>
                <th width="5%">{{ $t('qty') }}</th>
                <th width="7%">{{ $t('uom') }}</th>
                <th width="5%">{{ $t('sRate') }}</th>
                <th width="10%">{{ $t('grossAmt') }}</th>
                <th width="7%">{{ $t('netAmt') }}</th>
                <th width="6%">{{ $t('vatAmt') }}</th>
                <th width="10%">{{ $t('total') }}</th>
              </tr>
            </thead>
            <tbody>
              <tr class="even:bg-gray-50 odd:bg-white" v-for="(item, index) in items" :key="index">
                <td>
                  <input 
                    type="text" 
                    v-model="item.code" 
                    @keydown.enter="selectItem(item, index)" 
                    @input="searchItems($event.target.value, index, 'code')" 
                  />
                  <div v-if="item.suggestions.length && element === 'name'" class="suggestions-dropdown">
                    <table>
                      <thead>
                        <tr>
                          <th>{{ $t('suggestions.code') }}</th>
                          <th>{{ $t('suggestions.name') }}</th>
                          <th>{{ $t('suggestions.sellingPrice') }}</th>
                          <th>{{ $t('suggestions.purchasePrice') }}</th>
                          <th>{{ $t('suggestions.stock') }}</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="suggestion in item.suggestions" :key="suggestion.id" @click="selectSuggestion(suggestion, index)">
                          <td>{{ suggestion.code }}</td>
                          <td>{{ suggestion.name }}</td>
                          <td>{{ suggestion.sellingPrice }}</td>
                          <td>{{ suggestion.purchasePrice }}</td>
                          <td>{{ suggestion.stock }}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </td>
                <td class="items-td">
                  <input 
                    type="text" 
                    v-model="item.name" 
                    :ref="`name-${index}`"
                    @keydown.enter="focusNext($event, index, 'name')" 
                    @input="searchItems($event.target.value, index, 'name')" 
                  />
                  <div v-if="item.suggestions.length && element === 'code'" class="suggestions-dropdown">
                    <table>
                      <thead>
                        <tr>
                          <th>{{ $t('suggestions.code') }}</th>
                          <th>{{ $t('suggestions.name') }}</th>
                          <th>{{ $t('suggestions.sellingPrice') }}</th>
                          <th>{{ $t('suggestions.purchasePrice') }}</th>
                          <th>{{ $t('suggestions.stock') }}</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="suggestion in item.suggestions" :key="suggestion.id" @click="selectSuggestion(suggestion, index)">
                          <td>{{ suggestion.code }}</td>
                          <td>{{ suggestion.name }}</td>
                          <td>{{ suggestion.sellingPrice }}</td>
                          <td>{{ suggestion.purchasePrice }}</td>
                          <td>{{ suggestion.stock }}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </td>
                <td><input type="text" v-model="item.secondName" @keydown.enter="focusNext($event)" /></td>
                <td><input type="number" v-model.number="item.tax" @keydown.enter="focusNext($event)" /></td>
                <td><input type="number" v-model.number="item.qty" @keydown.enter="focusNext($event, index, 'qty')" /></td>
                <td><input type="text" v-model="item.uom" @keydown.enter="focusNext($event)" /></td>
                <td><input type="number" v-model.number="item.sRate" @keydown.enter="focusNext($event)" /></td>
                <td>{{ (item.grossAmt || 0).toFixed(2) }}</td>
                <td>{{ (item.netAmt || 0).toFixed(2) }}</td>
                <td>{{ (item.vatAmt || 0).toFixed(2) }}</td>
                <td>{{ (item.total || 0).toFixed(2) }}</td>
              </tr>
            </tbody>
          </table>
          <button @click="deleteAllRows" class="p-2">{{ $t('deleteAllRows') }}</button>
          <div class="footer">
  
            <div class="form-group flex justify-start w-half">
              <span class="p-1">{{ $t('SalesMan') }}</span>
              <input 
                
                placeholder="Select Salesman"
                type="text" 
                v-model="salesmanQuery" 
                @input="searchSalesmen" 
                @keydown.enter="focusNext($event)" 
              />
              <ul v-if="salesmanSuggestions.length" class="suggestions-dropdown">
                <li 
                  v-for="suggestion in salesmanSuggestions" 
                  :key="suggestion.id" 
                  @click="selectSalesman(suggestion)">
                  {{ suggestion.name }}
                </li>
              </ul>
            </div>
            
  
            <div class="totals">
              <div class="total-row">
              <span>{{ $t('discount') }}</span>
              <input class="discount" type="number" v-model.number="discount" @input="updateTotals" />
            </div>
  
              <div class="total-row">
                <span>{{ $t('charges') }}:</span>
                <span>{{ (charges || 0).toFixed(2) }}</span>
              </div>
              <div class="total-row">
                <span>{{ $t('roundOff') }}:</span>
                <span>{{ (roundOff || 0).toFixed(2) }}</span>
              </div>
              
              <div class="total-row grand-total">
                <span>{{ $t('grandTotal') }}:</span>
                <span>{{ grandTotal.toFixed(2) }}</span>
              </div>
            </div>
          </div>
          <div class="form-row">
            <label>{{ $t('warehouse') }}</label>
            <select v-model="warehouse" @keydown.enter="focusNext($event)">
              <option>{{ $t('genWarehouse') }}</option>
            </select>
          </div>
          <div class="form-row">
            <label>{{ $t('remarks') }}</label>
            <textarea v-model="remarks" @keydown.enter="focusNext($event)"></textarea>
          </div>
          <div class="balance">
            <span>{{ $t('balance') }}:</span>
            <span>{{ (customerBalance || 0).toFixed(2) }}</span>
          </div>
        </div>
      </form>
    </div>
  </template>
  
  <script>
   import jsonProducts from '../database/items.json';
  import HeaderNav from "../components/HeaderNav.vue";
  
  export default {
    components: {
      HeaderNav
    },
    data() {
      return {
        jsonProducts:jsonProducts,
        invoiceNo: 7,
        salesDate: '2024-07-12',
        salesmanQuery: '',
        salesmanSuggestions: [],
        customerQuery: '',
        customerCodeQuery: '',
        customers: [],
        customerSuggestions: [],
        customer: {
          name: '',
          address: '',
        },
        items: [
          {
            code: '',
            name: '',
            secondName: '',
            tax: 0,
            qty: 1,
            uom: '',
            sRate: 0,
            suggestions: [],
            get grossAmt() {
              return this.qty * this.sRate;
            },
            get netAmt() {
              return this.grossAmt;
            },
            get vatAmt() {
              return this.grossAmt * this.tax / 100;
            },
            get total() {
              return this.netAmt + this.vatAmt;
            },
          },
        ],
        discount: 0.00,
        charges: 0.00,
        roundOff: 0.00,
        warehouse: 'GEN.WAREHOUSE',
        remarks: '',
        customerBalance: 0,
        element: '',
        availableItems: [],
        salesmen: []
      };
    },
    computed: {
      grandTotal() {
        const totalBeforeDiscount = this.items.reduce((sum, item) => sum + (item.total || 0), 0) + (this.roundOff || 0) + (this.charges || 0);
        return totalBeforeDiscount - (this.discount || 0);
      },
    },
    methods: {
      async fetchItems() {
        try {
          //const response = await fetch('https://dummyjson.com/products');
        
          const data = jsonProducts;
  
          this.availableItems = data.products.map(item => ({
            code: item.sku,
            name: item.name,
            secondName: item.arabic_name,
            tax: 15,
            qty: 1,
            uom: 'Nos',
            sRate: item.price,
            sellingPrice: item.price,
            purchasePrice: item.price * 0.8,  // Assuming purchase price is 80% of selling price for demo
            stock: item.stock
          }));
        } catch (error) {
          console.error('Error fetching items:', error);
        }
      },
      async fetchCustomers() {
        try {
          const response = await fetch('https://dummyjson.com/users'); // Replace with your actual API endpoint
          const data = await response.json();
  
          this.customers = data.users.map(user => ({
            id: user.id,
            name: `${user.firstName} ${user.lastName}`,
            code: user.ssn, // Assuming username is used as customer code for demo purposes
            address: user.address.address,
            balance: user.balance,
          }));
        } catch (error) {
          console.error('Error fetching customers:', error);
        }
      },
      async fetchSalesmen() {
        try {
          const response = await fetch('https://dummyjson.com/users'); // Replace with your actual API endpoint
          const data = await response.json();
  
          this.salesmen = data.users.map(user => ({
            id: user.id,
            name: `${user.firstName} ${user.lastName}`,
          }));
        } catch (error) {
          console.error('Error fetching salesmen:', error);
        }
      },
      searchCustomers() {
        const codeQuery = this.customerCodeQuery.toLowerCase();
        const nameQuery = this.customerQuery.toLowerCase();
      
        if (codeQuery.length > 1 || nameQuery.length > 1) {
          this.customerSuggestions = this.customers.filter(customer =>
            customer.code.toLowerCase().includes(codeQuery) ||
            customer.name.toLowerCase().includes(nameQuery)
          );
        } else {
          this.customerSuggestions = [];
        }
      },
      searchSalesmen() {
        const query = this.salesmanQuery.toLowerCase();
      
        if (query.length > 1) {
          this.salesmanSuggestions = this.salesmen.filter(salesman =>
            salesman.name.toLowerCase().includes(query)
          );
        } else {
          this.salesmanSuggestions = [];
        }
      },
      selectCustomer(suggestion) {
        this.customer = {
          name: suggestion.name,
          address: suggestion.address,
        };
        this.customerCodeQuery = suggestion.code;
        this.customerQuery = suggestion.name;
        this.customerBalance = suggestion.balance;
        this.customerSuggestions = [];
      },
      selectSalesman(suggestion) {
        this.salesmanQuery = suggestion.name;
        this.salesmanSuggestions = [];
      },
      searchItems(query, index, el) {
        if (query.length > 1) {
          if (el === 'name') {
            this.items[index].suggestions = this.availableItems.filter(item =>
              item.name.toLowerCase().includes(query.toLowerCase())
            );
            this.element = "code";
          } else {
            this.items[index].suggestions = this.availableItems.filter(item =>
              item.code.toLowerCase().includes(query.toLowerCase())
            );
            this.element = 'name';
          }
        } else {
          this.items[index].suggestions = [];
        }
      },
      selectSuggestion(suggestion, index) {
        this.items[index] = {
          ...suggestion,
          suggestions: [],
          get grossAmt() {
            return this.qty * this.sRate;
          },
          get netAmt() {
            return this.grossAmt;
          },
          get vatAmt() {
            return this.grossAmt * this.tax / 100;
          },
          get total() {
            return this.netAmt + this.vatAmt;
          },
        };
        this.addNewRow();
      },
      addNewRow() {
        this.items.push({
          code: '',
          name: '',
          secondName: '',
          tax: 0,
          qty: 1,
          uom: '',
          sRate: 0,
          suggestions: [],
          get grossAmt() {
            return this.qty * this.sRate;
          },
          get netAmt() {
            return this.grossAmt;
          },
          get vatAmt() {
            return this.grossAmt * this.tax / 100;
          },
          get total() {
            return this.netAmt + this.vatAmt;
          },
        });
      },
      updateTotals() {
        // Automatically updates the grand total when discount is applied
        this.grandTotal;
      },
      async save() {
        try {
              // 1. Gather the invoice data
              const invoiceData = {
                  // Prepare data according to ERPNext Sales Invoice DocType
                  customer: this.customer.name,
                  posting_date: this.salesDate,
                  items: this.items.map(item => ({
                      item_code: item.code,
                      qty: item.qty,
                      rate: item.sRate,
                      uom: item.uom,
                      tax: item.tax,
                  })),
                  discount_amount: this.discount,
                  additional_charges: this.charges,
                  round_off_amount: this.roundOff,
                  remarks: this.remarks,
                  warehouse: this.warehouse,
                  grand_total: this.grandTotal,
              };
  
              // 2. Create Sales Invoice in ERPNext
              const erpResponse = await fetch('/api/resource/Sales Invoice', {
                  method: 'POST',
                  headers: {
                      'Content-Type': 'application/json',
                      //'Authorization': `token ${YOUR_ERPNext_API_TOKEN}`, // Replace with your ERPNext API Token
                  },
                  body: JSON.stringify(invoiceData),
              });
  
              if (!erpResponse.ok) {
                  throw new Error('Error saving invoice in ERPNext.');
              }
  
              const erpResult = await erpResponse.json();
  
              // 3. Send data to ZATCA
              const zatcaResponse = await fetch('YOUR_ZATCA_API_ENDPOINT', {
                  method: 'POST',
                  headers: {
                      'Content-Type': 'application/json',
                      //'Authorization': `Bearer ${YOUR_ZATCA_TOKEN}`, // Replace with your ZATCA Token
                  },
                  body: JSON.stringify({
                      invoiceData,
                      erpReference: erpResult.data.name, // ERPNext invoice ID
                  }),
              });
  
              if (!zatcaResponse.ok) {
                  throw new Error('Error sending invoice to ZATCA.');
              }
  
              //const zatcaResult = await zatcaResponse.json();
  
              // 4. Print the invoice
              this.printInvoice(erpResult.data.name);
  
              alert('Invoice saved in ERPNext and sent to ZATCA successfully!');
          } catch (error) {
              console.error('Error during save process:', error);
              alert('Failed to save the invoice. Please try again.');
          }
      
      },
      printInvoice(invoiceId) {
          // Use ERPNext's built-in print format for invoices
          window.open(`/printview?doctype=Sales Invoice&name=${invoiceId}&format=Standard&no_letterhead=0`, '_blank');
      },
      clear() {
        alert('Clear clicked!');
      },
      cancel() {
        alert('Cancel clicked!');
      },
      deleteAllRows() {
        this.items = [];
      },
      focusNext(event, index, field) {
        event.preventDefault();
        if (field === 'qty' && index < this.items.length - 1) {
          this.$refs[`name-${index + 1}`][0].focus();
        } else {
          const form = event.target.form;
          const index = Array.prototype.indexOf.call(form, event.target);
          form.elements[index + 1].focus();
        }
      },
    },
    mounted() {
      this.fetchItems();
      this.fetchCustomers();
      this.fetchSalesmen();
    },
  };
  </script>
  
  <style>
  .rtl {
    direction: rtl;
  }
  
  .ltr {
    direction: ltr;
  }
  
  .suggestions-dropdown {
    position: absolute;
    background: white;
    border: 1px solid #ccc;
    z-index: 1000;
  }
  
  .form-group .suggestions-dropdown {
    margin-left: 77px;
    width: 25%;
  }
  
  .table-auto {
    width: 100%;
  }
  
  .suggestions-dropdown ul, .suggestions-dropdown table tbody tr td {
    cursor: pointer;
  }
  .address{
    width: 50% !important;
  }
  .discount{
    width: 20% !important;
  }
  </style>
  
  