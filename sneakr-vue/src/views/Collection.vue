<template>
      <div class="header">
        <h1>Collection page</h1>
      </div>
      <div class="collection-container">
        <h2>Your collection</h2>
        <div class="collection-cards">
          <CollectionCard v-for="sneaker in collection" :key="sneaker.id" :sneaker="sneaker" @sneaker-removed="handleSneakerRemoved"/>
        </div>
      </div>
  </template>
  
  <script>
  import axios from 'axios';
  import { ref, onMounted } from 'vue';
  import CollectionCard from '../components/CollectionCard.vue';
  
  export default {
    name: 'Profile',
    components: {
      CollectionCard
    },
    setup() {
      const user = ref({
        username: 'username_example',
        email: 'email@example.com'
      });
      const collection = ref([]);
  
      const fetchUserData = async () => {
        try {
          const userId = getCurrentUserId();
          const userResponse = await axios.get(`http://localhost:3000/users/${userId}`);
          user.value = userResponse.data;
  
          
          const collectionResponse = await axios.get(`http://localhost:3000/collection?user_id=${userId}`);
          const collectionItems = collectionResponse.data;
  
          const sneakerIds = collectionItems.map(item => item.sneaker_id);
  
          console.log('IDs sended to API:', sneakerIds.join(','));
  
          if (sneakerIds.length > 0) {
            const sneakersResponse = await axios.get(`http://localhost:3000/sneakrs/by-ids`, {
              params: {
                ids: sneakerIds.join(',')
              }
            });
            collection.value = sneakersResponse.data.data;
  
            console.log('Sneakers fetched:', collection.value);
  
          } else {
            collection.value = [];
          }
          
          console.log('Sneakers data:', collection.value); // Log the sneakers data
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
        collection
      };
    },
    
    methods: {
    handleSneakerRemoved(sneakerId) {
      console.log('ID deleted received:', sneakerId);
      this.collection = this.collection.filter(s => s.id !== sneakerId);
      }
    }
  };
  </script>
  
  <style scoped>
  .collection-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px;
    background-color: #f5f5f5;
    font-family: Arial, sans-serif;
  }
  
  .header {
    width: 100%;
    text-align: center;
    margin-bottom: 20px;
  }
  
  .header h1 {
    font-size: 2em;
    color: #333;
  }
  
  .collection-container {
    width: 100%;
    max-width: 800px;
    margin: 0 auto;
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    padding: 20px;
    margin-bottom: 10%;

  }
  
  .collection-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 0;
    border-bottom: 1px solid #e0e0e0;
  }
  
  .collection-item:last-child {
    border-bottom: none;
  }
  
  .collection-item img {
    width: 50px;
    height: 50px;
    border-radius: 4px;
    margin-right: 20px;
  }
  
  .collection-item-details {
    flex-grow: 1;
  }
  
  .collection-item-details h3 {
    margin: 0;
    font-size: 1.2em;
    color: #333;
  }
  
  .collection-item-details p {
    margin: 5px 0 0;
    color: #666;
  }
  
  .collection-item-actions {
    display: flex;
    align-items: center;
  }
  
  .collection-item-actions button {
    background-color: #007bff;
    color: #fff;
    border: none;
    border-radius: 4px;
    padding: 10px 15px;
    cursor: pointer;
    transition: background-color 0.3s;
  }
  
  .collection-item-actions button:hover {
    background-color: #0056b3;
  }
  
  .collection {
    margin-top: 20px;
  }
  
  .collection-cards {
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
  }
  </style>