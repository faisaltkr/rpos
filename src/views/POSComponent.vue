<template>
  <div :class="[$i18n.locale === 'ar' ? 'rtl' : 'ltr']" class="pos-ui w-full h-screen flex flex-col">
    <HeaderNav></HeaderNav>
    <div class="header flex justify-between items-center p-4 bg-gray-800 text-white">
      <span>{{ $t('Sales') }}</span>
      <div class="actions flex space-x-2">
        <button @click="save" class="btn save"><img src="../assets/save.svg" width="25" alt="">{{ $t('save') }}</button>
        <button @click="print" class="btn print"><img src="../assets/print.svg" width="25" alt="">{{ $t('print') }}</button>
        <button @click="clear" class="btn clear"><img src="../assets/clear.svg" width="25" alt="">{{ $t('clear') }}</button>
        <button @click="cancel" class="btn cancel"><img src="../assets/close.svg" width="25" alt="">{{ $t('cancel') }}</button>
      </div>
    </div>

    <!-- Main Content -->
    <div class="flex flex-grow overflow-hidden">
      <!-- Customer and Invoice Sidebar -->
      <div class="sidebar w-1/4 bg-gray-100 p-4 overflow-y-auto">
        <div class="form-group">
          <label>{{ $t('invoiceNo') }}</label>
          <input type="text" v-model="invoiceNo" class="w-full mb-2"/>
          <label>{{ $t('customer') }}</label>
          <input placeholder="Search Customer" type="text" v-model="customerQuery" @input="searchCustomers" class="w-full mb-2"/>
          <ul v-if="customerSuggestions.length" class="suggestions-dropdown">
            <li v-for="suggestion in customerSuggestions" :key="suggestion.id" @click="selectCustomer(suggestion)">
              {{ suggestion.code }} - {{ suggestion.name }}
            </li>
          </ul>
          <label>{{ $t('salesDate') }}</label>
          <input type="date" v-model="salesDate" class="w-full mb-2"/>
        </div>
      </div>

      <!-- Sales Items and Totals -->
      <div class="main-content w-3/4 flex flex-col p-4">
        <!-- Items List -->
        <div class="items-list flex-grow overflow-y-auto">
          <div class="item flex items-center mb-2" v-for="(item, index) in items" :key="index">
            <input type="text" v-model="item.code" placeholder="Code" class="flex-1"/>
            <input type="text" v-model="item.name" placeholder="Name" class="flex-2"/>
            <input type="number" v-model.number="item.qty" placeholder="Qty" class="w-16 text-center"/>
            <input type="number" v-model.number="item.sRate" placeholder="Price" class="w-20 text-right"/>
            <span class="total w-20 text-right">{{ (item.total || 0).toFixed(2) }}</span>
            <button @click="removeItem(index)" class="ml-2"><img src="../assets/close-black.svg" width="15" alt=""></button>
          </div>
          <button @click="addItem" class="add-item-button">{{ $t('addItem') }}</button>
        </div>

        <!-- Floating Totals -->
        <div class="totals fixed bottom-0 left-0 w-full bg-white p-4 shadow-md flex justify-between">
          <span>{{ $t('grandTotal') }}:</span>
          <span>{{ grandTotal.toFixed(2) }}</span>
        </div>
      </div>
    </div>
  </div>
</template>


<script>
import config from '../database/config.json';
import HeaderNav from "../components/HeaderNav.vue";

