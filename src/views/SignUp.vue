  <template>
      <div class="login-container">
        <h1>Login</h1>
        <form @submit.prevent="login">
          <div class="form-group">
            <label for="username">User Name</label>
            <input type="text" id="username" v-model="username" required />
          </div>
          <div class="form-group">
            <label for="password">Password</label>
            <input type="password" id="password" v-model="password" required />
          </div>
          <button type="submit">Login</button>
        </form>
      </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        username: '',
        password: ''
      };
    },
    methods: {
      login() {
        console.log('Username:', this.username);
        console.log('Password:', this.password);
        // Implement the actual login logic here
      }
    }
  };
  </script>
  
  <style>
  #app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    text-align: center;
    color: #2c3e50;
    margin-top: 60px;
  }
  
  .login-container {
    width: 300px;
    margin: 0 auto;
  }
  
  .form-group {
    margin-bottom: 15px;
  }
  
  label {
    display: block;
    margin-bottom: 5px;
  }
  
  input {
    width: 100%;
    padding: 8px;
    box-sizing: border-box;
  }
  
  button {
    width: 100%;
    padding: 10px;
    background-color: #42b983;
    border: none;
    color: white;
    font-size: 16px;
    cursor: pointer;
  }
  
  button:hover {
    background-color: #357a38;
  }
  </style>