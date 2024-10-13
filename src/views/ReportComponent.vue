<template>
  <div :class="[$i18n.locale === 'ar' ? 'rtl' : 'ltr']" class="window w-full h-screen overflow-hidden">
    <HeaderNav />
    
    <iframe src="http://dev14.erpx.one/report/Cheques and Deposits Incorrectly cleared" width="100%" height="100%"></iframe>

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
      baseURL: localStorage.getItem('baseURL'),
      
    };
  },
  methods: {
   
  },
  mounted() {
    
  },
};
</script>




