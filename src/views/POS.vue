<template>
    
    <div class="flex flex-col w-screen h-screen bg-gray-800 text-white">
      
    <HeaderNav></HeaderNav>
      <!-- Header -->

      <HeaderComponent @search="searchItems" @focus-btn="focusBtn" @barcode-search="searchByBarcode" @payment="handlePayment" />
  
      <!-- Search Bar -->
      
  
      <!-- Main Content -->
      
      <div class="flex-1 flex overflow-hidden loading">
        <!-- Left Sidebar for Products -->
        <div class="w-3/5 p-4 bg-gray-700 overflow-y-auto">
          <ProductGrid :searchItems="searchItems" :items="filteredItems" :viewMode="viewMode"  @add-to-cart="addToCart" />
        </div>
  
        <!-- Right Sidebar for Cart Summary -->
         
        <div class="w-2/5 bg-gray-900 p-4 border-l">
         
          <CartSummary ref="cartSummaryComponent"  @clear-cart="ClearOrder"  @remove-item="removeItemFromCart" :cart="cart" :vat-rate="vatRate" />
          
        </div>
      </div>

      <FooterViewComponent @clear-order="ClearOrder" :cart="cart" :viewMode="viewMode" @toggle-view="toggleViewMode" @lock="DeskLock"></FooterViewComponent>


      <div v-if="showReturn" class="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-50">
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

        </div>

          <div class="grid grid-cols-2 gap-4">
          <!-- Sales Person Dropdown -->
          <div>
            <button v-if="amountGiven" @click="saveInvoice()" class="w-full bg-green-500 text-white px-2 py-2 mr-2">Get Invoice</button>
          </div>

          <div class="col-span-2">
            <button @click="closeModal" class="w-full bg-red-500 text-white px-2 py-2">Cance Payment</button>
          </div>
        </div>
        
      </div>
    </div>


    <div v-if="showLock==1" class="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-50">
      <div class="bg-gray-600 shadow-lg p-6 w-full max-w-md">

        <div class="grid grid-cols-1 gap-4 justify-between">
          <!-- Payment fields -->
          <div>
            <label class="block text-white">Enter Lock Password</label>
            <input @keydown.enter="focusUnlockBtn()" @click="error_msg=''" type="password" class="text-white bg-gray-800 w-full p-2 text-md" v-model="lock_password" />
            <span class="text-red-600">{{ error_msg }}</span>
          </div>
        </div>

          <div class="grid grid-cols-1 gap-4 mt-2">
          <!-- Sales Person Dropdown -->
          <div>
            <button ref="unlockBtn"  @click="unlockDesk()" class="w-full bg-green-500 text-white px-2 py-2 mr-2">Unlock</button>
          </div>
        </div>
        
      </div>
    </div>



    </div>
  </template>
  
  <script>
  import 'font-awesome/css/font-awesome.css';
   import HeaderComponent from '../components/HeaderComponent.vue'
  import ProductGrid from '../components/ProductGrid.vue'
  import CartSummary from '../components/CartSummary.vue'
  // import SearchBar from '@/components/SearchBar.vue';
  import HeaderNav from '@/components/HeaderNav.vue';
