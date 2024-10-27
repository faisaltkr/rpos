<template>
  <div :class="[$i18n.locale === 'ar' ? 'rtl' : 'ltr']" class="window w-screen h-screen overflow-hidden bg-gray-700">
    <HeaderNav/>
    
    <form @submit.prevent>
      <div class="sales-form">
        <div class="header">
          <span class="p-1">{{ $t('Sales') }}</span>
          <div class="actions">
            <button id="save" ref="save" @click="save" class="btn save">
              <img src="../assets/save.svg" class="inline-block p-1" width="25" alt="">{{ $t('save') }} 
            
          </button>
          <button @click="print" class="btn print">
              <img src="../assets/print.svg" class="inline-block p-1" width="25" alt="">
              {{ $t('print') }}
          </button>
          <button @click="clear" class="btn clear">
              <img src="../assets/clear.svg" class="inline-block p-1" width="25" alt="">
              {{ $t('clear') }}
          </button>

          <button @click="reload" class="btn cancel">
            <img src="../assets/close.svg" class="inline-block p-1" width="25" alt="">
              {{ $t('reload') }}
          </button>
          </div>
        </div>
        <table width="100%" class="table-noborder">
            <tr>
              <td width="10%"><span class="p-1">{{ $t('invoiceNo') }}</span></td>
              <td width="10%"><input type="text" v-model="invoiceNo" @keydown.enter="focusNext($event)" /></td>
              <td width="10%" class="text-right"><span class="p-1">{{ $t('salesDate') }}</span></td>
              <td width="20%"><input type="text" v-model="salesDate" @keydown.enter="focusNext($event)" /></td>
              <td width="50%"></td>
            </tr>

            <tr>
              <td width="10%"><span class="p-1">{{ $t('customer') }}</span></td>
              <td width="10%"><input placeholder="Search Code" type="text" v-model="customerCodeQuery" 
              @input="searchCustomers" @keydown.enter="focusNext($event)"/>
              <br><hr>
              <input placeholder="Search Customer" type="text" v-model="customerQuery"  @input="searchCustomers" @keydown.enter="focusNext($event)" />
            <ul v-if="customerSuggestions.length" class="suggestions-dropdown">
              <li 
                v-for="suggestion in customerSuggestions" 
                :key="suggestion.id" 
                @click="selectCustomer(suggestion)">
                {{ suggestion.name }} - {{ suggestion.customer_name }}
              </li>
            </ul>
            </td>
              <td width="10%" class="text-right"><span class="p-1">{{ $t('address') }}</span></td>
              <td width="20%"><textarea class="address" v-model="customer.address" @keydown.enter="focusNext($event)" /></td>
            </tr>
        </table>


        <table class="table-auto overflow-scroll grid-table">
          <thead>
            <tr>
              <th width="10%">{{ $t('code') }}</th>
              <th width="25%">{{ $t('name') }}</th>
              <th width="12%">{{ $t('secondName') }}</th>
              <th width="5%">{{ $t('tax') }}</th>
              <th width="5%">{{ $t('qty') }}</th>
              <th width="5%">{{ $t('uom') }}</th>
              <th width="5%">{{ $t('sRate') }}</th>
              <th width="10%">{{ $t('grossAmt') }}</th>
              <th width="7%">{{ $t('netAmt') }}</th>
              <th width="6%">{{ $t('vatAmt') }}</th>
              <th width="5%">{{ $t('total') }}</th>
              <th>Close</th>
            </tr>
          </thead>
          <tbody>
            <tr class="even:bg-gray-50 odd:bg-white" v-for="(item, index) in items" :key="index">
              <td>
                <input 
                  type="text" 
                  v-model="item.code"
                  :ref="`code-${index}`" 
                  @keydown="handleKeyNavigation($event, index)"
                  @keydown.enter="focusNext($event,index, 'code')"
                  autofocus 
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
                      <tr v-for="(suggestion, sIndex) in item.suggestions" 
                          :key="suggestion.id" 
                          :class="{ highlighted: sIndex === item.highlightedIndex }"
                          @click="selectSuggestion(suggestion, index)">
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
                <!-- <input 
                  type="text" 
                  v-model="item.name" 
                  :ref="`name-${index}`"
                  @keydown.enter="focusNext($event, index, 'name')" 
                  @input="searchItems($event.target.value, index, 'name')" 
                /> -->
                <input 
                  type="text" 
                  v-model="item.name" 
                  :ref="`name-${index}`"
                  @keydown="handleKeyNavigation($event, index)"
                  @keydown.enter="focusNext($event)" 
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
                      <tr 
                          v-for="(suggestion, sIndex) in item.suggestions" 
                          :key="suggestion.id" 
                          :class="{ highlighted: sIndex === item.highlightedIndex }"
                          @click="selectSuggestion(suggestion, index)"
                        >
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
              <td><button @click="removeItem(index)"><img src="../assets/close-black.svg" width="15" alt=""></button></td>
            </tr>
          </tbody>
        </table>
        <!-- <button @click="deleteAllRows" class="p-2">{{ $t('deleteAllRows') }}</button> -->
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

            <div class="total-row">
              <span>{{ $t('totalVat') }}:</span>
              <span>{{ totalVat.toFixed(2) }}</span>
            </div>
            
            <div class="total-row grand-total">
              <span>{{ $t('grandTotal') }}:</span>
              <span>{{ grandTotal.toFixed(2) }}</span>
            </div>
          </div>
        </div>
        <!-- <div class="form-row">
          <label>{{ $t('warehouse') }}</label>
          <select v-model="warehouse" @keydown.enter="focusNext($event)">
            <option>{{ $t('genWarehouse') }}</option>
          </select>
        </div> -->
        <!-- <div class="form-row">
          <label>{{ $t('remarks') }}</label>
          <textarea v-model="remarks" @keydown.enter="focusNext($event)"></textarea>
        </div> -->
        <div class="balance">
          <span>{{ $t('balance') }}:</span>
          <span>{{ (customerBalance || 0).toFixed(2) }}</span>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
 
