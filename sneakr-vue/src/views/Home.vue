<template>
    <div class="home">
        <main>
            <section class="about-us">
                <h2>About us</h2>
                <p>Welcome to SneakR, your ultimate destination for sneaker enthusiasts! With a collection of over
                    49,000 sneakers, we pride ourselves on being one of the largest and most comprehensive sneaker
                    databases in the world. Whether you're a casual fan or a dedicated collector, our platform offers
                    detailed information, reviews, and the latest arrivals to keep you updated on all things sneakers.
                    Join our community and explore the fascinating world of sneaker culture with SneakR!</p>
            </section>

            <section class="random-sneaker">
                <h2>Trended sneakers</h2>
                <div class="sneaker-card-container">
                    <SneakerCard v-if="randomSneaker" :sneaker="randomSneaker" />
                </div>
                <button @click="refreshPage" class="refresh-button">Another one ?</button>
            </section>
        </main>
    </div>
</template>

<script>
import axios from 'axios';
import SneakerCard from '../components/SneakerCard.vue';

export default {
    name: 'Home',
    components: {
        SneakerCard
    },
    data() {
        return {
            randomSneaker: null
        };
    },
    created() {
        this.fetchRandomSneaker();
    },
    methods: {
        async fetchRandomSneaker() {
            try {
                const response = await axios.get('http://localhost:3000/sneaker/random');
                console.log('Random Sneaker Response:', response.data); // Inspecte ici
                this.randomSneaker = response.data;
            } catch (error) {
                console.error('Erreur lors de la récupération de la sneaker aléatoire:', error);
            }
        },
        refreshPage() {
            this.fetchRandomSneaker();
        }
    }
}
</script>

<style scoped>
.home {
    text-align: center;
    padding: 20px;
    background: linear-gradient(135deg, #f5f7fa, #c3cfe2);
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}

.about-us {
    background: white;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    max-width: 600px;
    margin-bottom: 40px;
}

.about-us h2 {
    font-size: 24px;
    margin-bottom: 10px;
    color: #333;
}

.about-us p {
    font-size: 16px;
    color: #666;
    line-height: 1.5;
}

.random-sneaker {
    background: white;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    max-width: 600px;
    margin-top: 40px;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 20%;
}

.random-sneaker h2 {
    font-size: 24px;
    margin-bottom: 10px;
    color: #333;
}

.sneaker-card-container {
    display: flex;
    justify-content: center;
    width: 100%;
}

.refresh-button {
    margin-top: 20px;
    padding: 10px 20px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s ease;
}

.refresh-button:hover {
    background-color: #0056b3;
}
</style>