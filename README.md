# SneakR


<template>
  <div>
    <h1>Profil de l'utilisateur</h1>
    <p>Nom d'utilisateur : {{ user.username }}</p>
    <p>Email : {{ user.email }}</p>
    <div class="wishlist">
      <h2>Wishlist</h2>
      <div class="wishlist-cards">
        <WishlistCard v-for="sneaker in wishlist" :key="sneaker.id" :sneaker="sneaker" />
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import WishlistCard from '../components/WishlistCard.vue';
import { ref } from 'vue';

export default {
  name: 'Profile',
  components: {
    WishlistCard
  },
  setup() {
    const wishlist = ref([]);
    },
  data() {
    return {
      user: {
        username: 'Nom d\'utilisateur',
        email: 'email@example.com'
      },
    //   wishlist: []
    };
  },
  async created() {
    try {
      const userId = this.getCurrentUserId();
      const userResponse = await axios.get(`http://localhost:3000/users/${userId}`);
      this.user = userResponse.data;

      const wishlistResponse = await axios.get(`http://localhost:3000/wishlist?user_id=${userId}`);
      const wishlistItems = wishlistResponse.data;

      const sneakerIds = wishlistItems.map(item => item.sneaker_id);
      if (sneakerIds.length > 0) {
        const sneakersResponse = await axios.get(`http://localhost:3000/sneakrs`, {
          params: {
            ids: sneakerIds.join(',')
          }
        });
        this.wishlist = sneakersResponse.data;
      } else {
        this.wishlist = [];
      }
      console.log('Sneakers data:', this.wishlist); // Log the sneakers data
    } catch (error) {
      console.error('Error fetching user or wishlist data:', error);
    }
  },
  methods: {
    getCurrentUserId() {
      return localStorage.getItem('userId');
    }
  }
};
</script>   

<style scoped>
/* Ajoutez ici vos styles spécifiques à cette vue */
.wishlist {
  margin-top: 20px;
}

.wishlist-cards {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}
</style>