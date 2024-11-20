<template>
 
    <div class="flex flex-col w-screen h-screen bg-gray-800 text-white">
      <HeaderNav />
    
      <div class="container mx-auto mt-2" v-if="toggle">
  <div class="grid grid-cols-3 mt-4">
    
    <span class="flex items-center  space-x-2">
      <h1 class="text-white text-3xl my-4">Items List</h1>
      
    </span>
    <span>
      <input
        type="text"
        v-model="searchQuery"
        placeholder="Search by Item Code, Barcode, or Name"
        class="p-2 border bg-gray-600 "
      />
    </span>
    <span class="text-right">
      <button @click="toggleForm(toggle)" class="bg-green-600 p-2 text-white rounded">
        Add New
      </button>
    </span>
  </div>

  <div class="flex-1 flex overflow-hidden loading overflow-y-scroll h-3/4">
    <table class="min-w-full bg-gray-800 rounded-lg shadow-md">
      <thead>
        <tr>
          <th class="bg-gray-600 py-2 px-4 border-b">Barcode</th>
          <th class="bg-gray-600 py-2 px-4 border-b">Item Code</th>
          <th class="bg-gray-600 py-2 px-4 border-b">Item Name</th>
          <th class="bg-gray-600 py-2 px-4 border-b">Item Name in Arabic</th>
          <th class="bg-gray-600 py-2 px-4 border-b">Unit Price</th>
          <th class="bg-gray-600 py-2 px-4 border-b">Stock UOM</th>
          <th class="bg-gray-600 py-2 px-4 border-b">Price With VAT</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="item in filteredItems"
          :key="item.name"
          class="hover:bg-gray-800"
        >
          <td
            class="py-2 px-4 border-b relative"
            @mouseenter="hoverBarcode(item.barcode_details)"
            @mouseleave="hideTooltip"
          >
            {{ (item.barcode_details.length > 0) ? item.barcode_details[0].barcode : "" }}
            <div
              v-if="showTooltip && tooltipData === item.barcode_details"
              class="absolute left-0 top-full mt-1 bg-gray-700 text-white p-2 rounded shadow-lg z-10"
            >
              <ul>
                <li v-for="barcode in item.barcode_details" :key="barcode.barcode">
                  {{ barcode.barcode }}
                </li>
              </ul>
            </div>
          </td>
          <td class="py-2 px-4 border-b">{{ item.item_code }}</td>
          <td class="py-2 px-4 border-b">{{ item.item_name }}</td>
          <td class="py-2 px-4 border-b">{{ item.item_name_arabic }}</td>
          <td class="py-2 px-4 border-b text-right">{{ item.price?.toFixed(2) }}</td>
          <td class="py-2 px-4 border-b">{{ item.stock_uom }}</td>
          <td class="py-2 px-4 border-b">{{ Number(calculateVat(item))?.toFixed(2) }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</div>

      <div class="container-fluid mx-auto mt-2" v-if="!toggle">
        <div class="grid grid-cols-2 gap-4">
          <span><h1 class="text-white text-3xl my-4 ml-5">Add Item</h1></span>
          <span class="text-right mt-2"><button @click="toggleForm(toggle)" class="bg-green-600 p-2 mr-5">Show Item List</button></span>
        </div>
        <div class="flex-1 flex overflow-hidden loading">

        <form @submit.prevent="createItem">
            <div class="grid grid-cols-2 gap-4 m-2 p-4">

              <div>
                <label for="" class="text-white">Item Code</label>
                <input type="text" v-model="item.item_code" class="mt-2 p-2 text-white bg-gray-600">
              </div>

              <div>
                <label for="" class="text-white">Item Name</label>
                <input type="text"  v-model="item.item_name" class="mt-2 p-2 text-white bg-gray-600">
              </div>
              <div>
                <label for="" class="text-white">Item Name Arabic</label>
                <input type="text" v-model="item.item_name_arabic" class="mt-2 p-2 text-white bg-gray-600">
              </div>
              <div>
                <label for="" class="text-white">Company</label>
                <input type="text" v-model="item.company_name" class="mt-2 p-2 text-white bg-gray-600">
              </div>
              <div>
                <label for="" class="text-white">Item Group</label>
                <select v-model="item.item_group" class="text-white bg-gray-600 mt-2 p-2 w-full">
                    <option v-for="group in this.ItemGroups" :key="group.name">{{ group.name }}</option>
                 </select>
              </div>
              <div>
                <label for="" class="text-white">Stock UOM</label>
                 <select v-model="item.stock_uom" class="text-white bg-gray-600 mt-2 p-2 w-full">
                    <option v-for="uom in Uoms"  :key="uom.name">{{ uom.name }}</option>
                 </select>
              </div>
              <div>
                <label for="" class="text-white">Brand</label>
                <input type="text" v-model="item.brand" class="mt-2 p-2 text-white bg-gray-600">
              </div>
              

              <div>
                <label for="" class="text-white">Standard Rate</label>
                <input type="text" v-model="item.standard_rate" class="mt-2 p-2 text-white bg-gray-600">
              </div>

              <div>
                <label for="" class="text-white">Opening Stock</label>
                <input type="text" v-model="item.opening_stock" class="mt-2 p-2 text-white bg-gray-600">
              </div>
              <div>
                
                <div class="flex items-center mt-8 bg-gray-600 p-2">
                  
                    <input id="inline-checkbox" type="checkbox" v-model="item.tax_inclusive" @click="calculateTaxInclusive" class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600 pr-4">
                    <label for="inline-checkbox" class="ms-2 text-sm font-medium text-white dark:text-gray-300">Tax Inclusive</label>
                </div>
                
              </div>
              <div>
                  <label for="" class="text-white">Enter Barcode for selected UOM(For advanced barcodes refer WebApp)</label>
                  <input @input="addBarcodes" type="text" v-model="barcode" class="mt-2 p-2 text-white bg-gray-600">
                </div>
                <div class="mt-1">
                  <label for="" class="text-white p-2">Select Item Tax Template(optional)</label>
                <select v-model="tax_template" @change="selectTaxTemplate" class="w-full p-3 bg-gray-700">
                  <option value="">Select Tax Template</option>
                  <option v-for="template in taxTemplates" :key="template.name" :value="template.name">
                    {{ template.name }}
                  </option>
                </select>
              </div>


              </div>
        <div class="grid grid-cols-2 gap-4 m-2 p-4">
            <div class="col-span-2 text-center">
                <button class="p-2 px-10  bg-green-600 ">Save</button>
             </div>
        </div>
      </form>
      </div>
      </div>
  
    </div>
  
    
  </template>
  
  <script>
  import axios from "axios";
import HeaderNav from "../components/HeaderNav.vue";
import { nextTick } from "vue";
  
  
  export default {
    components: {
      HeaderNav
    },
    data() {
      return {
        searchQuery:"",
        toggle:true,
        showAddItem:false,
        showList:true,
        baseURL:localStorage.getItem('baseURL'),
        company:localStorage.getItem('companyName'),
        Uoms:[],
        ItemGroups:[],
        salesData:[],
        items:[],
        tax_template:"",
        showTooltip: false,
        tooltipData: null, // Holds the
        item: {
            item_code: "",
            item_name: "",
            description: "",
            stock_uom: "PCE",
            standard_rate: 0,
            item_group: "All Item Groups",
            is_stock_item: 0,
            tax_inclusive:0,
            opening_stock:0,
            company_name:localStorage.getItem('companyName'),
            price:0,
            taxes:[],
            barcodes:[]
        },
        barcode:"",
        taxTemplates:[],
        vat:0
      };
      
    },

    mounted(){
      this.getUOM(),
      this.getItemGroups()
      this.fetchItemsList();
      this.fetchTaxTemplates();
    },
    computed:{

      filteredItems() {
    // Filter items based on searchQuery
    const query = this.searchQuery.toLowerCase();
    return this.items.filter((item) => {
      const barcodeMatch = item.barcode_details.some((barcodeObj) =>
        barcodeObj.barcode.toLowerCase().includes(query)
      );
      const itemCodeMatch = item.item_code.toLowerCase().includes(query);
      const itemNameMatch = item.item_name.toLowerCase().includes(query);

      return barcodeMatch || itemCodeMatch || itemNameMatch;
    });
  },
      
    },
    // watch: {
    //   'item.tax_inclusive': function () {
    //     this.calculateTaxInclusive();
    //   },
    // },
    methods: {
      hoverBarcode(barcodeDetails) {
        this.tooltipData = barcodeDetails; // Set the barcode details for the tooltip
        this.showTooltip = true; // Show the tooltip
      },
      hideTooltip() {
        this.showTooltip = false; // Hide the tooltip
        this.tooltipData = null; // Reset the tooltip data
      },
      addBarcodes(){
        this.item.barcodes.push(
            {
              "barcode": this.barcode,
              "barcode_type": "EAN",
              "posa_uom": this.item.stock_uom,
              "uom": this.item.stock_uom,
          });
      },
      selectTaxTemplate(){
        this.item.taxes.push({item_tax_template:this.tax_template});
        console.log(this.item.taxes);
      },
      toggleForm(toggle){
          this.toggle=!toggle;
      },  
      async calculateTaxInclusive() {
        
        await nextTick();
        if (this.item.tax_inclusive == 1 && this.item.standard_rate > 0) {
          this.item.price = this.item.standard_rate / 1.15;
        } else {
          this.item.price = this.item.standard_rate;
        }
      },

      calculateVat(item){
        var tax_rate = (item?.taxes && item?.taxes.length > 0) ? item?.taxes[0].tax_rate : 0;
        return item.price + (item.price*tax_rate/100);
      },

      async createItem() {
        try {

          if(this.item.item_code=="")
          {
              alert('Item Code is required');
              return false;
          }
          if(this.item.item_name=="")
          {
              alert('Item Name is required');
              return false;
          }
          if(this.item.standard_rate=="")
          {
              alert('Item Standared Selling Price is required');
              return false;
          }
          this.item.standard_rate = parseFloat(this.item.standard_rate);
          const response = await fetch(this.baseURL+'/api/resource/Item', { // Replace with actual API endpoint
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Basic ${localStorage.getItem('token')}` 
            },
            body: JSON.stringify(this.item)
          });
  
          if (response.ok) {
            alert('Customer registered successfully!');
            this.clearForm();
            this.fetchItemsList()
            this.toggle=true;
          } else {
            const errorData = await response.json();
            alert('Error registering customer: ' + errorData.message);
          }
        } catch (error) {
          console.error('Error:', error);
            alert('An error occurred while registering the customer.');
        }
      },
      clearForm() {
        this.item= {
            item_code: "",
            item_name: "",
            description: "",
            stock_uom: "PCE",
            standard_rate: 0,
            item_group: "All Item Groups",
            is_stock_item: 0,
            tax_inclusive:0,
            opening_stock:0,
            company_name:this.company,
            price:0,
            taxes:[]
        }
      },
      async getUOM()
      {
        const UOMURL = this.baseURL +`/api/resource/UOM`;
        axios.get(UOMURL, {
                headers: {
                  Authorization: `Basic ${localStorage.getItem("token")}`,
                },
              })
              .then((result) => {
                console.log(result);
          
                let data = result.data.data;
                this.Uoms = data; 
              });
      },
      async getItemGroups()
      {

        const UOMURL = this.baseURL +`/api/resource/Item Group`;
        axios.get(UOMURL, {
                headers: {
                  Authorization: `Basic ${localStorage.getItem("token")}`,
                },
              })
              .then((result) => {
                console.log(result);
          
                let data = result.data.data;
                this.ItemGroups = data; 
              });

      },
      async fetchItemsList() {
          // let items = JSON.parse(localStorage.getItem('items'))
          // return this.items = items.items;
          let items =this.baseURL+`/api/method/exone_api.masters.get_items_with_tax_template?company_name=${this.company}`;
            axios.get(items, {
                headers: {
                  Authorization: `Basic ${localStorage.getItem("token")}`,
                },
              })
              .then((result) => {
                this.items = result.data.message.items;
                console.log(this.items);
                
              });
      },

      async fetchTaxTemplates() {
        const response = await fetch(`${this.baseURL}/api/resource/Item Tax Template`, {
          headers: {
            Authorization: `Basic ${localStorage.getItem('token')}`,
          },
        });
        const data = await response.json();
        console.log(data);
        
        this.taxTemplates = data.data;
      },
      async translateToArabic() {
      if (this.item.item_name.trim() === '') {
        this.item.item_name_in_arabic = '';
        return;
      }

      try {

       // Replace this with your actual API call to a translation service
        const response = await axios.post(
          'https://translation.googleapis.com/language/translate/v2', // Google Translate API endpoint
          {
            q: this.item.item_name,
            target: 'ar', // Arabic
            key: 'AIzaSyAOVYRIgupAurZup5y1PRh8Ismb1A3lLao', // Replace with your actual API key
          }
        );

        //Update the Arabic translation
        this.item.item_name_arabic = response.data.data.translations[0].translatedText;
      } catch (error) {
        console.error('Translation failed:', error);
      }
    },
    }
  };
  </script>
  
  <style scoped>
  
  </style>
  