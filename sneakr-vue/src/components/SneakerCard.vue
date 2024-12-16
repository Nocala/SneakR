<template>
  <div class="sneaker-card">
    <img :src="sneaker.Image_small" alt="Sneaker Image" />
    <h3>{{ sneaker.Name }}</h3>
    <p>{{ sneaker.Brand }}</p>
  </div>
</template>

<script>
export default {
  name: 'SneakerCard',
  props: {
    sneaker: {
      type: Object,
      required: true
    }
  }
}
</script>

<style scoped>
.sneaker-card {
  background-color: #f9f9f9;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 20px;
  width: 200px;
  text-align: center;
}

.sneaker-card img {
  max-width: 100%;
  border-radius: 8px;
}

.sneaker-card h3 {
  margin: 10px 0;
}

.sneaker-card p {
  margin: 5px 0;
}
</style>