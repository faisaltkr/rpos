<template>

<div class="flex flex-col w-screen h-screen bg-gray-800 text-white">
      
    <HeaderNav></HeaderNav>


    <h2 class="m-5">Coming Soon ...</h2>

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
    //this.getReport()
  },
};
</script>




