<template>
    <div class="sneaker-details">
        <div v-if="loading" class="loading">Chargement...</div>
        <div v-else-if="error" class="error">{{ error }}</div>
        <div v-else class="sneaker-info">
            <h1>{{ sneaker.Name }}</h1>
            <img :src="sneaker.Image_small" alt="Sneaker Image" />
            <p><strong>Marque :</strong> {{ sneaker.Brand }}</p>
            <p><strong>Valeur estimée :</strong> {{ sneaker.Estimated_Market_Value }} $</p>
            <p><strong>Release year :</strong> {{ sneaker.Release_Year }}</p>
            <p><strong>Colorway :</strong> {{ sneaker.Colorway }}</p>
        </div>
    </div>
    <div class="collection-button">
        <button @click="addToCollection">Ajouter à ma collection</button>
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
            sneaker: null, // Données de la sneaker
            loading: true, // État de chargement
            error: null, // Message d'erreur si problème
        };
    },
    async created() {
        const sneakerId = this.$route.params.id; // Récupère l'ID depuis l'URL

        if (!sneakerId) {
            this.error = "ID de la sneaker non spécifié.";
            this.loading = false;
            return;
        }

        try {
            const response = await axios.get(`http://localhost:3000/sneakrs/by-ids`, {
                params: { ids: sneakerId }, // Utilise l'ID de la sneaker
            });

            const sneakers = response.data.data;
            if (sneakers.length === 0) {
                throw new Error('Sneaker non trouvée.');
            }
            this.sneaker = sneakers[0]; // La première sneaker correspond à l'ID
        } catch (err) {
            this.error = "Impossible de charger les données de cette sneaker.";
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