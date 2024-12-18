<template>
  <div class="sneakers-container">
    <main>
      <section class="featured">
        <h2>Featured Sneakers</h2>

        <input type="text" v-model="searchQuery" placeholder="Search sneakers..." class="search-bar" />

        <div class="sneaker-grid">
          <SneakerCard v-for="sneaker in filteredSneakers" :key="sneaker.id" :sneaker="sneaker" @discover-sneaker="goToSneakerPage"/>
        </div>

        <div class="pagination">
          <button @click="prevPage(1)" :disabled="page === 1">&lt; 1</button>
          <button @click="prevPage(5)" :disabled="page <= 5">&lt; 5</button>
          <button @click="prevPage(10)" :disabled="page <= 10">&lt; 10</button>
          <span>Page {{ page }}</span>
          <button @click="nextPage(1)" :disabled="!hasMore">1 &gt;</button>
          <button @click="nextPage(5)" :disabled="!hasMore">5 &gt;</button>
          <button @click="nextPage(10)" :disabled="!hasMore">10 &gt;</button>
        </div>

      </section>
    </main>
  </div>
</template>

<script>
import axios from 'axios'
import { ref, computed, onMounted } from 'vue'
import SneakerCard from '../components/SneakerCard.vue'

export default {
  name: 'Sneakers',
  components: {
    SneakerCard
  },

  setup() {
    const sneakers = ref([])
    const page = ref(1)
    const hasMore = ref(true)
    const searchQuery = ref('')

    const fetchSneakers = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/sneakrs?page=${page.value}`)
        const fetchedSneakers = response.data.data.filter(sneaker => sneaker.Image_small && sneaker.Estimated_Market_Value !== 0)
        sneakers.value = fetchedSneakers
        hasMore.value = fetchedSneakers.length > 0
      } catch (error) {
        console.error('Error fetching sneakers:', error)
      }
    }

    const nextPage = (increment) => {
      page.value += increment
      fetchSneakers()
      window.scrollTo(0, 0) 
    }

    const prevPage = (decrement) => {
      if (page.value > decrement) {
        page.value -= decrement
        fetchSneakers()
        window.scrollTo(0, 0) 
      }
    }

    const filteredSneakers = computed(() => {
      return sneakers.value.filter(sneaker => 
        sneaker.Name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
        sneaker.Brand.toLowerCase().includes(searchQuery.value.toLowerCase())
      )
    })

    onMounted(() => {
      fetchSneakers()
    })

    return {
      sneakers,
      page,
      hasMore,
      searchQuery,
      filteredSneakers,
      nextPage,
      prevPage
    }
  },

  methods: {
    goToSneakerPage(sneakerIdNav) {
      this.$router.push(`/sneaker/${sneakerIdNav}`); 
    },
  },
}
</script>

<style scoped>
.sneakers-container {
  text-align: center;
  padding: 20px;
  margin-bottom: 10%;
}

.sneaker-grid {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 20px;
}

.pagination {
  margin-top: 3%;
  display: flex;
  justify-content: center;
  gap: 10px;
  
}

.pagination button {
  padding: 10px 20px;
  border: none;
  background-color: #333;
  color: white;
  cursor: pointer;
  border-radius: 5px;
}

.pagination button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.sneaker-card {
  background-color: #f9f9f9;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 20px;
  text-align: center;
}

.search-bar {
  width: 50%; 
  padding: 10px;
  margin-bottom: 20px;
  border: 1px solid #ddd;
  border-radius: 5px;
}
</style>