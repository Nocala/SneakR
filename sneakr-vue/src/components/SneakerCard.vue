<template>
  <div class="sneaker-card">
    <button class="wishlist-button" @click="addToWishlist">
      <img src="../assets/Heart_Icon.svg" alt="Wishlist Icon" />
    </button>
    <img :src="sneaker.Image_small" alt="Sneaker Image" />
    <h3>{{ sneaker.Name }}</h3>
    <p>{{ sneaker.Brand }}</p>
    <p>{{ sneaker.Estimated_Market_Value }} $</p>
    <button class="discover-button"  @click="emitDiscoverEvent">Discover</button>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'SneakerCard',
  props: {
    sneaker: {
      type: Object,
      required: true
    }
  },
  methods: {
    async addToWishlist() {
      try {
        const userId = this.getCurrentUserId();
        if (!userId) {
          throw new Error('User ID not found');
        }

        const response = await axios.post('http://localhost:3000/wishlist', {
          user_id: userId,
          sneaker_id: this.sneaker.id
        });

        console.log('Sneaker added to wishlist:', response.data);
      } catch (error) {
        console.error('Error adding sneaker to wishlist:', error);
      }
    },
    
    getCurrentUserId() {
      return localStorage.getItem('userId');
    },

    emitDiscoverEvent() {
      const sneakerIdNav = this.sneaker.id;
      this.$emit("discover-sneaker", sneakerIdNav); // Émet l'ID de la sneaker
    },
  }
}
</script>

<style scoped>
.sneaker-card {
  position: relative;
  background-color: #f9f9f9;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 20px;
  width: 200px;
  text-align: center;
}

.wishlist-button {
  position: absolute;
  top: 10px;
  left: 10px;
  background-color: transparent;
  border: none;
  cursor: pointer;
}

.wishlist-button img {
  width: 30px;
  height: 30px;
}

.sneaker-card img {
  max-width: 100%;
  border-radius: 8px;
  transition: transform 0.3s ease;
}

.sneaker-card img:hover {
  transform: scale(1.1);
}

.sneaker-card h3 {
  margin: 10px 0;
}

.sneaker-card p {
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
