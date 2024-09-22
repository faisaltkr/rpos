<template>
      <div class="sales-container">
        <h1>Sales Invoice</h1>
        <form @submit.prevent="submitInvoice">
          <div class="form-group">
            <label for="invoiceNo">Invoice No</label>
            <input type="text" id="invoiceNo" v-model="invoiceNo" required />
          </div>
  
          <div class="form-group">
            <label for="customer">Customer</label>
            <select id="customer" v-model="selectedCustomer" @change="loadCustomer">
              <option v-for="customer in customers" :key="customer.id" :value="customer.id">
                {{ customer.name }}
              </option>
            </select>
          </div>
  
          <div class="form-group">
            <label for="poDate">PO Date</label>
            <input type="date" id="poDate" v-model="poDate" />
          </div>
  
          <div class="form-group">
            <label for="poNo">PO No</label>
            <input type="text" id="poNo" v-model="poNo" />
          </div>
  
          <div class="form-group">
            <label for="dateTime">Date and Time</label>
            <input type="datetime-local" id="dateTime" v-model="dateTime" />
          </div>
  
          <div class="form-group">
            <label for="invoiceType">Invoice Type</label>
            <select id="invoiceType" v-model="invoiceType">
              <option value="Standard">Standard</option>
              <option value="Proforma">Proforma</option>
            </select>
          </div>
  
          <div class="form-group">
            <label for="transactionType">Transaction Type</label>
            <select id="transactionType" v-model="transactionType">
              <option value="Sale">Sale</option>
              <option value="Return">Return</option>
            </select>
          </div>
  
          <h2>Items</h2>
          <div class="items-container">
            <div class="item" v-for="(item, index) in items" :key="index">
              <div class="form-group">
                <label>Item Code</label>
                <input type="text" v-model="item.code" />
              </div>
              <div class="form-group">
                <label>Item Name</label>
                <input type="text" v-model="item.name" />
              </div>
              <div class="form-group">
                <label>Qty</label>
                <input type="number" v-model.number="item.qty" @input="updateItem(index)" />
              </div>
              <div class="form-group">
                <label>Price</label>
                <input type="number" v-model.number="item.price" @input="updateItem(index)" />
              </div>
              <div class="form-group">
                <label>Total</label>
                <input type="number" v-model.number="item.total" readonly />
              </div>
              <div class="form-group">
                <label>Discount (%)</label>
                <input type="number" v-model.number="item.discount" @input="updateItem(index)" />
              </div>
              <div class="form-group">
                <label>VAT Amount</label>
                <input type="number" v-model.number="item.vat" readonly />
              </div>
              <div class="form-group">
                <label>Net Total</label>
                <input type="number" v-model.number="item.netTotal" readonly />
              </div>
            </div>
            <button type="button" @click="addItem">Add Item</button>
          </div>
  
          <h2>Invoice Totals</h2>
          <div class="form-group">
            <label>Total</label>
            <input type="number" v-model.number="totals.total" readonly />
          </div>
          <div class="form-group">
            <label>Discount</label>
            <input type="number" v-model.number="totals.discount" readonly />
          </div>
          <div class="form-group">
            <label>VAT Amount</label>
            <input type="number" v-model.number="totals.vat" readonly />
          </div>
          <div class="form-group">
            <label>Gross Total</label>
            <input type="number" v-model.number="totals.grossTotal" readonly />
          </div>
          <div class="form-group">
            <label>Total in Words</label>
            <input type="text" v-model="totals.totalInWords" readonly />
          </div>
  
          <button type="submit">Submit Invoice</button>
        </form>
      </div>
  </template>
  
  <script>
//   import axios from 'axios';
  
  export default {
    data() {
      return {
        invoiceNo: '',
        selectedCustomer: '',
        poDate: '',
        poNo: '',
        dateTime: '',
        invoiceType: 'Standard',
        transactionType: 'Sale',
        customers: [
          { id: 1, name: 'Customer A' },
          { id: 2, name: 'Customer B' }
        ],
        items: [
          { code: '', name: '', qty: 1, price: 0, total: 0, discount: 0, vat: 0, netTotal: 0 }
        ],
        totals: {
          total: 0,
          discount: 0,
          vat: 0,
          grossTotal: 0,
          totalInWords: ''
        }
      };
    },
    methods: {
      loadCustomer() {
        // Load customer details from API if needed
      },
      addItem() {
        this.items.push({ code: '001', name: 'Faisal', qty: 1, price: 0, total: 0, discount: 0, vat: 0, netTotal: 0 });
      },
      updateItem(index) {
        const item = this.items[index];
        item.total = item.qty * item.price;
        item.vat = (item.total - (item.total * (item.discount / 100))) * 0.05;
        item.netTotal = item.total - (item.total * (item.discount / 100)) + item.vat;
        this.updateTotals();
      },
      updateTotals() {
        let total = 0, discount = 0, vat = 0, grossTotal = 0;
        this.items.forEach(item => {
          total += item.total;
          discount += item.total * (item.discount / 100);
          vat += item.vat;
          grossTotal += item.netTotal;
        });
        this.totals.total = total;
        this.totals.discount = discount;
        this.totals.vat = vat;
        this.totals.grossTotal = grossTotal;
        this.totals.totalInWords = this.numberToWords(grossTotal);
      },
      // numberToWords(number) {
      //   // Implement a function to convert numbers to words
      //   // For simplicity, you can use a library like `number-to-words`
      //   return numberToWords.toWords(number);
      // },
      submitInvoice() {
        console.log('Invoice submitted');
        // Implement submission logic
      }
    }
  };
  </script>
  
  <style>
  #app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    text-align: center;
    color: #2c3e50;
    margin-top: 60px;
  }
  
  .sales-container {
    width: 600px;
    margin: 0 auto;
  }
  
  .form-group {
    margin-bottom: 15px;
    text-align: left;
  }
  
  label {
    display: block;
    margin-bottom: 5px;
  }
  
  input,
  select {
    width: 100%;
    padding: 8px;
    box-sizing: border-box;
  }
  
  .items-container {
    margin-top: 20px;
  }
  
  .item {
    margin-bottom: 15px;
    border: 1px solid #ccc;
    padding: 10px;
  }
  
  button {
    width: 100%;
    padding: 10px;
    background-color: #42b983;
    border: none;
    color: white;
    font-size: 16px;
    cursor: pointer;
    margin-top: 20px;
  }
  
  button:hover {
    background-color: #357a38;
  }
  </style>
  