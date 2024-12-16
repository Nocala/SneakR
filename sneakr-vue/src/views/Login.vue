<template>
  <div>
    <h1>Login</h1>
    <form @submit.prevent="login">
      <div>
        <label for="email">Email:</label>
        <input type="email" v-model="email" id="email" required>
      </div>
      <div>
        <label for="password">Password:</label>
        <input type="password" v-model="password" id="password" required>
      </div>
      <button type="submit">Login</button>
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
          alert('Login successful');
        } else {
          alert('Login failed: ' + data.error);
        }
      } catch (error) {
        console.error('Error:', error);
      }
    }
  }
}
</script>

<style scoped>
/* Ajoutez vos styles ici */
</style>