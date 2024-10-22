<template>
  <header class="header-nav">
      <div class="grid grid-cols-2 gap-4">
          <div class="col-start-1 col-end-3">
            <nav>
              <ul>
                <li>
                  <b-icon icon="camera" font-scale="7.5"></b-icon>
                  <router-link to="/dashboard">Dashboard</router-link>
                </li>
                <li>
                  <b-icon icon="camera" font-scale="7.5"></b-icon>
                  <router-link to="/sales">Sales</router-link>
                  
                </li>
                <li><router-link to="/customer">Customer</router-link></li>
                <li><router-link to="/pos">POS</router-link></li>
                <li><router-link to="/report">Report</router-link></li>
                <li><router-link to="/settings">Settings</router-link></li>
              </ul>
            </nav>
          </div>
          <button class="text-white" @click="logout">Logout</button>
          <div class="col-end-7 col-span-2">
            <button class="text-white" @click="switchLanguage('en')">English</button>
            <button class="text-white" @click="switchLanguage('ar')">العربية</button>
          </div>
      </div>
      
      
    </header>
    
</template>

<script>
export default {
  name: 'HeaderNav',
  methods: {
    switchLanguage(lang) {
      this.$i18n.locale = lang;
      document.documentElement.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
    },
    logout() {
      // Clear any stored session data or tokens
      localStorage.removeItem('token'); // or sessionStorage, depending on your app
      // Clear any other user-related data if needed

      // Redirect the user to the login page
      this.$router.push('/login');  // Assuming you have Vue Router configured
    }
  }
};
</script>

<style scoped>

.header-nav {
  background-color: #74a3d5;
  padding: 10px 20px;
  box-shadow: -1px -1px 7px 0px;
}

.header-nav nav ul {
  display: flex;
  list-style: none;
  padding: 0;
  margin: 0;
}

.header-nav nav ul li {
  margin-right: 20px;
}

.header-nav nav ul li a {
  color: white;
  text-decoration: none;
}
button {
  margin: 5px;
}
</style>