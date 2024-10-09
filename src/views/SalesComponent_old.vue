<template>
  <div :class="[$i18n.locale === 'ar' ? 'rtl' : 'ltr']" class="window w-5/6 h-screen overflow-hidden">
    <HeaderNav/>
    
    <form @submit.prevent>
      <div class="sales-form">
        <div class="header">
          <span class="p-1">{{ $t('Sales') }}</span>
          <div class="actions">
            <button @click="save" class="btn save">
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

          <button @click="cancel" class="btn cancel">
            <img src="../assets/close.svg" class="inline-block p-1" width="25" alt="">
              {{ $t('cancel') }}
          </button>
          </div>
        </div>
        <table width="100%" class="table-noborder">
            <tr>
              <td width="10%"><span class="p-1">{{ $t('invoiceNo') }}</span></td>
              <td width="10%"><input type="text" v-model="invoiceNo" @keydown.enter="focusNext($event)" /></td>
              <td width="10%" class="text-right"><span class="p-1">{{ $t('salesDate') }}</span></td>
              <td width="20%"><input type="date" v-model="salesDate" @keydown.enter="focusNext($event)" /></td>
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
                {{ suggestion.code }} - {{ suggestion.name }}
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
 
 import config from '../database/config.json';
import HeaderNav from "../components/HeaderNav.vue";
import { ref, reactive } from 'vue';

export default {
  components: {
    HeaderNav
  },
  data() {
    return {
      baseURL:config.settings.baseURL,
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
          sRate: item.standard_rate,
          sellingPrice: item.standard_rate,
          purchasePrice: item.standard_rate * 0.8,  // Assuming purchase price is 80% of selling price for demo
          stock: item.is_stock_item
        }));
      } catch (error) {
        console.error('Error fetching items:', error);
      }
    },
    async fetchCustomers() {
      try {
        const users = JSON.parse(localStorage.getItem('customers'))

        console.log(users);
        //const response = await fetch('https://dummyjson.com/users'); // Replace with your actual API endpoint
        //const response = await fetch('');
        //const data = await response.json();

        //console.log(data);
        this.customers = users.map(user => (
          {
            id: user.id,
            name: user.name,
            code: user.naming_series, // Assuming username is used as customer code for demo purposes
            address: user.addresses.length > 0 ? user.addresses[0].address_line1 +','+ user.addresses[0].address_line2  : "",
            balance: user.balance,
            customer_type:user.custom_b2c
          }
      ));
      } catch (error) {
        console.error('Error fetching customers:', error);
      }
    },
    async fetchSalesmen() {
      try {
        //const response = await fetch('https://dummyjson.com/users'); // Replace with your actual API endpoint
        
        //const data = await response.json();

        // const data = localStorage.getItem('pos_profile')

        // this.salesmen = data.map(pos => ({
        //   name: pos.name,
        //   payment_methods : pos.payment_methods.map(payment => ({
        //      mode_of_payment : payment.mode_of_payment
        //   }))
        //}));
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

    handleKeyNavigation(event, index) {
    const item = this.items[index];
    const suggestionsLength = item.suggestions.length;

    if (suggestionsLength === 0) {
      return;
    }

    if (this.highlightedIndices[index] === undefined) {
      this.$set(this.highlightedIndices, index, -1); // Ensure highlighted index is initialized
    }

    switch (event.key) {
      case 'ArrowDown':
        this.highlightedIndices[index] = (this.highlightedIndices[index] + 1) % suggestionsLength;
        break;
      case 'ArrowUp':
        this.highlightedIndices[index] = (this.highlightedIndices[index] - 1 + suggestionsLength) % suggestionsLength;
        break;
      case 'Enter':
        if (this.highlightedIndices[index] >= 0) {
          this.selectSuggestion(item.suggestions[this.highlightedIndices[index]], index);
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
      this.$set(this.highlightedIndices, index, -1); // Properly initialize highlighted index for the row
    } else {
      this.items[index].suggestions = [];
    }
  },
    // selectSuggestion(suggestion, index) {
    //   this.items[index] = {
    //     ...suggestion,
    //     suggestions: [],
    //     get grossAmt() {
    //       return this.qty * this.sRate;
    //     },
    //     get netAmt() {
    //       return this.grossAmt;
    //     },
    //     get vatAmt() {
    //       return this.grossAmt * this.tax / 100;
    //     },
    //     get total() {
    //       return this.netAmt + this.vatAmt;
    //     },
    //   };
    //   this.addNewRow();
    // },
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
    this.$set(this.highlightedIndices, this.items.length - 1, -1); // Initialize highlighted index for the new row
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
            const erpResponse = await fetch(this.baseURL+'/api/resource/Sales Invoice', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Basic ${localStorage.getItem('token')}`, // Replace with your ERPNext API Token
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
    removeItem(index) {
      this.items.splice(index, 1);
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

.discount{
  width: 20% !important;
}
</style>

