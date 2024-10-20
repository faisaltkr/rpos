<template>
  <div id="app" class="bg-gray-100 min-h-screen">
    <Header />
    <div class="main-content p-4">
      <SearchBar @search="handleSearch" />
      <div class="flex mt-4">
        <ItemGrid :items="filteredItems" @add-to-cart="addToCart" />
        <Cart :cartItems="cartItems" :customer="customer" />
      </div>
    </div>
  
    <Footer :total="total" :additionalDiscount="additionalDiscount" />
  </div>
</template>

<script>
import Header from '../components/HeaderView.vue';
import SearchBar from '../components/SearchBar.vue';
import ItemGrid from '../components/ItemGrid.vue';
import Cart from '../components/CartViewComponent.vue';
import Footer from '../components/FooterViewComponent.vue';

export default {
  components: {
    Header,
    SearchBar,
    ItemGrid,
    Cart,
    Footer,
  },
  data() {
    return {
      items: JSON.parse(localStorage.getItem('items')) || [], // Fetch from local storage
      cartItems: [],
      customer: 'CASH',
      total: 0,
      additionalDiscount: 0,
      searchQuery: '',
    };
  },
  computed: {
    filteredItems() {
      if (!this.searchQuery) {
        return this.items.items;
      }
     
      
      return this.items.items.filter(item => 
        item.item_name.toLowerCase().includes(this.searchQuery.toLowerCase()) || 
        item.item_code.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    },
  },
  methods: {
    addToCart(item) {
      this.cartItems.push(item);
      this.updateTotal();
    },
    updateTotal() {
      this.total = this.cartItems.reduce((acc, item) => acc + item.standard_rate, 0);
    },
    handleSearch(query) {
      this.searchQuery = query;
    },
  },
};
</script>
