<template>
    <div class="collection-container">
        <div class="sneaker-details">

            <div class="sneaker-info">
                <h1>{{ sneaker.Name }}</h1>
                <img :src="sneaker.Image_small" alt="Sneaker Image" />
                <p><strong>Brand :</strong> {{ sneaker.Brand }}</p>
                <p><strong>Estimated Value :</strong> {{ sneaker.Estimated_Market_Value }} $</p>
                <p><strong>Release year :</strong> {{ sneaker.Release_Year }}</p>
                <p><strong>Colorway :</strong> {{ sneaker.Colorway }}</p>
            </div>
        </div>
        <div class="collection-button">
            <button @click="addToCollection">Add to collection</button>
        </div>
    </div>
</template>

<script>
import axios from 'axios';

export default {
    name: 'SneakerDetails',
    props: {
        id: {
            type: String,
            required: true,
        },
    },
    data() {
        return {
            sneaker: null, 
            loading: true, 
            error: null, 
        };
    },
    async created() {
        const sneakerId = this.$route.params.id; // Récupère l'ID depuis l'URL

        if (!sneakerId) {
            this.error = "ID of sneaker not found.";
            this.loading = false;
            return;
        }

        try {
            const response = await axios.get(`http://localhost:3000/sneakrs/by-ids`, {
                params: { ids: sneakerId }, 
            });

            const sneakers = response.data.data;
            if (sneakers.length === 0) {
                throw new Error('Sneaker not found.');
            }
            this.sneaker = sneakers[0]; // La première sneaker correspond à l'ID

        } catch (err) {
            this.error = "Impossible fetching sneaker.";
            console.error(err);

        } finally {
            this.loading = false;
        }
    },

    methods: {
        async addToCollection() {
            try {
                const userId = this.getCurrentUserId();
                if (!userId) {
                    throw new Error('User ID not found');
                }

                const response = await axios.post('http://localhost:3000/collection', {
                    user_id: userId,
                    sneaker_id: this.sneaker.id
                });

                console.log('Sneaker added to collection:', response.data);
            } catch (error) {
                console.error('Error adding sneaker to collection:', error);
            }
        },

        getCurrentUserId() {
            return localStorage.getItem('userId');
        },
    },
};
</script>

<style scoped>
.collection-container {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    min-height: 100vh;
    padding-bottom: 50px; 

}
.sneaker-details {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px;
    background-color: #f5f5f5;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    max-width: 800px;
    margin: 40px auto;
}

.loading,
.error {
    font-size: 1.2em;
    color: #ff6b6b;
    margin-top: 20px;
}

.sneaker-info {
    text-align: left;
    width: 100%;
}

.sneaker-info h1 {
    font-size: 2.5em;
    margin-bottom: 20px;
    color: #333;
}

.sneaker-info img {
    max-width: 100%;
    border-radius: 10px;
    margin-bottom: 20px;
    transition: transform 0.3s ease;
}

.sneaker-info img:hover {
    transform: scale(1.05);
}

.sneaker-info p {
    font-size: 1.2em;
    color: #666;
    margin: 10px 0;
}

.collection-button {
    display: flex;
    justify-content: center;
    margin-top: 20px;
    margin-bottom: 7%;
}

.collection-button button {
    padding: 10px 20px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 1em;
    transition: background-color 0.3s ease;
}

.collection-button button:hover {
    background-color: #0056b3;
}
</style>