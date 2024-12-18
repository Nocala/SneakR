<template>
  <div class="wishlist-card">
    <button class="remove-button" @click="removeFromWishlist"><strong>🚮</strong></button>
    <img :src="sneaker.Image_small" alt="Sneaker Image" />
    <h3>{{ sneaker.Name }}</h3>
    <p>{{ sneaker.Brand }}</p>
    <p>{{ sneaker.Estimated_Market_Value }} $</p>
    <button class="discover-button" @click="navigateToDetails">Discover</button>
  </div>
</template>

<script>
import axios from 'axios';
import { useRouter } from 'vue-router';

export default {
  name: 'WishlistCard',
  props: {
    sneaker: {
      type: Object,
      required: true
    }
  },
  setup() {
    const router = useRouter();
    return { router };
  },
  methods: {
    async removeFromWishlist() {
      try {
        console.log('Trying to remove sneaker with ID:', this.sneaker.id);

        const response = await axios.delete(`http://localhost:3000/wishlist/${this.sneaker.id}`, {
          headers: {
            'Content-Type': 'application/json'
          }
        });

        console.log('Response:', response);

        if (response.status !== 200) {
          throw new Error('Failed to remove sneaker from wishlist');
        }

        this.$emit('sneaker-removed', this.sneaker.id);
      } catch (error) {
        console.error('Error removing sneaker:', error);
      }
    },

    navigateToDetails() {
      this.router.push({ name: 'SneakerDetails', params: { id: this.sneaker.id } });
    }
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

.remove-button {
  color: #ff0000;
  font-size: x-large;
  position: absolute;
  top: 10px;
  right: 10px;
  background-color: transparent;
  border: none;
  cursor: pointer;
}

.remove-button img {
  width: 30px;
  height: 30px;
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
  width: 100%;
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