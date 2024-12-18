<template>
  <div class="register-container">
    <h1>Register</h1>

    <form @submit.prevent="register">
      <div class="form-group">
        <label for="username">Username :</label>
        <input type="text" v-model="username" id="username" required />
      </div>

      <div class="form-group">
        <label for="email">Email :</label>
        <input type="email" v-model="email" id="email" required />
      </div>

      <div class="form-group">
        <label for="password">Password :</label>
        <input type="password" v-model="password" id="password" required />
      </div>

      <button type="submit" class="register-button">Register</button>
      
    </form>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      username: '',
      email: '',
      password: ''
    };
  },
  methods: {
    async register() {
      try {
        const response = await axios.post('http://localhost:3000/users', {
          username: this.username,
          email: this.email,
          password: this.password
        });

        const data = response.data;
        if (data.success) {
          this.$router.push('/');

        } else {
          this.$router.push('/');
          alert('Registration failed: ' + data.error);
        }

      } catch (error) {
        console.error('Error:', error);
      }
    }
  }
}
</script>

<style scoped>
.register-container {
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

.register-button {
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

.register-button:hover {
  background-color: #0056b3;
}
</style>