<template>
  <div>
   
    <div v-if="viewMode === 'Grid'" class="grid grid-cols-2 gap-2">
      
      <div v-for="item in items" :key="item.item_code" class="bg-gray-600 p-4 rounded cursor-pointer" @click="$emit('add-to-cart', item)">
        <img v-if="item.image" :src="item.image" alt="" class="h-24 w-24 object-cover float-left mr-5">
        <img v-else :src="'https://as1.ftcdn.net/v2/jpg/00/70/62/40/1000_F_70624079_oK7bRAjfxEF6thKmaWewjBqgAlMHPSl4.jpg'" alt="Item Image" class="h-24 object-cover float-left mr-5" />
        <h3>{{ item.item_code }}</h3>
        <p>{{ item.item_name }} <span class="text-right">{{ item.item_name_arabic }}</span></p>
        <p class="text-right"><span v-html="currencySymbol(pos.pos_profiles[0].currency)"></span>{{ item.standard_rate }}</p>
      </div>
    </div>
    
    <div v-else class="List">
      <div class="grid grid-cols-6 p-4 border-b text-lg font-bold">
            <span>Item Code</span>
            <span class="col-span-2">Item Name</span>
            <span>Rate</span>
            <span>Vat</span>
            <span>Total</span>
          </div>
      <div v-for="item in items" :key="item.item_code" class="grid grid-cols-6 p-4 border-b cursor-pointer" @click="$emit('add-to-cart', item)">
        <span>{{ item.item_code }}</span>
        <span class="col-span-2">{{ item.item_name }}</span>
        <span class="col"><span v-html="currencySymbol(pos.pos_profiles[0].currency)"></span>{{ item.standard_rate }}</span>
        <span class="col">{{ item.stock_uom }}</span>
        <span class="col">{{ (item?.taxes && item?.taxes.length > 0) ? item?.taxes[0].tax_rate+"%" : 0+"%" }}</span>
        
        
      </div>
      
    </div>
  </div>
</template>

<script>
//import SearchBar from './SearchBar.vue';

export default {

  data(){
    return{
        pos:JSON.parse(localStorage.getItem('pos'))
    }
  },

  props: {
    searchItems:Array,
    items: Array,
    viewMode: String
  }
}
</script>
