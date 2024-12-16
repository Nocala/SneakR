<template>
  <div class="home">
    <main>
      <section class="featured">
        <h2>Featured Sneakers</h2>
        <div class="sneaker-grid">
          <div v-for="sneaker in sneakers" :key="sneaker.id" class="sneaker-card">
            <img :src="sneaker.Image_small" alt="Sneaker Image" />
            <h3>{{ sneaker.Name }}</h3>
            <p>{{ sneaker.Brand }}</p>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<script>
import axios from 'axios'
import { ref, onMounted } from 'vue'

export default {
  name: 'Test',
  setup() {
    const sneakers = ref([])

    const fetchSneakers = async () => {
      try {
        const response = await axios.get('http://localhost:3000/sneakrs')
        sneakers.value = response.data.data.filter(sneaker => sneaker.Image_small)
      } catch (error) {
        console.error('Error fetching sneakers:', error)
      }
    }

    onMounted(() => {
      fetchSneakers()
    })

    return {
      sneakers
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

.sneaker-card {
  background-color: #f9f9f9;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 20px;
  width: 200px;
  text-align: center;
}

.sneaker-card img {
  max-width: 100%;
  border-radius: 8px;
}

.sneaker-card h3 {
  margin: 10px 0;
}

.sneaker-card p {
  margin: 5px 0;
}
</style>