export default {
  components: {
    HeaderNav
  },
  data() {
    return {
      baseURL: config.settings.baseURL,
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
        this.createNewItem()
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
        const data = JSON.parse(localStorage.getItem('items'));
        console.log('Items fetched from storage:', data);
        this.availableItems = data.items.map(item => ({
          code: item.item_code,
          name: item.item_name,
          secondName: item.item_name_arabic,
          tax: item?.tax_details?.tax_rate ?? 15,
          qty: 1,
          uom: 'Nos',
          sRate: item.standard_rate,
          sellingPrice: item.standard_rate,
          purchasePrice: item.standard_rate * 0.8,
          stock: item.is_stock_item
        }));
      } catch (error) {
        console.error('Error fetching items:', error);
      }
    },
    async fetchCustomers() {
      try {
        const users = JSON.parse(localStorage.getItem('customers'));
        this.customers = users.map(user => ({
          id: user.id,
          name: user.name,
          code: user.naming_series,
          address: user.addresses.length > 0 ? `${user.addresses[0].address_line1}, ${user.addresses[0].address_line2}` : "",
          balance: user.balance,
          customer_type: user.custom_b2c
        }));
      } catch (error) {
        console.error('Error fetching customers:', error);
      }
    },
    async fetchSalesmen() {
      try {
        // Placeholder for future API implementation to fetch salesmen data
        console.log('Fetch salesmen logic needs to be implemented');
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

      if (suggestionsLength === 0) return;

      if (this.highlightedIndices[index] === undefined) {
        this.$set(this.highlightedIndices, index, -1);
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
          return;
      }

      event.preventDefault();
    },
    searchItems(query, index, el) {
      if (query.length > 1) {
        const filterField = el === 'name' ? 'name' : 'code';
        this.items[index].suggestions = this.availableItems.filter(item =>
          item[filterField].toLowerCase().includes(query.toLowerCase())
        );
        this.element = el === 'name' ? 'code' : 'name';
        this.$set(this.highlightedIndices, index, -1);
      } else {
        this.items[index].suggestions = [];
      }
    },
    selectSuggestion(suggestion, index) {
      this.items[index] = {
        ...suggestion,
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
      };
      this.addNewRow();
    },
    addNewRow() {
      this.items.push(this.createNewItem());
      this.$set(this.highlightedIndices, this.items.length - 1, -1);
    },
    createNewItem() {
      return {
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
      };
    },
    async save() {
      try {
        const invoiceData = {
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

        const erpResponse = await fetch(`${this.baseURL}/api/resource/Sales Invoice`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Basic ${localStorage.getItem('token')}`,
          },
          body: JSON.stringify(invoiceData),
        });

        if (!erpResponse.ok) {
          throw new Error('Error saving invoice in ERPNext.');
        }

        const erpResult = await erpResponse.json();

        const zatcaResponse = await fetch('YOUR_ZATCA_API_ENDPOINT', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            invoiceData,
            erpReference: erpResult.data.name,
          }),
        });

        if (!zatcaResponse.ok) {
          throw new Error('Error sending invoice to ZATCA.');
        }

        this.printInvoice(erpResult.data.name);

        alert('Invoice saved in ERPNext and sent to ZATCA successfully!');
      } catch (error) {
        console.error('Error during save process:', error);
        alert('Failed to save the invoice. Please try again.');
      }
    },
    printInvoice(invoiceId) {
      window.open(`/printview?doctype=Sales Invoice&name=${invoiceId}&format=Standard&no_letterhead=0`, '_blank');
    },
    clear() {
      alert('Clear clicked!');
    },
    cancel() {
      alert('Cancel clicked!');
    },
    deleteAllRows() {
      this.items = [this.createNewItem()];
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
        const nextElement = form.elements[Array.prototype.indexOf.call(form, event.target) + 1];
        if (nextElement) {
          nextElement.focus();
        }
      }
    }
  },
  async mounted() {
    await this.fetchItems();
    await this.fetchCustomers();
    await this.fetchSalesmen();
  }
};
</script>


<style scoped>
/* Base Styles */
body {
  font-family: Arial, sans-serif;
}

.pos-ui {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: #f3f4f6;
}

/* Header Styles */
.header {
  background-color: #1f2937;
  color: #fff;
  padding: 10px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header .actions {
  display: flex;
  gap: 10px;
}

.header .btn {
  background: #4b5563;
  color: white;
  border: none;
  padding: 8px 12px;
  border-radius: 4px;
  cursor: pointer;
}

.header .btn:hover {
  background: #374151;
}

/* Sidebar Styles */
.sidebar {
  background-color: #e5e7eb;
  width: 25%;
  padding: 20px;
  overflow-y: auto;
  border-right: 1px solid #d1d5db;
}

.sidebar .form-group {
  margin-bottom: 15px;
}

.sidebar .form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

.sidebar .form-group input {
  width: 100%;
  padding: 8px;
  border: 1px solid #d1d5db;
  border-radius: 4px;
}

/* Main Content Styles */
.main-content {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  padding: 20px;
}

.items-list {
  flex-grow: 1;
  margin-bottom: 20px;
}

.items-list .item {
  display: flex;
  align-items: center;
  gap: 10px;
  background: #fff;
  padding: 10px;
  border-radius: 5px;
  margin-bottom: 10px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.items-list .item input {
  padding: 8px;
  border: 1px solid #d1d5db;
  border-radius: 4px;
}

.items-list .add-item-button {
  background: #3b82f6;
  color: white;
  padding: 10px 15px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 10px;
}

.items-list .add-item-button:hover {
  background: #2563eb;
}

/* Floating Totals Styles */
.totals {
  background: #fff;
  padding: 15px;
  border-top: 1px solid #d1d5db;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.totals span {
  font-weight: bold;
  font-size: 18px;
}

/* Suggestions Dropdown */
.suggestions-dropdown {
  background: white;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  margin-top: 5px;
  max-height: 150px;
  overflow-y: auto;
  position: absolute;
  z-index: 10;
  width: 100%;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
}

.suggestions-dropdown li {
  padding: 8px 10px;
  cursor: pointer;
}

.suggestions-dropdown li:hover {
  background-color: #f9fafb;
}

/* Responsive Design */
@media (max-width: 768px) {
  .pos-ui {
    flex-direction: column;
  }

  .sidebar {
    width: 100%;
    border-right: none;
    border-bottom: 1px solid #d1d5db;
  }

  .main-content {
    width: 100%;
    padding: 10px;
  }

  .totals {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    width: 100%;
    box-shadow: 0 -2px 5px rgba(0, 0, 0, 0.1);
  }
}

</style>

