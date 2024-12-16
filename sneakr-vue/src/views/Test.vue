<template>
  <div class="home">
    <main>
      <section class="featured">
        <h2>Featured Sneakers</h2>
        <div class="sneaker-grid">
          <SneakerCard v-for="sneaker in sneakers" :key="sneaker.id" :sneaker="sneaker" />
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
import { ref, onMounted } from 'vue'
import SneakerCard from '../components/SneakerCard.vue'

export default {
  name: 'Test',
  components: {
    SneakerCard
  },
  setup() {
    const sneakers = ref([])
    const page = ref(1)
    const hasMore = ref(true)

    const fetchSneakers = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/sneakrs?page=${page.value}`)
        const fetchedSneakers = response.data.data.filter(sneaker => sneaker.Image_small)
        sneakers.value = fetchedSneakers
        hasMore.value = fetchedSneakers.length > 0
      } catch (error) {
        console.error('Error fetching sneakers:', error)
      }
    }

    const nextPage = (increment) => {
      page.value += increment
      fetchSneakers()
    }

    const prevPage = (decrement) => {
      if (page.value > decrement) {
        page.value -= decrement
        fetchSneakers()
      } else {
        page.value = 1
        fetchSneakers()
      }
    }

    onMounted(() => {
      fetchSneakers()
    })

    return {
      sneakers,
      page,
      hasMore,
      nextPage,
      prevPage
    }
  }
}
</script>

<style scoped>
.home {
  text-align: center;
  padding: 20px;
}

.sneaker-grid {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 20px;
}

.pagination {
  margin-top: 20px;
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
</style>