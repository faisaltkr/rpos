<template>
  <div>
  
    <div v-if="viewMode === 'Grid'" class="grid grid-cols-4 gap-4">
      <div v-for="item in items" :key="item.item_code" class="bg-gray-600 p-4 rounded cursor-pointer" @click="$emit('add-to-cart', item)">
        <h3>{{ item.item_name }}</h3>
        <p>{{ item.standard_rate }}</p>
      </div>
    </div>
    <div v-else class="List">
      <div v-for="item in items" :key="item.item_code" class="flex justify-between p-4 border-b cursor-pointer" @click="$emit('add-to-cart', item)">
        <h3>{{ item.item_name }}</h3>
        <p>{{ item.standard_rate }}</p>
      </div>
    </div>
  </div>
</template>

<script>
//import SearchBar from './SearchBar.vue';

export default {

  props: {
    searchItems:Array,
    items: Array,
    viewMode: String
  }
}
</script>
