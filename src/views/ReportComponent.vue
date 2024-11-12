
<template>
  <div class="flex flex-col w-screen h-screen bg-gray-800 text-white">
    <HeaderNav></HeaderNav>
    
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
      targetUrl: ''
    };
  },

  mounted(){
    this.getReport()
  },
  methods: {

    

    getReport(){
      //var targetUrl = this.baseURL+`/report/Cheques and Deposits Incorrectly cleared`;
      const filterVars = JSON.stringify({
      "fiscal_year": "2024",       
      "from_date": "2024-01-01", 
      "to_date": "2024-12-31",    
      "company":"Exone Technologies",
      "based_on": "Customer",
      "period": "Monthly" 
    });
      var targetUrl = this.baseURL+`/api/method/frappe.desk.query_report.run?report_name=Sales Invoice Trends
&filters=${filterVars}`;

        fetch(targetUrl, {
          method: 'GET',
          headers: {
            Authorization: 'Basic '+localStorage.getItem('token'),
          }
        })
        .then(response => {
            console.log(response.data);
            

        })
        .catch(error => console.error('Error:', error));
    }
   
  }
};
</script>




