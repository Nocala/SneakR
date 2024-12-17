<template>
  <div class="wishlist-card">
    <img :src="sneaker.Image_small" alt="Sneaker Image" />
    <h3>{{ sneaker.Name }}</h3>
    <p>{{ sneaker.Brand }}</p>
    <p>{{ sneaker.Estimated_Market_Value }} $</p>
    <button class="discover-button">Discover</button>
  </div>
</template>

<script>
export default {
  name: 'WishlistCard',
  props: {
    sneaker: {
      type: Object,
      required: true
    }
  },
  mounted() {
    console.log('Sneaker data:', this.sneaker); // Log the sneaker data
  }
}
</script>

<style scoped>
.wishlist-card {
  position: relative;
  background-color: #f9f9f9;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 20px;
  width: 200px;
  text-align: center;
}

.wishlist-card img {
  max-width: 100%;
  border-radius: 8px;
  transition: transform 0.3s ease;
}

.wishlist-card img:hover {
  transform: scale(1.1);
}

.wishlist-card h3 {
  margin: 10px 0;
}

.wishlist-card p {
  margin: 5px 0;
}

.discover-button {
  width: 100%; /* Prend toute la largeur de la carte */
  padding: 10px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 10px;
}

.discover-button:hover {
  background-color: #0056b3;
}
</style>