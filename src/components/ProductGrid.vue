<template>
  <div>
   
    <div v-if="viewMode === 'Grid'" class="grid grid-cols-4 gap-2">
      
      <div v-for="item in items" :key="item.item_code" class="bg-gray-600 p-1 rounded cursor-pointer relative" @click="$emit('add-to-cart', item)">
          
            <img v-if="item.image" :src="item.image" alt="" class=" object-cover float-left mr-5 h-20 w-full">
          <img v-else :src="'https://as1.ftcdn.net/v2/jpg/00/70/62/40/1000_F_70624079_oK7bRAjfxEF6thKmaWewjBqgAlMHPSl4.jpg'" alt="Item Image" class="h-20 w-full object-cover float-left mr-5 my-2" />
          
        
          <p class=" top-3 text-right absolute z-40 bg-gray-300 p-1 text-black">{{ item.price }}</p>
        <p>{{ item.item_code }}</p>
        <p class="text-sm">{{ item.item_name }} <span class="ml-2 text-right">{{ item.item_name_arabic }}</span></p>
        
          
        
      </div>
    </div>
    
    <div v-else class="List">
      <div class="grid grid-cols-6 p-2 border-b text-lg font-bold">
            <span>Code</span>
            <span class="col-span-2">Item</span>
            <span>Rate</span>
            <span>UOM</span>
            <span class="text-right">E-rate</span>
      
          </div>
      <div v-for="item in items" :key="item.item_code" class="grid grid-cols-6 px-2 py-1 border-b cursor-pointer" @click="$emit('add-to-cart', item)">
        <span>{{ item.item_code }}</span>
        <span class="col-span-2">{{ item.item_name }} <br> {{ item.item_name_arabic }}</span>
        <span class="col">{{ item.price.toFixed(2) }}</span>
        <span class="col">{{ item.stock_uom }}</span>
        <span class="col text-right">{{ Number(item.standard_rate).toFixed(2) }}</span>
        <!-- <span class="col">{{ (item?.taxes && item?.taxes.length > 0) ? item?.taxes[0].tax_rate+"%" : 0+"%" }}</span> -->
        
        
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
    searchItems: {
      type: Function,
      required: true
    },
    items: Array,
    viewMode: String
  }
}
</script>
