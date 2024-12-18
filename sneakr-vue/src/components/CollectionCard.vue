<template>
    <div class="collection-card">
      <img :src="sneaker.Image_small" alt="Sneaker Image" />
      <h3>{{ sneaker.Name }}</h3>
      <p>{{ sneaker.Brand }}</p>
      <p>{{ sneaker.Estimated_Market_Value }} $</p>
      <button class="details-button">See details</button>
      <button class="remove-button" @click="removeSneaker">Remove</button>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    name: 'CollectionCard',
    props: {
      sneaker: {
        type: Object,
        required: true
      }
    },
    mounted() {
      console.log('Sneaker data:', this.sneaker); // Log the sneaker data
    },
    methods: {
      async removeSneaker() {
        try {
          console.log('Trying to remove sneaker with ID:', this.sneaker.id);
  
          const response = await axios.delete(`http://localhost:3000/collection/${this.sneaker.id}`, {
            headers: {
              'Content-Type': 'application/json'
            }
          });
  
          console.log('Response:', response);
  
          if (response.status !== 200) {
            throw new Error('Failed to remove sneaker from collection');
          }
  
          this.$emit('sneaker-removed', this.sneaker.id);
        } catch (error) {
          console.error('Error removing sneaker:', error);
        }
      }
    }
  }
  </script>
  
  <style scoped>
  .collection-card {
    position: relative;
    background-color: #f9f9f9;
    border: 1px solid #ddd;
    border-radius: 8px;
    padding: 20px;
    width: 200px;
    text-align: center;
  }
  
  .collection-card img {
    max-width: 100%;
    border-radius: 8px;
    transition: transform 0.3s ease;
  }
  
  .collection-card img:hover {
    transform: scale(1.1);
  }
  
  .collection-card h3 {
    margin: 10px 0;
  }
  
  .collection-card p {
    margin: 5px 0;
  }
  
  .details-button {
    width: 100%; /* Prend toute la largeur de la carte */
    padding: 10px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    margin-top: 10px;
  }
  
  .details-button:hover {
    background-color: #0056b3;
  }
  
  .remove-button {
    width: 100%;
    padding: 10px;
    background-color: #ff4d4d;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s ease;
    margin-top: 10px;
  }
  
  .remove-button:hover {
    background-color: #cc0000;
  }
  </style>