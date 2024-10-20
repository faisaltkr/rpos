<template>
  <div :class="[$i18n.locale === 'ar' ? 'rtl' : 'ltr']" class="window w-full h-screen overflow-hidden">
    <HeaderNav />
    
    <!-- <iframe src="http://dev14.erpx.one/report/Cheques and Deposits Incorrectly cleared" width="100%" height="100%"></iframe> -->

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

    getReport(){
      var targetUrl = this.baseURL+`/report/Cheques and Deposits Incorrectly cleared`;

        fetch(targetUrl, {
          method: 'GET',
          headers: {
            Authorization: 'Basic '+localStorage.getItem('token'),
          }
        })
        .then(response => response.json())
        .then(data => {
          // Do something with the data or open it in a new window
          const newWindow = window.open();
          newWindow.document.write(JSON.stringify(data));
        })
        .catch(error => console.error('Error:', error));
    }
   
  },
  mounted() {
    this.getReport()
  },
};
</script>




