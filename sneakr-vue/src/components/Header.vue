<template>
  <header>
    <nav>
      <ul>
        <li><router-link to="/">Home</router-link></li>
        <li><router-link to="/login">Login</router-link></li>
        <li><router-link to="/profile">Profile</router-link></li>
        <li><router-link to="/sneakers">Sneakers</router-link></li>
        <li><router-link to="/collection">Collections</router-link></li>
      </ul>
    </nav>
  </header>
</template>

<script>
export default {
  name: 'Header'
}
</script>

<style scoped>
header {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  background-color: #E7E1CD;
  border-radius: 10px;
  margin-bottom: 5%;
}

nav ul {
  list-style: none;
  display: flex;
  gap: 1rem;
}

nav ul li {
  display: inline;
}

nav ul li a {
  color: white;
  text-decoration: none;
}

nav ul li a:hover {
  text-decoration: underline;
}
</style>