import HeaderNav from "../components/HeaderNav.vue";
import axios from "axios";
import moment from 'moment';
//const { ThermalPrinter, PrinterTypes, CharacterSet, BreakLine } = require('node-thermal-printer');


export default {
  components: {
    HeaderNav
  },
  data() {
    return {
      baseURL:localStorage.getItem('baseURL') ?? "",
      pos : localStorage.getItem('pos'),
      invoiceNo: "",
      salesDate: moment(new Date()).format('DD-MM-YYYY'),
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
          highlightedIndex: -1,
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
      highlightedIndices: [],
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
    totalVat(){
      const totalVatamt = this.items.reduce((sum, item) => sum + (item.vatAmt || 0), 0);
      return totalVatamt;
    }
  },
  methods: {
    async fetchItems() {
      try {
        //const response = await fetch('https://dummyjson.com/products');
        //const data = localStorage.getItem('items');
        const data = JSON.parse(localStorage.getItem('items'))
        console.log('fetch from storage');
        console.log(data);

        this.availableItems = data.items.map(item => ({
          code: item.item_code,
          name: item.item_name,
          secondName: item.item_name_arabic,
          tax: item?.tax_details?.tax_rate ?? 15,
          qty: 1,
          uom: 'Nos',
          sRate: item.price,
          sellingPrice: item.price,
          purchasePrice: item.price * 0.8,  // Assuming purchase price is 80% of selling price for demo
          stock: item.is_stock_item
        }));
      } catch (error) {
        console.error('Error fetching items:', error);
      }
    },
    async fetchCustomers() {
      try {
        this.customers = JSON.parse(localStorage.getItem('customers'))
      } catch (error) {
        console.error('Error fetching customers:', error);
      }
    },
    async fetchSalesmen() {
      try {
        this.pos_profile = localStorage.getItem('pos_profile') || {};
      } catch (error) {
        console.error('Error fetching salesmen:', error);
      }
    },
    searchCustomers() {
      const codeQuery = this.customerCodeQuery.toLowerCase();
      const nameQuery = this.customerQuery.toLowerCase();
    
      if (codeQuery.length > 1 || nameQuery.length > 1) {
        this.customerSuggestions = this.customers.filter(customer =>
          customer.name.toLowerCase().includes(codeQuery) ||
          customer.customer_name.toLowerCase().includes(nameQuery)
        );
      } else {
        this.customerSuggestions = [];
      }
    },

    selectCustomer(suggestion) {
      console.log(suggestion);
          let address="";
          if(suggestion.addresses.length > 0)
          {
            let addresse = suggestion.addresses[0];
            address = addresse.address_line1+"\n"+addresse.address_line2+","+addresse.city
          }

          this.customer = {
              name: suggestion.name,
              address: address,
          };
          this.customerCodeQuery = suggestion.name;
          this.customerQuery = suggestion.customer_name;
          this.customerBalance = suggestion.balance;
          this.customerSuggestions = [];
          
      
    },
    selectSalesman(suggestion) {
      this.salesmanQuery = suggestion.name;
      this.salesmanSuggestions = [];
    },

    handleKeyNavigation(event, index) {
    const item = this.items[index];
    const suggestionsLength = item.suggestions.length;

    if (suggestionsLength === 0) {
      return;
    }
    switch (event.key) {
      case 'ArrowDown':
        item.highlightedIndex = (item.highlightedIndex + 1) % suggestionsLength;
        break;
      case 'ArrowUp':
        item.highlightedIndex = (item.highlightedIndex - 1 + suggestionsLength) % suggestionsLength;
        break;
      case 'Enter':
        if (item.highlightedIndex >= 0) {
          this.selectSuggestion(item.suggestions[item.highlightedIndex], index);
        }
        break;
      default:
        return; // Exit this handler for other keys
    }

    event.preventDefault(); // Prevent the default action, such as scrolling
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
      highlightedIndex: -1, // Reset the highlighted index
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
    this.focusCode()
  },
    focusCode(){
      
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
        highlightedIndex: -1,
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
            let items = this.items.map(function(item){
                  if(item.code!=""){
                    return {
                      item_code: item.code,
                      qty: item.qty,
                      rate: item.sRate
                    }
                  }
                    
              });
              var filtered = items.filter(function (el) {
                return el != null;
              });
              
            const invoiceData = {
                // Prepare data according to ERPNext Sales Invoice DocType
                customer: this.customer.name,
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
            alert('Invoice saved in ERPNext and sent to ZATCA successfully!');
            this.clear()
          });
            
        } catch (error) {
            console.error('Error during save process:', error);
        }
    
    },
    printInvoice(invoiceId) {
        // Use ERPNext's built-in print format for invoices
        window.open(`http://dev14.erpx.one/printview?doctype=Sales Invoice&name=${invoiceId}&token=${localStorage.getItem('token')}&format=Standard&no_letterhead=0`, '_blank');
    },
    clear() {
      this.input = "";
      this.items = [];
      window.location.reload();
    },
    print(){
      this.printInvoice()
    },
    reload() {
      window.location.reload();
    },
    deleteAllRows() {
      this.items = [];
    },
    removeItem(index) {
      this.items.splice(index, 1);
    },
    focusNext(event, index, field) {
      event.preventDefault();
      if(field=='code' && this.items[index]['code']=="" && this.items.length > 0){
        this.$refs.save.focus()
      }else if(field=='code' && this.items[index]['code']=="")
      {
        const form = event.target.form;
        const index = Array.prototype.indexOf.call(form, event.target);
        form.elements[index].focus();
      }else{
        if (field === 'qty' && index < this.items.length - 1) {
        this.$refs[`code-${index + 1}`][0].focus();
      } else {
        const form = event.target.form;
        const index = Array.prototype.indexOf.call(form, event.target);
        form.elements[index + 1].focus();
      }
      }
      
      
    },

  //  printInvoiceDirectly(invoiceData) {
  //     let printer = new ThermalPrinter({
  //       type: PrinterTypes.STAR,                                  // Printer type: 'star' or 'epson'
  //       interface: 'tcp://xxx.xxx.xxx.xxx',                       // Printer interface
  //       characterSet: CharacterSet.PC852_LATIN2,                  // Printer character set
  //       removeSpecialCharacters: false,                           // Removes special characters - default: false
  //       lineCharacter: "=",                                       // Set character for lines - default: "-"
  //       breakLine: BreakLine.WORD,                                // Break line after WORD or CHARACTERS. Disabled with NONE - default: WORD
  //       options:{                                                 // Additional options
  //         timeout: 5000                                           // Connection timeout (ms) [applicable only for network printers] - default: 3000
  //       }
  //     });
  //   }
  },
  mounted() {
    this.fetchItems();
    this.fetchCustomers();
    this.fetchSalesmen();
    const data = JSON.parse(localStorage.getItem('pos'))
    this.pos = data
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

.discount{
  width: 20% !important;
}
</style>

