<template>
  <div class="login-container">
    <h1>Login</h1>

    <form @submit.prevent="login">
      <div class="form-group">
        <label for="email">Email :</label>
        <input type="email" v-model="email" id="email" required>
      </div>

      <div class="form-group">
        <label for="password">Password :</label>
        <input type="password" v-model="password" id="password" required>
      </div>

      <button type="submit" class="login-button">Login</button>
      
      <p>You don't have an account ? <router-link to="/register">Register Here</router-link></p>
    </form>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  data() {
    return {
      email: '',
      password: ''
    };
  },
  methods: {
    async login() {
      try {
        const response = await axios.post('http://localhost:3000/login', {
          email: this.email,
          password: this.password
        });

        const data = response.data;
        if (data.token) {
          localStorage.setItem('token', data.token);
          localStorage.setItem('userId', data.userId);
          this.$router.push('/');

        } else {
          alert('Login failed: ' + data.error);
        }

      } catch (error) {
        console.error('Error:', error);
        alert('An error occurred during login');
      }
    }
  }
}
</script>

<style scoped>
.login-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
}

h1 {
  margin-bottom: 20px;
  font-size: 24px;
  color: #333;
}

form {
  width: 100%;
  max-width: 400px;
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.form-group {
  margin-bottom: 15px;
}

label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
  color: #333;
}

input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
}

.login-button {
  width: 100%;
  padding: 10px;
  background-color: #007bff;
  border: none;
  border-radius: 4px;
  color: white;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.login-button:hover {
  background-color: #0056b3;
}

p {
  margin-top: 20px;
  text-align: center;
  font-size: 14px;
  color: #333;
}

p a {
  color: #007bff;
  text-decoration: none;
}

p a:hover {
  text-decoration: underline;
}
</style>