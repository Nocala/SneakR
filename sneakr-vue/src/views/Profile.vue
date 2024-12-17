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
import { ref, onMounted } from 'vue';
import WishlistCard from '../components/WishlistCard.vue';

export default {
  name: 'Profile',
  components: {
    WishlistCard
  },
  setup() {
    const user = ref({
      username: 'Nom d\'utilisateur',
      email: 'email@example.com'
    });
    const wishlist = ref([]);

    const fetchUserData = async () => {
      try {
        const userId = getCurrentUserId();
        const userResponse = await axios.get(`http://localhost:3000/users/${userId}`);
        user.value = userResponse.data;

        const wishlistResponse = await axios.get(`http://localhost:3000/wishlist?user_id=${userId}`);
        const wishlistItems = wishlistResponse.data;

        const sneakerIds = wishlistItems.map(item => item.sneaker_id);

        console.log('IDs envoyés à l\'API:', sneakerIds.join(','));

        if (sneakerIds.length > 0) {
          const sneakersResponse = await axios.get(`http://localhost:3000/sneakrs`, {
            params: {
              ids: sneakerIds.join(',')
            }
          });
          wishlist.value = sneakersResponse.data.data;

          console.log('Sneakers récupérées:', wishlist.value);

        } else {
          wishlist.value = [];
        }
        
        console.log('Sneakers data:', wishlist.value); // Log the sneakers data
      } catch (error) {
        console.error('Error fetching user or wishlist data:', error);
      }
    };

    const getCurrentUserId = () => {
      return localStorage.getItem('userId');
    };

    onMounted(() => {
      fetchUserData();
    });

    return {
      user,
      wishlist
    };
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