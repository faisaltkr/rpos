<template>
    <div class="flex flex-col w-screen h-screen bg-gray-800 text-white">

    <HeaderNav></HeaderNav>
      <!-- Header -->
       <!-- <HeaderView></HeaderView> -->
      <HeaderComponent @search="searchItems" @focus-btn="focusBtn" @barcode-search="searchByBarcode" @payment="handlePayment" />
  
      <!-- Search Bar -->
      
  
      <!-- Main Content -->
      
      <div class="flex-1 flex overflow-hidden">
            
        <!-- Left Sidebar for Products -->
        <div class="w-2/4 p-4 bg-gray-700 overflow-y-auto">
          <ProductGrid :searchItems="searchItems" :items="filteredItems" :viewMode="viewMode"  @add-to-cart="addToCart" />
        </div>
  
        <!-- Right Sidebar for Cart Summary -->
         
        <div class="w-2/4 bg-gray-900 p-4 border-l">
         
          <CartSummary @clear-cart="ClearOrder" @focus-btn="PaymentBtnFocus(btn)"  @remove-item="removeItemFromCart" :cart="cart" :vat-rate="vatRate" />
          
        </div>
      </div>

      <FooterViewComponent :viewMode="viewMode" @toggle-view="toggleViewMode"></FooterViewComponent>

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
// import HeaderView from '@/components/HeaderView.vue';



  
  
  export default {
    components: {
      ProductGrid,
      CartSummary,
      // HeaderView,
      HeaderNav,
      FooterViewComponent,
      HeaderComponent

    },
    data() {
      return {
        items: [], // Load items from local storage
        searchQuery: '',
        filteredItems: [],
        cart: [],
        vatRate: 0.15,
        viewMode: 'List'
      }
    },
    created() {
      this.loadItemsFromLocalStorage()
      this.filteredItems = this.items
    },
    methods: {
      focusBtn(){
          this.$emit('focus-btn')
      },
      loadItemsFromLocalStorage() {
        const storedItems = JSON.parse(localStorage.getItem('items'))
        this.items = storedItems ? storedItems.items : []
        console.log(this.items);
        
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
        const foundItem = this.items.find(item => item.item_code === barcode)
        if (foundItem) {
          this.addToCart(foundItem)
        } else {
          if(this.cart.length > 0){
            this.$refs.PaymentBtn.focus()
          }
          alert('Item not found')
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
        existingItem.total = existingItem.quantity * item.standard_rate; // Ensure to calculate the total based on quantity
      } else {
        // Add new item to the cart
        this.cart.push({
          item_code: item.item_code,
          name: item.item_name,
          quantity: 1,
          price: item.standard_rate,
          total: item.standard_rate, // Initialize total for new item
          vat: (item?.taxes && item?.taxes.length > 0) ? item?.taxes[0].tax_rate : 0
        });
      }
      
      this.updateCart();
    },
    updateCart() {
      this.cart.forEach(item => {
        // Ensure total is a number and calculate it
        item.total = (item.price * item.quantity) || 0;
      });
    },
      calculateTotals() {
        this.cart.forEach(item => {
          if (item.standard_rate && item.quantity) {
            item.total = (item.standard_rate * item.quantity).toFixed(2)
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
      
    }
  }
  </script>
  