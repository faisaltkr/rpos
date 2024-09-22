<template>
  <div :class="[$i18n.locale === 'ar' ? 'rtl' : 'ltr']" class="window w-5/6 h-screen overflow-hidden">
    <HeaderNav />
    
    <div class="dashboard grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4">
      <div class="card bg-blue-500 text-white p-5 rounded-lg shadow-lg">
        <h3 class="text-lg font-semibold">{{ $t('totalSales') }}</h3>
        <p class="text-2xl font-bold">{{ formatCurrency(totalSales) }}</p>
      </div>
      
      <div class="card bg-green-500 text-white p-5 rounded-lg shadow-lg">
        <h3 class="text-lg font-semibold">{{ $t('salesToday') }}</h3>
        <p class="text-2xl font-bold">{{ formatCurrency(salesToday) }}</p>
      </div>
      
      <div class="card bg-yellow-500 text-white p-5 rounded-lg shadow-lg">
        <h3 class="text-lg font-semibold">{{ $t('totalCustomers') }}</h3>
        <p class="text-2xl font-bold">{{ totalCustomers }}</p>
      </div>
      
      <div class="card bg-red-500 text-white p-5 rounded-lg shadow-lg">
        <h3 class="text-lg font-semibold">{{ $t('totalInvoices') }}</h3>
        <p class="text-2xl font-bold">{{ totalInvoices }}</p>
      </div>
    </div>
    
    <div class="sales-table mt-10">
      <h2 class="text-xl font-semibold mb-4">{{ $t('recentSales') }}</h2>
      <table class="min-w-full bg-white rounded-lg shadow-md overflow-hidden">
        <thead>
          <tr>
            <th class="py-2 px-4 border-b">{{ $t('invoiceNo') }}</th>
            <th class="py-2 px-4 border-b">{{ $t('customer') }}</th>
            <th class="py-2 px-4 border-b">{{ $t('salesDate') }}</th>
            <th class="py-2 px-4 border-b">{{ $t('amount') }}</th>
            <th class="py-2 px-4 border-b">{{ $t('salesman') }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="sale in recentSales" :key="sale.invoiceNo" class="hover:bg-gray-100">
            <td class="py-2 px-4 border-b">{{ sale.invoiceNo }}</td>
            <td class="py-2 px-4 border-b">{{ sale.customer }}</td>
            <td class="py-2 px-4 border-b">{{ sale.salesDate }}</td>
            <td class="py-2 px-4 border-b">{{ formatCurrency(sale.amount) }}</td>
            <td class="py-2 px-4 border-b">{{ sale.salesman }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>


<script>
import HeaderNav from "../components/HeaderNav.vue";

export default {
  components: {
    HeaderNav
  },
  data() {
    return {
      totalSales: 0,
      salesToday: 0,
      totalCustomers: 0,
      totalInvoices: 0,
      recentSales: []
    };
  },
  methods: {
    async fetchDashboardData() {
      try {
        const salesResponse = await fetch('https://dummyjson.com/sales'); // Replace with actual API
        const salesData = await salesResponse.json();

        this.totalSales = salesData.totalSales;
        this.salesToday = salesData.salesToday;
        this.totalCustomers = salesData.totalCustomers;
        this.totalInvoices = salesData.totalInvoices;
        this.recentSales = salesData.recentSales;
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    },
    formatCurrency(value) {
      if (!value) return '';
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
      }).format(value);
    }
  },
  mounted() {
    this.fetchDashboardData();
  },
};
</script>