import FooterViewComponent from '@/components/FooterViewComponent.vue';



  
  
  export default {
    components: {
      ProductGrid,
      CartSummary,
      HeaderNav,
      FooterViewComponent,
      HeaderComponent

    },
    data() {
      return {
        showReturn:false,
        items: [], // Load items from local storage
        searchQuery: '',
        filteredItems: [],
        cart: [],
        vatRate: 0.15,
        viewMode: 'List',
        showLock: 0,
        lock_password:"",
        error_msg:""
      }
    },
    created() {
      //this.showLock = localStorage.getItem('showLock')
      this.loadItemsFromLocalStorage()
      this.filteredItems = this.items,
      this.getUnlock()
    },
    computed(){
      this.getUnlock()
    },
    methods: {
      getUnlock(){
          this.showLock = localStorage.getItem('showLock');
      },
      GetInvoice(){

      },
      focusBtn(){
          this.$emit('focus-btn')
      },
      loadItemsFromLocalStorage() {
        const storedItems = JSON.parse(localStorage.getItem('items'))
        this.items = storedItems ? storedItems.items : []
      },
      searchItems(query) {
        this.searchQuery = query.toLowerCase()
        this.filteredItems = this.items.filter(item => {
          return (
            item.item_name.toLowerCase().includes(this.searchQuery) ||
            item.item_code.toLowerCase().includes(this.searchQuery)
          )
        })
      },
      searchByBarcode(barcode) {
        const foundItem = this.items.find(item => item.item_code === barcode);
        if (foundItem) {
          this.addToCart(foundItem);
        } else if (barcode === "") {
          if (this.cart.length > 0) {
            this.$nextTick(() => {
              // Access the CartSummary component via $refs
              const cartSummaryComponent = this.$refs.cartSummaryComponent;
              if (cartSummaryComponent) {
                const PaymentBtn = cartSummaryComponent.$refs.PaymentBtn;
                if (PaymentBtn) {
                  PaymentBtn.focus();
                }
              }
            });
          }
        } else {
          alert('Item not found');
        }
      },
              
      removeItemFromCart(index) {
      // Remove the item from the cart by index
        this.cart.splice(index, 1);
      },
      addToCart(item) {
      // Check if item already exists in cart
      const existingItem = this.cart.find(cartItem => cartItem.item_code === item.item_code);
      
      if (existingItem) {
        // Update quantity and total
        existingItem.quantity += 1;
        existingItem.total = existingItem.quantity * item.price; // Ensure to calculate the total based on quantity
      } else {
        // Add new item to the cart
        this.cart.push({
          item_code: item.item_code,
          name: item.item_name,
          quantity: 1,
          price: item.price,
          total: item.price, // Initialize total for new item
          vatRate: (item?.taxes && item?.taxes.length > 0) ? item?.taxes[0].tax_rate : 0
        });
      }
      
      this.updateCart();
    },
    updateCart() {
      this.cart.forEach(item => {
        // Ensure total is a number and calculate it
        item.total = (item.price * item.quantity) || 0;
        item.vat = (item.total*item.vatRate)/100 || 0;
        item.total = item.total+item.vat;
      });
    },
      calculateTotals() {
        this.cart.forEach(item => {
          if (item.price && item.quantity) {
            item.total = (item.price * item.quantity).toFixed(2)
          } else {
            item.total = 0
          }
        })
      },
      ClearOrder() {
        this.cart = []
      },
      toggleViewMode() {
        this.viewMode = this.viewMode!='Grid' ? 'Grid' : 'List';
      },
      handlePayment() {
        if (this.cart.length === 0) {
          alert('No items in the cart to process payment.')
          return
        }
        alert('Processing payment for the current cart.')
        this.cart = [] // Clear the cart after payment
      },

      DeskLock(){
          this.showLock = 1;
          localStorage.setItem('showLock',1);
          localStorage.setItem('lock_password','123456');
          this.lock_password=""
      },

      unlockDesk(){
        let lock_password = localStorage.getItem('lock_password');
        if(this.lock_password==lock_password)
        {
          this.showLock = 0;
          localStorage.setItem('showLock',0);
        }else{
          this.error_msg = "Invalid Lock Password"
        }
      },

      filterCustomers() {
        this.filteredCustomers = this.customers.data.filter(customer =>
          customer.customer_name.toLowerCase().includes(this.searchQuery.toLowerCase())
        );
      },
      selectCustomer(customer) {
        this.selectedCustomer = customer;
        this.searchQuery = customer.name;
        this.filteredCustomers = [];
        this.$emit('customer-selected', customer);
      },
      clearCustomer() {
        this.selectedCustomer = null;
        this.searchQuery = '';
        this.filteredCustomers = [];
        this.$emit('customer-cleared');
      },
    },
   
  }
  </script>
  