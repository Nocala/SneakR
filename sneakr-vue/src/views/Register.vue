<template>
    <div class="register">
        <h2>Register</h2>
        <form @submit.prevent="register">
            <div>
                <label for="username">Username:</label>
                <input type="text" v-model="username" required />
            </div>
            <div>
                <label for="email">Email:</label>
                <input type="email" v-model="email" required />
            </div>
            <div>
                <label for="password">Password:</label>
                <input type="password" v-model="password" required />
            </div>
            <button type="submit">Register</button>
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
                if (response.status === 201) {
                    alert('Registration successful');
                } else {
                    alert('Registration failed: ' + response.data.error);
                }
            } catch (error) {
                console.error('Error:', error);
            }
        }
    }
};
</script>