<template>
  <div class="profile-container">
    <div class="profile-header">
      <h1>Profil de l'utilisateur</h1>
      <p>Nom d'utilisateur : {{ user.username }}</p>
      <p>Email : {{ user.email }}</p>
    </div>
    <div class="wishlist-container">
      <h2>Wishlist</h2>
      <div class="wishlist-cards">
        <WishlistCard v-for="sneaker in wishlist" :key="sneaker.id" :sneaker="sneaker" @sneaker-removed="handleSneakerRemoved"/>
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
  },
  
  methods: {
  handleSneakerRemoved(sneakerId) {
    console.log('ID supprimé reçu:', sneakerId);
    this.wishlist = this.wishlist.filter(s => s.id !== sneakerId);
  }
}
};
</script>

<style scoped>
.profile-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  background-color: #f5f5f5;
  font-family: Arial, sans-serif;
}

.profile-header {
  width: 100%;
  text-align: center;
  margin-bottom: 20px;
}

.profile-header h1 {
  font-size: 2em;
  color: #333;
}

.wishlist-container {
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 20px;
}

.wishlist-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 0;
  border-bottom: 1px solid #e0e0e0;
}

.wishlist-item:last-child {
  border-bottom: none;
}

.wishlist-item img {
  width: 50px;
  height: 50px;
  border-radius: 4px;
  margin-right: 20px;
}

.wishlist-item-details {
  flex-grow: 1;
}

.wishlist-item-details h3 {
  margin: 0;
  font-size: 1.2em;
  color: #333;
}

.wishlist-item-details p {
  margin: 5px 0 0;
  color: #666;
}

.wishlist-item-actions {
  display: flex;
  align-items: center;
}

.wishlist-item-actions button {
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 4px;
  padding: 10px 15px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.wishlist-item-actions button:hover {
  background-color: #0056b3;
}

.wishlist {
  margin-top: 20px;
}

.wishlist-cards {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}
</style>