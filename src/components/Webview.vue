<template>
    <div>
      <iframe :src="reportUrl" style="width: 100%; height: 100vh;" ref="erpReport"></iframe>
    </div>
  </template>
  
  <script>
  import { invoke } from '@tauri-apps/api/tauri';
  
  export default {
    data() {
      return {
        reportUrl: "https://your-erpnext-instance.com/api/resource/ReportName",
        authToken: "Basic your-auth-token",
        sessionUrl: '',
      };
    },
    mounted() {
      this.fetchReportWithAuth();
    },
    methods: {
      async fetchReportWithAuth() {
        try {
          const reportData = await invoke('get_erp_report', {
            url: this.reportUrl,
            token: this.authToken,
          });
          this.sessionUrl = reportData;  // Fetches an authenticated session URL
        } catch (error) {
          console.error("Error fetching report:", error);
        }
      }
    }
  };
  </script>
  